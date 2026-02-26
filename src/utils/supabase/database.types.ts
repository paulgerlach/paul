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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      agencies: {
        Row: {
          city: string | null
          created_at: string
          id: string
          is_active: boolean
          logo_url: string | null
          name: string
          street: string | null
          updated_at: string
          vat_id: string | null
          zip: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name: string
          street?: string | null
          updated_at?: string
          vat_id?: string | null
          zip?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name?: string
          street?: string | null
          updated_at?: string
          vat_id?: string | null
          zip?: string | null
        }
        Relationships: []
      }
      bved_api_tokens: {
        Row: {
          access_token_expires_at: string
          access_token_hash: string
          access_token_prefix: string
          client_name: string
          created_at: string
          id: string
          last_used_at: string | null
          metadata: Json | null
          refresh_token_expires_at: string
          refresh_token_hash: string
          refresh_token_prefix: string
          revoked: boolean
          user_id: string
        }
        Insert: {
          access_token_expires_at: string
          access_token_hash: string
          access_token_prefix: string
          client_name: string
          created_at?: string
          id?: string
          last_used_at?: string | null
          metadata?: Json | null
          refresh_token_expires_at: string
          refresh_token_hash: string
          refresh_token_prefix: string
          revoked?: boolean
          user_id: string
        }
        Update: {
          access_token_expires_at?: string
          access_token_hash?: string
          access_token_prefix?: string
          client_name?: string
          created_at?: string
          id?: string
          last_used_at?: string | null
          metadata?: Json | null
          refresh_token_expires_at?: string
          refresh_token_hash?: string
          refresh_token_prefix?: string
          revoked?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bved_api_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      bved_cost_categories_cache: {
        Row: {
          cache_key: string
          cached_data: Json
          created_at: string
          expires_at: string
          id: string
          property_id: string
        }
        Insert: {
          cache_key: string
          cached_data: Json
          created_at?: string
          expires_at: string
          id?: string
          property_id: string
        }
        Update: {
          cache_key?: string
          cached_data?: Json
          created_at?: string
          expires_at?: string
          id?: string
          property_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bved_cost_categories_cache_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "objekte"
            referencedColumns: ["id"]
          },
        ]
      }
      bved_platform_credentials: {
        Row: {
          created_at: string
          credentials: Json
          id: string
          platform_type: string
          property_id: string
          token_expires_at: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          credentials: Json
          id?: string
          platform_type: string
          property_id: string
          token_expires_at?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          credentials?: Json
          id?: string
          platform_type?: string
          property_id?: string
          token_expires_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bved_platform_credentials_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "objekte"
            referencedColumns: ["id"]
          },
        ]
      }
      config_versions: {
        Row: {
          config: Json
          created_at: string
          created_by: string | null
          description: string | null
          etag: string
          id: string
          is_active: boolean | null
        }
        Insert: {
          config: Json
          created_at?: string
          created_by?: string | null
          description?: string | null
          etag: string
          id?: string
          is_active?: boolean | null
        }
        Update: {
          config?: Json
          created_at?: string
          created_by?: string | null
          description?: string | null
          etag?: string
          id?: string
          is_active?: boolean | null
        }
        Relationships: []
      }
      contractors: {
        Row: {
          birth_date: string | null
          contract_id: string
          created_at: string
          email: string | null
          first_name: string
          id: string
          last_name: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          birth_date?: string | null
          contract_id: string
          created_at: string
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          phone?: string | null
          updated_at: string
          user_id: string
        }
        Update: {
          birth_date?: string | null
          contract_id?: string
          created_at?: string
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contractors_contract_id_contracts_id_fk"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          additional_costs: number
          cold_rent: number
          created_at: string
          custody_type: string | null
          deposit: number | null
          id: string
          is_current: boolean
          local_id: string
          rental_end_date: string | null
          rental_start_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          additional_costs: number
          cold_rent: number
          created_at: string
          custody_type?: string | null
          deposit?: number | null
          id?: string
          is_current?: boolean
          local_id: string
          rental_end_date?: string | null
          rental_start_date: string
          updated_at: string
          user_id: string
        }
        Update: {
          additional_costs?: number
          cold_rent?: number
          created_at?: string
          custody_type?: string | null
          deposit?: number | null
          id?: string
          is_current?: boolean
          local_id?: string
          rental_end_date?: string | null
          rental_start_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contracts_local_id_locals_id_fk"
            columns: ["local_id"]
            isOneToOne: false
            referencedRelation: "locals"
            referencedColumns: ["id"]
          },
        ]
      }
      doc_cost_category: {
        Row: {
          allocation_key:
            | Database["public"]["Enums"]["doc_cost_category_allocation_key"]
            | null
          created_at: string
          document_type:
            | Database["public"]["Enums"]["doc_cost_category_document_type"]
            | null
          id: string
          name: string | null
          options: string[] | null
          type: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          allocation_key?:
            | Database["public"]["Enums"]["doc_cost_category_allocation_key"]
            | null
          created_at?: string
          document_type?:
            | Database["public"]["Enums"]["doc_cost_category_document_type"]
            | null
          id?: string
          name?: string | null
          options?: string[] | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          allocation_key?:
            | Database["public"]["Enums"]["doc_cost_category_allocation_key"]
            | null
          created_at?: string
          document_type?:
            | Database["public"]["Enums"]["doc_cost_category_document_type"]
            | null
          id?: string
          name?: string | null
          options?: string[] | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      doc_cost_category_defaults: {
        Row: {
          allocation_key:
            | Database["public"]["Enums"]["doc_cost_category_allocation_key"]
            | null
          created_at: string | null
          document_type:
            | Database["public"]["Enums"]["doc_cost_category_document_type"]
            | null
          id: string
          name: string | null
          options: string[] | null
          type: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          allocation_key?:
            | Database["public"]["Enums"]["doc_cost_category_allocation_key"]
            | null
          created_at?: string | null
          document_type?:
            | Database["public"]["Enums"]["doc_cost_category_document_type"]
            | null
          id?: string
          name?: string | null
          options?: string[] | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          allocation_key?:
            | Database["public"]["Enums"]["doc_cost_category_allocation_key"]
            | null
          created_at?: string | null
          document_type?:
            | Database["public"]["Enums"]["doc_cost_category_document_type"]
            | null
          id?: string
          name?: string | null
          options?: string[] | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          created_at: string | null
          current_document: boolean
          document_name: string
          document_url: string
          id: string
          local_id: string | null
          related_id: string
          related_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_document?: boolean
          document_name: string
          document_url: string
          id?: string
          local_id?: string | null
          related_id: string
          related_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_document?: boolean
          document_name?: string
          document_url?: string
          id?: string
          local_id?: string | null
          related_id?: string
          related_type?: string
          user_id?: string
        }
        Relationships: []
      }
      firmware_deployments: {
        Row: {
          completed_at: string | null
          created_at: string
          current_chunk: number | null
          error_message: string | null
          firmware_id: string | null
          gateway_eui: string
          id: string
          last_chunk_at: string | null
          metadata: Json | null
          retry_count: number | null
          scheduled_at: string
          started_at: string | null
          status: string | null
          total_chunks: number | null
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          current_chunk?: number | null
          error_message?: string | null
          firmware_id?: string | null
          gateway_eui: string
          id?: string
          last_chunk_at?: string | null
          metadata?: Json | null
          retry_count?: number | null
          scheduled_at: string
          started_at?: string | null
          status?: string | null
          total_chunks?: number | null
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          current_chunk?: number | null
          error_message?: string | null
          firmware_id?: string | null
          gateway_eui?: string
          id?: string
          last_chunk_at?: string | null
          metadata?: Json | null
          retry_count?: number | null
          scheduled_at?: string
          started_at?: string | null
          status?: string | null
          total_chunks?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "firmware_deployments_firmware_id_fkey"
            columns: ["firmware_id"]
            isOneToOne: false
            referencedRelation: "firmware_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      firmware_download_log: {
        Row: {
          chunk_number: number
          downloaded_at: string
          error_message: string | null
          firmware_filename: string
          gateway_eui: string
          id: string
          response_time_ms: number | null
          success: boolean
        }
        Insert: {
          chunk_number: number
          downloaded_at?: string
          error_message?: string | null
          firmware_filename: string
          gateway_eui: string
          id?: string
          response_time_ms?: number | null
          success: boolean
        }
        Update: {
          chunk_number?: number
          downloaded_at?: string
          error_message?: string | null
          firmware_filename?: string
          gateway_eui?: string
          id?: string
          response_time_ms?: number | null
          success?: boolean
        }
        Relationships: []
      }
      firmware_history: {
        Row: {
          created_at: string
          details: Json | null
          firmware_type: string
          first_seen: string
          gateway_eui: string
          id: string
          last_seen: string
          version: string
        }
        Insert: {
          created_at?: string
          details?: Json | null
          firmware_type: string
          first_seen: string
          gateway_eui: string
          id?: string
          last_seen: string
          version: string
        }
        Update: {
          created_at?: string
          details?: Json | null
          firmware_type?: string
          first_seen?: string
          gateway_eui?: string
          id?: string
          last_seen?: string
          version?: string
        }
        Relationships: []
      }
      firmware_versions: {
        Row: {
          allowed_gateways: Json | null
          checksum_sha256: string
          chunk_size: number | null
          created_at: string
          deployment_type: string | null
          description: string | null
          device_model: string
          filename: string
          id: string
          is_active: boolean | null
          max_version: string | null
          min_version: string | null
          original_filename: string
          release_notes: string | null
          size_bytes: number
          total_chunks: number
          type: string
          uploaded_at: string | null
          uploaded_by: string | null
          version: string
        }
        Insert: {
          allowed_gateways?: Json | null
          checksum_sha256: string
          chunk_size?: number | null
          created_at?: string
          deployment_type?: string | null
          description?: string | null
          device_model: string
          filename: string
          id?: string
          is_active?: boolean | null
          max_version?: string | null
          min_version?: string | null
          original_filename: string
          release_notes?: string | null
          size_bytes: number
          total_chunks: number
          type: string
          uploaded_at?: string | null
          uploaded_by?: string | null
          version: string
        }
        Update: {
          allowed_gateways?: Json | null
          checksum_sha256?: string
          chunk_size?: number | null
          created_at?: string
          deployment_type?: string | null
          description?: string | null
          device_model?: string
          filename?: string
          id?: string
          is_active?: boolean | null
          max_version?: string | null
          min_version?: string | null
          original_filename?: string
          release_notes?: string | null
          size_bytes?: number
          total_chunks?: number
          type?: string
          uploaded_at?: string | null
          uploaded_by?: string | null
          version?: string
        }
        Relationships: []
      }
      gateway_alerts: {
        Row: {
          alert_type: string
          created_at: string
          data: Json | null
          gateway_eui: string
          id: string
          message: string
          resolved_at: string | null
          severity: Database["public"]["Enums"]["alert_severity"]
          updated_at: string
        }
        Insert: {
          alert_type: string
          created_at?: string
          data?: Json | null
          gateway_eui: string
          id?: string
          message: string
          resolved_at?: string | null
          severity: Database["public"]["Enums"]["alert_severity"]
          updated_at?: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          data?: Json | null
          gateway_eui?: string
          id?: string
          message?: string
          resolved_at?: string | null
          severity?: Database["public"]["Enums"]["alert_severity"]
          updated_at?: string
        }
        Relationships: []
      }
      gateway_config_overrides: {
        Row: {
          config_key: string
          config_value: string | null
          created_at: string
          gateway_eui: string
          id: string
          updated_at: string
        }
        Insert: {
          config_key: string
          config_value?: string | null
          created_at?: string
          gateway_eui: string
          id?: string
          updated_at?: string
        }
        Update: {
          config_key?: string
          config_value?: string | null
          created_at?: string
          gateway_eui?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      gateway_desired_states: {
        Row: {
          created_at: string
          desired_app_version: string | null
          desired_boot_version: string | null
          desired_etag: string | null
          gateway_eui: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          desired_app_version?: string | null
          desired_boot_version?: string | null
          desired_etag?: string | null
          gateway_eui: string
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          desired_app_version?: string | null
          desired_boot_version?: string | null
          desired_etag?: string | null
          gateway_eui?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      gateway_devices: {
        Row: {
          boot_version: string | null
          created_at: string
          eui: string
          firmware: string | null
          iccid: string | null
          id: string
          imei: string | null
          imsi: string | null
          last_seen: string | null
          metadata: Json | null
          model: string | null
          updated_at: string
        }
        Insert: {
          boot_version?: string | null
          created_at?: string
          eui: string
          firmware?: string | null
          iccid?: string | null
          id?: string
          imei?: string | null
          imsi?: string | null
          last_seen?: string | null
          metadata?: Json | null
          model?: string | null
          updated_at?: string
        }
        Update: {
          boot_version?: string | null
          created_at?: string
          eui?: string
          firmware?: string | null
          iccid?: string | null
          id?: string
          imei?: string | null
          imsi?: string | null
          last_seen?: string | null
          metadata?: Json | null
          model?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      gateway_status: {
        Row: {
          apn: string | null
          band: number | null
          ci: string | null
          collected: boolean | null
          created_at: string
          gateway_eui: string
          id: string
          monitor: string | null
          operator: string | null
          rsrp: number | null
          rsrq: number | null
          snr: number | null
          sync_from: number | null
          sync_ticks: number | null
          sync_to: number | null
          tac: string | null
          telegram_count: number | null
          temperature: number | null
          time: number | null
          timestamp: string | null
          uploading_count: number | null
          vbat: number | null
        }
        Insert: {
          apn?: string | null
          band?: number | null
          ci?: string | null
          collected?: boolean | null
          created_at?: string
          gateway_eui: string
          id?: string
          monitor?: string | null
          operator?: string | null
          rsrp?: number | null
          rsrq?: number | null
          snr?: number | null
          sync_from?: number | null
          sync_ticks?: number | null
          sync_to?: number | null
          tac?: string | null
          telegram_count?: number | null
          temperature?: number | null
          time?: number | null
          timestamp?: string | null
          uploading_count?: number | null
          vbat?: number | null
        }
        Update: {
          apn?: string | null
          band?: number | null
          ci?: string | null
          collected?: boolean | null
          created_at?: string
          gateway_eui?: string
          id?: string
          monitor?: string | null
          operator?: string | null
          rsrp?: number | null
          rsrq?: number | null
          snr?: number | null
          sync_from?: number | null
          sync_ticks?: number | null
          sync_to?: number | null
          tac?: string | null
          telegram_count?: number | null
          temperature?: number | null
          time?: number | null
          timestamp?: string | null
          uploading_count?: number | null
          vbat?: number | null
        }
        Relationships: []
      }
      gateway_telegram_parser_errors: {
        Row: {
          created_at: string | null
          error: string
          gateway_eui: string
          id: string
          telegram: string
          telegram_length: string
        }
        Insert: {
          created_at?: string | null
          error: string
          gateway_eui: string
          id?: string
          telegram: string
          telegram_length: string
        }
        Update: {
          created_at?: string | null
          error?: string
          gateway_eui?: string
          id?: string
          telegram?: string
          telegram_length?: string
        }
        Relationships: [
          {
            foreignKeyName: "gateway_telegram_parser_errors_gateway_eui_fkey"
            columns: ["gateway_eui"]
            isOneToOne: false
            referencedRelation: "gateway_devices"
            referencedColumns: ["eui"]
          },
        ]
      }
      gateway_telegrams: {
        Row: {
          created_at: string | null
          gateway_eui: string
          id: string
          message_number: string
          telegram: string
        }
        Insert: {
          created_at?: string | null
          gateway_eui: string
          id?: string
          message_number: string
          telegram: string
        }
        Update: {
          created_at?: string | null
          gateway_eui?: string
          id?: string
          message_number?: string
          telegram?: string
        }
        Relationships: [
          {
            foreignKeyName: "gateway_telegrams_gateway_eui_fkey"
            columns: ["gateway_eui"]
            isOneToOne: false
            referencedRelation: "gateway_devices"
            referencedColumns: ["eui"]
          },
        ]
      }
      heating_bill_documents: {
        Row: {
          consumption_dependent: number | null
          created_at: string
          end_date: string | null
          id: string
          living_space_share: number | null
          local_id: string | null
          objekt_id: string | null
          start_date: string | null
          submited: boolean
          user_id: string | null
        }
        Insert: {
          consumption_dependent?: number | null
          created_at?: string
          end_date?: string | null
          id?: string
          living_space_share?: number | null
          local_id?: string | null
          objekt_id?: string | null
          start_date?: string | null
          submited?: boolean
          user_id?: string | null
        }
        Update: {
          consumption_dependent?: number | null
          created_at?: string
          end_date?: string | null
          id?: string
          living_space_share?: number | null
          local_id?: string | null
          objekt_id?: string | null
          start_date?: string | null
          submited?: boolean
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "heating_bill_documents_local_id_fkey"
            columns: ["local_id"]
            isOneToOne: false
            referencedRelation: "locals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "heating_bill_documents_objekt_id_fkey1"
            columns: ["objekt_id"]
            isOneToOne: false
            referencedRelation: "objekte"
            referencedColumns: ["id"]
          },
        ]
      }
      heating_invoices: {
        Row: {
          cost_type: string | null
          created_at: string
          direct_local_id: string[] | null
          document_name: string | null
          for_all_tenants: boolean | null
          heating_doc_id: string | null
          id: string
          invoice_date: string | null
          notes: string | null
          objekt_id: string
          purpose: string | null
          service_period: boolean | null
          total_amount: number | null
          user_id: string
        }
        Insert: {
          cost_type?: string | null
          created_at?: string
          direct_local_id?: string[] | null
          document_name?: string | null
          for_all_tenants?: boolean | null
          heating_doc_id?: string | null
          id?: string
          invoice_date?: string | null
          notes?: string | null
          objekt_id?: string
          purpose?: string | null
          service_period?: boolean | null
          total_amount?: number | null
          user_id?: string
        }
        Update: {
          cost_type?: string | null
          created_at?: string
          direct_local_id?: string[] | null
          document_name?: string | null
          for_all_tenants?: boolean | null
          heating_doc_id?: string | null
          id?: string
          invoice_date?: string | null
          notes?: string | null
          objekt_id?: string
          purpose?: string | null
          service_period?: boolean | null
          total_amount?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "heating_invoices_heating_doc_id_fkey"
            columns: ["heating_doc_id"]
            isOneToOne: false
            referencedRelation: "heating_bill_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "heating_invoices_objekt_id_fkey"
            columns: ["objekt_id"]
            isOneToOne: false
            referencedRelation: "objekte"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_documents: {
        Row: {
          cost_type: string | null
          created_at: string
          direct_local_id: string[] | null
          document_name: string | null
          for_all_tenants: boolean | null
          id: string
          invoice_date: string | null
          notes: string | null
          objekt_id: string
          operating_doc_id: string | null
          purpose: string | null
          service_period: boolean | null
          total_amount: number | null
          user_id: string
        }
        Insert: {
          cost_type?: string | null
          created_at?: string
          direct_local_id?: string[] | null
          document_name?: string | null
          for_all_tenants?: boolean | null
          id?: string
          invoice_date?: string | null
          notes?: string | null
          objekt_id?: string
          operating_doc_id?: string | null
          purpose?: string | null
          service_period?: boolean | null
          total_amount?: number | null
          user_id?: string
        }
        Update: {
          cost_type?: string | null
          created_at?: string
          direct_local_id?: string[] | null
          document_name?: string | null
          for_all_tenants?: boolean | null
          id?: string
          invoice_date?: string | null
          notes?: string | null
          objekt_id?: string
          operating_doc_id?: string | null
          purpose?: string | null
          service_period?: boolean | null
          total_amount?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "heating_bill_documents_objekt_id_fkey"
            columns: ["objekt_id"]
            isOneToOne: false
            referencedRelation: "objekte"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_documents_operating_doc_id_fkey"
            columns: ["operating_doc_id"]
            isOneToOne: false
            referencedRelation: "operating_cost_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          created_at: string | null
          email: string
          id: string
          source: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          source?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          source?: string | null
        }
        Relationships: []
      }
      local_meters: {
        Row: {
          created_at: string
          id: string
          local_id: string | null
          meter_note: string | null
          meter_number: string | null
          meter_type: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          local_id?: string | null
          meter_note?: string | null
          meter_number?: string | null
          meter_type?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          local_id?: string | null
          meter_note?: string | null
          meter_number?: string | null
          meter_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "local_meters_local_id_fkey"
            columns: ["local_id"]
            isOneToOne: false
            referencedRelation: "locals"
            referencedColumns: ["id"]
          },
        ]
      }
      locals: {
        Row: {
          apartment_type: string | null
          cellar_available: boolean | null
          created_at: string | null
          floor: string
          heating_area: number | null
          heating_systems: Json | null
          house_fee: number | null
          house_location: string | null
          id: string
          living_space: number
          meter_ids: string[] | null
          objekt_id: string
          outdoor: string | null
          outdoor_area: number | null
          residential_area: string | null
          rooms: number | null
          tags: Json | null
          usage_type: string
        }
        Insert: {
          apartment_type?: string | null
          cellar_available?: boolean | null
          created_at?: string | null
          floor: string
          heating_area?: number | null
          heating_systems?: Json | null
          house_fee?: number | null
          house_location?: string | null
          id?: string
          living_space: number
          meter_ids?: string[] | null
          objekt_id: string
          outdoor?: string | null
          outdoor_area?: number | null
          residential_area?: string | null
          rooms?: number | null
          tags?: Json | null
          usage_type: string
        }
        Update: {
          apartment_type?: string | null
          cellar_available?: boolean | null
          created_at?: string | null
          floor?: string
          heating_area?: number | null
          heating_systems?: Json | null
          house_fee?: number | null
          house_location?: string | null
          id?: string
          living_space?: number
          meter_ids?: string[] | null
          objekt_id?: string
          outdoor?: string | null
          outdoor_area?: number | null
          residential_area?: string | null
          rooms?: number | null
          tags?: Json | null
          usage_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "locals_objekt_id_objekte_id_fk"
            columns: ["objekt_id"]
            isOneToOne: false
            referencedRelation: "objekte"
            referencedColumns: ["id"]
          },
        ]
      }
      objekte: {
        Row: {
          administration_type: string
          agency_id: string | null
          build_year: number | null
          created_at: string | null
          has_elevator: boolean | null
          heating_systems: Json | null
          hot_water_preparation: string
          id: string
          image_url: string | null
          land_area: number | null
          living_area: number | null
          objekt_type: string
          street: string
          tags: Json | null
          usable_area: number | null
          user_id: string
          zip: string
        }
        Insert: {
          administration_type: string
          agency_id?: string | null
          build_year?: number | null
          created_at?: string | null
          has_elevator?: boolean | null
          heating_systems?: Json | null
          hot_water_preparation: string
          id?: string
          image_url?: string | null
          land_area?: number | null
          living_area?: number | null
          objekt_type: string
          street: string
          tags?: Json | null
          usable_area?: number | null
          user_id: string
          zip: string
        }
        Update: {
          administration_type?: string
          agency_id?: string | null
          build_year?: number | null
          created_at?: string | null
          has_elevator?: boolean | null
          heating_systems?: Json | null
          hot_water_preparation?: string
          id?: string
          image_url?: string | null
          land_area?: number | null
          living_area?: number | null
          objekt_type?: string
          street?: string
          tags?: Json | null
          usable_area?: number | null
          user_id?: string
          zip?: string
        }
        Relationships: [
          {
            foreignKeyName: "objekte_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      operating_cost_documents: {
        Row: {
          created_at: string
          end_date: string | null
          id: string
          objekt_id: string | null
          start_date: string | null
          submited: boolean
          user_id: string | null
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id?: string
          objekt_id?: string | null
          start_date?: string | null
          submited?: boolean
          user_id?: string | null
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: string
          objekt_id?: string | null
          start_date?: string | null
          submited?: boolean
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "operating_cost_documents_objekt_id_fkey"
            columns: ["objekt_id"]
            isOneToOne: false
            referencedRelation: "objekte"
            referencedColumns: ["id"]
          },
        ]
      }
      parsed_data: {
        Row: {
          access_number: number | null
          created_at: string | null
          date_only: string | null
          device_id: string
          device_type: string
          encryption: number | null
          frame_type: string | null
          id: string
          local_meter_id: string | null
          manufacturer: string
          parsed_data: Json
          status: string | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          access_number?: number | null
          created_at?: string | null
          date_only?: string | null
          device_id: string
          device_type: string
          encryption?: number | null
          frame_type?: string | null
          id?: string
          local_meter_id?: string | null
          manufacturer: string
          parsed_data: Json
          status?: string | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          access_number?: number | null
          created_at?: string | null
          date_only?: string | null
          device_id?: string
          device_type?: string
          encryption?: number | null
          frame_type?: string | null
          id?: string
          local_meter_id?: string | null
          manufacturer?: string
          parsed_data?: Json
          status?: string | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "parsed_data_local_meter_id_fkey"
            columns: ["local_meter_id"]
            isOneToOne: false
            referencedRelation: "local_meters"
            referencedColumns: ["id"]
          },
        ]
      }
      share_pins: {
        Row: {
          attempts: number | null
          created_at: string | null
          email: string
          expires_at: string
          id: string
          link_params: string
          pin_hash: string
          share_token: string
        }
        Insert: {
          attempts?: number | null
          created_at?: string | null
          email: string
          expires_at: string
          id?: string
          link_params: string
          pin_hash: string
          share_token: string
        }
        Update: {
          attempts?: number | null
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          link_params?: string
          pin_hash?: string
          share_token?: string
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          id: string
          registration_enabled: boolean
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          registration_enabled?: boolean
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          registration_enabled?: boolean
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      tenant_email_schedules: {
        Row: {
          created_at: string | null
          enabled: boolean | null
          frequency: string
          id: string
          last_sent_at: string | null
          next_send_at: string | null
          tenant_login_id: string
        }
        Insert: {
          created_at?: string | null
          enabled?: boolean | null
          frequency: string
          id?: string
          last_sent_at?: string | null
          next_send_at?: string | null
          tenant_login_id: string
        }
        Update: {
          created_at?: string | null
          enabled?: boolean | null
          frequency?: string
          id?: string
          last_sent_at?: string | null
          next_send_at?: string | null
          tenant_login_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_email_schedules_tenant_login_id_fkey"
            columns: ["tenant_login_id"]
            isOneToOne: false
            referencedRelation: "tenant_logins"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_logins: {
        Row: {
          contractor_id: string
          created_at: string | null
          email: string
          enabled: boolean | null
          id: string
          invite_expires_at: string | null
          invite_token: string | null
          last_login_at: string | null
          password_hash: string
          reset_expires_at: string | null
          reset_token: string | null
          time_frame_limit_days: number | null
        }
        Insert: {
          contractor_id: string
          created_at?: string | null
          email: string
          enabled?: boolean | null
          id?: string
          invite_expires_at?: string | null
          invite_token?: string | null
          last_login_at?: string | null
          password_hash: string
          reset_expires_at?: string | null
          reset_token?: string | null
          time_frame_limit_days?: number | null
        }
        Update: {
          contractor_id?: string
          created_at?: string | null
          email?: string
          enabled?: boolean | null
          id?: string
          invite_expires_at?: string | null
          invite_token?: string | null
          last_login_at?: string | null
          password_hash?: string
          reset_expires_at?: string | null
          reset_token?: string | null
          time_frame_limit_days?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tenant_logins_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: true
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
        ]
      }
      user_invitations: {
        Row: {
          agency_id: string | null
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string | null
          role: string
          status: string | null
          token: string
          updated_at: string
        }
        Insert: {
          agency_id?: string | null
          created_at?: string
          email: string
          expires_at: string
          id?: string
          invited_by?: string | null
          role?: string
          status?: string | null
          token: string
          updated_at?: string
        }
        Update: {
          agency_id?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          role?: string
          status?: string | null
          token?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_invitations_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          agency_id: string | null
          created_at: string | null
          email: string
          first_name: string
          has_seen_tour: boolean
          id: string
          last_name: string
          permission: string
        }
        Insert: {
          agency_id?: string | null
          created_at?: string | null
          email: string
          first_name: string
          has_seen_tour?: boolean
          id: string
          last_name: string
          permission?: string
        }
        Update: {
          agency_id?: string | null
          created_at?: string | null
          email?: string
          first_name?: string
          has_seen_tour?: boolean
          id?: string
          last_name?: string
          permission?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users_in_auth: {
        Row: {
          created_at: string
          email: string
          hashed_password: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          hashed_password: string
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          hashed_password?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      wmbus_telegrams: {
        Row: {
          created_at: string | null
          device_type: string | null
          gateway_eui: string
          id: string
          manufacturer_code: string | null
          meter_number: string | null
          mode: string | null
          processed: boolean | null
          rssi: number | null
          telegram_hex: string
          timestamp: number
          type: string | null
          version: string | null
        }
        Insert: {
          created_at?: string | null
          device_type?: string | null
          gateway_eui: string
          id?: string
          manufacturer_code?: string | null
          meter_number?: string | null
          mode?: string | null
          processed?: boolean | null
          rssi?: number | null
          telegram_hex: string
          timestamp: number
          type?: string | null
          version?: string | null
        }
        Update: {
          created_at?: string | null
          device_type?: string | null
          gateway_eui?: string
          id?: string
          manufacturer_code?: string | null
          meter_number?: string | null
          mode?: string | null
          processed?: boolean | null
          rssi?: number | null
          telegram_hex?: string
          timestamp?: number
          type?: string | null
          version?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_property: { Args: { p_property_id: string }; Returns: boolean }
      create_users_in_auth_table: { Args: never; Returns: undefined }
      get_dashboard_data: {
        Args: {
          p_device_types?: string[]
          p_end_date?: string
          p_local_meter_ids?: string[]
          p_start_date?: string
        }
        Returns: {
          access_number: number
          device_id: string
          device_type: string
          encryption: number
          frame_type: string
          id: string
          local_meter_id: string
          manufacturer: string
          parsed_data: Json
          status: string
          updated_at: string
          version: string
        }[]
      }
      is_admin: { Args: never; Returns: boolean }
      is_agency_admin: { Args: { p_agency_id: string }; Returns: boolean }
      is_super_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      alert_severity: "info" | "warning" | "error" | "critical"
      doc_cost_category_allocation_key:
        | "Wohneinheiten"
        | "Verbrauch"
        | "m2 Wohnfläche"
      doc_cost_category_document_type:
        | "heizkostenabrechnung"
        | "betriebskostenabrechnung"
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
      alert_severity: ["info", "warning", "error", "critical"],
      doc_cost_category_allocation_key: [
        "Wohneinheiten",
        "Verbrauch",
        "m2 Wohnfläche",
      ],
      doc_cost_category_document_type: [
        "heizkostenabrechnung",
        "betriebskostenabrechnung",
      ],
    },
  },
} as const
