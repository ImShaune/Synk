import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import type { MediaItem } from '@/types'

export async function GET(req: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient() as any
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
        }

        const { data, error } = await supabase
            .from('saved_items')
            .select()
            .eq('user_id', user.id)
            .order('saved_at', { ascending: false })

        if (error) throw new Error(error.message)
        return NextResponse.json({ items: data ?? [] })
    } catch (err) {
        console.error('[api/favorites GET]', err)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient() as any
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
        }

        const body: { media: MediaItem } = await req.json()

        if (!body.media) {
            return NextResponse.json({ error: 'media es requerido' }, { status: 400 })
        }

        const { data, error } = await supabase
            .from('saved_items')
            .insert({ user_id: user.id, media: body.media })
            .select()
            .single()

        if (error) throw new Error(error.message)
        return NextResponse.json({ item: data })
    } catch (err) {
        console.error('[api/favorites POST]', err)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient() as any
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
        }

        const body: { itemId: string } = await req.json()

        if (!body.itemId) {
            return NextResponse.json({ error: 'itemId es requerido' }, { status: 400 })
        }

        const { error } = await supabase
            .from('saved_items')
            .delete()
            .eq('id', body.itemId)
            .eq('user_id', user.id)

        if (error) throw new Error(error.message)
        return NextResponse.json({ success: true })
    } catch (err) {
        console.error('[api/favorites DELETE]', err)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}