'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GenreChipProps {
    label: string
    selected: boolean
    onToggle: (label: string) => void
    disabled?: boolean
}

export function GenreChip({
    label,
    selected,
    onToggle,
    disabled = false,
}: GenreChipProps) {
    return (
        <motion.button
            onClick={() => !disabled && onToggle(label)}
            whileHover={!disabled ? { scale: 1.05 } : {}}
            whileTap={!disabled ? { scale: 0.95 } : {}}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={cn(
                'relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium',
                'border transition-all duration-200 select-none',
                selected
                    ? [
                        'bg-white text-black border-white',
                        'shadow-[0_0_20px_rgba(255,255,255,0.15)]',
                    ]
                    : [
                        'bg-white/5 text-white/60 border-white/10',
                        'hover:bg-white/10 hover:border-white/25 hover:text-white',
                    ],
                disabled && 'opacity-50 cursor-not-allowed'
            )}
        >
            {/* Ícono check animado */}
            <motion.span
                initial={false}
                animate={{
                    width: selected ? 16 : 0,
                    opacity: selected ? 1 : 0,
                }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="overflow-hidden flex items-center"
            >
                <Check className="w-3.5 h-3.5 shrink-0" strokeWidth={2.5} />
            </motion.span>

            {label}
        </motion.button>
    )
}