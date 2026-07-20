'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Users, Plus, LogIn, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

type View = 'menu' | 'create' | 'join'

export default function NewRoomPage() {
    const router = useRouter()
    const [view, setView] = useState<View>('menu')
    const [code, setCode] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const userId = 'user-' + Math.random().toString(36).slice(2, 9)

    async function handleCreate() {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch('/api/rooms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'create', userId }),
            })
            const data = await res.json()
            if (data.room) {
                router.push('/room/' + data.room.code + '?participant=user1&userId=' + userId)
            }
        } catch {
            setError('No se pudo crear la sala. Intentá de nuevo.')
        } finally {
            setLoading(false)
        }
    }

    async function handleJoin() {
        if (code.length < 6) {
            setError('El codigo debe tener 6 caracteres')
            return
        }
        setLoading(true)
        setError(null)
        try {
            const res = await fetch('/api/rooms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'join', code: code.toUpperCase(), userId }),
            })
            const data = await res.json()
            if (data.room) {
                router.push('/room/' + data.room.code + '?participant=user2&userId=' + userId)
            } else {
                setError(data.error ?? 'Sala no encontrada')
            }
        } catch {
            setError('No se pudo unir a la sala. Intentá de nuevo.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6">

            {/* Fondo */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
                <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-purple-600/10 blur-3xl" />
                <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl" />
            </div>

            <div className="relative z-10 w-full max-w-md">

                {/* Back */}
                <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                >
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm transition-colors duration-200"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver al inicio
                    </Link>
                </motion.div>

                <AnimatePresence mode="wait">

                    {/* Menu principal */}
                    {view === 'menu' && (
                        <motion.div
                            key="menu"
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -24 }}
                            transition={{ duration: 0.35, ease: 'easeInOut' }}
                        >
                            <div className="text-center mb-10">
                                <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mx-auto mb-6">
                                    <Users className="w-8 h-8 text-white/70" />
                                </div>
                                <h1 className="text-3xl font-bold text-white mb-3">
                                    Modo Cooperativo
                                </h1>
                                <p className="text-white/50 text-base">
                                    Encontra algo para ver o jugar juntos
                                </p>
                            </div>

                            <div className="flex flex-col gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setView('create')}
                                    className="flex items-center gap-4 p-5 rounded-2xl glass border border-white/10 hover:bg-white/8 hover:border-white/20 transition-all duration-200 text-left"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0">
                                        <Plus className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold mb-0.5">Crear sala</p>
                                        <p className="text-white/40 text-sm">
                                            Genera un codigo y compartilo con tu compañero
                                        </p>
                                    </div>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setView('join')}
                                    className="flex items-center gap-4 p-5 rounded-2xl glass border border-white/10 hover:bg-white/8 hover:border-white/20 transition-all duration-200 text-left"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                                        <LogIn className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold mb-0.5">Unirse a una sala</p>
                                        <p className="text-white/40 text-sm">
                                            Ingresa el codigo que te compartieron
                                        </p>
                                    </div>
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {/* Crear sala */}
                    {view === 'create' && (
                        <motion.div
                            key="create"
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -24 }}
                            transition={{ duration: 0.35, ease: 'easeInOut' }}
                        >
                            <div className="text-center mb-10">
                                <h1 className="text-3xl font-bold text-white mb-3">
                                    Crear sala
                                </h1>
                                <p className="text-white/50 text-base">
                                    Se va a generar un codigo unico para compartir
                                </p>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                                    {error}
                                </div>
                            )}

                            <div className="flex flex-col gap-4">
                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleCreate}
                                    disabled={loading}
                                    className="w-full py-4 rounded-2xl bg-white text-black font-semibold hover:bg-white/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Creando sala...' : 'Crear sala ahora'}
                                </motion.button>

                                <button
                                    onClick={() => { setView('menu'); setError(null) }}
                                    className="text-white/40 hover:text-white/70 text-sm transition-colors duration-200"
                                >
                                    Volver
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Unirse */}
                    {view === 'join' && (
                        <motion.div
                            key="join"
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -24 }}
                            transition={{ duration: 0.35, ease: 'easeInOut' }}
                        >
                            <div className="text-center mb-10">
                                <h1 className="text-3xl font-bold text-white mb-3">
                                    Unirse a una sala
                                </h1>
                                <p className="text-white/50 text-base">
                                    Ingresa el codigo de 6 caracteres
                                </p>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                                    {error}
                                </div>
                            )}

                            <div className="flex flex-col gap-4">
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 6))}
                                    placeholder="A7K9QF"
                                    maxLength={6}
                                    className="w-full py-4 px-6 rounded-2xl glass border border-white/15 text-white text-center text-2xl font-mono tracking-widest placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors duration-200"
                                />

                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleJoin}
                                    disabled={loading || code.length < 6}
                                    className="w-full py-4 rounded-2xl bg-white text-black font-semibold hover:bg-white/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Uniendose...' : 'Unirse'}
                                </motion.button>

                                <button
                                    onClick={() => { setView('menu'); setCode(''); setError(null) }}
                                    className="text-white/40 hover:text-white/70 text-sm transition-colors duration-200"
                                >
                                    Volver
                                </button>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </main>
    )
}