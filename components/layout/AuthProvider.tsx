'use client'

import { useAuth } from '@/hooks/useAuth'
import { UsernameModal } from '@/components/ui/UsernameModal'

interface AuthProviderProps {
    children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
    const { loading, needsUsername, saveUsername, profile } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            </div>
        )
    }

    return (
        <>
            {children}
            {needsUsername && (
                <UsernameModal onSave={saveUsername} />
            )}
        </>
    )
}