export type ProjectCategory
  = | 'landing-page'
    | 'web-app'
    | 'dashboard'
    | 'portfolio'
    | 'e-commerce'
    | 'blog-editorial'
    | 'saas'
    | 'ai-tool'
    | 'mobile-app'
    | 'game-interactive'
    | 'productivity'
    | 'experimental'
    | 'lainnya'
export type ProjectStatus = 'draft' | 'published'

export type ProjectSummary = Pick<
  Project,
  | 'id'
  | 'title'
  | 'slug'
  | 'category'
  | 'style_tags'
  | 'tech_stack'
  | 'thumbnail_url'
  | 'preview_media_url'
>

/** Public detail payload: plain summary + sanitized HTML instead of raw markdown. */
export type ProjectDetail = Omit<Project, 'description'> & {
  summary: string
  description_html: string
}

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
  seo_title?: string | null
  seo_description?: string | null
  focus_keyword?: string | null
  created_at: string
  updated_at: string
}

export type SiteSetting = {
  key: string
  value: Record<string, any>
  updated_at: string
}

export type ClickTarget = 'demo' | 'repo'

export type ProjectClickStats = {
  project_id: string
  demo_total: number
  demo_30d: number
  repo_total: number
  repo_30d: number
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
      site_settings: {
        Row: SiteSetting
        Insert: { key: string, value: Record<string, any>, updated_at?: string }
        Update: { key?: string, value?: Record<string, any>, updated_at?: string }
        Relationships: []
      }
      project_clicks: {
        Row: { id: number, project_id: string, target: ClickTarget, clicked_at: string }
        Insert: never
        Update: never
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      is_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
      record_project_click: {
        Args: { p_slug: string, p_target: ClickTarget }
        Returns: undefined
      }
      project_click_stats: {
        Args: Record<string, never>
        Returns: ProjectClickStats[]
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

