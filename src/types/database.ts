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
      halls: {
        Row: {
          id: string
          name: string
          color: string
          bg_color: string
          motto: string
          created_at: string
        }
        Insert: {
          id: string
          name: string
          color: string
          bg_color: string
          motto?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          color?: string
          bg_color?: string
          motto?: string
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          role: "admin" | "referee" | "superadmin"
          full_name: string
          created_at: string
        }
        Insert: {
          id: string
          email: string
          role?: "admin" | "referee" | "superadmin"
          full_name: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: "admin" | "referee" | "superadmin"
          full_name?: string
          created_at?: string
        }
      }
      students: {
        Row: {
          id: string
          reg_number: string
          full_name: string
          hall_id: string
          eligibility_status: "eligible" | "pending_verification" | "ineligible"
          year_of_study: number
          verified_by: string | null
          verified_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          reg_number: string
          full_name: string
          hall_id: string
          eligibility_status?: "eligible" | "pending_verification" | "ineligible"
          year_of_study: number
          verified_by?: string | null
          verified_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          reg_number?: string
          full_name?: string
          hall_id?: string
          eligibility_status?: "eligible" | "pending_verification" | "ineligible"
          year_of_study?: number
          verified_by?: string | null
          verified_at?: string | null
          created_at?: string
        }
      }
      sports: {
        Row: {
          id: string
          name: string
          icon: string
          description: string | null
          rules: string | null
          points_for_win: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          icon: string
          description?: string | null
          rules?: string | null
          points_for_win?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          icon?: string
          description?: string | null
          rules?: string | null
          points_for_win?: number
          created_at?: string
        }
      }
      matches: {
        Row: {
          id: string
          sport_id: string
          home_hall_id: string
          away_hall_id: string
          home_score: number
          away_score: number
          status: "upcoming" | "live" | "finished"
          match_minute: number | null
          scheduled_date: string
          scheduled_time: string
          venue: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sport_id: string
          home_hall_id: string
          away_hall_id: string
          home_score?: number
          away_score?: number
          status?: "upcoming" | "live" | "finished"
          match_minute?: number | null
          scheduled_date: string
          scheduled_time: string
          venue?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sport_id?: string
          home_hall_id?: string
          away_hall_id?: string
          home_score?: number
          away_score?: number
          status?: "upcoming" | "live" | "finished"
          match_minute?: number | null
          scheduled_date?: string
          scheduled_time?: string
          venue?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      match_events: {
        Row: {
          id: string
          match_id: string
          hall_id: string
          event_type: "GOAL" | "POINT" | "FOUL" | "PENALTY" | "CARD" | "SUBSTITUTION"
          description: string
          match_minute: number | null
          recorded_by: string
          created_at: string
        }
        Insert: {
          id?: string
          match_id: string
          hall_id: string
          event_type: "GOAL" | "POINT" | "FOUL" | "PENALTY" | "CARD" | "SUBSTITUTION"
          description: string
          match_minute?: number | null
          recorded_by: string
          created_at?: string
        }
        Update: {
          id?: string
          match_id?: string
          hall_id?: string
          event_type?: "GOAL" | "POINT" | "FOUL" | "PENALTY" | "CARD" | "SUBSTITUTION"
          description?: string
          match_minute?: number | null
          recorded_by?: string
          created_at?: string
        }
      }
      match_results: {
        Row: {
          id: string
          match_id: string
          winner_hall_id: string | null
          is_draw: boolean
          home_hall_pts: number
          away_hall_pts: number
          approved_by: string
          approved_at: string
        }
        Insert: {
          id?: string
          match_id: string
          winner_hall_id?: string | null
          is_draw?: boolean
          home_hall_pts: number
          away_hall_pts: number
          approved_by: string
          approved_at?: string
        }
        Update: {
          id?: string
          match_id?: string
          winner_hall_id?: string | null
          is_draw?: boolean
          home_hall_pts?: number
          away_hall_pts?: number
          approved_by?: string
          approved_at?: string
        }
      }
    }
  }
}
