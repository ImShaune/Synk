'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ProgressBar } from '@/components/ui/ProgressBar'

interface LoadingScreenProps {
    onComplete: () => void
}

const MESSAGES = [
    'Analizando tus gustos...',
    'Buscando coincidencias...',
    'Comparando miles de títulos...',
    'Aplicando el algoritmo...',
    'Preparando tus recomendaciones...',
    'Casi listo...',
]

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
    const [progress, setProgress] = useState(0)
    const [messageIndex, setMessageIndex] = useState(0)

    useEffect(() => {
        // Avanza el progreso gradualmente
        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 95) {
                    clearInterval(progressInterval)
                    return 95
                }
                // Avanza más rápido al principio, más lento al final
                const increment = prev < 60 ? 3 : prev < 85 ? 1.5 : 0.5
                return Math.min(prev + increment, 95)
            })
        }, 100)

        // Rota los mensajes
        const messageInterval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % MESSAGES.length)
        }, 1800)

        return () => {
            clearInterval(progressInterval)
            clearInterval(messageInterval)
        }
    }, [])

    // Cuando onComplete se llama desde afuera (cuando la API responde),
    // completamos la barra y esperamos un momento antes de avanzar
    useEffect(() => {
        if (progress >= 95) {
            const timeout = setTimeout(() => {
                setProgress(100)
                setTimeout(onComplete, 400)
            }, 500)
            return () => clearTimeout(timeout)
        }
    }, [progress, onComplete])

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto px-6 min-h-[60vh]">

            {/* Ícono animado */}
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="relative mb-12"
            >
                {/* Anillos pulsantes */}
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className="absolute inset-0 rounded-full border border-white/20"
                        animate={{
                            scale: [1, 1.8 + i * 0.4],
                            opacity: [0.4, 0],
                        }}
                        transition={{
                            duration: 2,
                            ease: 'easeOut',
                            repeat: Infinity,
                            delay: i * 0.5,
                        }}
                    />
                ))}

                {/* Centro */}
                <div className="relative w-20 h-20 rounded-full glass flex items-center justify-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, ease: 'linear', repeat: Infinity }}
                        className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white"
                    />
                </div>
            </motion.div>

            {/* Mensaje animado */}
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

            {/* Barra de progreso */}
            <div className="w-full">
                <ProgressBar
                    value={progress}
                    showLabel
                    shimmer
                />
            </div>

        </div>
    )
}