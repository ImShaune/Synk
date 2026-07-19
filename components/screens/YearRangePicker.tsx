'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { YearSlider } from '@/components/ui/YearSlider'

interface YearRangePickerProps {
    value: [number, number]
    onChange: (range: [number, number]) => void
    onNext: () => void
    onBack: () => void
    category: 'movie' | 'series' | 'game'
}

const CURRENT_YEAR = new Date().getFullYear()

const MIN_YEAR_MOVIE = 1980
const MIN_YEAR_SERIES = 1990
const MIN_YEAR_GAME = 2000

export function YearRangePicker({
    value,
    onChange,
    onNext,
    onBack,
    category,
}: YearRangePickerProps) {
    const MIN_YEAR =
        category === 'movie'
            ? MIN_YEAR_MOVIE
            : category === 'series'
                ? MIN_YEAR_SERIES
                : MIN_YEAR_GAME

    return (
        <div className="flex flex-col items-center w-full max-w-lg mx-auto px-6">

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="text-center mb-10"
            >
                <p className="text-white/40 text-sm uppercase tracking-widest mb-3">
                    Paso 3 de 3
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                    De que epoca?
                </h2>
                <p className="text-white/50 text-base">
                    Elegí el rango de años que mas te interesa
                </p>
            </motion.div>

            {/* Slider */}
            <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15, duration: 0.5, ease: 'easeOut' }}
                className="w-full glass rounded-3xl p-8 mb-10"
            >
                <YearSlider
                    min={MIN_YEAR}
                    max={CURRENT_YEAR}
                    value={value}
                    onChange={onChange}
                />
            </motion.div>

            {/* Hint */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-white/25 text-sm mb-10 text-center"
            >
                Podes seleccionar desde {MIN_YEAR} hasta {CURRENT_YEAR}
            </motion.p>

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
                    Buscar!
                    <ArrowRight className="w-4 h-4" />
                </button>
            </motion.div>

        </div>
    )
}