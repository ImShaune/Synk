export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json }
    | Json[]

export interface Database {
    public: {
        Tables: {
            rooms: {
                Row: {
                    id: string
                    code: string
                    status: 'waiting' | 'active' | 'finished' | 'abandoned'
                    created_at: string
                    user1_id: string
                    user2_id: string | null
                    shared_media_ids: string[]
                    preferences1: Json | null
                    preferences2: Json | null
                    votes1: Json
                    votes2: Json
                    match_result_id: string | null
                }
                Insert: {
                    id?: string
                    code: string
                    status?: 'waiting' | 'active' | 'finished' | 'abandoned'
                    created_at?: string
                    user1_id: string
                    user2_id?: string | null
                    shared_media_ids?: string[]
                    preferences1?: Json | null
                    preferences2?: Json | null
                    votes1?: Json
                    votes2?: Json
                    match_result_id?: string | null
                }
                Update: {
                    id?: string
                    code?: string
                    status?: 'waiting' | 'active' | 'finished' | 'abandoned'
                    created_at?: string
                    user1_id?: string
                    user2_id?: string | null
                    shared_media_ids?: string[]
                    preferences1?: Json | null
                    preferences2?: Json | null
                    votes1?: Json
                    votes2?: Json
                    match_result_id?: string | null
                }
            }
            saved_items: {
                Row: {
                    id: string
                    user_id: string
                    media: Json
                    saved_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    media: Json
                    saved_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    media?: Json
                    saved_at?: string
                }
            }
        }
        Views: Record<string, never>
        Functions: Record<string, never>
        Enums: Record<string, never>
    }
}

