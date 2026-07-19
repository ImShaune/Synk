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

        let cards

        switch (prefs.category) {
            case 'movie':
                cards = await searchMovies(prefs)
                break
            case 'series':
                cards = await searchSeries(prefs)
                break
            case 'game':
                cards = await searchGames(prefs)
                break
            default:
                return NextResponse.json(
                    { error: 'Categoría inválida' },
                    { status: 400 }
                )
        }

        return NextResponse.json({ cards })
    } catch (err) {
        console.error('[api/search]', err)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}