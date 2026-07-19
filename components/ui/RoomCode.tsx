'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, Share2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getRoomUrl } from '@/lib/utils'

interface RoomCodeProps {
    code: string
    partnerConnected: boolean
    className?: string
}

export function RoomCode({
    code,
    partnerConnected,
    className,
}: RoomCodeProps) {
    const [copied, setCopied] = useState(false)
    const roomUrl = getRoomUrl(code)

    async function handleCopy() {
        await navigator.clipboard.writeText(roomUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    async function handleShare() {
        if (navigator.share) {
            await navigator.share({
                title: 'MatchFlix',
                text: '¡Unite a mi sala y encontremos algo para ver juntos!',
                url: roomUrl,
            })
        } else {
            handleCopy()
        }
    }

    return (
        <div className={cn('flex flex-col items-center gap-8', className)}>

            {/* Código */}
            <div className="flex gap-2 sm:gap-3">
                {code.split('').map((char, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 24, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                            delay: i * 0.07,
                            type: 'spring',
                            stiffness: 400,
                            damping: 25,
                        }}
                        className={cn(
                            'w-11 h-14 sm:w-14 sm:h-16 flex items-center justify-center',
                            'rounded-xl bg-white/8 border border-white/15',
                            'text-white text-2xl sm:text-3xl font-mono font-bold',
                            'backdrop-blur-sm',
                        )}
                    >
                        {char}
                    </motion.div>
                ))}
            </div>

            {/* URL */}
            <p className="text-white/30 text-xs font-mono truncate max-w-xs text-center">
                {roomUrl}
            </p>

            {/* Botones */}
            <div className="flex gap-3">
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopy}
                    className={cn(
                        'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium',
                        'bg-white/8 border border-white/15 text-white',
                        'hover:bg-white/15 hover:border-white/25 transition-all duration-200',
                    )}
                >
                    <AnimatePresence mode="wait" initial={false}>
                        {copied ? (
                            <motion.span
                                key="check"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ duration: 0.15 }}
                            >
                                <Check className="w-4 h-4 text-green-400" />
                            </motion.span>
                        ) : (
                            <motion.span
                                key="copy"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ duration: 0.15 }}
                            >
                                <Copy className="w-4 h-4" />
                            </motion.span>
                        )}
                    </AnimatePresence>
                    {copied ? 'Copiado' : 'Copiar enlace'}
                </motion.button>

                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShare}
                    className={cn(
                        'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium',
                        'bg-white/8 border border-white/15 text-white',
                        'hover:bg-white/15 hover:border-white/25 transition-all duration-200',
                    )}
                >
                    <Share2 className="w-4 h-4" />
                    Compartir
                </motion.button>
            </div>

            {/* Estado de conexión */}
            <AnimatePresence mode="wait">
                {partnerConnected ? (
                    <motion.div
                        key="connected"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={cn(
                            'flex items-center gap-2.5 px-5 py-3 rounded-2xl',
                            'bg-green-500/10 border border-green-500/25 text-green-400',
                        )}
                    >
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400" />
                        </span>
                        <span className="text-sm font-medium">¡Ambos conectados!</span>
                    </motion.div>
                ) : (
                    <motion.div
                        key="waiting"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={cn(
                            'flex items-center gap-2.5 px-5 py-3 rounded-2xl',
                            'bg-white/5 border border-white/10 text-white/50',
                        )}
                    >
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Esperando al segundo usuario...</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}