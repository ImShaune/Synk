'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
    value: number        // 0-100
    showLabel?: boolean
    label?: string
    className?: string
    shimmer?: boolean
}

export function ProgressBar({
    value,
    showLabel = false,
    label,
    className,
    shimmer = true,
}: ProgressBarProps) {
    const clamped = Math.min(100, Math.max(0, value))

    return (
        <div className={cn('w-full', className)}>

            {/* Label opcional */}
            {(showLabel || label) && (
                <div className="flex justify-between items-center mb-2">
                    {label && (
                        <span className="text-sm text-white/50">{label}</span>
                    )}
                    {showLabel && (
                        <motion.span
                            key={Math.round(clamped)}
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm font-medium text-white/70 tabular-nums ml-auto"
                        >
                            {Math.round(clamped)}%
                        </motion.span>
                    )}
                </div>
            )}

            {/* Track */}
            <div className="relative h-1 w-full rounded-full bg-white/10 overflow-hidden">

                {/* Fill */}
                <motion.div
                    className="absolute left-0 top-0 h-full rounded-full bg-white"
                    initial={{ width: '0%' }}
                    animate={{ width: `${clamped}%` }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                />

                {/* Shimmer */}
                {shimmer && clamped < 100 && (
                    <motion.div
                        className="absolute top-0 h-full w-20 rounded-full"
                        style={{
                            background:
                                'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                        }}
                        animate={{ left: ['-10%', '110%'] }}
                        transition={{
                            duration: 1.6,
                            ease: 'easeInOut',
                            repeat: Infinity,
                            repeatDelay: 0.4,
                        }}
                    />
                )}
            </div>
        </div>
    )
}