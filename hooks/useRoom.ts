'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase'
import type { Room, RoomParticipant, UserPreferences, SwipeVote } from '@/types'

interface UseRoomState {
    room: Room | null
    partnerConnected: boolean
    partnerDisconnected: boolean
    loading: boolean
    error: string | null
}

interface UseRoomOptions {
    roomId: string
    participant: RoomParticipant
}

export function useRoom({ roomId, participant }: UseRoomOptions) {
    const supabase = createClient()
    const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

    const [state, setState] = useState<UseRoomState>({
        room: null,
        partnerConnected: false,
        partnerDisconnected: false,
        loading: true,
        error: null,
    })

    // ── Fetch inicial ──────────────────────────────────────────────────────────

    useEffect(() => {
        async function fetchRoom() {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const { data, error } = await (supabase as any)
                    .from('rooms')
                    .select()
                    .eq('id', roomId)
                    .single()

                if (error) throw new Error(error.message)

                const room = data as Room
                setState((s) => ({
                    ...s,
                    room,
                    partnerConnected: !!room.user2Id,
                    loading: false,
                }))
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Error al cargar la sala'
                setState((s) => ({ ...s, error: message, loading: false }))
            }
        }

        fetchRoom()
    }, [roomId]) // eslint-disable-line react-hooks/exhaustive-deps

    // ── Realtime ───────────────────────────────────────────────────────────────

    useEffect(() => {
        const channel = supabase
            .channel(`room:${roomId}`)
            .on(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                'postgres_changes' as any,
                {
                    event: '*',
                    schema: 'public',
                    table: 'rooms',
                    filter: `id=eq.${roomId}`,
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (payload: any) => {
                    const updated = payload.new as Room
                    setState((s) => ({
                        ...s,
                        room: updated,
                        partnerConnected: !!updated.user2Id,
                    }))
                }
            )
            .on('presence', { event: 'leave' }, () => {
                setState((s) => ({ ...s, partnerDisconnected: true }))
            })
            .subscribe()

        channelRef.current = channel

        return () => {
            supabase.removeChannel(channel)
        }
    }, [roomId]) // eslint-disable-line react-hooks/exhaustive-deps

    // ── Acciones ───────────────────────────────────────────────────────────────

    const savePreferences = useCallback(
        async (prefs: UserPreferences) => {
            const col = participant === 'user1' ? 'preferences1' : 'preferences2'

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { error } = await (supabase as any)
                .from('rooms')
                .update({ [col]: prefs })
                .eq('id', roomId)

            if (error) setState((s) => ({ ...s, error: error.message }))
        },
        [roomId, participant, supabase]
    )

    const saveVotes = useCallback(
        async (votes: SwipeVote[]) => {
            const col = participant === 'user1' ? 'votes1' : 'votes2'

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { error } = await (supabase as any)
                .from('rooms')
                .update({ [col]: votes })
                .eq('id', roomId)

            if (error) setState((s) => ({ ...s, error: error.message }))
        },
        [roomId, participant, supabase]
    )

    return {
        ...state,
        savePreferences,
        saveVotes,
    }
}