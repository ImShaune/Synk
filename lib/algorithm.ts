import type { MediaItem, MatchResult, SwipeVote, UserPreferences } from '@/types'

// ── Pesos del algoritmo ───────────────────────────────────────────────────────

const W = {
    like: 40,
    genre: 25,
    year: 15,
    rating: 10,
    popularity: 10,
} as const

// ── Helpers ───────────────────────────────────────────────────────────────────

function genreOverlap(
    mediaGenres: string[],
    chosenGenres: string[]
): number {
    if (!chosenGenres.length) return 1
    const hits = mediaGenres.filter((g) => chosenGenres.includes(g)).length
    return Math.min(hits / chosenGenres.length, 1)
}

function yearScore(
    year: number,
    [from, to]: [number, number]
): number {
    return year >= from && year <= to ? 1 : 0
}

function normalize(value: number, max: number): number {
    return Math.min(value / max, 1)
}

function scoreMedia(
    media: MediaItem,
    prefs: UserPreferences,
    vote: SwipeVote | undefined
): number {
    if (vote?.decision === 'dislike') return 0

    let score = 0
    if (vote?.decision === 'like') score += W.like

    score += W.genre * genreOverlap(media.genres, prefs.genres)
    score += W.year * yearScore(media.year, prefs.yearRange)
    score += W.rating * normalize(media.rating, 10)
    score += W.popularity * normalize(media.popularity, 1000)

    return score
}

function toPct(score: number): number {
    return Math.round(Math.min(score, 100))
}

// ── Solo ──────────────────────────────────────────────────────────────────────

export function computeSoloMatch(
    cards: MediaItem[],
    votes: SwipeVote[],
    prefs: UserPreferences
): MatchResult {
    const voteMap = new Map(votes.map((v) => [v.mediaId, v]))

    const scored = cards
        .map((media) => ({
            media,
            score: scoreMedia(media, prefs, voteMap.get(media.id)),
        }))
        .sort((a, b) => b.score - a.score)

    const best = scored[0]
    const pct = toPct(best.score)

    return {
        media: best.media,
        compatibilityScore: pct,
        explanation: buildSoloExplanation(best.media, votes, prefs, pct),
        isCooperative: false,
    }
}

// ── Cooperativo ───────────────────────────────────────────────────────────────

export function computeCoopMatch(
    cards: MediaItem[],
    votes1: SwipeVote[],
    votes2: SwipeVote[],
    prefs1: UserPreferences,
    prefs2: UserPreferences
): MatchResult | null {
    if (!cards.length) return null

    const map1 = new Map(votes1.map((v) => [v.mediaId, v]))
    const map2 = new Map(votes2.map((v) => [v.mediaId, v]))

    const bothLiked = cards.filter(
        (m) =>
            map1.get(m.id)?.decision === 'like' &&
            map2.get(m.id)?.decision === 'like'
    )

    // Si hay ítems donde ambos hicieron like, competimos solo entre esos
    const pool = bothLiked.length > 0 ? bothLiked : cards

    const scored = pool
        .map((media) => {
            const s1 = scoreMedia(media, prefs1, map1.get(media.id))
            const s2 = scoreMedia(media, prefs2, map2.get(media.id))
            const mutualLike =
                map1.get(media.id)?.decision === 'like' &&
                map2.get(media.id)?.decision === 'like'

            return {
                media,
                score: (s1 + s2) / 2 + (mutualLike ? 10 : 0),
                mutualLike,
            }
        })
        .sort((a, b) => b.score - a.score)

    if (!scored.length) return null

    const best = scored[0]
    const pct = toPct(best.score)

    return {
        media: best.media,
        compatibilityScore: pct,
        explanation: buildCoopExplanation(
            best.media, prefs1, prefs2, pct, best.mutualLike
        ),
        isCooperative: true,
        bothLiked: best.mutualLike,
    }
}

// ── Explicaciones ─────────────────────────────────────────────────────────────

function buildSoloExplanation(
    media: MediaItem,
    votes: SwipeVote[],
    prefs: UserPreferences,
    pct: number
): string {
    const liked = votes.filter((v) => v.decision === 'like').length
    const sharedGenres = media.genres.filter((g) => prefs.genres.includes(g))
    const inRange =
        media.year >= prefs.yearRange[0] && media.year <= prefs.yearRange[1]

    const parts: string[] = []

    if (pct >= 85) parts.push('Es una coincidencia casi perfecta con tu perfil.')
    else if (pct >= 60) parts.push('Tiene una gran compatibilidad con tus gustos.')
    else parts.push('Es la mejor opción disponible según tus preferencias.')

    if (liked > 0)
        parts.push(`Le diste like a ${liked} título${liked > 1 ? 's' : ''} en el swipe.`)

    if (sharedGenres.length)
        parts.push(`Comparte los géneros que elegiste: ${sharedGenres.join(', ')}.`)

    if (inRange)
        parts.push('Está dentro del rango de años que seleccionaste.')

    if (media.rating >= 7.5)
        parts.push(`Además tiene un rating destacado de ${media.rating}/10.`)

    return parts.join(' ')
}

function buildCoopExplanation(
    media: MediaItem,
    prefs1: UserPreferences,
    prefs2: UserPreferences,
    pct: number,
    mutualLike: boolean
): string {
    const allGenres = [...new Set([...prefs1.genres, ...prefs2.genres])]
    const sharedGenres = media.genres.filter((g) => allGenres.includes(g))
    const inRange1 =
        media.year >= prefs1.yearRange[0] && media.year <= prefs1.yearRange[1]
    const inRange2 =
        media.year >= prefs2.yearRange[0] && media.year <= prefs2.yearRange[1]

    const parts: string[] = []

    if (mutualLike)
        parts.push('Ambos coincidieron en este título durante el swipe.')

    if (pct >= 85)
        parts.push('Es la elección casi perfecta para los dos.')

    if (sharedGenres.length)
        parts.push(
            `Comparte géneros seleccionados por ambos: ${sharedGenres.join(', ')}.`
        )

    if (inRange1 && inRange2)
        parts.push('Encaja en el rango de años elegido por ambos.')
    else if (inRange1 || inRange2)
        parts.push('Encaja en el rango de años de al menos uno de los dos.')

    if (media.rating >= 7.5)
        parts.push(`Con un rating de ${media.rating}/10, es muy bien valorado.`)

    return parts.join(' ')
}