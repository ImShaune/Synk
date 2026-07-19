import { NextRequest, NextResponse } from 'next/server'
import { getMovieDetail, getSeriesDetail } from '@/lib/media-api'
import type { MediaCategory } from '@/types'

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl
        const externalId = searchParams.get('externalId')
        const category = searchParams.get('category') as MediaCategory | null

        if (!externalId || !category) {
            return NextResponse.json(
                { error: 'externalId y category son requeridos' },
                { status: 400 }
            )
        }

        let trailerKey: string | undefined

        if (category === 'movie') {
            const detail = await getMovieDetail(parseInt(externalId))
            trailerKey = detail.trailerKey
        }

        if (category === 'series') {
            const detail = await getSeriesDetail(parseInt(externalId))
            trailerKey = detail.trailerKey
        }

        if (category === 'game') {
            // RAWG no provee tráilers — buscamos en YouTube directamente
            const query = searchParams.get('title') ?? ''
            trailerKey = await searchYouTubeTrailer(query)
        }

        if (!trailerKey) {
            return NextResponse.json(
                { error: 'Tráiler no disponible' },
                { status: 404 }
            )
        }

        return NextResponse.json({ trailerKey })
    } catch (err) {
        console.error('[api/trailer]', err)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}

async function searchYouTubeTrailer(title: string): Promise<string | undefined> {
    const apiKey = process.env.YOUTUBE_API_KEY
    if (!apiKey) return undefined

    const url = new URL('https://www.googleapis.com/youtube/v3/search')
    url.searchParams.set('key', apiKey)
    url.searchParams.set('q', `${title} trailer oficial`)
    url.searchParams.set('part', 'snippet')
    url.searchParams.set('type', 'video')
    url.searchParams.set('maxResults', '1')
    url.searchParams.set('relevanceLanguage', 'es')

    const res = await fetch(url.toString(), { next: { revalidate: 86400 } })
    if (!res.ok) return undefined

    const data = await res.json()
    return data.items?.[0]?.id?.videoId
}