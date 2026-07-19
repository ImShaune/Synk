import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import type { MediaItem } from '@/types'

// GET /api/favorites?userId=xxx
export async function GET(req: NextRequest) {
    try {
        const userId = req.nextUrl.searchParams.get('userId')

        if (!userId) {
            return NextResponse.json(
                { error: 'userId es requerido' },
                { status: 400 }
            )
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const supabase = await createServerSupabaseClient() as any

        const { data, error } = await supabase
            .from('saved_items')
            .select()
            .eq('user_id', userId)
            .order('saved_at', { ascending: false })

        if (error) throw new Error(error.message)

        return NextResponse.json({ items: data ?? [] })
    } catch (err) {
        console.error('[api/favorites GET]', err)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}

// POST /api/favorites { userId, media }
export async function POST(req: NextRequest) {
    try {
        const body: { userId: string; media: MediaItem } = await req.json()

        if (!body.userId || !body.media) {
            return NextResponse.json(
                { error: 'userId y media son requeridos' },
                { status: 400 }
            )
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const supabase = await createServerSupabaseClient() as any

        const { data, error } = await supabase
            .from('saved_items')
            .insert({ user_id: body.userId, media: body.media })
            .select()
            .single()

        if (error) throw new Error(error.message)

        return NextResponse.json({ item: data })
    } catch (err) {
        console.error('[api/favorites POST]', err)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}

// DELETE /api/favorites { userId, itemId }
export async function DELETE(req: NextRequest) {
    try {
        const body: { userId: string; itemId: string } = await req.json()

        if (!body.userId || !body.itemId) {
            return NextResponse.json(
                { error: 'userId e itemId son requeridos' },
                { status: 400 }
            )
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const supabase = await createServerSupabaseClient() as any

        const { error } = await supabase
            .from('saved_items')
            .delete()
            .eq('id', body.itemId)
            .eq('user_id', body.userId)

        if (error) throw new Error(error.message)

        return NextResponse.json({ success: true })
    } catch (err) {
        console.error('[api/favorites DELETE]', err)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}