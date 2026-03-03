export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            daily_tips: {
                Row: {
                    id: string
                    content: string
                    category: 'heating' | 'water' | 'electricity'
                    season: 'winter' | 'summer' | 'all'
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    content: string
                    category: 'heating' | 'water' | 'electricity'
                    season?: 'winter' | 'summer' | 'all'
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    content?: string
                    category?: 'heating' | 'water' | 'electricity'
                    season?: 'winter' | 'summer' | 'all'
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
