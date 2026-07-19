export const MOVIE_GENRES = [
    'Acción',
    'Aventura',
    'Animación',
    'Comedia',
    'Crimen',
    'Documental',
    'Drama',
    'Fantasía',
    'Historia',
    'Terror',
    'Misterio',
    'Musical',
    'Romance',
    'Ciencia Ficción',
    'Suspenso',
    'Western',
    'Biográfico',
] as const

export const SERIES_GENRES = [
    'Acción',
    'Aventura',
    'Animación',
    'Anime',
    'Comedia',
    'Crimen',
    'Documental',
    'Drama',
    'Fantasía',
    'Historia',
    'Terror',
    'Misterio',
    'Reality',
    'Romance',
    'Ciencia Ficción',
    'Suspenso',
    'Familiar',
] as const

export const GAME_GENRES = [
    'Acción',
    'Aventura',
    'RPG',
    'FPS',
    'Estrategia',
    'Simulación',
    'Puzzle',
    'Plataformas',
    'Terror',
    'Deportes',
    'Carreras',
    'Lucha',
    'Indie',
    'Mundo Abierto',
    'Roguelike',
    'Multijugador',
] as const

export type MovieGenre = (typeof MOVIE_GENRES)[number]
export type SeriesGenre = (typeof SERIES_GENRES)[number]
export type GameGenre = (typeof GAME_GENRES)[number]
export type AnyGenre = MovieGenre | SeriesGenre | GameGenre

export function getGenresForCategory(
    category: 'movie' | 'series' | 'game'
): readonly string[] {
    switch (category) {
        case 'movie': return MOVIE_GENRES
        case 'series': return SERIES_GENRES
        case 'game': return GAME_GENRES
    }
}

// Mapeo nombre → ID para TMDB (películas)
export const TMDB_MOVIE_GENRE_MAP: Record<string, number> = {
    'Acción': 28,
    'Aventura': 12,
    'Animación': 16,
    'Comedia': 35,
    'Crimen': 80,
    'Documental': 99,
    'Drama': 18,
    'Fantasía': 14,
    'Historia': 36,
    'Terror': 27,
    'Misterio': 9648,
    'Musical': 10402,
    'Romance': 10749,
    'Ciencia Ficción': 878,
    'Suspenso': 53,
    'Western': 37,
    'Biográfico': 10751,
}

// Mapeo nombre → ID para TMDB (series)
export const TMDB_TV_GENRE_MAP: Record<string, number> = {
    'Acción': 10759,
    'Aventura': 10759,
    'Animación': 16,
    'Anime': 16,
    'Comedia': 35,
    'Crimen': 80,
    'Documental': 99,
    'Drama': 18,
    'Fantasía': 10765,
    'Historia': 36,
    'Terror': 9648,
    'Misterio': 9648,
    'Reality': 10764,
    'Romance': 10749,
    'Ciencia Ficción': 10765,
    'Suspenso': 9648,
    'Familiar': 10751,
}