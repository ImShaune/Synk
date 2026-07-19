import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function generateRoomCode(): string {
    const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    return Array.from({ length: 6 }, () =>
        CHARS[Math.floor(Math.random() * CHARS.length)]
    ).join('')
}

export function formatRuntime(minutes: number | undefined): string {
    if (!minutes) return 'N/D'
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return h ? `${h}h ${m}min` : `${m}min`
}

export function normalizeScore(value: number, max: number): number {
    return Math.min(value / max, 1)
}

export function getRoomUrl(code: string): string {
    const base =
        process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
    return `${base}/room/${code}`
}