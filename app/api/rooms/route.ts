import { NextRequest, NextResponse } from 'next/server'
import { createRoom, joinRoom } from '@/lib/room'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        if (!body.action) {
            return NextResponse.json(
                { error: 'action es requerida' },
                { status: 400 }
            )
        }

        if (body.action === 'create') {
            if (!body.userId) {
                return NextResponse.json(
                    { error: 'userId es requerido' },
                    { status: 400 }
                )
            }

            const room = await createRoom(body.userId)
            return NextResponse.json({ room })
        }

        if (body.action === 'join') {
            if (!body.code || !body.userId) {
                return NextResponse.json(
                    { error: 'code y userId son requeridos' },
                    { status: 400 }
                )
            }

            const room = await joinRoom(body.code, body.userId)
            return NextResponse.json({ room })
        }

        return NextResponse.json(
            { error: 'action inválida' },
            { status: 400 }
        )
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Error interno del servidor'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}