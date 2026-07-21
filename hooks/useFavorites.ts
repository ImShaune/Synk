'use client'

import { useState, useEffect, useCallback } from 'react'
import type { MediaItem, SavedItem } from '@/types'

export function useFavorites() {
    const [items, setItems] = useState<SavedItem[]>([])
    const [loading, setLoading] = useState(true)

    const fetchItems = useCallback(async () => {
        try {
            const res = await fetch('/api/favorites')
            const data = await res.json()
            if (data.items) setItems(data.items.map((i: any) => ({
                id: i.id,
                userId: i.user_id,
                media: i.media as MediaItem,
                savedAt: i.saved_at,
            })))
        } catch {
            setItems([])
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchItems() }, [fetchItems])

    const save = useCallback(async (media: MediaItem): Promise<boolean> => {
        try {
            const res = await fetch('/api/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ media }),
            })
            if (!res.ok) return false
            await fetchItems()
            return true
        } catch {
            return false
        }
    }, [fetchItems])

    const remove = useCallback(async (itemId: string): Promise<boolean> => {
        try {
            const res = await fetch('/api/favorites', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itemId }),
            })
            if (!res.ok) return false
            setItems((prev) => prev.filter((i) => i.id !== itemId))
            return true
        } catch {
            return false
        }
    }, [])

    const isSaved = useCallback(
        (mediaId: string) => items.some((i) => i.media.id === mediaId),
        [items]
    )

    return { items, loading, save, remove, isSaved, refetch: fetchItems }
}