'use client'

import { useRef, useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface YearSliderProps {
    min: number
    max: number
    value: [number, number]
    onChange: (value: [number, number]) => void
}

export function YearSlider({ min, max, value, onChange }: YearSliderProps) {
    const trackRef = useRef<HTMLDivElement>(null)
    const dragging = useRef<'left' | 'right' | null>(null)
    const [hover, setHover] = useState<'left' | 'right' | null>(null)

    const toPercent = useCallback(
        (val: number) => ((val - min) / (max - min)) * 100,
        [min, max]
    )

    const fromPercent = useCallback(
        (pct: number) => Math.round(min + (pct / 100) * (max - min)),
        [min, max]
    )

    const getPercent = useCallback(
        (clientX: number): number => {
            const track = trackRef.current
            if (!track) return 0
            const rect = track.getBoundingClientRect()
            const pct = ((clientX - rect.left) / rect.width) * 100
            return Math.min(100, Math.max(0, pct))
        },
        []
    )

    const handleMove = useCallback(
        (clientX: number) => {
            if (!dragging.current) return
            const pct = getPercent(clientX)
            const val = fromPercent(pct)

            if (dragging.current === 'left') {
                onChange([Math.min(val, value[1] - 1), value[1]])
            } else {
                onChange([value[0], Math.max(val, value[0] + 1)])
            }
        },
        [dragging, getPercent, fromPercent, onChange, value]
    )

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => handleMove(e.clientX)
        const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX)
        const onUp = () => { dragging.current = null }

        window.addEventListener('mousemove', onMouseMove)
        window.addEventListener('mouseup', onUp)
        window.addEventListener('touchmove', onTouchMove)
        window.addEventListener('touchend', onUp)

        return () => {
            window.removeEventListener('mousemove', onMouseMove)
            window.removeEventListener('mouseup', onUp)
            window.removeEventListener('touchmove', onTouchMove)
            window.removeEventListener('touchend', onUp)
        }
    }, [handleMove])

    const leftPct = toPercent(value[0])
    const rightPct = toPercent(value[1])

    return (
        <div className="w-full px-3 py-6 select-none">

            {/* Años seleccionados */}
            <div className="flex justify-between mb-6">
                {(['left', 'right'] as const).map((side, i) => (
                    <div key={side} className="flex flex-col items-center gap-1">
                        <span className="text-xs text-white/40 uppercase tracking-widest">
                            {i === 0 ? 'Desde' : 'Hasta'}
                        </span>
                        <motion.span
                            key={value[i]}
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-3xl font-bold text-white tabular-nums"
                        >
                            {value[i]}
                        </motion.span>
                    </div>
                ))}
            </div>

            {/* Track */}
            <div
                ref={trackRef}
                className="relative h-1.5 rounded-full bg-white/10 cursor-pointer"
                onClick={(e) => {
                    const pct = getPercent(e.clientX)
                    const val = fromPercent(pct)
                    const distLeft = Math.abs(val - value[0])
                    const distRight = Math.abs(val - value[1])
                    if (distLeft <= distRight) {
                        onChange([Math.min(val, value[1] - 1), value[1]])
                    } else {
                        onChange([value[0], Math.max(val, value[0] + 1)])
                    }
                }}
            >
                {/* Rango activo */}
                <div
                    className="absolute top-0 h-full rounded-full bg-white/80"
                    style={{
                        left: `${leftPct}%`,
                        width: `${rightPct - leftPct}%`,
                    }}
                />

                {/* Thumb izquierdo */}
                <Thumb
                    percent={leftPct}
                    isHovered={hover === 'left'}
                    onMouseEnter={() => setHover('left')}
                    onMouseLeave={() => setHover(null)}
                    onMouseDown={() => { dragging.current = 'left' }}
                    onTouchStart={() => { dragging.current = 'left' }}
                />

                {/* Thumb derecho */}
                <Thumb
                    percent={rightPct}
                    isHovered={hover === 'right'}
                    onMouseEnter={() => setHover('right')}
                    onMouseLeave={() => setHover(null)}
                    onMouseDown={() => { dragging.current = 'right' }}
                    onTouchStart={() => { dragging.current = 'right' }}
                />
            </div>

            {/* Labels min/max */}
            <div className="flex justify-between mt-4">
                <span className="text-xs text-white/25">{min}</span>
                <span className="text-xs text-white/25">{max}</span>
            </div>
        </div>
    )
}

// ── Thumb ─────────────────────────────────────────────────────────────────────

interface ThumbProps {
    percent: number
    isHovered: boolean
    onMouseEnter: () => void
    onMouseLeave: () => void
    onMouseDown: () => void
    onTouchStart: () => void
}

function Thumb({
    percent,
    isHovered,
    onMouseEnter,
    onMouseLeave,
    onMouseDown,
    onTouchStart,
}: ThumbProps) {
    return (
        <motion.div
            className={cn(
                'absolute top-1/2 -translate-x-1/2 -translate-y-1/2',
                'w-5 h-5 rounded-full bg-white cursor-grab active:cursor-grabbing',
                'border-2 border-white/20',
                'shadow-[0_0_12px_rgba(255,255,255,0.3)]',
            )}
            style={{ left: `${percent}%` }}
            animate={{ scale: isHovered ? 1.3 : 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
        />
    )
}