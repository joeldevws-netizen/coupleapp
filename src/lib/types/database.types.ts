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
      couples: {
        Row: {
          id: string
          created_at: string
          anniversary_date: string
          partner1_id: string | null
          partner2_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          anniversary_date: string
          partner1_id?: string | null
          partner2_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          anniversary_date?: string
          partner1_id?: string | null
          partner2_id?: string | null
        }
      }
      tasks: {
        Row: {
          id: string
          couple_id: string
          created_at: string
          updated_at: string
          title: string
          completed: boolean
          created_by: string | null
        }
        Insert: {
          id?: string
          couple_id: string
          created_at?: string
          updated_at?: string
          title: string
          completed?: boolean
          created_by?: string | null
        }
        Update: {
          id?: string
          couple_id?: string
          created_at?: string
          updated_at?: string
          title?: string
          completed?: boolean
          created_by?: string | null
        }
      }
      messages: {
        Row: {
          id: string
          couple_id: string
          created_at: string
          author_id: string | null
          content: string
          sender_name: string
        }
        Insert: {
          id?: string
          couple_id: string
          created_at?: string
          author_id?: string | null
          content: string
          sender_name: string
        }
        Update: {
          id?: string
          couple_id?: string
          created_at?: string
          author_id?: string | null
          content?: string
          sender_name?: string
        }
      }
      mood_entries: {
        Row: {
          id: string
          couple_id: string
          partner_name: string
          mood: string
          note: string | null
          created_at: string
        }
        Insert: {
          id?: string
          couple_id: string
          partner_name: string
          mood: string
          note?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          couple_id?: string
          partner_name?: string
          mood?: string
          note?: string | null
          created_at?: string
        }
      }
    }
  }
}
