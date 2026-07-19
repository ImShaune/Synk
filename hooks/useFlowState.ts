'use client'

import { useState, useCallback } from 'react'
import type {
    FlowState,
    FlowStep,
    MediaCategory,
    MediaItem,
    MatchResult,
    SwipeVote,
} from '@/types'

const INITIAL_STATE: FlowState = {
    step: 'category',
    mode: 'solo',
    preferences: {
        category: null,
        genres: [],
        yearRange: [1990, new Date().getFullYear()],
    },
    mediaCards: [],
    votes: [],
    matchResult: null,
}

export function useFlowState(mode: 'solo' | 'coop' = 'solo') {
    const [state, setState] = useState<FlowState>({
        ...INITIAL_STATE,
        mode,
    })

    // ── Navegación ─────────────────────────────────────────────────────────────

    const goTo = useCallback((step: FlowStep) => {
        setState((s) => ({ ...s, step }))
    }, [])

    const goNext = useCallback(() => {
        setState((s) => {
            const steps: FlowStep[] = [
                'category',
                'genres',
                'yearRange',
                'loading',
                'swipe',
                'processing',
                'result',
            ]
            const current = steps.indexOf(s.step)
            const next = steps[current + 1]
            return next ? { ...s, step: next } : s
        })
    }, [])

    const goBack = useCallback(() => {
        setState((s) => {
            const steps: FlowStep[] = [
                'category',
                'genres',
                'yearRange',
                'loading',
                'swipe',
                'processing',
                'result',
            ]
            const current = steps.indexOf(s.step)
            const prev = steps[current - 1]
            return prev ? { ...s, step: prev } : s
        })
    }, [])

    // ── Preferencias ───────────────────────────────────────────────────────────

    const setCategory = useCallback((category: MediaCategory) => {
        const defaultYear: Record<MediaCategory, number> = {
            movie: 1980,
            series: 1990,
            game: 2000,
        }
        setState((s) => ({
            ...s,
            preferences: {
                ...s.preferences,
                category,
                yearRange: [defaultYear[category], new Date().getFullYear()],
            },
            step: 'genres',
        }))
    }, [])

    const toggleGenre = useCallback((genre: string) => {
        setState((s) => {
            const genres = s.preferences.genres.includes(genre)
                ? s.preferences.genres.filter((g) => g !== genre)
                : [...s.preferences.genres, genre]
            return {
                ...s,
                preferences: { ...s.preferences, genres },
            }
        })
    }, [])

    const setYearRange = useCallback((range: [number, number]) => {
        setState((s) => ({
            ...s,
            preferences: { ...s.preferences, yearRange: range },
        }))
    }, [])

    // ── Swipe ──────────────────────────────────────────────────────────────────

    const setMediaCards = useCallback((cards: MediaItem[]) => {
        setState((s) => ({ ...s, mediaCards: cards }))
    }, [])

    const addVote = useCallback((vote: SwipeVote) => {
        setState((s) => ({
            ...s,
            votes: [...s.votes, vote],
        }))
    }, [])

    // ── Resultado ──────────────────────────────────────────────────────────────

    const setMatchResult = useCallback((result: MatchResult) => {
        setState((s) => ({ ...s, matchResult: result, step: 'result' }))
    }, [])

    // ── Reset ──────────────────────────────────────────────────────────────────

    const reset = useCallback(() => {
        setState({ ...INITIAL_STATE, mode })
    }, [mode])

    return {
        state,
        goTo,
        goNext,
        goBack,
        setCategory,
        toggleGenre,
        setYearRange,
        setMediaCards,
        addVote,
        setMatchResult,
        reset,
    }
}