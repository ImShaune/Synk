'use client'

import { useRef, useState } from 'react'
import {
    motion,
    useMotionValue,
    useTransform,
    useAnimation,
    AnimatePresence,
    type PanInfo,
} from 'framer-motion'
import Image from 'next/image'
import { Star, Clock, ThumbsUp, ThumbsDown, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MediaItem, SwipeDecision } from '@/types'

interface SwipeCardProps {
    media: MediaItem
    onDecision: (id: string, decision: SwipeDecision) => void
    isTop: boolean
    stackIndex: number
    offset: number
}

const SWIPE_THRESHOLD = 100
const ROTATION_MAX = 18

export function SwipeCard({ media, onDecision, isTop, stackIndex, offset }: SwipeCardProps) {
    const controls = useAnimation()
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const isDragging = useRef(false)
    const [expanded, setExpanded] = useState(false)

    const rotate = useTransform(x, [-300, 300], [-ROTATION_MAX, ROTATION_MAX])
    const likeOpacity = useTransform(x, [20, 120], [0, 1])
    const nopeOpacity = useTransform(x, [-20, -120], [0, 1])
    const cardScale = useTransform(x, [-300, 0, 300], [0.95, 1, 0.95])

    async function flyOut(direction: 'left' | 'right') {
        setExpanded(false)
        const targetX = direction === 'right' ? 700 : -700
        await controls.start({
            x: targetX,
            y: -80,
            rotate: direction === 'right' ? 25 : -25,
            opacity: 0,
            transition: { duration: 0.38 },
        })
        onDecision(media.id, direction === 'right' ? 'like' : 'dislike')
    }

    function handleDragEnd(_: unknown, info: PanInfo) {
        isDragging.current = false
        if (info.offset.x > SWIPE_THRESHOLD) flyOut('right')
        else if (info.offset.x < -SWIPE_THRESHOLD) flyOut('left')
        else {
            controls.start({
                x: 0, y: 0, rotate: 0,
                transition: { type: 'spring', stiffness: 400, damping: 28 },
            })
        }
    }

    // ── Cards del stack ───────────────────────────────────────────────────────

    if (!isTop) {
        const scale = 1 - stackIndex * 0.04
        return (
            <motion.div
                className="absolute left-0 right-0 rounded-3xl overflow-hidden"
                animate={{
                    scale,
                    opacity: stackIndex > 2 ? 0 : 1 - stackIndex * 0.3,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={{
                    zIndex: 10 - stackIndex,
                    top: offset,
                    bottom: 0,
                    // Recortar la parte superior para que no se superponga
                    clipPath: `inset(0 0 0 0 round 24px)`,
                }}
            >
                <Image src={media.backdropUrl} alt="" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/75" />
            </motion.div>
        )
    }

    // ── Card principal ────────────────────────────────────────────────────────

    return (
        <motion.div
            className={cn(
                'absolute inset-0 rounded-3xl overflow-hidden',
                'cursor-grab active:cursor-grabbing select-none shadow-2xl',
            )}
            style={{ x, y, rotate, scale: cardScale, zIndex: 20 }}
            drag={!expanded}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.7}
            animate={controls}
            onDragStart={() => { isDragging.current = true }}
            onDragEnd={handleDragEnd}
        >
            <Image
                src={media.backdropUrl}
                alt={media.title}
                fill
                className="object-cover"
                priority
            />

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 z-10"
                        style={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.6)' }}
                    />
                )}
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

            <motion.div
                style={{ opacity: likeOpacity }}
                className="absolute top-8 left-6 z-30 px-4 py-2 rounded-xl border-2 border-green-400 bg-green-500/80 backdrop-blur-sm text-white font-bold text-xl rotate-[-12deg]"
            >
                ME GUSTA
            </motion.div>

            <motion.div
                style={{ opacity: nopeOpacity }}
                className="absolute top-8 right-6 z-30 px-4 py-2 rounded-xl border-2 border-red-400 bg-red-500/80 backdrop-blur-sm text-white font-bold text-xl rotate-[12deg]"
            >
                NOPE
            </motion.div>

            <AnimatePresence>
                {!expanded && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-36 right-4 w-20 h-28 rounded-xl overflow-hidden shadow-xl border border-white/20 z-10"
                    >
                        <Image src={media.posterUrl} alt="" fill className="object-cover" />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="absolute bottom-0 left-0 right-0 p-5 pb-4 z-20">
                <h2 className="text-white text-2xl sm:text-3xl font-bold leading-tight mb-1.5">
                    {media.title}
                </h2>

                <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-white/60 text-sm mb-2.5">
                    <span>{media.year}</span>
                    {media.duration && (
                        <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {media.duration}
                        </span>
                    )}
                    <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        {media.rating.toFixed(1)}
                    </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                    {media.genres.slice(0, 4).map((g) => (
                        <span
                            key={g}
                            className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-white/70 border border-white/10 backdrop-blur-sm"
                        >
                            {g}
                        </span>
                    ))}
                </div>

                {media.synopsis && (
                    <div className="mb-3">
                        <AnimatePresence initial={false} mode="wait">
                            {expanded ? (
                                <motion.p
                                    key="expanded"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-white/80 text-sm leading-relaxed mb-2 max-h-48 overflow-y-auto scrollbar-hide"
                                >
                                    {media.synopsis}
                                </motion.p>
                            ) : (
                                <motion.p
                                    key="collapsed"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-white/60 text-sm line-clamp-2 leading-relaxed mb-2"
                                >
                                    {media.synopsis}
                                </motion.p>
                            )}
                        </AnimatePresence>

                        <button
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v) }}
                            className="flex items-center gap-1 text-white/40 hover:text-white/70 text-xs transition-colors duration-200"
                        >
                            {expanded ? (
                                <><ChevronUp className="w-3.5 h-3.5" />Ver menos</>
                            ) : (
                                <><ChevronDown className="w-3.5 h-3.5" />Ver sinopsis completa</>
                            )}
                        </button>
                    </div>
                )}

                <div className="flex gap-3">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => { e.stopPropagation(); flyOut('left') }}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/8 border border-white/15 text-white hover:bg-red-500/20 hover:border-red-400/30 transition-colors duration-200"
                    >
                        <ThumbsDown className="w-5 h-5" />
                        <span className="font-medium text-sm">No me interesa</span>
                    </motion.button>

                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => { e.stopPropagation(); flyOut('right') }}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/8 border border-white/15 text-white hover:bg-green-500/20 hover:border-green-400/30 transition-colors duration-200"
                    >
                        <ThumbsUp className="w-5 h-5" />
                        <span className="font-medium text-sm">Me interesa</span>
                    </motion.button>
                </div>
            </div>
        </motion.div>
    )
}