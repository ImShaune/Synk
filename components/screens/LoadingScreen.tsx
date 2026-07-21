'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ProgressBar } from '@/components/ui/ProgressBar'

interface LoadingScreenProps {
    onComplete: () => Promise<void>
}

const MESSAGES = [
    'Analizando tus gustos...',
    'Buscando coincidencias...',
    'Comparando miles de titulos...',
    'Aplicando el algoritmo...',
    'Preparando tus recomendaciones...',
    'Casi listo...',
]

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
    const [progress, setProgress] = useState(0)
    const [messageIndex, setMessageIndex] = useState(0)
    const [apiDone, setApiDone] = useState(false)
    const calledRef = useRef(false)

    // Rotar mensajes
    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % MESSAGES.length)
        }, 1800)
        return () => clearInterval(interval)
    }, [])

    // Llamar a la API inmediatamente
    useEffect(() => {
        if (calledRef.current) return
        calledRef.current = true

        onComplete().then(() => {
            setApiDone(true)
        })
    }, [onComplete])

    // Avanzar el progreso — se detiene en 90% hasta que la API responda
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                const limit = apiDone ? 100 : 90
                const increment = prev < 60 ? 3 : prev < 80 ? 1.5 : 0.5
                return Math.min(prev + increment, limit)
            })
        }, 100)
        return () => clearInterval(interval)
    }, [apiDone])

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto px-6 min-h-[60vh]">

            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="relative mb-12"
            >
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className="absolute inset-0 rounded-full border border-white/20"
                        animate={{ scale: [1, 1.8 + i * 0.4], opacity: [0.4, 0] }}
                        transition={{ duration: 2, ease: 'easeOut', repeat: Infinity, delay: i * 0.5 }}
                    />
                ))}
                <div className="relative w-20 h-20 rounded-full glass flex items-center justify-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, ease: 'linear', repeat: Infinity }}
                        className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white"
                    />
                </div>
            </motion.div>

            <div className="h-8 flex items-center justify-center mb-10">
                <AnimatePresence mode="wait">
                    <motion.p
                        key={messageIndex}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                        className="text-white/70 text-lg font-medium text-center"
                    >
                        {MESSAGES[messageIndex]}
                    </motion.p>
                </AnimatePresence>
            </div>

            <div className="w-full">
                <ProgressBar value={progress} showLabel shimmer />
            </div>

        </div>
    )
}