import { NextRequest, NextResponse } from 'next/server'
import { searchMovies, searchSeries, searchGames } from '@/lib/media-api'
import type { UserPreferences } from '@/types'

export async function POST(req: NextRequest) {
    try {
        const prefs: UserPreferences = await req.json()

        if (!prefs.category) {
            return NextResponse.json(
                { error: 'category es requerida' },
                { status: 400 }
            )
        }

        const cardCount = prefs.cardCount ?? 10

        let results

        switch (prefs.category) {
            case 'movie':
                results = await searchMovies(prefs, cardCount)
                break
            case 'series':
                results = await searchSeries(prefs, cardCount)
                break
            case 'game':
                results = await searchGames(prefs, cardCount)
                break
            default:
                return NextResponse.json(
                    { error: 'Categoria invalida' },
                    { status: 400 }
                )
        }

        return NextResponse.json({ cards: results })
    } catch (err) {
        console.error('[api/search]', err)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}