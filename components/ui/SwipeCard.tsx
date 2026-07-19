'use client'

import { useRef } from 'react'
import {
    motion,
    useMotionValue,
    useTransform,
    useAnimation,
    type PanInfo,
} from 'framer-motion'
import Image from 'next/image'
import { Star, Clock, ThumbsUp, ThumbsDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MediaItem, SwipeDecision } from '@/types'

interface SwipeCardProps {
    media: MediaItem
    onDecision: (id: string, decision: SwipeDecision) => void
    isTop: boolean
    stackIndex: number
}

const SWIPE_THRESHOLD = 100
const ROTATION_MAX = 18

export function SwipeCard({
    media,
    onDecision,
    isTop,
    stackIndex,
}: SwipeCardProps) {
    const controls = useAnimation()
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const isDragging = useRef(false)

    const rotate = useTransform(x, [-300, 300], [-ROTATION_MAX, ROTATION_MAX])
    const likeOpacity = useTransform(x, [20, 120], [0, 1])
    const nopeOpacity = useTransform(x, [-20, -120], [0, 1])
    const cardScale = useTransform(x, [-300, 0, 300], [0.95, 1, 0.95])

    async function flyOut(direction: 'left' | 'right') {
        const targetX = direction === 'right' ? 700 : -700
        await controls.start({
            x: targetX,
            y: -80,
            rotate: direction === 'right' ? 25 : -25,
            opacity: 0,
            transition: { duration: 0.38, ease: [0.4, 0, 0.2, 1] },
        })
        onDecision(media.id, direction === 'right' ? 'like' : 'dislike')
    }

    function handleDragEnd(_: unknown, info: PanInfo) {
        isDragging.current = false
        if (info.offset.x > SWIPE_THRESHOLD) {
            flyOut('right')
        } else if (info.offset.x < -SWIPE_THRESHOLD) {
            flyOut('left')
        } else {
            controls.start({
                x: 0,
                y: 0,
                rotate: 0,
                transition: { type: 'spring', stiffness: 400, damping: 28 },
            })
        }
    }

    // ── Tarjetas del stack (debajo de la principal) ───────────────────────────

    if (!isTop) {
        return (
            <motion.div
                className="absolute inset-0 rounded-3xl overflow-hidden"
                animate={{
                    scale: 1 - stackIndex * 0.04,
                    y: stackIndex * 12,
                    opacity: stackIndex > 2 ? 0 : 1 - stackIndex * 0.2,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={{ zIndex: 10 - stackIndex }}
            >
                <Image
                    src={media.backdropUrl}
                    alt=""
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/60" />
            </motion.div>
        )
    }

    // ── Tarjeta principal ─────────────────────────────────────────────────────

    return (
        <motion.div
            className={cn(
                'absolute inset-0 rounded-3xl overflow-hidden',
                'cursor-grab active:cursor-grabbing select-none',
                'shadow-2xl',
            )}
            style={{ x, y, rotate, scale: cardScale, zIndex: 20 }}
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.7}
            animate={controls}
            onDragStart={() => { isDragging.current = true }}
            onDragEnd={handleDragEnd}
        >
            {/* Backdrop */}
            <Image
                src={media.backdropUrl}
                alt={media.title}
                fill
                className="object-cover"
                priority
            />

            {/* Gradiente */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />

            {/* Indicador LIKE */}
            <motion.div
                style={{ opacity: likeOpacity }}
                className={cn(
                    'absolute top-8 left-6 z-30',
                    'px-4 py-2 rounded-xl border-2 border-green-400',
                    'bg-green-500/80 backdrop-blur-sm',
                    'text-white font-bold text-xl rotate-[-12deg]',
                )}
            >
                ME GUSTA ❤️
            </motion.div>

            {/* Indicador NOPE */}
            <motion.div
                style={{ opacity: nopeOpacity }}
                className={cn(
                    'absolute top-8 right-6 z-30',
                    'px-4 py-2 rounded-xl border-2 border-red-400',
                    'bg-red-500/80 backdrop-blur-sm',
                    'text-white font-bold text-xl rotate-[12deg]',
                )}
            >
                NOPE ✕
            </motion.div>

            {/* Poster pequeño */}
            <div className="absolute bottom-40 right-4 w-20 h-28 rounded-xl overflow-hidden shadow-xl border border-white/20 z-10">
                <Image
                    src={media.posterUrl}
                    alt=""
                    fill
                    className="object-cover"
                />
            </div>

            {/* Info */}
            <div className="absolute bottom-0 left-0 right-0 p-5 pb-4 z-10">
                <h2 className="text-white text-2xl sm:text-3xl font-bold leading-tight mb-1.5">
                    {media.title}
                </h2>

                {/* Meta */}
                <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-white/60 text-sm mb-2.5">
                    <span>{media.year}</span>

                    {media.duration && (
                        <>
                            <span>·</span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {media.duration}
                            </span>
                        </>
                    )}

                    <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        {media.rating.toFixed(1)}
                    </span>
                </div>

                {/* Géneros */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                    {media.genres.slice(0, 4).map((g) => (
                        <span
                            key={g}
                            className={cn(
                                'text-xs px-2.5 py-0.5 rounded-full',
                                'bg-white/10 text-white/70 border border-white/10',
                                'backdrop-blur-sm',
                            )}
                        >
                            {g}
                        </span>
                    ))}
                </div>

                {/* Sinopsis */}
                <p className="text-white/50 text-sm line-clamp-2 mb-4 leading-relaxed">
                    {media.synopsis}
                </p>

                {/* Botones */}
                <div className="flex gap-3">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => flyOut('left')}
                        className={cn(
                            'flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl',
                            'bg-white/8 border border-white/15 text-white',
                            'hover:bg-red-500/20 hover:border-red-400/30',
                            'transition-colors duration-200',
                        )}
                    >
                        <ThumbsDown className="w-5 h-5" />
                        <span className="font-medium text-sm">No me interesa</span>
                    </motion.button>

                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => flyOut('right')}
                        className={cn(
                            'flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl',
                            'bg-white/8 border border-white/15 text-white',
                            'hover:bg-green-500/20 hover:border-green-400/30',
                            'transition-colors duration-200',
                        )}
                    >
                        <ThumbsUp className="w-5 h-5" />
                        <span className="font-medium text-sm">Me interesa</span>
                    </motion.button>
                </div>
            </div>
        </motion.div>
    )
}