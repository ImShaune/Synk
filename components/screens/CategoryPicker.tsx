'use client'

import { motion, type Variants } from 'framer-motion'
import { Film, Tv, Gamepad2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MediaCategory } from '@/types'

interface CategoryPickerProps {
    onSelect: (category: MediaCategory) => void
}

const container: Variants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.1,
        },
    },
}

const item: Variants = {
    hidden: { opacity: 0, y: 24 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: 'easeOut',
        },
    },
}

const CATEGORIES = [
    {
        id: 'movie' as MediaCategory,
        label: 'Películas',
        description: 'Clásicos, blockbusters y cine independiente',
        icon: Film,
        gradient: 'from-orange-500/20 to-red-500/20',
        border: 'hover:border-orange-500/40',
        iconColor: 'text-orange-400',
    },
    {
        id: 'series' as MediaCategory,
        label: 'Series',
        description: 'Temporadas completas para maratonear',
        icon: Tv,
        gradient: 'from-blue-500/20 to-purple-500/20',
        border: 'hover:border-blue-500/40',
        iconColor: 'text-blue-400',
    },
    {
        id: 'game' as MediaCategory,
        label: 'Videojuegos',
        description: 'Indie, AAA, multijugador y más',
        icon: Gamepad2,
        gradient: 'from-green-500/20 to-teal-500/20',
        border: 'hover:border-green-500/40',
        iconColor: 'text-green-400',
    },
]

export function CategoryPicker({ onSelect }: CategoryPickerProps) {
    return (
        <div className="flex flex-col items-center w-full max-w-2xl mx-auto px-6">

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="text-center mb-10"
            >
                <p className="text-white/40 text-sm uppercase tracking-widest mb-3">
                    Paso 1 de 3
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                    ¿Qué estás buscando?
                </h2>
                <p className="text-white/50 text-base">
                    Elegí una categoría para empezar
                </p>
            </motion.div>

            {/* Cards */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full"
            >
                {CATEGORIES.map((cat) => {
                    const Icon = cat.icon
                    return (
                        <motion.button
                            key={cat.id}
                            variants={item}
                            whileHover={{ scale: 1.03, y: -4 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => onSelect(cat.id)}
                            className={cn(
                                'relative flex flex-col items-center justify-center gap-4',
                                'p-8 rounded-2xl text-center',
                                'bg-white/5 border border-white/10',
                                'hover:bg-gradient-to-b',
                                cat.gradient,
                                cat.border,
                                'transition-all duration-300',
                                'group cursor-pointer',
                            )}
                        >
                            {/* Ícono */}
                            <div className={cn(
                                'w-16 h-16 rounded-2xl flex items-center justify-center',
                                'bg-white/8 group-hover:bg-white/12 transition-colors duration-300',
                            )}>
                                <Icon className={cn('w-8 h-8', cat.iconColor)} />
                            </div>

                            {/* Texto */}
                            <div>
                                <p className="text-white font-semibold text-lg mb-1">
                                    {cat.label}
                                </p>
                                <p className="text-white/40 text-sm leading-snug">
                                    {cat.description}
                                </p>
                            </div>

                            {/* Hover glow */}
                            <div className={cn(
                                'absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100',
                                'transition-opacity duration-300 pointer-events-none',
                                'bg-gradient-to-b',
                                cat.gradient,
                            )} />
                        </motion.button>
                    )
                })}
            </motion.div>
        </div>
    )
}