'use client'

import { useState, useCallback } from 'react'
import type { MediaItem, UserPreferences } from '@/types'

interface UseMediaSearchResult {
    cards: MediaItem[]
    loading: boolean
    error: string | null
    search: (prefs: UserPreferences) => Promise<MediaItem[]>
    reset: () => void
}

export function useMediaSearch(): UseMediaSearchResult {
    const [cards, setCards] = useState<MediaItem[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const search = useCallback(async (prefs: UserPreferences): Promise<MediaItem[]> => {
        setLoading(true)
        setError(null)

        try {
            const res = await fetch('/api/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(prefs),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error ?? 'Error al buscar contenido')
            }

            const data = await res.json()
            setCards(data.cards)
            return data.cards
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error desconocido'
            setError(message)
            return []
        } finally {
            setLoading(false)
        }
    }, [])

    const reset = useCallback(() => {
        setCards([])
        setError(null)
        setLoading(false)
    }, [])

    return { cards, loading, error, search, reset }
}