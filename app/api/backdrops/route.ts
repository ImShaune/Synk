import { NextResponse } from 'next/server'

const TMDB_BASE = 'https://api.themoviedb.org/3'
const TMDB_IMG = 'https://image.tmdb.org/t/p/w1280'

async function tmdbFetch(path: string) {
    const url = new URL(`${TMDB_BASE}${path}`)
    url.searchParams.set('language', 'es-AR')

    const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${process.env.TMDB_API_READ_TOKEN}` },
        next: { revalidate: 3600 },
    })

    if (!res.ok) throw new Error(`TMDB ${path} → ${res.status}`)
    return res.json()
}

export async function GET() {
    try {
        const [movies, series] = await Promise.all([
            tmdbFetch('/movie/popular'),
            tmdbFetch('/tv/popular'),
        ])

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const movieBackdrops = (movies.results as any[])
            .filter((m) => m.backdrop_path)
            .slice(0, 8)
            .map((m) => ({
                url: TMDB_IMG + m.backdrop_path,
                title: m.title,
                type: 'movie',
            }))

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const seriesBackdrops = (series.results as any[])
            .filter((s) => s.backdrop_path)
            .slice(0, 8)
            .map((s) => ({
                url: TMDB_IMG + s.backdrop_path,
                title: s.name,
                type: 'series',
            }))

        const all = [...movieBackdrops, ...seriesBackdrops]
            .sort(() => Math.random() - 0.5)
            .slice(0, 12)

        return NextResponse.json({ backdrops: all })
    } catch (err) {
        console.error('[api/backdrops]', err)
        return NextResponse.json({ backdrops: [] })
    }
}