'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Home, Sun, Moon, User, ChevronDown } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/utils'

export function Navbar() {
    const pathname = usePathname()
    const { profile } = useAuth()
    const { theme, toggle, buttonRef } = useTheme()
    const [open, setOpen] = useState(false)

    if (pathname === '/swipe') return null

    return (
        <motion.nav
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
        >
            <div className="max-w-6xl mx-auto flex items-center justify-end gap-3">

                {/* Favoritos */}
                <Link
                    href="/saved"
                    className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all duration-200',
                        pathname === '/saved'
                            ? 'glass text-white border border-white/15'
                            : 'text-white/50 hover:text-white hover:bg-white/8'
                    )}
                >
                    <Heart className="w-4 h-4" />
                    <span className="hidden sm:block">Favoritos</span>
                </Link>

                {/* Usuario */}
                {profile && (
                    <div className="relative">
                        <button
                            onClick={() => setOpen((v) => !v)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl glass border border-white/15 text-white/70 hover:text-white transition-all duration-200 text-sm"
                        >
                            <div className="w-5 h-5 rounded-full bg-purple-500/40 border border-purple-400/40 flex items-center justify-center">
                                <User className="w-3 h-3 text-purple-300" />
                            </div>
                            <span className="hidden sm:block max-w-24 truncate">
                                {profile.username}
                            </span>
                            <ChevronDown className={cn(
                                'w-3.5 h-3.5 transition-transform duration-200',
                                open && 'rotate-180'
                            )} />
                        </button>

                        <AnimatePresence>
                            {open && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 top-full mt-2 w-48 glass-strong rounded-2xl border border-white/15 overflow-hidden p-1"
                                >
                                    {/* Header */}
                                    <div className="px-3 py-2 flex items-center justify-between">
                                        <div>
                                            <p className="text-white/40 text-xs">Conectado como</p>
                                            <p className="text-white text-sm font-medium truncate max-w-28">
                                                {profile.username}
                                            </p>
                                        </div>

                                        {/* Toggle tema — isotipo que cambia */}
                                        <button
                                            ref={buttonRef}
                                            onClick={toggle}
                                            className="relative w-8 h-8 rounded-xl bg-white/8 hover:bg-white/15 flex items-center justify-center transition-all duration-200"
                                        >
                                            <AnimatePresence mode="wait" initial={false}>
                                                {theme === 'dark' ? (
                                                    <motion.span
                                                        key="moon"
                                                        initial={{ opacity: 0, rotate: -45, scale: 0.5 }}
                                                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                                        exit={{ opacity: 0, rotate: 45, scale: 0.5 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="absolute"
                                                    >
                                                        <Moon className="w-4 h-4 text-blue-400" />
                                                    </motion.span>
                                                ) : (
                                                    <motion.span
                                                        key="sun"
                                                        initial={{ opacity: 0, rotate: 45, scale: 0.5 }}
                                                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                                        exit={{ opacity: 0, rotate: -45, scale: 0.5 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="absolute"
                                                    >
                                                        <Sun className="w-4 h-4 text-yellow-400" />
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>
                                        </button>
                                    </div>

                                    {/* Links */}
                                    <Link
                                        href="/"
                                        onClick={() => setOpen(false)}
                                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/8 text-sm transition-all duration-200 w-full"
                                    >
                                        <Home className="w-4 h-4" />
                                        Inicio
                                    </Link>
                                    <Link
                                        href="/saved"
                                        onClick={() => setOpen(false)}
                                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/8 text-sm transition-all duration-200 w-full"
                                    >
                                        <Heart className="w-4 h-4" />
                                        Mis favoritos
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </motion.nav>
    )
}