'use client'

import { useEffect, useCallback, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { BackdropPoster } from '@/components/ui/BackdropPoster'
import { RoomCode } from '@/components/ui/RoomCode'
import { CategoryPicker } from '@/components/screens/CategoryPicker'
import { GenrePicker } from '@/components/screens/GenrePicker'
import { YearRangePicker } from '@/components/screens/YearRangePicker'
import { CardCountPicker } from '@/components/screens/CardCountPicker'
import { LoadingScreen } from '@/components/screens/LoadingScreen'
import { SwipeScreen } from '@/components/screens/SwipeScreen'
import { MatchResult } from '@/components/screens/MatchResult'
import { useFlowState } from '@/hooks/useFlowState'
import { useRoom } from '@/hooks/useRoom'
import { useMediaSearch } from '@/hooks/useMediaSearch'
import { useFavorites } from '@/hooks/useFavorites'
import type { RoomParticipant, SwipeVote } from '@/types'

const FALLBACK_BACKDROP = 'https://image.tmdb.org/t/p/w1280/tmU7GeKVybMWFButWEGl2M4GeiP.jpg'

export default function RoomPage() {
    const params = useParams()
    const searchParams = useSearchParams()

    const roomCode = (params.id as string).toUpperCase()
    const participant = (searchParams.get('participant') ?? 'user1') as RoomParticipant

    const {
        state,
        setCategory,
        toggleGenre,
        setYearRange,
        setCardCount,
        setMediaCards,
        setMatchResult,
        goTo,
        goNext,
        goBack,
        reset,
    } = useFlowState('coop')

    const { room, partnerConnected, partnerDisconnected, savePreferences, saveVotes } = useRoom({
        roomId: roomCode,
        participant,
    })

    const { search } = useMediaSearch()
    const { save } = useFavorites()
    const [isSaved, setIsSaved] = useState(false)

    const backdropUrl = state.mediaCards[0]?.backdropUrl ?? FALLBACK_BACKDROP

    const handleLoadingComplete = useCallback(async () => {
        const cards = await search(state.preferences)
        if (cards.length > 0) {
            setMediaCards(cards)
            goTo('swipe')
        }
    }, [state.preferences, search, setMediaCards, goTo])

    const handleSwipeComplete = useCallback(async (votes: SwipeVote[]) => {
        await saveVotes(votes)
        goTo('processing')

        const room_ = room
        if (!room_) return

        const votes1 = participant === 'user1' ? votes : (room_.votes1 as SwipeVote[])
        const votes2 = participant === 'user2' ? votes : (room_.votes2 as SwipeVote[])
        const prefs1 = room_.preferences1 ?? state.preferences
        const prefs2 = room_.preferences2 ?? state.preferences

        try {
            const res = await fetch('/api/match', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mode: 'coop',
                    cards: state.mediaCards,
                    votes1,
                    votes2,
                    preferences1: prefs1,
                    preferences2: prefs2,
                }),
            })
            const data = await res.json()
            if (data.result) setMatchResult(data.result)
        } catch (err) {
            console.error(err)
        }
    }, [room, participant, state.mediaCards, state.preferences, saveVotes, setMatchResult, goTo])

    const handleNext = useCallback(async () => {
        await savePreferences(state.preferences)
        if (state.step === 'cardCount') {
            goTo('loading')
        } else {
            goNext()
        }
    }, [state.step, state.preferences, savePreferences, goTo, goNext])

    async function handleSave() {
        if (!state.matchResult) return
        const ok = await save(state.matchResult.media)
        if (ok) setIsSaved(true)
    }

    function handleReset() {
        setIsSaved(false)
        reset()
    }

    const slideProps = {
        initial: { opacity: 0, x: 40 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -40 },
        transition: { duration: 0.35, ease: 'easeInOut' as const },
        className: 'relative z-10 w-full',
    }

    if (partnerDisconnected) {
        return (
            <main className="relative min-h-screen flex flex-col items-center justify-center px-6">
                <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-black to-black" />
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 text-center max-w-sm"
                >
                    <p className="text-5xl mb-6">😔</p>
                    <h2 className="text-2xl font-bold text-white mb-3">
                        Tu compañero se desconecto
                    </h2>
                    <p className="text-white/50 text-base mb-8">
                        La sesion no puede continuar sin el segundo usuario.
                    </p>
                    <button
                        onClick={handleReset}
                        className="px-6 py-3 rounded-2xl bg-white text-black font-semibold hover:bg-white/90 transition-all duration-200"
                    >
                        Volver al inicio
                    </button>
                </motion.div>
            </main>
        )
    }

    if (!partnerConnected && state.step === 'category') {
        return (
            <main className="relative min-h-screen flex flex-col items-center justify-center px-6">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
                    <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-purple-600/10 blur-3xl" />
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 text-center w-full max-w-md"
                >
                    <h1 className="text-3xl font-bold text-white mb-3">Tu sala esta lista</h1>
                    <p className="text-white/50 text-base mb-10">
                        Compartí el codigo con tu compañero para empezar
                    </p>
                    <RoomCode
                        code={roomCode}
                        partnerConnected={partnerConnected}
                    />
                    {partnerConnected && (
                        <motion.button
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={() => goNext()}
                            className="mt-8 w-full py-4 rounded-2xl bg-white text-black font-semibold hover:bg-white/90 transition-all duration-200"
                        >
                            Empezar juntos
                        </motion.button>
                    )}
                </motion.div>
            </main>
        )
    }

    return (
        <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-12">

            <BackdropPoster src={backdropUrl} />

            <AnimatePresence mode="wait">

                {state.step === 'category' && (
                    <motion.div key="category" {...slideProps}>
                        <CategoryPicker onSelect={setCategory} />
                    </motion.div>
                )}

                {state.step === 'genres' && state.preferences.category && (
                    <motion.div key="genres" {...slideProps}>
                        <GenrePicker
                            category={state.preferences.category}
                            selectedGenres={state.preferences.genres}
                            onToggle={toggleGenre}
                            onNext={handleNext}
                            onBack={goBack}
                        />
                    </motion.div>
                )}

                {state.step === 'yearRange' && (
                    <motion.div key="yearRange" {...slideProps}>
                        <YearRangePicker
                            value={state.preferences.yearRange}
                            onChange={setYearRange}
                            onNext={handleNext}
                            onBack={goBack}
                            category={state.preferences.category ?? 'movie'}
                        />
                    </motion.div>
                )}

                {state.step === 'cardCount' && (
                    <motion.div key="cardCount" {...slideProps}>
                        <CardCountPicker
                            value={state.preferences.cardCount}
                            onChange={setCardCount}
                            onNext={handleNext}
                            onBack={goBack}
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
                        transition={{ duration: 0.5 }}
                        className="relative z-10 w-full"
                    >
                        <MatchResult
                            result={state.matchResult}
                            onSave={handleSave}
                            onRetry={() => goTo('swipe')}
                            onReset={handleReset}
                            isSaved={isSaved}
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
                        <p className="text-white/60 text-sm">Buscando coincidencias entre los dos...</p>
                    </motion.div>
                )}

            </AnimatePresence>
        </main>
    )
}