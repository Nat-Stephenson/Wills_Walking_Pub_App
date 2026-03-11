import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Type definitions for Supabase tables
export type Database = {
  public: {
    Tables: {
      routes: {
        Row: {
          id: string;
          name: string;
          description: string;
          distance: number;
          duration: number;
          difficulty: 'Easy' | 'Moderate' | 'Challenging';
          region: string;
          image_url?: string;
          is_completed: boolean;
          start_point: {
            name: string;
            lat: number;
            lng: number;
          };
          end_point: {
            name: string;
            lat: number;
            lng: number;
          };
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          distance: number;
          duration: number;
          difficulty: 'Easy' | 'Moderate' | 'Challenging';
          region: string;
          image_url?: string;
          is_completed?: boolean;
          start_point: {
            name: string;
            lat: number;
            lng: number;
          };
          end_point: {
            name: string;
            lat: number;
            lng: number;
          };
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          distance?: number;
          duration?: number;
          difficulty?: 'Easy' | 'Moderate' | 'Challenging';
          region?: string;
          image_url?: string;
          is_completed?: boolean;
          start_point?: {
            name: string;
            lat: number;
            lng: number;
          };
          end_point?: {
            name: string;
            lat: number;
            lng: number;
          };
        };
      };
      pubs: {
        Row: {
          id: string;
          name: string;
          description: string;
          latitude: number;
          longitude: number;
          route_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          latitude: number;
          longitude: number;
          route_id: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          latitude?: number;
          longitude?: number;
          route_id?: string;
        };
      };
    };
  };
};