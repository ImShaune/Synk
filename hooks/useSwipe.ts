'use client'

import { useState, useCallback } from 'react'
import type { MediaItem, SwipeVote, SwipeDecision } from '@/types'

interface UseSwipeOptions {
    cards: MediaItem[]
    onComplete: (votes: SwipeVote[]) => void
}

export function useSwipe({ cards, onComplete }: UseSwipeOptions) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [votes, setVotes] = useState<SwipeVote[]>([])

    const currentCard = cards[currentIndex] ?? null
    const isLast = currentIndex === cards.length - 1
    const isDone = currentIndex >= cards.length
    const progress = cards.length > 0
        ? Math.round((currentIndex / cards.length) * 100)
        : 0

    const decide = useCallback(
        (decision: SwipeDecision) => {
            if (!currentCard) return

            const vote: SwipeVote = {
                mediaId: currentCard.id,
                decision,
            }

            const updatedVotes = [...votes, vote]
            setVotes(updatedVotes)

            if (isLast || currentIndex >= cards.length - 1) {
                onComplete(updatedVotes)
            } else {
                setCurrentIndex((i) => i + 1)
            }
        },
        [currentCard, votes, isLast, currentIndex, cards.length, onComplete]
    )

    const like = useCallback(() => decide('like'), [decide])
    const dislike = useCallback(() => decide('dislike'), [decide])

    const reset = useCallback(() => {
        setCurrentIndex(0)
        setVotes([])
    }, [])

    return {
        currentCard,
        currentIndex,
        votes,
        progress,
        isDone,
        isLast,
        like,
        dislike,
        decide,
        reset,
    }
}