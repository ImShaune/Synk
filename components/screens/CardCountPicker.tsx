'use client'

import { motion, type Variants } from 'framer-motion'
import { ArrowLeft, ArrowRight, Zap, Target } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CardCountPickerProps {
    value: number
    onChange: (count: number) => void
    onNext: () => void
    onBack: () => void
}

const OPTIONS = [
    {
        count: 10,
        label: '10 cards',
        description: 'Rapido y directo',
        icon: Zap,
        accuracy: 'Precision basica',
        color: 'text-blue-400',
        bg: 'bg-blue-500/10 border-blue-500/20 hover:border-blue-500/40',
        selected: 'bg-blue-500/20 border-blue-500/50',
    },
    {
        count: 15,
        label: '15 cards',
        description: 'Buen balance',
        icon: Zap,
        accuracy: 'Buena precision',
        color: 'text-teal-400',
        bg: 'bg-teal-500/10 border-teal-500/20 hover:border-teal-500/40',
        selected: 'bg-teal-500/20 border-teal-500/50',
    },
    {
        count: 20,
        label: '20 cards',
        description: 'Recomendado',
        icon: Target,
        accuracy: 'Alta precision',
        color: 'text-purple-400',
        bg: 'bg-purple-500/10 border-purple-500/20 hover:border-purple-500/40',
        selected: 'bg-purple-500/20 border-purple-500/50',
    },
    {
        count: 25,
        label: '25 cards',
        description: 'Para exigentes',
        icon: Target,
        accuracy: 'Muy alta precision',
        color: 'text-pink-400',
        bg: 'bg-pink-500/10 border-pink-500/20 hover:border-pink-500/40',
        selected: 'bg-pink-500/20 border-pink-500/50',
    },
    {
        count: 30,
        label: '30 cards',
        description: 'Maximo detalle',
        icon: Target,
        accuracy: 'Precision maxima',
        color: 'text-orange-400',
        bg: 'bg-orange-500/10 border-orange-500/20 hover:border-orange-500/40',
        selected: 'bg-orange-500/20 border-orange-500/50',
    },
]

const container: Variants = {
    hidden: {},
    show: {
        transition: { staggerChildren: 0.07 },
    },
}

const item: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.35, ease: 'easeOut' },
    },
}

export function CardCountPicker({
    value,
    onChange,
    onNext,
    onBack,
}: CardCountPickerProps) {
    return (
        <div className="flex flex-col items-center w-full max-w-lg mx-auto px-6">

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="text-center mb-8"
            >
                <p className="text-white/40 text-sm uppercase tracking-widest mb-3">
                    Casi listo
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                    Cuantas opciones queres ver?
                </h2>
                <p className="text-white/50 text-base leading-relaxed">
                    Mientras mas cards swipees, mas preciso va a ser el match
                </p>
            </motion.div>

            {/* Opciones */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="w-full flex flex-col gap-3 mb-8"
            >
                {OPTIONS.map((opt) => {
                    const Icon = opt.icon
                    const isSelected = value === opt.count

                    return (
                        <motion.button
                            key={opt.count}
                            variants={item}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onChange(opt.count)}
                            className={cn(
                                'flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 text-left',
                                isSelected ? opt.selected : opt.bg,
                            )}
                        >
                            {/* Icono */}
                            <div className={cn(
                                'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 glass',
                            )}>
                                <Icon className={cn('w-5 h-5', opt.color)} />
                            </div>

                            {/* Texto */}
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <p className="text-white font-semibold">{opt.label}</p>
                                    {opt.count === 20 && (
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-300 border border-purple-500/30">
                                            Recomendado
                                        </span>
                                    )}
                                </div>
                                <p className="text-white/40 text-sm">{opt.description}</p>
                            </div>

                            {/* Precision */}
                            <div className="text-right shrink-0">
                                <p className={cn('text-xs font-medium', opt.color)}>
                                    {opt.accuracy}
                                </p>
                            </div>

                            {/* Check */}
                            {isSelected && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0"
                                >
                                    <div className="w-2 h-2 rounded-full bg-black" />
                                </motion.div>
                            )}
                        </motion.button>
                    )
                })}
            </motion.div>

            {/* Navegacion */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
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
                    Empezar
                    <ArrowRight className="w-4 h-4" />
                </button>
            </motion.div>
        </div>
    )
}