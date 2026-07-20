'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'

interface UsernameModalProps {
    onSave: (username: string) => Promise<{ error: string | null }>
}

export function UsernameModal({ onSave }: UsernameModalProps) {
    const [username, setUsername] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    function validate(value: string): string | null {
        if (value.length < 3) return 'Minimo 3 caracteres'
        if (value.length > 20) return 'Maximo 20 caracteres'
        if (!/^[a-zA-Z0-9_]+$/.test(value))
            return 'Solo letras, numeros y guion bajo'
        return null
    }

    async function handleSubmit() {
        const validationError = validate(username)
        if (validationError) {
            setError(validationError)
            return
        }

        setLoading(true)
        setError(null)

        const { error: saveError } = await onSave(username)
        if (saveError) {
            setError(saveError)
            setLoading(false)
        }
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter') handleSubmit()
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center px-6"
                style={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)' }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 24 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 24 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                    className="w-full max-w-sm"
                >
                    <div className="glass-strong rounded-3xl p-8 border border-white/15">

                        {/* Icono */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.15, type: 'spring', stiffness: 400 }}
                            className="w-16 h-16 rounded-2xl glass flex items-center justify-center mx-auto mb-6"
                        >
                            <Sparkles className="w-8 h-8 text-white/70" />
                        </motion.div>

                        {/* Texto */}
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-white mb-2">
                                Bienvenido a MatchFlix
                            </h2>
                            <p className="text-white/50 text-sm leading-relaxed">
                                Como queremos llamarte?
                            </p>
                        </div>

                        {/* Input */}
                        <div className="mb-4">
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value)
                                    setError(null)
                                }}
                                onKeyDown={handleKeyDown}
                                placeholder="tu_username"
                                maxLength={20}
                                autoFocus
                                className="w-full py-3.5 px-4 rounded-2xl glass border border-white/15 text-white text-center text-lg font-medium placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors duration-200"
                            />

                            <AnimatePresence>
                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        className="text-red-400 text-xs text-center mt-2"
                                    >
                                        {error}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Hint */}
                        <p className="text-white/25 text-xs text-center mb-6">
                            Solo letras, numeros y guion bajo. Min 3, max 20.
                        </p>

                        {/* Boton */}
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSubmit}
                            disabled={loading || username.length < 3}
                            className="w-full py-3.5 rounded-2xl bg-white text-black font-semibold hover:bg-white/90 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Guardando...' : 'Continuar'}
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}