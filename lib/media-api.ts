import { formatRuntime } from './utils'
import { TMDB_MOVIE_GENRE_MAP, TMDB_TV_GENRE_MAP } from './genres'
import type { MediaItem, UserPreferences } from '@/types'

const TMDB_BASE = 'https://api.themoviedb.org/3'
const TMDB_IMG = 'https://image.tmdb.org/t/p'
const RAWG_BASE = 'https://api.rawg.io/api'

async function tmdbFetch(path: string, params: Record<string, string> = {}) {
    const url = new URL(`${TMDB_BASE}${path}`)
    url.searchParams.set('language', 'es-AR')
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))

    const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${process.env.TMDB_API_READ_TOKEN}` },
        cache: 'no-store',
    })

    if (!res.ok) throw new Error(`TMDB ${path} → ${res.status}`)
    return res.json()
}

async function rawgFetch(path: string, params: Record<string, string> = {}) {
    const url = new URL(`${RAWG_BASE}${path}`)
    url.searchParams.set('key', process.env.RAWG_API_KEY!)
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))

    const res = await fetch(url.toString(), { cache: 'no-store' })
    if (!res.ok) throw new Error(`RAWG ${path} → ${res.status}`)
    return res.json()
}

function tmdbImg(path: string | null, size = 'w500') {
    return path ? `${TMDB_IMG}/${size}${path}` : '/placeholder-poster.webp'
}

function shuffle<T>(arr: T[]): T[] {
    return [...arr].sort(() => Math.random() - 0.5)
}

// ── Películas ─────────────────────────────────────────────────────────────────

export async function searchMovies(
    prefs: UserPreferences,
    count = 10
): Promise<MediaItem[]> {
    const [from, to] = prefs.yearRange
    const genreIds = prefs.genres.map((g) => TMDB_MOVIE_GENRE_MAP[g]).filter(Boolean)

    const pages = count > 20 ? [
        Math.floor(Math.random() * 8) + 1,
        Math.floor(Math.random() * 8) + 9,
    ] : [Math.floor(Math.random() * 8) + 1]

    const params = {
        sort_by: 'popularity.desc',
        'vote_count.gte': '100',
        'primary_release_date.gte': `${from}-01-01`,
        'primary_release_date.lte': `${to}-12-31`,
        ...(genreIds.length ? { with_genres: genreIds.join(',') } : {}),
    }

    const responses = await Promise.all(
        pages.map((page) => tmdbFetch('/discover/movie', { ...params, page: String(page) }))
    )

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allResults = responses.flatMap((data) => data.results as any[])
    const unique = Array.from(new Map(allResults.map((m) => [m.id, m])).values())

    return shuffle(unique).slice(0, count).map((m) => ({
        id: `movie-${m.id}`,
        externalId: m.id,
        category: 'movie' as const,
        title: m.title,
        year: parseInt(m.release_date?.split('-')[0] ?? '0'),
        rating: parseFloat((m.vote_average ?? 0).toFixed(1)),
        genres: [],
        platforms: [],
        posterUrl: tmdbImg(m.poster_path),
        backdropUrl: tmdbImg(m.backdrop_path, 'w1280'),
        synopsis: m.overview ?? '',
        popularity: m.popularity ?? 0,
    }))
}

export async function searchSeries(
    prefs: UserPreferences,
    count = 10
): Promise<MediaItem[]> {
    const [from, to] = prefs.yearRange
    const genreIds = prefs.genres.map((g) => TMDB_TV_GENRE_MAP[g]).filter(Boolean)

    const pages = count > 20 ? [
        Math.floor(Math.random() * 8) + 1,
        Math.floor(Math.random() * 8) + 9,
    ] : [Math.floor(Math.random() * 8) + 1]

    const params = {
        sort_by: 'popularity.desc',
        'vote_count.gte': '50',
        'first_air_date.gte': `${from}-01-01`,
        'first_air_date.lte': `${to}-12-31`,
        ...(genreIds.length ? { with_genres: genreIds.join(',') } : {}),
    }

    const responses = await Promise.all(
        pages.map((page) => tmdbFetch('/discover/tv', { ...params, page: String(page) }))
    )

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allResults = responses.flatMap((data) => data.results as any[])
    const unique = Array.from(new Map(allResults.map((s) => [s.id, s])).values())

    return shuffle(unique).slice(0, count).map((s) => ({
        id: `series-${s.id}`,
        externalId: s.id,
        category: 'series' as const,
        title: s.name,
        year: parseInt(s.first_air_date?.split('-')[0] ?? '0'),
        rating: parseFloat((s.vote_average ?? 0).toFixed(1)),
        genres: [],
        platforms: [],
        posterUrl: tmdbImg(s.poster_path),
        backdropUrl: tmdbImg(s.backdrop_path, 'w1280'),
        synopsis: s.overview ?? '',
        popularity: s.popularity ?? 0,
    }))
}

// ── Juegos ────────────────────────────────────────────────────────────────────

export async function searchGames(
    prefs: UserPreferences,
    count = 10
): Promise<MediaItem[]> {
    const [from, to] = prefs.yearRange
    const page = Math.floor(Math.random() * 5) + 1

    const data = await rawgFetch('/games', {
        ordering: '-rating',
        page_size: '20',
        dates: `${from}-01-01,${to}-12-31`,
        page: String(page),
        ...(prefs.genres.length ? { genres: prefs.genres.join(',').toLowerCase() } : {}),
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return shuffle(data.results as any[]).slice(0, count).map((g) => ({
        id: `game-${g.id}`,
        externalId: g.id,
        category: 'game' as const,
        title: g.name,
        year: parseInt(g.released?.split('-')[0] ?? '0'),
        rating: parseFloat((g.rating ?? 0).toFixed(1)),
        genres: (g.genres ?? []).map((x: { name: string }) => x.name),
        platforms: (g.platforms ?? []).map((x: { platform: { name: string } }) => x.platform.name),
        posterUrl: g.background_image ?? '/placeholder-poster.webp',
        backdropUrl: g.background_image ?? '/placeholder-poster.webp',
        synopsis: '',
        popularity: g.ratings_count ?? 0,
    }))
}

// ── Buscar candidato para el match (titulo nuevo, diferente a las cards) ──────

export async function searchMatchCandidate(
    prefs: UserPreferences,
    excludeIds: number[]
): Promise<MediaItem | null> {
    try {
        // Usar una página diferente a las que usamos en el swipe
        const page = Math.floor(Math.random() * 5) + 9

        if (prefs.category === 'movie') {
            const [from, to] = prefs.yearRange
            const genreIds = prefs.genres.map((g) => TMDB_MOVIE_GENRE_MAP[g]).filter(Boolean)

            const data = await tmdbFetch('/discover/movie', {
                sort_by: 'vote_average.desc',
                'vote_count.gte': '200',
                'primary_release_date.gte': `${from}-01-01`,
                'primary_release_date.lte': `${to}-12-31`,
                ...(genreIds.length ? { with_genres: genreIds.join(',') } : {}),
                page: String(page),
            })

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const filtered = (data.results as any[]).filter(
                (m) => !excludeIds.includes(m.id)
            )

            if (!filtered.length) return null
            const m = shuffle(filtered)[0]

            return {
                id: `movie-${m.id}`,
                externalId: m.id,
                category: 'movie',
                title: m.title,
                year: parseInt(m.release_date?.split('-')[0] ?? '0'),
                rating: parseFloat((m.vote_average ?? 0).toFixed(1)),
                genres: [],
                platforms: [],
                posterUrl: tmdbImg(m.poster_path),
                backdropUrl: tmdbImg(m.backdrop_path, 'w1280'),
                synopsis: m.overview ?? '',
                popularity: m.popularity ?? 0,
            }
        }

        if (prefs.category === 'series') {
            const [from, to] = prefs.yearRange
            const genreIds = prefs.genres.map((g) => TMDB_TV_GENRE_MAP[g]).filter(Boolean)

            const data = await tmdbFetch('/discover/tv', {
                sort_by: 'vote_average.desc',
                'vote_count.gte': '100',
                'first_air_date.gte': `${from}-01-01`,
                'first_air_date.lte': `${to}-12-31`,
                ...(genreIds.length ? { with_genres: genreIds.join(',') } : {}),
                page: String(page),
            })

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const filtered = (data.results as any[]).filter(
                (s) => !excludeIds.includes(s.id)
            )

            if (!filtered.length) return null
            const s = shuffle(filtered)[0]

            return {
                id: `series-${s.id}`,
                externalId: s.id,
                category: 'series',
                title: s.name,
                year: parseInt(s.first_air_date?.split('-')[0] ?? '0'),
                rating: parseFloat((s.vote_average ?? 0).toFixed(1)),
                genres: [],
                platforms: [],
                posterUrl: tmdbImg(s.poster_path),
                backdropUrl: tmdbImg(s.backdrop_path, 'w1280'),
                synopsis: s.overview ?? '',
                popularity: s.popularity ?? 0,
            }
        }

        if (prefs.category === 'game') {
            const [from, to] = prefs.yearRange

            const data = await rawgFetch('/games', {
                ordering: '-rating',
                page_size: '20',
                dates: `${from}-01-01,${to}-12-31`,
                page: String(page),
                ...(prefs.genres.length ? { genres: prefs.genres.join(',').toLowerCase() } : {}),
            })

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const filtered = (data.results as any[]).filter(
                (g) => !excludeIds.includes(g.id)
            )

            if (!filtered.length) return null
            const g = shuffle(filtered)[0]

            return {
                id: `game-${g.id}`,
                externalId: g.id,
                category: 'game',
                title: g.name,
                year: parseInt(g.released?.split('-')[0] ?? '0'),
                rating: parseFloat((g.rating ?? 0).toFixed(1)),
                genres: (g.genres ?? []).map((x: { name: string }) => x.name),
                platforms: (g.platforms ?? []).map((x: { platform: { name: string } }) => x.platform.name),
                posterUrl: g.background_image ?? '/placeholder-poster.webp',
                backdropUrl: g.background_image ?? '/placeholder-poster.webp',
                synopsis: '',
                popularity: g.ratings_count ?? 0,
            }
        }

        return null
    } catch {
        return null
    }
}

// ── Detalle de película ────────────────────────────────────────────────────────

export async function getMovieDetail(tmdbId: number): Promise<Partial<MediaItem>> {
    const [detail, credits, videos, providers] = await Promise.all([
        tmdbFetch(`/movie/${tmdbId}`),
        tmdbFetch(`/movie/${tmdbId}/credits`),
        tmdbFetch(`/movie/${tmdbId}/videos`),
        tmdbFetch(`/movie/${tmdbId}/watch/providers`),
    ])

    const director = (credits.crew as { job: string; name: string }[])
        .find((c) => c.job === 'Director')?.name

    const trailerKey = (videos.results as { type: string; site: string; key: string }[])
        .find((v) => v.type === 'Trailer' && v.site === 'YouTube')?.key

    const arPlatforms: string[] =
        (providers.results?.AR?.flatrate as { provider_name: string }[] | undefined)
            ?.map((p) => p.provider_name) ?? []

    return {
        duration: formatRuntime(detail.runtime),
        genres: (detail.genres as { name: string }[]).map((g) => g.name),
        platforms: arPlatforms,
        director,
        studio: (detail.production_companies as { name: string }[])[0]?.name,
        trailerKey,
    }
}

// ── Detalle de serie ───────────────────────────────────────────────────────────

export async function getSeriesDetail(tmdbId: number): Promise<Partial<MediaItem>> {
    const [detail, videos, providers] = await Promise.all([
        tmdbFetch(`/tv/${tmdbId}`),
        tmdbFetch(`/tv/${tmdbId}/videos`),
        tmdbFetch(`/tv/${tmdbId}/watch/providers`),
    ])

    const trailerKey = (videos.results as { type: string; site: string; key: string }[])
        .find((v) => v.type === 'Trailer' && v.site === 'YouTube')?.key

    const arPlatforms: string[] =
        (providers.results?.AR?.flatrate as { provider_name: string }[] | undefined)
            ?.map((p) => p.provider_name) ?? []

    const episodeRuntime = detail.episode_run_time?.[0]
    const seasons = detail.number_of_seasons
    const episodes = detail.number_of_episodes
    const episodesStr = seasons && episodes
        ? `${seasons} temp. · ${Math.round(episodes / seasons)} ep/temp`
        : undefined

    return {
        duration: episodeRuntime ? `${episodeRuntime}min/ep` : undefined,
        episodes: episodesStr,
        seasons,
        genres: (detail.genres as { name: string }[]).map((g) => g.name),
        platforms: arPlatforms,
        studio: (detail.networks as { name: string }[])[0]?.name,
        trailerKey,
    }
}

// ── Detalle de juego ───────────────────────────────────────────────────────────

export async function getGameDetail(rawgId: number): Promise<Partial<MediaItem>> {
    const data = await rawgFetch(`/games/${rawgId}`)

    return {
        genres: (data.genres ?? []).map((g: { name: string }) => g.name),
        platforms: (data.platforms ?? []).map((p: { platform: { name: string } }) => p.platform.name),
        developer: (data.developers ?? [])[0]?.name,
        studio: (data.publishers ?? [])[0]?.name,
    }
}