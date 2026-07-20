'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { motion } from 'framer-motion'

export function ThemeToggle() {
    const { theme, toggle, buttonRef } = useTheme()

    return (
        <motion.button
            ref={buttonRef}
            onClick={toggle}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            className="w-10 h-10 rounded-xl glass border border-white/15 flex items-center justify-center text-white/60 hover:text-white transition-colors duration-200"
            aria-label="Cambiar tema"
        >
            <motion.div
                key={theme}
                initial={{ rotate: -30, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 30, opacity: 0 }}
                transition={{ duration: 0.2 }}
            >
                {theme === 'dark'
                    ? <Sun className="w-4 h-4" />
                    : <Moon className="w-4 h-4" />
                }
            </motion.div>
        </motion.button>
    )
}