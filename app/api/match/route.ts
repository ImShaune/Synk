import { NextRequest, NextResponse } from 'next/server'
import { computeSoloMatch, computeCoopMatch } from '@/lib/algorithm'
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

export async function POST(req: NextRequest) {
    try {
        const body: SoloBody | CoopBody = await req.json()

        if (!body.mode) {
            return NextResponse.json(
                { error: 'mode es requerido' },
                { status: 400 }
            )
        }

        if (body.mode === 'solo') {
            const { cards, votes, preferences } = body

            if (!cards?.length || !preferences) {
                return NextResponse.json(
                    { error: 'cards y preferences son requeridos' },
                    { status: 400 }
                )
            }

            const result = computeSoloMatch(cards, votes ?? [], preferences)
            return NextResponse.json({ result })
        }

        if (body.mode === 'coop') {
            const { cards, votes1, votes2, preferences1, preferences2 } = body

            if (!cards?.length || !preferences1 || !preferences2) {
                return NextResponse.json(
                    { error: 'cards, preferences1 y preferences2 son requeridos' },
                    { status: 400 }
                )
            }

            const result = computeCoopMatch(
                cards,
                votes1 ?? [],
                votes2 ?? [],
                preferences1,
                preferences2
            )

            return NextResponse.json({ result })
        }

        return NextResponse.json(
            { error: 'mode inválido' },
            { status: 400 }
        )
    } catch (err) {
        console.error('[api/match]', err)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}