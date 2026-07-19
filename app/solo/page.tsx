'use client'

import { useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BackdropPoster } from '@/components/ui/BackdropPoster'
import { CategoryPicker } from '@/components/screens/CategoryPicker'
import { GenrePicker } from '@/components/screens/GenrePicker'
import { YearRangePicker } from '@/components/screens/YearRangePicker'
import { LoadingScreen } from '@/components/screens/LoadingScreen'
import { SwipeScreen } from '@/components/screens/SwipeScreen'
import { MatchResult } from '@/components/screens/MatchResult'
import { useFlowState } from '@/hooks/useFlowState'
import { useMediaSearch } from '@/hooks/useMediaSearch'
import type { SwipeVote } from '@/types'

const FALLBACK_BACKDROP = 'https://image.tmdb.org/t/p/w1280/tmU7GeKVybMWFButWEGl2M4GeiP.jpg'

export default function SoloPage() {
    const { state, setCategory, toggleGenre, setYearRange, setMediaCards, setMatchResult, goTo, goNext, goBack, reset } = useFlowState('solo')
    const { search } = useMediaSearch()

    const backdropUrl = state.mediaCards[0]?.backdropUrl ?? FALLBACK_BACKDROP

    const handleLoadingComplete = useCallback(async () => {
        const cards = await search(state.preferences)
        if (cards.length > 0) {
            setMediaCards(cards)
            goTo('swipe')
        }
    }, [state.preferences, search, setMediaCards, goTo])

    const handleSwipeComplete = useCallback(async (votes: SwipeVote[]) => {
        goTo('processing')

        try {
            const res = await fetch('/api/match', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mode: 'solo',
                    cards: state.mediaCards,
                    votes,
                    preferences: state.preferences,
                }),
            })
            const data = await res.json()
            if (data.result) setMatchResult(data.result)
        } catch (err) {
            console.error(err)
        }
    }, [state.mediaCards, state.preferences, setMatchResult, goTo])

    const handleNext = useCallback(() => {
        if (state.step === 'yearRange') {
            goTo('loading')
        } else {
            goNext()
        }
    }, [state.step, goTo, goNext])

    return (
        <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-12">

            {/* Fondo */}
            <BackdropPoster src={backdropUrl} />

            {/* Contenido */}
            <AnimatePresence mode="wait">
                {state.step === 'category' && (
                    <motion.div
                        key="category"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        className="relative z-10 w-full"
                    >
                        <CategoryPicker onSelect={setCategory} />
                    </motion.div>
                )}

                {state.step === 'genres' && state.preferences.category && (
                    <motion.div
                        key="genres"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        className="relative z-10 w-full"
                    >
                        <GenrePicker
                            category={state.preferences.category}
                            selectedGenres={state.preferences.genres}
                            onToggle={toggleGenre}
                            onNext={goNext}
                            onBack={goBack}
                        />
                    </motion.div>
                )}

                {state.step === 'yearRange' && (
                    <motion.div
                        key="yearRange"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        className="relative z-10 w-full"
                    >
                        <YearRangePicker
                            value={state.preferences.yearRange}
                            onChange={setYearRange}
                            onNext={handleNext}
                            onBack={goBack}
                            category={state.preferences.category ?? 'movie'}
                        />
                    </motion.div>
                )}

                {state.step === 'loading' && (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35 }}
                        className="relative z-10 w-full"
                    >
                        <LoadingScreen onComplete={handleLoadingComplete} />
                    </motion.div>
                )}

                {state.step === 'swipe' && (
                    <motion.div
                        key="swipe"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.35 }}
                        className="relative z-10 w-full"
                    >
                        <SwipeScreen
                            cards={state.mediaCards}
                            onComplete={handleSwipeComplete}
                        />
                    </motion.div>
                )}

                {(state.step === 'processing' || state.step === 'result') && state.matchResult && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -24 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="relative z-10 w-full"
                    >
                        <MatchResult
                            result={state.matchResult}
                            onSave={() => { }}
                            onRetry={() => goTo('swipe')}
                            onReset={reset}
                        />
                    </motion.div>
                )}

                {state.step === 'processing' && !state.matchResult && (
                    <motion.div
                        key="processing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative z-10 flex flex-col items-center justify-center gap-4"
                    >
                        <div className="w-12 h-12 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                        <p className="text-white/60 text-sm">Calculando tu Match Perfecto...</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    )
}