'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { User, Users } from 'lucide-react'
import Link from 'next/link'

const POSTERS = [
  'https://image.tmdb.org/t/p/w1280/tmU7GeKVybMWFButWEGl2M4GeiP.jpg', // The Godfather
  'https://image.tmdb.org/t/p/w1280/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', // Pulp Fiction
  'https://image.tmdb.org/t/p/w1280/sfw3vXVJnkH0VqXOEoKhIcBnPMb.jpg', // Bastardos sin gloria
  'https://image.tmdb.org/t/p/w1280/nXZFM6rAMBNKJRUbFBpjHEBVBMN.jpg', // Avatar
  'https://image.tmdb.org/t/p/w1280/suopoADq0k8YZr4dQXcU6pToj6s.jpg', // Game of Thrones
  'https://image.tmdb.org/t/p/w1280/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',  // Breaking Bad
  'https://image.tmdb.org/t/p/w1280/8kOWDBK6XlPUzckuHDo3wwVRFwt.jpg', // Rick and Morty
  'https://image.tmdb.org/t/p/w1280/mY7SeH4HFFxW1hiI6cWuwCRKptN.jpg', // The Boys
  'https://image.tmdb.org/t/p/w1280/bgBMfBuBHkS5bKKoHYBkDGfIBMq.jpg', // Criminal Minds
]

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

const item: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
}

export default function LandingPage() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % POSTERS.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

      {/* ── Fondo con crossfade ── */}
      <div className="absolute inset-0 z-0">

        <AnimatePresence mode="sync">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <div
              className="absolute inset-0 scale-105"
              style={{
                backgroundImage: `url(${POSTERS[currentIndex]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(8px) saturate(0.6)',
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Gradientes */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />

        {/* Orbes animados */}
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-purple-600/20 blur-3xl pointer-events-none"
          animate={{
            x: [0, 100, -80, 60, 0],
            y: [0, -80, 100, -60, 0],
          }}
          transition={{
            duration: 18,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
          style={{ top: '20%', left: '20%' }}
        />
        <motion.div
          className="absolute w-80 h-80 rounded-full bg-pink-600/15 blur-3xl pointer-events-none"
          animate={{
            x: [0, -120, 80, -40, 0],
            y: [0, 60, -100, 80, 0],
          }}
          transition={{
            duration: 22,
            ease: 'easeInOut',
            repeat: Infinity,
            delay: 3,
          }}
          style={{ bottom: '20%', right: '20%' }}
        />
        <motion.div
          className="absolute w-64 h-64 rounded-full bg-blue-600/10 blur-3xl pointer-events-none"
          animate={{
            x: [0, 80, -60, 100, 0],
            y: [0, 100, 60, -80, 0],
          }}
          transition={{
            duration: 26,
            ease: 'easeInOut',
            repeat: Infinity,
            delay: 6,
          }}
          style={{ top: '50%', left: '50%' }}
        />
      </div>


      {/* ── Contenido ── */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl mx-auto"
      >


        {/* Título */}
        <motion.h1
          variants={item}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 text-gradient"
        >
          ¿No sabés qué<br />ver o jugar hoy?
        </motion.h1>

        {/* Subtítulo */}
        <motion.p
          variants={item}
          className="text-white/50 text-lg sm:text-xl mb-12 max-w-md leading-relaxed"
        >
          Para vos que no sabes qué ver o qué jugar siendo que tenes 500 juegos en steam y garpas +5 plataformas de streaming, elegí 3 opciones, swipeá tarjetas y el algoritmo te va a dar un match con un porcentaje dependiendo tus elecciones. :)
        </motion.p>

        {/* Botones */}
        <motion.div
          variants={item}
          className="flex flex-col sm:flex-row gap-4 w-full max-w-sm"
        >
          <Link
            href="/solo"
            className="group flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-white text-black font-semibold text-base hover:bg-white/90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <User className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            Modo Individual
          </Link>

          <Link
            href="/room/new"
            className="group flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-2xl glass text-white font-semibold text-base hover:bg-white/10 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Users className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            Modo Cooperativo
          </Link>
        </motion.div>


      </motion.div>
    </main>
  )
}