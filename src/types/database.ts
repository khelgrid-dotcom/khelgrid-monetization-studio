export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      venues: {
        Row: {
          id: string;
          name: string;
          slug: string | null;
          area: string;
          city: string;
          address: string | null;
          latitude: number | null;
          longitude: number | null;
          sports: string[];
          amenities: string[];
          price_per_hour: number;
          rating: number;
          reviews_count: number;
          featured: boolean;
          bookable: boolean;
          image_url: string | null;
          contact_phone: string | null;
          contact_email: string | null;
          operating_hours?: Json | null;
          booking_policies?: Json | null;
          rules_restrictions?: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["venues"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["venues"]["Insert"]>;
      };
      trials: {
        Row: {
          id: string;
          venue_id: string | null;
          academy_name: string;
          title: string;
          sport: string;
          city: string;
          venue_name: string | null;
          trial_date: string;
          reporting_time: string | null;
          fee: number;
          spots_total: number;
          spots_available: number;
          tag: string;
          eligibility: string | null;
          required_documents: string[];
          selection_process: string | null;
          registration_deadline: string | null;
          source_url: string | null;
          source_label: string | null;
          last_verified: string;
          status: "active" | "upcoming" | "completed" | "cancelled";
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["trials"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["trials"]["Insert"]>;
      };
      coaching_programs: {
        Row: {
          id: string;
          venue_id: string | null;
          title: string;
          coach_name: string;
          sport: string;
          city: string;
          area: string | null;
          level: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
          price_per_month: number;
          rating: number;
          reviews_count: number;
          image_url: string | null;
          schedule_details: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["coaching_programs"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["coaching_programs"]["Insert"]>;
      };
      venue_bookings: {
        Row: {
          id: string;
          venue_id: string;
          user_id: string | null;
          user_email: string | null;
          user_phone: string | null;
          sport: string;
          booking_date: string;
          start_time: string;
          end_time: string;
          total_price: number;
          status: "pending" | "confirmed" | "cancelled" | "completed";
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["venue_bookings"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["venue_bookings"]["Insert"]>;
      };
      trial_applications: {
        Row: {
          id: string;
          trial_id: string;
          user_id: string | null;
          athlete_name: string;
          athlete_age: number | null;
          playing_position: string | null;
          contact_phone: string;
          contact_email: string | null;
          sports_cv_data: Json;
          status: "submitted" | "shortlisted" | "rejected" | "attended";
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["trial_applications"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["trial_applications"]["Insert"]>;
      };
      coaching_enrollments: {
        Row: {
          id: string;
          program_id: string;
          user_id: string | null;
          student_name: string;
          student_age: number | null;
          contact_phone: string;
          status: "pending" | "active" | "paused" | "completed" | "cancelled";
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["coaching_enrollments"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["coaching_enrollments"]["Insert"]>;
      };
      user_profiles: {
        Row: {
          id: string;
          user_id: string | null;
          full_name: string;
          email: string | null;
          phone: string | null;
          avatar_url: string | null;
          primary_sport: string;
          secondary_sports: string[];
          city: string;
          age_category: string;
          playing_position: string | null;
          bio: string | null;
          skill_level: string;
          membership_tier: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["user_profiles"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_profiles"]["Insert"]>;
      };
      sports_achievements: {
        Row: {
          id: string;
          user_id: string | null;
          user_email: string | null;
          title: string;
          sport: string;
          category: "tournament" | "selection" | "award" | "milestone" | "certification";
          level: "Club" | "District" | "State" | "Zonal" | "National";
          organization: string;
          year: number;
          position_rank: string | null;
          description: string | null;
          verified: boolean;
          verification_badge: string | null;
          certificate_url: string | null;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["sports_achievements"]["Row"],
          "id" | "created_at"
        > & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["sports_achievements"]["Insert"]>;
      };
      user_memberships: {
        Row: {
          id: string;
          user_id: string | null;
          user_email: string | null;
          plan_name: string;
          tier: "free" | "pro" | "elite" | "academy";
          status: "active" | "renewed" | "expired" | "paused";
          sport: string;
          venue_name: string | null;
          valid_from: string;
          valid_until: string;
          auto_renew: boolean;
          perks: string[];
          allocated_hours_per_month: number;
          used_hours_this_month: number;
          price_paid: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["user_memberships"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_memberships"]["Insert"]>;
      };
    };
  };
}
