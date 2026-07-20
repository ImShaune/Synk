'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

type Theme = 'dark' | 'light'

export function useTheme() {
    const [theme, setTheme] = useState<Theme>('dark')
    const buttonRef = useRef<HTMLButtonElement | null>(null)

    useEffect(() => {
        const stored = localStorage.getItem('matchflix-theme') as Theme | null
        const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light'
        const initial = stored ?? preferred
        setTheme(initial)
        document.documentElement.setAttribute('data-theme', initial)
    }, [])

    const toggle = useCallback(async () => {
        const next = theme === 'dark' ? 'light' : 'dark'

        // Sin soporte para View Transitions — cambio directo
        if (!document.startViewTransition) {
            setTheme(next)
            document.documentElement.setAttribute('data-theme', next)
            localStorage.setItem('matchflix-theme', next)
            return
        }

        // Con View Transitions — circular reveal desde el botón
        const btn = buttonRef.current
        const x = btn ? btn.getBoundingClientRect().left + btn.offsetWidth / 2 : window.innerWidth / 2
        const y = btn ? btn.getBoundingClientRect().top + btn.offsetHeight / 2 : window.innerHeight / 2

        const maxRadius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        )

        const transition = document.startViewTransition(() => {
            setTheme(next)
            document.documentElement.setAttribute('data-theme', next)
            localStorage.setItem('matchflix-theme', next)
        })

        await transition.ready

        document.documentElement.animate(
            {
                clipPath: [
                    `circle(0px at ${x}px ${y}px)`,
                    `circle(${maxRadius}px at ${x}px ${y}px)`,
                ],
            },
            {
                duration: 500,
                easing: 'ease-in-out',
                pseudoElement: '::view-transition-new(root)',
            }
        )
    }, [theme])

    return { theme, toggle, buttonRef }
}