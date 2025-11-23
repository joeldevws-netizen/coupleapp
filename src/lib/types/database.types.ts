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
          couple_code: string
          partner1_name: string | null
          partner2_name: string | null
          anniversary_date: string
          theme_color: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          couple_code: string
          partner1_name?: string | null
          partner2_name?: string | null
          anniversary_date?: string
          theme_color?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          couple_code?: string
          partner1_name?: string | null
          partner2_name?: string | null
          anniversary_date?: string
          theme_color?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      important_dates: {
        Row: {
          id: string
          couple_id: string
          title: string
          date: string
          type: 'anniversary' | 'birthday' | 'special' | 'recurring'
          icon: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          couple_id: string
          title: string
          date: string
          type: 'anniversary' | 'birthday' | 'special' | 'recurring'
          icon?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          couple_id?: string
          title?: string
          date?: string
          type?: 'anniversary' | 'birthday' | 'special' | 'recurring'
          icon?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      bucket_list: {
        Row: {
          id: string
          couple_id: string
          title: string
          category: 'travel' | 'activity' | 'food' | 'adventure' | 'other'
          priority: 'high' | 'medium' | 'low'
          completed: boolean
          notes: string | null
          created_at: string
          updated_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          couple_id: string
          title: string
          category: 'travel' | 'activity' | 'food' | 'adventure' | 'other'
          priority: 'high' | 'medium' | 'low'
          completed?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          couple_id?: string
          title?: string
          category?: 'travel' | 'activity' | 'food' | 'adventure' | 'other'
          priority?: 'high' | 'medium' | 'low'
          completed?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
      }
      tasks: {
        Row: {
          id: string
          couple_id: string
          title: string
          completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          couple_id: string
          title: string
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          couple_id?: string
          title?: string
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          couple_id: string
          content: string
          sender_name: string
          created_at: string
        }
        Insert: {
          id?: string
          couple_id: string
          content: string
          sender_name: string
          created_at?: string
        }
        Update: {
          id?: string
          couple_id?: string
          content?: string
          sender_name?: string
          created_at?: string
        }
      }
      photos: {
        Row: {
          id: string
          couple_id: string
          url: string
          caption: string | null
          date_taken: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          couple_id: string
          url: string
          caption?: string | null
          date_taken?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          couple_id?: string
          url?: string
          caption?: string | null
          date_taken?: string | null
          created_at?: string
          updated_at?: string
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
