'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Star, Trash2, Heart } from 'lucide-react'
import type { MediaItem } from '@/types'

interface SavedItem {
    id: string
    media: MediaItem
    savedAt: string
}

export default function SavedPage() {
    const [items, setItems] = useState<SavedItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        try {
            const raw = localStorage.getItem('matchflix-saved')
            if (raw) setItems(JSON.parse(raw))
        } catch {
            setItems([])
        } finally {
            setLoading(false)
        }
    }, [])

    function handleDelete(id: string) {
        const updated = items.filter((i) => i.id !== id)
        setItems(updated)
        localStorage.setItem('matchflix-saved', JSON.stringify(updated))
    }

    return (
        <main className="relative min-h-screen overflow-hidden">

            {/* Fondo */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-black to-black" />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-600/8 blur-3xl pointer-events-none" />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto px-6 py-12">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm transition-colors duration-200 mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver al inicio
                    </Link>

                    <div className="flex items-center gap-3">
                        <Heart className="w-6 h-6 text-pink-400" />
                        <h1 className="text-3xl font-bold text-white">Mis favoritos</h1>
                        {items.length > 0 && (
                            <span className="text-white/30 text-sm">
                                {items.length} titulo{items.length > 1 ? 's' : ''}
                            </span>
                        )}
                    </div>
                </motion.div>

                {/* Loading */}
                {loading && (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                    </div>
                )}

                {/* Empty */}
                {!loading && items.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20"
                    >
                        <p className="text-5xl mb-6">🎬</p>
                        <h2 className="text-xl font-semibold text-white mb-3">
                            Todavia no tenes favoritos
                        </h2>
                        <p className="text-white/40 text-base mb-8">
                            Cuando encuentres un match, podas guardarlo aca.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-black font-semibold hover:bg-white/90 transition-all duration-200"
                        >
                            Buscar un match
                        </Link>
                    </motion.div>
                )}

                {/* Lista */}
                <AnimatePresence>
                    {items.map((item, i) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -40, transition: { duration: 0.25 } }}
                            transition={{ delay: i * 0.08, duration: 0.4 }}
                            className="flex gap-4 p-4 rounded-2xl glass border border-white/8 mb-4 group"
                        >
                            {/* Poster */}
                            <div className="relative w-16 h-24 rounded-xl overflow-hidden shrink-0">
                                <Image
                                    src={item.media.posterUrl}
                                    alt={item.media.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h3 className="text-white font-semibold text-base leading-tight mb-1 truncate">
                                    {item.media.title}
                                </h3>
                                <div className="flex items-center gap-2 text-white/40 text-xs mb-2">
                                    <span>{item.media.year}</span>
                                    <span>·</span>
                                    <span className="flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                        {item.media.rating.toFixed(1)}
                                    </span>
                                    <span>·</span>
                                    <span className="capitalize">{item.media.category === 'movie' ? 'Pelicula' : item.media.category === 'series' ? 'Serie' : 'Juego'}</span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {item.media.genres.slice(0, 3).map((g) => (
                                        <span
                                            key={g}
                                            className="text-xs px-2 py-0.5 rounded-full bg-white/8 text-white/50"
                                        >
                                            {g}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Delete */}
                            <button
                                onClick={() => handleDelete(item.id)}
                                className="opacity-0 group-hover:opacity-100 p-2 rounded-xl hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-all duration-200 self-start"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </main>
    )
}