export type MediaCategory = 'movie' | 'series' | 'game'

export interface MediaItem {
    id: string
    externalId: number
    category: MediaCategory
    title: string
    year: number
    rating: number
    duration?: string
    episodes?: string
    seasons?: number
    genres: string[]
    platforms: string[]
    posterUrl: string
    backdropUrl: string
    synopsis: string
    director?: string
    developer?: string
    studio?: string
    trailerKey?: string
    popularity: number
}

export interface UserPreferences {
    category: MediaCategory | null
    genres: string[]
    yearRange: [number, number]
    cardCount: number
}

export type SwipeDecision = 'like' | 'dislike'

export interface SwipeVote {
    mediaId: string
    decision: SwipeDecision
}

export interface MatchResult {
    media: MediaItem
    compatibilityScore: number
    explanation: string
    isCooperative: boolean
    bothLiked?: boolean
}

export type RoomStatus = 'waiting' | 'active' | 'finished' | 'abandoned'

export interface Room {
    id: string
    code: string
    status: RoomStatus
    createdAt: string
    user1Id: string
    user2Id: string | null
    sharedMediaIds: string[]
    preferences1: UserPreferences | null
    preferences2: UserPreferences | null
    votes1: SwipeVote[]
    votes2: SwipeVote[]
    matchResultId: string | null
}

export type RoomParticipant = 'user1' | 'user2'

export interface SavedItem {
    id: string
    userId: string
    media: MediaItem
    savedAt: string
}

export type FlowStep =
    | 'category'
    | 'genres'
    | 'yearRange'
    | 'cardCount'
    | 'loading'
    | 'swipe'
    | 'processing'
    | 'result'

export interface FlowState {
    step: FlowStep
    mode: 'solo' | 'coop'
    roomId?: string
    participant?: RoomParticipant
    preferences: UserPreferences
    mediaCards: MediaItem[]
    votes: SwipeVote[]
    matchResult: MatchResult | null
}