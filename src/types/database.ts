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
      academies: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          description: string | null
          email: string | null
          facilities: Json
          id: string
          is_verified: boolean
          latitude: number | null
          logo_url: string | null
          longitude: number | null
          name: string
          owner_profile_id: string
          phone: string | null
          rating: number
          reviews_count: number
          slug: string
          sport_ids: string[]
          state: string | null
          updated_at: string
          verification_status: string
          website: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          facilities?: Json
          id?: string
          is_verified?: boolean
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          name: string
          owner_profile_id: string
          phone?: string | null
          rating?: number
          reviews_count?: number
          slug: string
          sport_ids?: string[]
          state?: string | null
          updated_at?: string
          verification_status?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          facilities?: Json
          id?: string
          is_verified?: boolean
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          name?: string
          owner_profile_id?: string
          phone?: string | null
          rating?: number
          reviews_count?: number
          slug?: string
          sport_ids?: string[]
          state?: string | null
          updated_at?: string
          verification_status?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "academies_owner_profile_id_fkey"
            columns: ["owner_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          applied_at: string
          athlete_id: string
          cover_note: string | null
          cv_snapshot: Json
          id: string
          opportunity_id: string
          organizer_note: string | null
          reviewed_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          applied_at?: string
          athlete_id: string
          cover_note?: string | null
          cv_snapshot?: Json
          id?: string
          opportunity_id: string
          organizer_note?: string | null
          reviewed_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          applied_at?: string
          athlete_id?: string
          cover_note?: string | null
          cv_snapshot?: Json
          id?: string
          opportunity_id?: string
          organizer_note?: string | null
          reviewed_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      athletes: {
        Row: {
          achievements: Json
          certificates: Json
          city: string | null
          created_at: string
          date_of_birth: string | null
          dominant_hand: string | null
          gender: string | null
          height_cm: number | null
          highlights: Json
          id: string
          is_public: boolean
          playing_level: string | null
          position: string | null
          profile_id: string
          secondary_sports: string[]
          sport_id: string | null
          sports_cv_url: string | null
          state: string | null
          statistics: Json
          updated_at: string
          weight_kg: number | null
        }
        Insert: {
          achievements?: Json
          certificates?: Json
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          dominant_hand?: string | null
          gender?: string | null
          height_cm?: number | null
          highlights?: Json
          id?: string
          is_public?: boolean
          playing_level?: string | null
          position?: string | null
          profile_id: string
          secondary_sports?: string[]
          sport_id?: string | null
          sports_cv_url?: string | null
          state?: string | null
          statistics?: Json
          updated_at?: string
          weight_kg?: number | null
        }
        Update: {
          achievements?: Json
          certificates?: Json
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          dominant_hand?: string | null
          gender?: string | null
          height_cm?: number | null
          highlights?: Json
          id?: string
          is_public?: boolean
          playing_level?: string | null
          position?: string | null
          profile_id?: string
          secondary_sports?: string[]
          sport_id?: string | null
          sports_cv_url?: string | null
          state?: string | null
          statistics?: Json
          updated_at?: string
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "athletes_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "athletes_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          booking_date: string | null
          booking_type: string
          coach_id: string | null
          created_at: string
          end_time: string | null
          id: string
          notes: string | null
          opportunity_id: string | null
          quantity: number
          start_time: string | null
          status: string
          total_amount: number
          updated_at: string
          user_id: string
          venue_id: string | null
        }
        Insert: {
          booking_date?: string | null
          booking_type?: string
          coach_id?: string | null
          created_at?: string
          end_time?: string | null
          id?: string
          notes?: string | null
          opportunity_id?: string | null
          quantity?: number
          start_time?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
          user_id: string
          venue_id?: string | null
        }
        Update: {
          booking_date?: string | null
          booking_type?: string
          coach_id?: string | null
          created_at?: string
          end_time?: string | null
          id?: string
          notes?: string | null
          opportunity_id?: string | null
          quantity?: number
          start_time?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string
          venue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coaches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      coaches: {
        Row: {
          availability: Json
          bio: string | null
          certifications: Json
          city: string | null
          created_at: string
          experience_years: number
          hourly_rate: number
          id: string
          is_verified: boolean
          profile_id: string
          qualification: string | null
          specialization: string | null
          sport_id: string | null
          state: string | null
          updated_at: string
        }
        Insert: {
          availability?: Json
          bio?: string | null
          certifications?: Json
          city?: string | null
          created_at?: string
          experience_years?: number
          hourly_rate?: number
          id?: string
          is_verified?: boolean
          profile_id: string
          qualification?: string | null
          specialization?: string | null
          sport_id?: string | null
          state?: string | null
          updated_at?: string
        }
        Update: {
          availability?: Json
          bio?: string | null
          certifications?: Json
          city?: string | null
          created_at?: string
          experience_years?: number
          hourly_rate?: number
          id?: string
          is_verified?: boolean
          profile_id?: string
          qualification?: string | null
          specialization?: string | null
          sport_id?: string | null
          state?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "coaches_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coaches_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
        ]
      }
      coaching_enrollments: {
        Row: {
          contact_phone: string
          created_at: string
          id: string
          program_id: string
          status: string
          student_age: number | null
          student_name: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          contact_phone: string
          created_at?: string
          id?: string
          program_id: string
          status?: string
          student_age?: number | null
          student_name: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          contact_phone?: string
          created_at?: string
          id?: string
          program_id?: string
          status?: string
          student_age?: number | null
          student_name?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coaching_enrollments_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "coaching_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      coaching_programs: {
        Row: {
          area: string | null
          city: string
          coach_name: string
          created_at: string
          id: string
          image_url: string | null
          level: string
          price_per_month: number
          rating: number | null
          reviews_count: number | null
          schedule_details: Json | null
          sport: string
          title: string
          updated_at: string
          venue_id: string | null
        }
        Insert: {
          area?: string | null
          city: string
          coach_name: string
          created_at?: string
          id?: string
          image_url?: string | null
          level?: string
          price_per_month?: number
          rating?: number | null
          reviews_count?: number | null
          schedule_details?: Json | null
          sport: string
          title: string
          updated_at?: string
          venue_id?: string | null
        }
        Update: {
          area?: string | null
          city?: string
          coach_name?: string
          created_at?: string
          id?: string
          image_url?: string | null
          level?: string
          price_per_month?: number
          rating?: number | null
          reviews_count?: number | null
          schedule_details?: Json | null
          sport?: string
          title?: string
          updated_at?: string
          venue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coaching_programs_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      disputes: {
        Row: {
          application_id: string | null
          booking_id: string | null
          created_at: string
          description: string | null
          evidence: Json
          id: string
          opened_by: string
          payment_id: string | null
          reason: string
          refund_amount: number
          resolution: string | null
          resolved_at: string | null
          resolved_by: string | null
          respondent_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          application_id?: string | null
          booking_id?: string | null
          created_at?: string
          description?: string | null
          evidence?: Json
          id?: string
          opened_by: string
          payment_id?: string | null
          reason: string
          refund_amount?: number
          resolution?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          respondent_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          application_id?: string | null
          booking_id?: string | null
          created_at?: string
          description?: string | null
          evidence?: Json
          id?: string
          opened_by?: string
          payment_id?: string | null
          reason?: string
          refund_amount?: number
          resolution?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          respondent_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "disputes_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      matchups: {
        Row: {
          athlete_id: string
          created_at: string
          id: string
          matched_athlete_id: string | null
          reasons: Json
          score: number
          sport_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          athlete_id: string
          created_at?: string
          id?: string
          matched_athlete_id?: string | null
          reasons?: Json
          score?: number
          sport_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          athlete_id?: string
          created_at?: string
          id?: string
          matched_athlete_id?: string | null
          reasons?: Json
          score?: number
          sport_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "matchups_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matchups_matched_athlete_id_fkey"
            columns: ["matched_athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matchups_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          data: Json
          id: string
          is_read: boolean
          message: string
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          data?: Json
          id?: string
          is_read?: boolean
          message: string
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          data?: Json
          id?: string
          is_read?: boolean
          message?: string
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      opportunities: {
        Row: {
          academy_id: string | null
          address: string | null
          applications_count: number
          capacity: number | null
          city: string | null
          created_at: string
          description: string | null
          eligibility: Json
          end_at: string | null
          fee: number
          id: string
          is_featured: boolean
          latitude: number | null
          location_name: string | null
          longitude: number | null
          metadata: Json
          opportunity_type: string
          organizer_profile_id: string
          registration_deadline: string | null
          requirements: Json
          slug: string | null
          sport_id: string | null
          start_at: string | null
          state: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          academy_id?: string | null
          address?: string | null
          applications_count?: number
          capacity?: number | null
          city?: string | null
          created_at?: string
          description?: string | null
          eligibility?: Json
          end_at?: string | null
          fee?: number
          id?: string
          is_featured?: boolean
          latitude?: number | null
          location_name?: string | null
          longitude?: number | null
          metadata?: Json
          opportunity_type?: string
          organizer_profile_id: string
          registration_deadline?: string | null
          requirements?: Json
          slug?: string | null
          sport_id?: string | null
          start_at?: string | null
          state?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          academy_id?: string | null
          address?: string | null
          applications_count?: number
          capacity?: number | null
          city?: string | null
          created_at?: string
          description?: string | null
          eligibility?: Json
          end_at?: string | null
          fee?: number
          id?: string
          is_featured?: boolean
          latitude?: number | null
          location_name?: string | null
          longitude?: number | null
          metadata?: Json
          opportunity_type?: string
          organizer_profile_id?: string
          registration_deadline?: string | null
          requirements?: Json
          slug?: string | null
          sport_id?: string | null
          start_at?: string | null
          state?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunities_organizer_profile_id_fkey"
            columns: ["organizer_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunities_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
        ]
      }
      organizer_verifications: {
        Row: {
          academy_id: string | null
          created_at: string
          documents: Json
          expires_at: string | null
          id: string
          profile_id: string
          reviewed_at: string | null
          reviewer_note: string | null
          status: string
          submitted_at: string | null
          updated_at: string
          verification_type: string
        }
        Insert: {
          academy_id?: string | null
          created_at?: string
          documents?: Json
          expires_at?: string | null
          id?: string
          profile_id: string
          reviewed_at?: string | null
          reviewer_note?: string | null
          status?: string
          submitted_at?: string | null
          updated_at?: string
          verification_type?: string
        }
        Update: {
          academy_id?: string | null
          created_at?: string
          documents?: Json
          expires_at?: string | null
          id?: string
          profile_id?: string
          reviewed_at?: string | null
          reviewer_note?: string | null
          status?: string
          submitted_at?: string | null
          updated_at?: string
          verification_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "organizer_verifications_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organizer_verifications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          application_id: string | null
          booking_id: string | null
          created_at: string
          currency: string
          id: string
          metadata: Json
          opportunity_id: string | null
          paid_at: string | null
          payment_type: string
          provider: string | null
          provider_order_id: string | null
          provider_payment_id: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          application_id?: string | null
          booking_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json
          opportunity_id?: string | null
          paid_at?: string | null
          payment_type?: string
          provider?: string | null
          provider_order_id?: string | null
          provider_payment_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          application_id?: string | null
          booking_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json
          opportunity_id?: string | null
          paid_at?: string | null
          payment_type?: string
          provider?: string | null
          provider_order_id?: string | null
          provider_payment_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          city: string | null
          country: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          is_verified: boolean
          metadata: Json
          phone: string | null
          plan: string
          role: string
          state: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          is_verified?: boolean
          metadata?: Json
          phone?: string | null
          plan?: string
          role?: string
          state?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          is_verified?: boolean
          metadata?: Json
          phone?: string | null
          plan?: string
          role?: string
          state?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string
          id: string
          referral_code: string
          referred_user_id: string | null
          referrer_id: string
          reward_amount: number
          rewarded_at: string | null
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          referral_code: string
          referred_user_id?: string | null
          referrer_id: string
          reward_amount?: number
          rewarded_at?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          referral_code?: string
          referred_user_id?: string | null
          referrer_id?: string
          reward_amount?: number
          rewarded_at?: string | null
          status?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          academy_id: string | null
          booking_id: string | null
          coach_id: string | null
          created_at: string
          id: string
          is_verified_transaction: boolean
          opportunity_id: string | null
          rating: number
          response_text: string | null
          review_text: string | null
          reviewer_profile_id: string
          status: string
          title: string | null
          updated_at: string
        }
        Insert: {
          academy_id?: string | null
          booking_id?: string | null
          coach_id?: string | null
          created_at?: string
          id?: string
          is_verified_transaction?: boolean
          opportunity_id?: string | null
          rating: number
          response_text?: string | null
          review_text?: string | null
          reviewer_profile_id: string
          status?: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          academy_id?: string | null
          booking_id?: string | null
          coach_id?: string | null
          created_at?: string
          id?: string
          is_verified_transaction?: boolean
          opportunity_id?: string | null
          rating?: number
          response_text?: string | null
          review_text?: string | null
          reviewer_profile_id?: string
          status?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coaches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_profile_id_fkey"
            columns: ["reviewer_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_searches: {
        Row: {
          alert_enabled: boolean
          alert_frequency: string
          created_at: string
          filters: Json
          id: string
          last_alerted_at: string | null
          name: string
          search_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          alert_enabled?: boolean
          alert_frequency?: string
          created_at?: string
          filters?: Json
          id?: string
          last_alerted_at?: string | null
          name: string
          search_type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          alert_enabled?: boolean
          alert_frequency?: string
          created_at?: string
          filters?: Json
          id?: string
          last_alerted_at?: string | null
          name?: string
          search_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sports: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          icon_url: string | null
          id: string
          is_active: boolean
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      sports_entities: {
        Row: {
          id: number
        }
        Insert: {
          id?: number
        }
        Update: {
          id?: number
        }
        Relationships: []
      }
      State: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      trial_applications: {
        Row: {
          athlete_age: number | null
          athlete_name: string
          contact_email: string | null
          contact_phone: string
          created_at: string
          id: string
          playing_position: string | null
          sports_cv_data: Json | null
          status: string
          trial_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          athlete_age?: number | null
          athlete_name: string
          contact_email?: string | null
          contact_phone: string
          created_at?: string
          id?: string
          playing_position?: string | null
          sports_cv_data?: Json | null
          status?: string
          trial_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          athlete_age?: number | null
          athlete_name?: string
          contact_email?: string | null
          contact_phone?: string
          created_at?: string
          id?: string
          playing_position?: string | null
          sports_cv_data?: Json | null
          status?: string
          trial_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trial_applications_trial_id_fkey"
            columns: ["trial_id"]
            isOneToOne: false
            referencedRelation: "trials"
            referencedColumns: ["id"]
          },
        ]
      }
      trials: {
        Row: {
          academy_name: string
          city: string
          created_at: string
          eligibility: string | null
          fee: number
          id: string
          last_verified: string | null
          registration_deadline: string | null
          reporting_time: string | null
          required_documents: string[] | null
          selection_process: string | null
          source_label: string | null
          source_url: string | null
          sport: string
          spots_available: number
          spots_total: number
          status: string
          tag: string | null
          title: string
          trial_date: string
          updated_at: string
          venue_id: string | null
          venue_name: string | null
        }
        Insert: {
          academy_name: string
          city: string
          created_at?: string
          eligibility?: string | null
          fee?: number
          id?: string
          last_verified?: string | null
          registration_deadline?: string | null
          reporting_time?: string | null
          required_documents?: string[] | null
          selection_process?: string | null
          source_label?: string | null
          source_url?: string | null
          sport: string
          spots_available?: number
          spots_total?: number
          status?: string
          tag?: string | null
          title: string
          trial_date: string
          updated_at?: string
          venue_id?: string | null
          venue_name?: string | null
        }
        Update: {
          academy_name?: string
          city?: string
          created_at?: string
          eligibility?: string | null
          fee?: number
          id?: string
          last_verified?: string | null
          registration_deadline?: string | null
          reporting_time?: string | null
          required_documents?: string[] | null
          selection_process?: string | null
          source_label?: string | null
          source_url?: string | null
          sport?: string
          spots_available?: number
          spots_total?: number
          status?: string
          tag?: string | null
          title?: string
          trial_date?: string
          updated_at?: string
          venue_id?: string | null
          venue_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trials_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      venue_bookings: {
        Row: {
          booking_date: string
          created_at: string
          end_time: string
          id: string
          sport: string
          start_time: string
          status: string
          total_price: number
          updated_at: string
          user_email: string | null
          user_id: string | null
          user_phone: string | null
          venue_id: string
        }
        Insert: {
          booking_date: string
          created_at?: string
          end_time: string
          id?: string
          sport: string
          start_time: string
          status?: string
          total_price: number
          updated_at?: string
          user_email?: string | null
          user_id?: string | null
          user_phone?: string | null
          venue_id: string
        }
        Update: {
          booking_date?: string
          created_at?: string
          end_time?: string
          id?: string
          sport?: string
          start_time?: string
          status?: string
          total_price?: number
          updated_at?: string
          user_email?: string | null
          user_id?: string | null
          user_phone?: string | null
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "venue_bookings_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      venues: {
        Row: {
          address: string | null
          amenities: string[] | null
          area: string
          bookable: boolean | null
          city: string
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          featured: boolean | null
          id: string
          image_url: string | null
          latitude: number | null
          longitude: number | null
          name: string
          price_per_hour: number
          rating: number | null
          reviews_count: number | null
          slug: string | null
          sports: string[]
          updated_at: string
        }
        Insert: {
          address?: string | null
          amenities?: string[] | null
          area: string
          bookable?: boolean | null
          city: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          featured?: boolean | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          name: string
          price_per_hour?: number
          rating?: number | null
          reviews_count?: number | null
          slug?: string | null
          sports?: string[]
          updated_at?: string
        }
        Update: {
          address?: string | null
          amenities?: string[] | null
          area?: string
          bookable?: boolean | null
          city?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          featured?: boolean | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          price_per_hour?: number
          rating?: number | null
          reviews_count?: number | null
          slug?: string | null
          sports?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          balance_after: number | null
          created_at: string
          description: string | null
          id: string
          metadata: Json
          payment_id: string | null
          reference_id: string | null
          reference_type: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          balance_after?: number | null
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json
          payment_id?: string | null
          reference_id?: string | null
          reference_type?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number | null
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json
          payment_id?: string | null
          reference_id?: string | null
          reference_type?: string | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
