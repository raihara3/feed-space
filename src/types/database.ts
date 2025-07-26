export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          created_at?: string
          updated_at?: string
        }
      }
      feeds: {
        Row: {
          id: string
          user_id: string
          title: string
          url: string
          description: string | null
          last_fetched_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          url: string
          description?: string | null
          last_fetched_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          url?: string
          description?: string | null
          last_fetched_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      feed_items: {
        Row: {
          id: string
          feed_id: string
          title: string
          link: string
          description: string | null
          published_at: string | null
          guid: string | null
          created_at: string
        }
        Insert: {
          id?: string
          feed_id: string
          title: string
          link: string
          description?: string | null
          published_at?: string | null
          guid?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          feed_id?: string
          title?: string
          link?: string
          description?: string | null
          published_at?: string | null
          guid?: string | null
          created_at?: string
        }
      }
    }
  }
}