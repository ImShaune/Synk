import { NextRequest, NextResponse } from 'next/server'
import { computeSoloMatch, computeCoopMatch } from '@/lib/algorithm'
import {
    searchMatchCandidate,
    getMovieDetail,
    getSeriesDetail,
    getGameDetail,
} from '@/lib/media-api'
import type { MediaItem, SwipeVote, UserPreferences } from '@/types'

interface SoloBody {
    mode: 'solo'
    cards: MediaItem[]
    votes: SwipeVote[]
    preferences: UserPreferences
}

interface CoopBody {
    mode: 'coop'
    cards: MediaItem[]
    votes1: SwipeVote[]
    votes2: SwipeVote[]
    preferences1: UserPreferences
    preferences2: UserPreferences
}

async function enrichMedia(media: MediaItem): Promise<MediaItem> {
    try {
        let detail: Partial<MediaItem> = {}
        if (media.category === 'movie') detail = await getMovieDetail(media.externalId)
        else if (media.category === 'series') detail = await getSeriesDetail(media.externalId)
        else if (media.category === 'game') detail = await getGameDetail(media.externalId)
        return { ...media, ...detail }
    } catch {
        return media
    }
}

function extractLikedGenres(cards: MediaItem[], votes: SwipeVote[]): string[] {
    const likedIds = new Set(
        votes.filter((v) => v.decision === 'like').map((v) => v.mediaId)
    )
    const likedCards = cards.filter((c) => likedIds.has(c.id))
    const allGenres = likedCards.flatMap((c) => c.genres)

    // Contar frecuencia de cada género
    const freq = new Map<string, number>()
    allGenres.forEach((g) => freq.set(g, (freq.get(g) ?? 0) + 1))

    // Devolver los géneros más frecuentes (top 3)
    return [...freq.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([genre]) => genre)
}

export async function POST(req: NextRequest) {
    try {
        const body: SoloBody | CoopBody = await req.json()

        if (!body.mode) {
            return NextResponse.json({ error: 'mode es requerido' }, { status: 400 })
        }

        if (body.mode === 'solo') {
            const { cards, votes, preferences } = body

            if (!cards?.length || !preferences) {
                return NextResponse.json(
                    { error: 'cards y preferences son requeridos' },
                    { status: 400 }
                )
            }

            // Extraer géneros de los likes para refinar la búsqueda
            const likedGenres = extractLikedGenres(cards, votes ?? [])

            const refinedPrefs: UserPreferences = {
                ...preferences,
                genres: likedGenres.length > 0 ? likedGenres : preferences.genres,
            }

            const excludeIds = cards.map((c) => c.externalId)
            const candidate = await searchMatchCandidate(refinedPrefs, excludeIds)

            // Calcular score con las cards del swipe
            const swipeResult = computeSoloMatch(cards, votes ?? [], preferences)

            const matchMedia = candidate ?? swipeResult.media
            const enriched = await enrichMedia(matchMedia)

            return NextResponse.json({
                result: { ...swipeResult, media: enriched },
            })
        }

        if (body.mode === 'coop') {
            const { cards, votes1, votes2, preferences1, preferences2 } = body

            if (!cards?.length || !preferences1 || !preferences2) {
                return NextResponse.json(
                    { error: 'cards, preferences1 y preferences2 son requeridos' },
                    { status: 400 }
                )
            }

            // Combinar likes de ambos usuarios
            const allVotes = [...(votes1 ?? []), ...(votes2 ?? [])]
            const likedGenres = extractLikedGenres(cards, allVotes)

            const mergedPrefs: UserPreferences = {
                category: preferences1.category ?? preferences2.category,
                genres: likedGenres.length > 0
                    ? likedGenres
                    : [...new Set([...preferences1.genres, ...preferences2.genres])],
                yearRange: [
                    Math.min(preferences1.yearRange[0], preferences2.yearRange[0]),
                    Math.max(preferences1.yearRange[1], preferences2.yearRange[1]),
                ],
                cardCount: preferences1.cardCount,
            }

            const excludeIds = cards.map((c) => c.externalId)
            const candidate = await searchMatchCandidate(mergedPrefs, excludeIds)
            const swipeResult = computeCoopMatch(
                cards,
                votes1 ?? [],
                votes2 ?? [],
                preferences1,
                preferences2
            )

            if (!swipeResult) return NextResponse.json({ result: null })

            const matchMedia = candidate ?? swipeResult.media
            const enriched = await enrichMedia(matchMedia)

            return NextResponse.json({
                result: { ...swipeResult, media: enriched },
            })
        }

        return NextResponse.json({ error: 'mode invalido' }, { status: 400 })
    } catch (err) {
        console.error('[api/match]', err)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}