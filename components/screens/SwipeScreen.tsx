'use client'

import { motion } from 'framer-motion'
import { SwipeCard } from '@/components/ui/SwipeCard'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useSwipe } from '@/hooks/useSwipe'
import type { MediaItem, SwipeVote } from '@/types'

interface SwipeScreenProps {
    cards: MediaItem[]
    onComplete: (votes: SwipeVote[]) => void
}

export function SwipeScreen({ cards, onComplete }: SwipeScreenProps) {
    const {
        currentCard,
        currentIndex,
        progress,
        isDone,
        like,
        dislike,
    } = useSwipe({ cards, onComplete })

    if (isDone || !currentCard) return null

    return (
        <div className="flex flex-col items-center w-full max-w-lg mx-auto px-4">

            <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full mb-6"
            >
                <div className="flex justify-between items-center mb-3">
                    <p className="text-white/40 text-sm uppercase tracking-widest">
                        Swipe
                    </p>
                    <p className="text-white/40 text-sm tabular-nums">
                        {currentIndex + 1} / {cards.length}
                    </p>
                </div>
                <ProgressBar value={progress} />
            </motion.div>

            <div
                className="relative w-full"
                style={{ height: '540px', isolation: 'isolate' }}
            >
                {cards
                    .slice(currentIndex, currentIndex + 4)
                    .reverse()
                    .map((card, i, arr) => {
                        const stackIndex = arr.length - 1 - i
                        const isTop = stackIndex === 0
                        const offset = stackIndex * 10

                        return (
                            <SwipeCard
                                key={card.id}
                                media={card}
                                isTop={isTop}
                                stackIndex={stackIndex}
                                offset={offset}
                                onDecision={(id, decision) => {
                                    if (decision === 'like') like()
                                    else dislike()
                                }}
                            />
                        )
                    })}
            </div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 text-white/25 text-xs text-center"
            >
                Desliza o usa los botones para decidir
            </motion.p>

        </div>
    )
}