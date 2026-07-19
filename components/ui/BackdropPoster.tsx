'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface BackdropPosterProps {
    src: string
    alt?: string
    opacity?: number
}

export function BackdropPoster({
    src,
    alt = '',
    opacity = 0.25,
}: BackdropPosterProps) {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={src}
                className="absolute inset-0 z-0 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
            >
                {/* Imagen de fondo */}
                <div
                    className="absolute inset-0 scale-110 bg-poster-animate"
                    style={{ opacity }}
                >
                    <Image
                        src={src}
                        alt={alt}
                        fill
                        className="object-cover"
                        style={{ filter: 'blur(32px)' }}
                        priority
                    />
                </div>

                {/* Gradiente superior */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90" />

                {/* Viñeta lateral */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
            </motion.div>
        </AnimatePresence>
    )
}