export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author: string
          category: string
          content: string
          cover_url: string
          created_at: string
          excerpt: string
          featured: boolean
          id: string
          main_featured: boolean
          meta_description: string | null
          meta_title: string | null
          published_at: string
          reading_time: string
          slug: string
          status: string
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          author?: string
          category: string
          content?: string
          cover_url?: string
          created_at?: string
          excerpt?: string
          featured?: boolean
          id?: string
          main_featured?: boolean
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string
          reading_time?: string
          slug: string
          status?: string
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          category?: string
          content?: string
          cover_url?: string
          created_at?: string
          excerpt?: string
          featured?: boolean
          id?: string
          main_featured?: boolean
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string
          reading_time?: string
          slug?: string
          status?: string
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      home_page_settings: {
        Row: {
          created_at: string
          hero_bg_image_desktop_url: string | null
          hero_bg_image_mobile_url: string | null
          hero_bg_image_url: string | null
          id: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          hero_bg_image_desktop_url?: string | null
          hero_bg_image_mobile_url?: string | null
          hero_bg_image_url?: string | null
          id?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          hero_bg_image_desktop_url?: string | null
          hero_bg_image_mobile_url?: string | null
          hero_bg_image_url?: string | null
          id?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      hotel_page_settings: {
        Row: {
          gallery_urls: string[]
          hero_image_url: string | null
          id: boolean
          logo_url: string | null
          map_url: string | null
          presentation_image_url: string | null
          reservation_url: string | null
          updated_at: string
        }
        Insert: {
          gallery_urls?: string[]
          hero_image_url?: string | null
          id?: boolean
          logo_url?: string | null
          map_url?: string | null
          presentation_image_url?: string | null
          reservation_url?: string | null
          updated_at?: string
        }
        Update: {
          gallery_urls?: string[]
          hero_image_url?: string | null
          id?: boolean
          logo_url?: string | null
          map_url?: string | null
          presentation_image_url?: string | null
          reservation_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      o_valen_page_settings: {
        Row: {
          created_at: string
          experiencias_image_url: string | null
          gallery_urls: Json
          hero_image_url: string | null
          id: boolean
          instagram_urls: Json
          map_url: string | null
          presentation_image_url: string | null
          purpose_image_url: string | null
          timeline_2019_image_url: string | null
          timeline_2022_image_url: string | null
          timeline_2025_image_url: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          experiencias_image_url?: string | null
          gallery_urls?: Json
          hero_image_url?: string | null
          id?: boolean
          instagram_urls?: Json
          map_url?: string | null
          presentation_image_url?: string | null
          purpose_image_url?: string | null
          timeline_2019_image_url?: string | null
          timeline_2022_image_url?: string | null
          timeline_2025_image_url?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          experiencias_image_url?: string | null
          gallery_urls?: Json
          hero_image_url?: string | null
          id?: boolean
          instagram_urls?: Json
          map_url?: string | null
          presentation_image_url?: string | null
          purpose_image_url?: string | null
          timeline_2019_image_url?: string | null
          timeline_2022_image_url?: string | null
          timeline_2025_image_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      posto_page_settings: {
        Row: {
          abastecimento_image_url: string | null
          conveniencia_image_url: string | null
          hero_image_url: string | null
          id: boolean
          logo_url: string | null
          map_url: string | null
          payment_logos: string[]
          payment_strip_url: string | null
          posto_image_url: string | null
          updated_at: string
          whatsapp_url: string | null
        }
        Insert: {
          abastecimento_image_url?: string | null
          conveniencia_image_url?: string | null
          hero_image_url?: string | null
          id?: boolean
          logo_url?: string | null
          map_url?: string | null
          payment_logos?: string[]
          payment_strip_url?: string | null
          posto_image_url?: string | null
          updated_at?: string
          whatsapp_url?: string | null
        }
        Update: {
          abastecimento_image_url?: string | null
          conveniencia_image_url?: string | null
          hero_image_url?: string | null
          id?: boolean
          logo_url?: string | null
          map_url?: string | null
          payment_logos?: string[]
          payment_strip_url?: string | null
          posto_image_url?: string | null
          updated_at?: string
          whatsapp_url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      promotions: {
        Row: {
          category: string
          cover_url: string
          created_at: string
          cta_text: string
          cta_url: string
          featured: boolean
          full_description: string
          id: string
          meta_description: string | null
          meta_title: string | null
          rules: string
          short_description: string
          show_on_blog: boolean
          show_on_home: boolean
          slug: string
          status: string
          title: string
          updated_at: string
          validity: string
        }
        Insert: {
          category: string
          cover_url?: string
          created_at?: string
          cta_text?: string
          cta_url?: string
          featured?: boolean
          full_description?: string
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          rules?: string
          short_description?: string
          show_on_blog?: boolean
          show_on_home?: boolean
          slug: string
          status?: string
          title: string
          updated_at?: string
          validity?: string
        }
        Update: {
          category?: string
          cover_url?: string
          created_at?: string
          cta_text?: string
          cta_url?: string
          featured?: boolean
          full_description?: string
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          rules?: string
          short_description?: string
          show_on_blog?: boolean
          show_on_home?: boolean
          slug?: string
          status?: string
          title?: string
          updated_at?: string
          validity?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          description: string
          icon: string
          id: string
          image_url: string
          link_url: string
          name: string
          order_index: number
          slug: string
          status: string
          tags: string[]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          image_url?: string
          link_url?: string
          name: string
          order_index?: number
          slug: string
          status?: string
          tags?: string[]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          image_url?: string
          link_url?: string
          name?: string
          order_index?: number
          slug?: string
          status?: string
          tags?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      stores: {
        Row: {
          block: string
          category: string
          cover_url: string
          created_at: string
          cta_text: string
          cta_url: string
          featured: boolean
          full_description: string
          hours: string
          id: string
          location: string
          logo_url: string
          meta_description: string | null
          meta_title: string | null
          name: string
          phone: string
          short_description: string
          show_on_home: boolean
          slug: string
          status: string
          updated_at: string
          whatsapp: string
        }
        Insert: {
          block?: string
          category: string
          cover_url?: string
          created_at?: string
          cta_text?: string
          cta_url?: string
          featured?: boolean
          full_description?: string
          hours?: string
          id?: string
          location?: string
          logo_url?: string
          meta_description?: string | null
          meta_title?: string | null
          name: string
          phone?: string
          short_description?: string
          show_on_home?: boolean
          slug: string
          status?: string
          updated_at?: string
          whatsapp?: string
        }
        Update: {
          block?: string
          category?: string
          cover_url?: string
          created_at?: string
          cta_text?: string
          cta_url?: string
          featured?: boolean
          full_description?: string
          hours?: string
          id?: string
          location?: string
          logo_url?: string
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          phone?: string
          short_description?: string
          show_on_home?: boolean
          slug?: string
          status?: string
          updated_at?: string
          whatsapp?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      valenlog_page_settings: {
        Row: {
          classificacao_image_url: string | null
          gallery_urls: string[]
          hero_image_url: string | null
          id: boolean
          inspecao_image_url: string | null
          map_url: string | null
          presentation_image_url: string | null
          updated_at: string
          valentina_image_urls: string[]
        }
        Insert: {
          classificacao_image_url?: string | null
          gallery_urls?: string[]
          hero_image_url?: string | null
          id?: boolean
          inspecao_image_url?: string | null
          map_url?: string | null
          presentation_image_url?: string | null
          updated_at?: string
          valentina_image_urls?: string[]
        }
        Update: {
          classificacao_image_url?: string | null
          gallery_urls?: string[]
          hero_image_url?: string | null
          id?: boolean
          inspecao_image_url?: string | null
          map_url?: string | null
          presentation_image_url?: string | null
          updated_at?: string
          valentina_image_urls?: string[]
        }
        Relationships: []
      }
      videos: {
        Row: {
          category: string
          created_at: string
          featured: boolean
          id: string
          short_description: string
          sort_order: number
          status: string
          title: string
          updated_at: string
          youtube_id: string
          youtube_url: string
        }
        Insert: {
          category?: string
          created_at?: string
          featured?: boolean
          id?: string
          short_description?: string
          sort_order?: number
          status?: string
          title: string
          updated_at?: string
          youtube_id: string
          youtube_url: string
        }
        Update: {
          category?: string
          created_at?: string
          featured?: boolean
          id?: string
          short_description?: string
          sort_order?: number
          status?: string
          title?: string
          updated_at?: string
          youtube_id?: string
          youtube_url?: string
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
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
