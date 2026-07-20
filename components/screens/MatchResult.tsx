'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Star, Clock, Heart, RotateCcw, Play, MapPin, Share2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MatchResult as MatchResultType } from '@/types'

interface MatchResultProps {
  result: MatchResultType
  onSave: () => void
  onRetry: () => void
  onReset: () => void
  isSaved?: boolean
}

export function MatchResult({
  result,
  onSave,
  onRetry,
  onReset,
  isSaved = false,
}: MatchResultProps) {
  const { media, compatibilityScore, explanation, isCooperative, bothLiked } = result

  const trailerUrl = media.trailerKey
    ? 'https://youtube.com/watch?v=' + media.trailerKey
    : null

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: 'MatchFlix',
        text: 'Mi match es ' + media.title,
        url: window.location.href,
      })
    }
  }

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto px-4 pb-12">
      {isCooperative && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <p className="text-4xl mb-2">🎉</p>
          <h2 className="text-2xl font-bold text-white">Tenemos un Match!</h2>
          {bothLiked === true && (
            <p className="text-white/50 text-sm mt-1">
              Ambos eligieron este titulo durante el swipe
            </p>
          )}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative w-full rounded-3xl overflow-hidden mb-6 match-glow"
        style={{ height: '380px' }}
      >
        <Image
          src={media.backdropUrl}
          alt={media.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
        <div className="absolute bottom-4 right-4 w-24 h-36 rounded-xl overflow-hidden shadow-2xl border border-white/20">
          <Image src={media.posterUrl} alt="" fill className="object-cover" />
        </div>
        <div className="absolute bottom-4 left-4 right-32">
          <h1 className="text-white text-3xl font-bold leading-tight mb-2">
            {media.title}
          </h1>
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-white/60 text-sm">
            <span>{media.year}</span>
            {media.duration && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {media.duration}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              {media.rating.toFixed(1)}
            </span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-full glass rounded-2xl p-6 mb-4 text-center"
      >
        <motion.p
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
          className="text-5xl font-bold text-white mb-1"
        >
          {compatibilityScore}%
        </motion.p>
        <p className="text-white/50 text-sm">
          Compatible {isCooperative ? 'para los dos' : 'con vos'}
        </p>
      </motion.div>

      {media.genres.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-2 mb-4"
        >
          {media.genres.map((g) => (
            <span
              key={g}
              className="text-xs px-3 py-1 rounded-full bg-white/8 border border-white/10 text-white/60"
            >
              {g}
            </span>
          ))}
        </motion.div>
      )}


      {media.synopsis && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="w-full glass rounded-2xl p-6 mb-4"
        >
          <p className="text-white/40 text-xs uppercase tracking-widest mb-3">
            De que trata?
          </p>
          <p className="text-white/70 text-sm leading-relaxed">{media.synopsis}</p>
        </motion.div>
      )}

      {media.platforms.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="w-full glass rounded-2xl p-6 mb-6"
        >
          <p className="text-white/40 text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5" />
            Donde verlo
          </p>
          <div className="flex flex-wrap gap-2">
            {media.platforms.map((p) => (
              <span
                key={p}
                className="text-sm px-3 py-1.5 rounded-xl bg-white/8 border border-white/10 text-white/70"
              >
                {p}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="w-full grid grid-cols-2 gap-3"
      >
        <button
          onClick={onSave}
          className={cn(
            'flex items-center justify-center gap-2 py-3.5 rounded-2xl border font-medium text-sm transition-all duration-200',
            isSaved
              ? 'bg-pink-500/20 border-pink-500/40 text-pink-400'
              : 'glass border-white/15 text-white hover:bg-white/10'
          )}
        >
          <Heart className={cn('w-4 h-4', isSaved && 'fill-pink-400')} />
          {isSaved ? 'Guardado' : 'Guardar'}
        </button>

        {trailerUrl !== null && (
          <a
            href={trailerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl glass border border-white/15 text-white hover:bg-white/10 font-medium text-sm transition-all duration-200"
          >
            <Play className="w-4 h-4" />
            Ver trailer
          </a>
        )}

        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 py-3.5 rounded-2xl glass border border-white/15 text-white hover:bg-white/10 font-medium text-sm transition-all duration-200"
        >
          <Share2 className="w-4 h-4" />
          Compartir
        </button>

        <button
          onClick={onRetry}
          className="flex items-center justify-center gap-2 py-3.5 rounded-2xl glass border border-white/15 text-white hover:bg-white/10 font-medium text-sm transition-all duration-200"
        >
          <RotateCcw className="w-4 h-4" />
          Otro match
        </button>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        onClick={onReset}
        className="mt-4 text-white/30 text-sm hover:text-white/60 transition-colors duration-200"
      >
        Empezar de nuevo
      </motion.button>
    </div>
  )
}
