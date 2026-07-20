'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'

interface Profile {
  id: string
  username: string
}

interface UseAuthReturn {
  profile: Profile | null
  loading: boolean
  needsUsername: boolean
  saveUsername: (username: string) => Promise<{ error: string | null }>
}

export function useAuth(): UseAuthReturn {
  const supabase = createClient()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [needsUsername, setNeedsUsername] = useState(false)

  useEffect(() => {
    async function init() {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        let userId: string

        if (!session) {
          const { data, error } = await supabase.auth.signInAnonymously()
          if (error || !data.user) {
            setLoading(false)
            return
          }
          userId = data.user.id
        } else {
          userId = session.user.id
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: profileData } = await (supabase as any)
          .from('profiles')
          .select('id, username')
          .eq('id', userId)
          .maybeSingle()

        if (profileData) {
          setProfile(profileData)
          setNeedsUsername(false)
        } else {
          setNeedsUsername(true)
        }
      } catch (err) {
        console.error('[useAuth]', err)
      } finally {
        setLoading(false)
      }
    }

    init()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const saveUsername = useCallback(async (username: string): Promise<{ error: string | null }> => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return { error: 'No hay sesion activa' }

      const userId = session.user.id

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: existing } = await (supabase as any)
        .from('profiles')
        .select('id')
        .eq('username', username.trim())
        .maybeSingle()

      if (existing) return { error: 'Ese username ya esta en uso' }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('profiles')
        .insert({ id: userId, username: username.trim() })
        .select()
        .single()

      if (error) return { error: error.message }

      setProfile(data)
      setNeedsUsername(false)
      return { error: null }
    } catch {
      return { error: 'Error al guardar el username' }
    }
  }, [supabase])

  return { profile, loading, needsUsername, saveUsername }
}