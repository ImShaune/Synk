import { createServerSupabaseClient } from './supabase'
import { generateRoomCode } from './utils'
import type { Room } from '@/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: Record<string, any>): Room {
    return {
        id: row.id,
        code: row.code,
        status: row.status,
        createdAt: row.created_at,
        user1Id: row.user1_id,
        user2Id: row.user2_id,
        sharedMediaIds: row.shared_media_ids ?? [],
        preferences1: row.preferences1,
        preferences2: row.preferences2,
        votes1: row.votes1 ?? [],
        votes2: row.votes2 ?? [],
        matchResultId: row.match_result_id,
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function db(): Promise<any> {
    return createServerSupabaseClient()
}

export async function createRoom(userId: string): Promise<Room> {
    const supabase = await db()
    const code = generateRoomCode()

    const { data, error } = await supabase
        .from('rooms')
        .insert({ code, user1_id: userId })
        .select()
        .single()

    if (error || !data) throw new Error(error?.message ?? 'No se pudo crear la sala')
    return mapRow(data)
}

export async function joinRoom(code: string, userId: string): Promise<Room> {
    const supabase = await db()

    const { data: existing, error: findErr } = await supabase
        .from('rooms')
        .select()
        .eq('code', code.toUpperCase())
        .eq('status', 'waiting')
        .single()

    if (findErr || !existing)
        throw new Error('Sala no encontrada o ya está llena')

    const { data, error } = await supabase
        .from('rooms')
        .update({ user2_id: userId, status: 'active' })
        .eq('id', existing.id)
        .select()
        .single()

    if (error || !data) throw new Error(error?.message ?? 'No se pudo unirse a la sala')
    return mapRow(data)
}

export async function getRoom(id: string): Promise<Room | null> {
    const supabase = await db()

    const { data } = await supabase
        .from('rooms')
        .select()
        .eq('id', id)
        .single()

    return data ? mapRow(data) : null
}

export async function setSharedMedia(
    roomId: string,
    mediaIds: string[]
): Promise<void> {
    const supabase = await db()

    const { error } = await supabase
        .from('rooms')
        .update({ shared_media_ids: mediaIds })
        .eq('id', roomId)

    if (error) throw new Error(error.message)
}

export async function finishRoom(roomId: string): Promise<void> {
    const supabase = await db()

    const { error } = await supabase
        .from('rooms')
        .update({ status: 'finished' })
        .eq('id', roomId)

    if (error) throw new Error(error.message)
}