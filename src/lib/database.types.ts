export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          company_name: string;
          subscription_tier: string;
          products_optimized_this_month: number;
          max_products_per_month: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          company_name?: string;
          subscription_tier?: string;
          products_optimized_this_month?: number;
          max_products_per_month?: number;
        };
        Update: {
          company_name?: string;
          subscription_tier?: string;
          products_optimized_this_month?: number;
          max_products_per_month?: number;
        };
      };
      products: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          image_url: string;
          alt_text: string;
          metafields: Record<string, string>;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          title: string;
          description?: string;
          image_url?: string;
          alt_text?: string;
          metafields?: Record<string, string>;
          status?: string;
        };
        Update: {
          title?: string;
          description?: string;
          image_url?: string;
          alt_text?: string;
          metafields?: Record<string, string>;
          status?: string;
        };
      };
      optimizations: {
        Row: {
          id: string;
          product_id: string;
          user_id: string;
          optimized_title: string;
          optimized_description: string;
          optimized_alt_text: string;
          optimized_metafields: Record<string, string>;
          score: number;
          status: string;
          created_at: string;
          approved_at: string | null;
        };
        Insert: {
          product_id: string;
          user_id: string;
          optimized_title: string;
          optimized_description?: string;
          optimized_alt_text?: string;
          optimized_metafields?: Record<string, string>;
          score?: number;
          status?: string;
        };
        Update: {
          optimized_title?: string;
          optimized_description?: string;
          optimized_alt_text?: string;
          optimized_metafields?: Record<string, string>;
          score?: number;
          status?: string;
          approved_at?: string;
        };
      };
      ab_tests: {
        Row: {
          id: string;
          product_id: string;
          optimization_id: string;
          user_id: string;
          variant_a_views: number;
          variant_b_views: number;
          variant_a_clicks: number;
          variant_b_clicks: number;
          status: string;
          winner: string | null;
          started_at: string;
          ended_at: string | null;
        };
        Insert: {
          product_id: string;
          optimization_id: string;
          user_id: string;
          status?: string;
        };
        Update: {
          variant_a_views?: number;
          variant_b_views?: number;
          variant_a_clicks?: number;
          variant_b_clicks?: number;
          status?: string;
          winner?: string;
          ended_at?: string;
        };
      };
      snapshots: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string;
          product_count: number;
          snapshot_data: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          user_id: string;
          name: string;
          description?: string;
          product_count: number;
          snapshot_data: Record<string, unknown>;
        };
        Update: {
          name?: string;
          description?: string;
        };
      };
      usage_logs: {
        Row: {
          id: string;
          user_id: string;
          operation_type: string;
          products_count: number;
          created_at: string;
        };
        Insert: {
          user_id: string;
          operation_type: string;
          products_count?: number;
        };
        Update: never;
      };
    };
  };
}
