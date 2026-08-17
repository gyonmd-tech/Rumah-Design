export type ProjectCategory = 'landing-page' | 'web-app' | 'dashboard' | 'lainnya'
export type ProjectStatus = 'draft' | 'published'

export type Project = {
  id: string
  title: string
  slug: string
  description: string | null
  live_url: string
  repo_url: string | null
  category: ProjectCategory
  style_tags: string[]
  tech_stack: string[]
  thumbnail_url: string
  preview_media_url: string | null
  status: ProjectStatus
  created_at: string
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: { user_id: string, created_at: string }
        Insert: { user_id: string, created_at?: string }
        Update: { user_id?: string, created_at?: string }
        Relationships: []
      }
      projects: {
        Row: Project
        Insert: Omit<Project, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>> & {
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      is_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
