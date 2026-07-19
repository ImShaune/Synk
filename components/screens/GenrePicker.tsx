'use client'

import { motion, type Variants } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { GenreChip } from '@/components/ui/GenreChip'
import { getGenresForCategory } from '@/lib/genres'
import type { MediaCategory } from '@/types'

interface GenrePickerProps {
    category: MediaCategory
    selectedGenres: string[]
    onToggle: (genre: string) => void
    onNext: () => void
    onBack: () => void
}

const container: Variants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.03,
        },
    },
}

const item: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    show: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.3,
            ease: 'easeOut',
        },
    },
}

const CATEGORY_LABELS: Record<MediaCategory, string> = {
    movie: 'películas',
    series: 'series',
    game: 'videojuegos',
}

export function GenrePicker({
    category,
    selectedGenres,
    onToggle,
    onNext,
    onBack,
}: GenrePickerProps) {
    const genres = getGenresForCategory(category)

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
                    Paso 2 de 3
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                    ¿Qué géneros te gustan?
                </h2>
                <p className="text-white/50 text-base">
                    Elegí uno o más géneros de {CATEGORY_LABELS[category]}.
                    {' '}
                    <span className="text-white/30">
                        Si no elegís ninguno, buscamos de todo.
                    </span>
                </p>
            </motion.div>

            {/* Chips */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="flex flex-wrap justify-center gap-2.5 mb-10"
            >
                {genres.map((genre) => (
                    <motion.div key={genre} variants={item}>
                        <GenreChip
                            label={genre}
                            selected={selectedGenres.includes(genre)}
                            onToggle={onToggle}
                        />
                    </motion.div>
                ))}
            </motion.div>

            {/* Contador */}
            {selectedGenres.length > 0 && (
                <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-white/40 text-sm mb-8"
                >
                    {selectedGenres.length} género{selectedGenres.length > 1 ? 's' : ''} seleccionado{selectedGenres.length > 1 ? 's' : ''}
                </motion.p>
            )}

            {/* Navegación */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex gap-3 w-full max-w-xs"
            >
                <button
                    onClick={onBack}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl glass text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver
                </button>

                <button
                    onClick={onNext}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-white text-black font-semibold hover:bg-white/90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                    Continuar
                    <ArrowRight className="w-4 h-4" />
                </button>
            </motion.div>
        </div>
    )
}