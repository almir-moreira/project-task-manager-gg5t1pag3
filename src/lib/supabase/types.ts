// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.5'
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          code: string
          created_at: string | null
          id: string
          name: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          name?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      activities: {
        Row: {
          account_id: string | null
          activity_name: string
          approver_cpo_approved: boolean | null
          approver_cpo_comments: string | null
          approver_cpo_date: string | null
          approver_cpo_id: string | null
          approver_head_approved: boolean | null
          approver_head_comments: string | null
          approver_head_date: string | null
          approver_head_id: string | null
          approver_sg_approved: boolean | null
          approver_sg_comments: string | null
          approver_sg_date: string | null
          approver_sg_id: string | null
          assignee_id: string | null
          budget_line_id: string | null
          category_id: string | null
          comments: string | null
          cost_center_id: string | null
          cost_estimated: number | null
          created_at: string | null
          current_stage: string | null
          end_date: string | null
          event_approval_status: string | null
          event_can_change_time: boolean | null
          event_category: string | null
          event_change_time_desc: string | null
          event_comments: string | null
          event_date_status: string | null
          event_include_calendar: boolean | null
          event_links: string | null
          event_location: string | null
          event_location_status: string | null
          event_participants_count: number | null
          id: string
          in_budget: boolean | null
          in_workplan: boolean | null
          inv_commd: boolean | null
          inv_commd_role: string | null
          inv_comments_to_ems: string | null
          inv_cop_bod: boolean | null
          inv_cop_bod_role: string | null
          inv_ems: boolean | null
          inv_ems_comments: string | null
          inv_heads: boolean | null
          inv_heads_role: string | null
          inv_individuals_meet: string | null
          inv_kaiciid_delegation: string | null
          inv_orgs_desc: string | null
          inv_orgs_involved: string | null
          inv_participants_type: string | null
          inv_protocol: boolean | null
          inv_sg: boolean | null
          inv_staff: boolean | null
          inv_staff_involvement: string | null
          inv_travel_days: string | null
          nature_of_urgency: string | null
          priority: Database['public']['Enums']['task_priority'] | null
          programme_id: string | null
          project: string | null
          project_id: string | null
          project_owner_id: string | null
          purpose: string | null
          rbm_outcomes: string | null
          rbm_outputs: string | null
          reviewer_cpo_approved: boolean | null
          reviewer_cpo_comments: string | null
          reviewer_cpo_date: string | null
          reviewer_cpo_id: string | null
          reviewer_head_approved: boolean | null
          reviewer_head_comments: string | null
          reviewer_head_date: string | null
          reviewer_head_id: string | null
          reviewer_team_leader_approved: boolean | null
          reviewer_team_leader_comments: string | null
          reviewer_team_leader_date: string | null
          reviewer_team_leader_id: string | null
          sg_role: string | null
          sg_speaking_notes: string | null
          short_description: string | null
          stage_started_at: string | null
          start_date: string | null
          status: Database['public']['Enums']['task_status'] | null
          sub_task_id: string | null
          task_number: string | null
          type_id: string | null
          updated_at: string | null
          urgency_of_approval: string | null
          wf_comms: boolean | null
          wf_comms_reviewer_id: string | null
          wf_cpo_approver_required: boolean | null
          wf_cpo_reviewer_required: boolean | null
          wf_ems: boolean | null
          wf_ems_reviewer_id: string | null
          wf_eosg: boolean | null
          wf_eosg_reviewer_id: string | null
          wf_gob: boolean | null
          wf_gob_reviewer_id: string | null
          wf_head_approver_required: boolean | null
          wf_head_reviewer_required: boolean | null
          wf_legal: boolean | null
          wf_legal_reviewer_id: string | null
          wf_mne: boolean | null
          wf_mne_reviewer_id: string | null
          wf_ops: boolean | null
          wf_ops_reviewer_id: string | null
          wf_partnerships: boolean | null
          wf_partnerships_reviewer_id: string | null
          wf_procurement: boolean | null
          wf_procurement_reviewer_id: string | null
          wf_protocol: boolean | null
          wf_protocol_reviewer_id: string | null
          wf_relex: boolean | null
          wf_relex_reviewer_id: string | null
          wf_sg_approver_required: boolean | null
          wf_social_media: boolean | null
          wf_social_media_reviewer_id: string | null
          wf_team_leader_required: boolean | null
          wf_technology: boolean | null
          wf_technology_reviewer_id: string | null
          workorder_id: string | null
        }
        Insert: {
          account_id?: string | null
          activity_name: string
          approver_cpo_approved?: boolean | null
          approver_cpo_comments?: string | null
          approver_cpo_date?: string | null
          approver_cpo_id?: string | null
          approver_head_approved?: boolean | null
          approver_head_comments?: string | null
          approver_head_date?: string | null
          approver_head_id?: string | null
          approver_sg_approved?: boolean | null
          approver_sg_comments?: string | null
          approver_sg_date?: string | null
          approver_sg_id?: string | null
          assignee_id?: string | null
          budget_line_id?: string | null
          category_id?: string | null
          comments?: string | null
          cost_center_id?: string | null
          cost_estimated?: number | null
          created_at?: string | null
          current_stage?: string | null
          end_date?: string | null
          event_approval_status?: string | null
          event_can_change_time?: boolean | null
          event_category?: string | null
          event_change_time_desc?: string | null
          event_comments?: string | null
          event_date_status?: string | null
          event_include_calendar?: boolean | null
          event_links?: string | null
          event_location?: string | null
          event_location_status?: string | null
          event_participants_count?: number | null
          id?: string
          in_budget?: boolean | null
          in_workplan?: boolean | null
          inv_commd?: boolean | null
          inv_commd_role?: string | null
          inv_comments_to_ems?: string | null
          inv_cop_bod?: boolean | null
          inv_cop_bod_role?: string | null
          inv_ems?: boolean | null
          inv_ems_comments?: string | null
          inv_heads?: boolean | null
          inv_heads_role?: string | null
          inv_individuals_meet?: string | null
          inv_kaiciid_delegation?: string | null
          inv_orgs_desc?: string | null
          inv_orgs_involved?: string | null
          inv_participants_type?: string | null
          inv_protocol?: boolean | null
          inv_sg?: boolean | null
          inv_staff?: boolean | null
          inv_staff_involvement?: string | null
          inv_travel_days?: string | null
          nature_of_urgency?: string | null
          priority?: Database['public']['Enums']['task_priority'] | null
          programme_id?: string | null
          project?: string | null
          project_id?: string | null
          project_owner_id?: string | null
          purpose?: string | null
          rbm_outcomes?: string | null
          rbm_outputs?: string | null
          reviewer_cpo_approved?: boolean | null
          reviewer_cpo_comments?: string | null
          reviewer_cpo_date?: string | null
          reviewer_cpo_id?: string | null
          reviewer_head_approved?: boolean | null
          reviewer_head_comments?: string | null
          reviewer_head_date?: string | null
          reviewer_head_id?: string | null
          reviewer_team_leader_approved?: boolean | null
          reviewer_team_leader_comments?: string | null
          reviewer_team_leader_date?: string | null
          reviewer_team_leader_id?: string | null
          sg_role?: string | null
          sg_speaking_notes?: string | null
          short_description?: string | null
          stage_started_at?: string | null
          start_date?: string | null
          status?: Database['public']['Enums']['task_status'] | null
          sub_task_id?: string | null
          task_number?: string | null
          type_id?: string | null
          updated_at?: string | null
          urgency_of_approval?: string | null
          wf_comms?: boolean | null
          wf_comms_reviewer_id?: string | null
          wf_cpo_approver_required?: boolean | null
          wf_cpo_reviewer_required?: boolean | null
          wf_ems?: boolean | null
          wf_ems_reviewer_id?: string | null
          wf_eosg?: boolean | null
          wf_eosg_reviewer_id?: string | null
          wf_gob?: boolean | null
          wf_gob_reviewer_id?: string | null
          wf_head_approver_required?: boolean | null
          wf_head_reviewer_required?: boolean | null
          wf_legal?: boolean | null
          wf_legal_reviewer_id?: string | null
          wf_mne?: boolean | null
          wf_mne_reviewer_id?: string | null
          wf_ops?: boolean | null
          wf_ops_reviewer_id?: string | null
          wf_partnerships?: boolean | null
          wf_partnerships_reviewer_id?: string | null
          wf_procurement?: boolean | null
          wf_procurement_reviewer_id?: string | null
          wf_protocol?: boolean | null
          wf_protocol_reviewer_id?: string | null
          wf_relex?: boolean | null
          wf_relex_reviewer_id?: string | null
          wf_sg_approver_required?: boolean | null
          wf_social_media?: boolean | null
          wf_social_media_reviewer_id?: string | null
          wf_team_leader_required?: boolean | null
          wf_technology?: boolean | null
          wf_technology_reviewer_id?: string | null
          workorder_id?: string | null
        }
        Update: {
          account_id?: string | null
          activity_name?: string
          approver_cpo_approved?: boolean | null
          approver_cpo_comments?: string | null
          approver_cpo_date?: string | null
          approver_cpo_id?: string | null
          approver_head_approved?: boolean | null
          approver_head_comments?: string | null
          approver_head_date?: string | null
          approver_head_id?: string | null
          approver_sg_approved?: boolean | null
          approver_sg_comments?: string | null
          approver_sg_date?: string | null
          approver_sg_id?: string | null
          assignee_id?: string | null
          budget_line_id?: string | null
          category_id?: string | null
          comments?: string | null
          cost_center_id?: string | null
          cost_estimated?: number | null
          created_at?: string | null
          current_stage?: string | null
          end_date?: string | null
          event_approval_status?: string | null
          event_can_change_time?: boolean | null
          event_category?: string | null
          event_change_time_desc?: string | null
          event_comments?: string | null
          event_date_status?: string | null
          event_include_calendar?: boolean | null
          event_links?: string | null
          event_location?: string | null
          event_location_status?: string | null
          event_participants_count?: number | null
          id?: string
          in_budget?: boolean | null
          in_workplan?: boolean | null
          inv_commd?: boolean | null
          inv_commd_role?: string | null
          inv_comments_to_ems?: string | null
          inv_cop_bod?: boolean | null
          inv_cop_bod_role?: string | null
          inv_ems?: boolean | null
          inv_ems_comments?: string | null
          inv_heads?: boolean | null
          inv_heads_role?: string | null
          inv_individuals_meet?: string | null
          inv_kaiciid_delegation?: string | null
          inv_orgs_desc?: string | null
          inv_orgs_involved?: string | null
          inv_participants_type?: string | null
          inv_protocol?: boolean | null
          inv_sg?: boolean | null
          inv_staff?: boolean | null
          inv_staff_involvement?: string | null
          inv_travel_days?: string | null
          nature_of_urgency?: string | null
          priority?: Database['public']['Enums']['task_priority'] | null
          programme_id?: string | null
          project?: string | null
          project_id?: string | null
          project_owner_id?: string | null
          purpose?: string | null
          rbm_outcomes?: string | null
          rbm_outputs?: string | null
          reviewer_cpo_approved?: boolean | null
          reviewer_cpo_comments?: string | null
          reviewer_cpo_date?: string | null
          reviewer_cpo_id?: string | null
          reviewer_head_approved?: boolean | null
          reviewer_head_comments?: string | null
          reviewer_head_date?: string | null
          reviewer_head_id?: string | null
          reviewer_team_leader_approved?: boolean | null
          reviewer_team_leader_comments?: string | null
          reviewer_team_leader_date?: string | null
          reviewer_team_leader_id?: string | null
          sg_role?: string | null
          sg_speaking_notes?: string | null
          short_description?: string | null
          stage_started_at?: string | null
          start_date?: string | null
          status?: Database['public']['Enums']['task_status'] | null
          sub_task_id?: string | null
          task_number?: string | null
          type_id?: string | null
          updated_at?: string | null
          urgency_of_approval?: string | null
          wf_comms?: boolean | null
          wf_comms_reviewer_id?: string | null
          wf_cpo_approver_required?: boolean | null
          wf_cpo_reviewer_required?: boolean | null
          wf_ems?: boolean | null
          wf_ems_reviewer_id?: string | null
          wf_eosg?: boolean | null
          wf_eosg_reviewer_id?: string | null
          wf_gob?: boolean | null
          wf_gob_reviewer_id?: string | null
          wf_head_approver_required?: boolean | null
          wf_head_reviewer_required?: boolean | null
          wf_legal?: boolean | null
          wf_legal_reviewer_id?: string | null
          wf_mne?: boolean | null
          wf_mne_reviewer_id?: string | null
          wf_ops?: boolean | null
          wf_ops_reviewer_id?: string | null
          wf_partnerships?: boolean | null
          wf_partnerships_reviewer_id?: string | null
          wf_procurement?: boolean | null
          wf_procurement_reviewer_id?: string | null
          wf_protocol?: boolean | null
          wf_protocol_reviewer_id?: string | null
          wf_relex?: boolean | null
          wf_relex_reviewer_id?: string | null
          wf_sg_approver_required?: boolean | null
          wf_social_media?: boolean | null
          wf_social_media_reviewer_id?: string | null
          wf_team_leader_required?: boolean | null
          wf_technology?: boolean | null
          wf_technology_reviewer_id?: string | null
          workorder_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'activities_account_id_fkey'
            columns: ['account_id']
            isOneToOne: false
            referencedRelation: 'accounts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activities_approver_cpo_id_fkey'
            columns: ['approver_cpo_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activities_approver_head_id_fkey'
            columns: ['approver_head_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activities_approver_sg_id_fkey'
            columns: ['approver_sg_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activities_assignee_id_fkey'
            columns: ['assignee_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activities_budget_line_id_fkey'
            columns: ['budget_line_id']
            isOneToOne: false
            referencedRelation: 'budget_lines'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activities_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activities_cost_center_id_fkey'
            columns: ['cost_center_id']
            isOneToOne: false
            referencedRelation: 'cost_centers'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activities_programme_id_fkey'
            columns: ['programme_id']
            isOneToOne: false
            referencedRelation: 'programmes'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activities_project_id_fkey'
            columns: ['project_id']
            isOneToOne: false
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activities_project_owner_id_fkey'
            columns: ['project_owner_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activities_reviewer_cpo_id_fkey'
            columns: ['reviewer_cpo_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activities_reviewer_head_id_fkey'
            columns: ['reviewer_head_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activities_reviewer_team_leader_id_fkey'
            columns: ['reviewer_team_leader_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activities_sub_task_id_fkey'
            columns: ['sub_task_id']
            isOneToOne: false
            referencedRelation: 'activities'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activities_sub_task_id_fkey'
            columns: ['sub_task_id']
            isOneToOne: false
            referencedRelation: 'calendar_report_view'
            referencedColumns: ['activity_id']
          },
          {
            foreignKeyName: 'activities_sub_task_id_fkey'
            columns: ['sub_task_id']
            isOneToOne: false
            referencedRelation: 'calendar_report_view'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activities_type_id_fkey'
            columns: ['type_id']
            isOneToOne: false
            referencedRelation: 'task_types'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activities_wf_comms_reviewer_id_fkey'
            columns: ['wf_comms_reviewer_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activities_wf_ems_reviewer_id_fkey'
            columns: ['wf_ems_reviewer_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activities_wf_eosg_reviewer_id_fkey'
            columns: ['wf_eosg_reviewer_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activities_wf_gob_reviewer_id_fkey'
            columns: ['wf_gob_reviewer_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activities_wf_legal_reviewer_id_fkey'
            columns: ['wf_legal_reviewer_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activities_wf_mne_reviewer_id_fkey'
            columns: ['wf_mne_reviewer_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activities_wf_ops_reviewer_id_fkey'
            columns: ['wf_ops_reviewer_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activities_wf_partnerships_reviewer_id_fkey'
            columns: ['wf_partnerships_reviewer_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activities_wf_procurement_reviewer_id_fkey'
            columns: ['wf_procurement_reviewer_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activities_wf_protocol_reviewer_id_fkey'
            columns: ['wf_protocol_reviewer_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activities_wf_relex_reviewer_id_fkey'
            columns: ['wf_relex_reviewer_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activities_wf_social_media_reviewer_id_fkey'
            columns: ['wf_social_media_reviewer_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activities_wf_technology_reviewer_id_fkey'
            columns: ['wf_technology_reviewer_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activities_workorder_id_fkey'
            columns: ['workorder_id']
            isOneToOne: false
            referencedRelation: 'workorders'
            referencedColumns: ['id']
          },
        ]
      }
      activity_attachments: {
        Row: {
          activity_id: string
          content_type: string | null
          created_at: string
          description: string | null
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          uploaded_by: string | null
        }
        Insert: {
          activity_id: string
          content_type?: string | null
          created_at?: string
          description?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          uploaded_by?: string | null
        }
        Update: {
          activity_id?: string
          content_type?: string | null
          created_at?: string
          description?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'activity_attachments_activity_id_fkey'
            columns: ['activity_id']
            isOneToOne: false
            referencedRelation: 'activities'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activity_attachments_activity_id_fkey'
            columns: ['activity_id']
            isOneToOne: false
            referencedRelation: 'calendar_report_view'
            referencedColumns: ['activity_id']
          },
          {
            foreignKeyName: 'activity_attachments_activity_id_fkey'
            columns: ['activity_id']
            isOneToOne: false
            referencedRelation: 'calendar_report_view'
            referencedColumns: ['id']
          },
        ]
      }
      activity_budget_lines: {
        Row: {
          account_id: string | null
          activity_id: string
          amount: number | null
          budget_line_id: string | null
          cost_center_id: string | null
          created_at: string | null
          id: string
          workorder_id: string | null
        }
        Insert: {
          account_id?: string | null
          activity_id: string
          amount?: number | null
          budget_line_id?: string | null
          cost_center_id?: string | null
          created_at?: string | null
          id?: string
          workorder_id?: string | null
        }
        Update: {
          account_id?: string | null
          activity_id?: string
          amount?: number | null
          budget_line_id?: string | null
          cost_center_id?: string | null
          created_at?: string | null
          id?: string
          workorder_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'activity_budget_lines_account_id_fkey'
            columns: ['account_id']
            isOneToOne: false
            referencedRelation: 'accounts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activity_budget_lines_activity_id_fkey'
            columns: ['activity_id']
            isOneToOne: false
            referencedRelation: 'activities'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activity_budget_lines_activity_id_fkey'
            columns: ['activity_id']
            isOneToOne: false
            referencedRelation: 'calendar_report_view'
            referencedColumns: ['activity_id']
          },
          {
            foreignKeyName: 'activity_budget_lines_activity_id_fkey'
            columns: ['activity_id']
            isOneToOne: false
            referencedRelation: 'calendar_report_view'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activity_budget_lines_budget_line_id_fkey'
            columns: ['budget_line_id']
            isOneToOne: false
            referencedRelation: 'budget_lines'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activity_budget_lines_cost_center_id_fkey'
            columns: ['cost_center_id']
            isOneToOne: false
            referencedRelation: 'cost_centers'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activity_budget_lines_workorder_id_fkey'
            columns: ['workorder_id']
            isOneToOne: false
            referencedRelation: 'workorders'
            referencedColumns: ['id']
          },
        ]
      }
      activity_comments: {
        Row: {
          activity_id: string
          author_id: string
          content: string
          created_at: string
          id: string
          recipient_id: string | null
        }
        Insert: {
          activity_id: string
          author_id?: string
          content: string
          created_at?: string
          id?: string
          recipient_id?: string | null
        }
        Update: {
          activity_id?: string
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          recipient_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'activity_comments_activity_id_fkey'
            columns: ['activity_id']
            isOneToOne: false
            referencedRelation: 'activities'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activity_comments_activity_id_fkey'
            columns: ['activity_id']
            isOneToOne: false
            referencedRelation: 'calendar_report_view'
            referencedColumns: ['activity_id']
          },
          {
            foreignKeyName: 'activity_comments_activity_id_fkey'
            columns: ['activity_id']
            isOneToOne: false
            referencedRelation: 'calendar_report_view'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activity_comments_author_id_fkey'
            columns: ['author_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activity_comments_recipient_id_fkey'
            columns: ['recipient_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      activity_workflows: {
        Row: {
          activity_id: string
          comments: string | null
          completed_at: string | null
          completed_date: string | null
          created_at: string | null
          due_date: string | null
          execution_mode: string | null
          id: string
          requirement_level: string | null
          responsible_user_id: string | null
          reviewer_id: string | null
          sequence_order: number | null
          status: string | null
          workflow_id: string
        }
        Insert: {
          activity_id: string
          comments?: string | null
          completed_at?: string | null
          completed_date?: string | null
          created_at?: string | null
          due_date?: string | null
          execution_mode?: string | null
          id?: string
          requirement_level?: string | null
          responsible_user_id?: string | null
          reviewer_id?: string | null
          sequence_order?: number | null
          status?: string | null
          workflow_id: string
        }
        Update: {
          activity_id?: string
          comments?: string | null
          completed_at?: string | null
          completed_date?: string | null
          created_at?: string | null
          due_date?: string | null
          execution_mode?: string | null
          id?: string
          requirement_level?: string | null
          responsible_user_id?: string | null
          reviewer_id?: string | null
          sequence_order?: number | null
          status?: string | null
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'activity_workflows_activity_id_fkey'
            columns: ['activity_id']
            isOneToOne: false
            referencedRelation: 'activities'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activity_workflows_activity_id_fkey'
            columns: ['activity_id']
            isOneToOne: false
            referencedRelation: 'calendar_report_view'
            referencedColumns: ['activity_id']
          },
          {
            foreignKeyName: 'activity_workflows_activity_id_fkey'
            columns: ['activity_id']
            isOneToOne: false
            referencedRelation: 'calendar_report_view'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activity_workflows_responsible_user_id_fkey'
            columns: ['responsible_user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activity_workflows_reviewer_id_fkey'
            columns: ['reviewer_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activity_workflows_workflow_id_fkey'
            columns: ['workflow_id']
            isOneToOne: false
            referencedRelation: 'workflows'
            referencedColumns: ['id']
          },
        ]
      }
      attachments: {
        Row: {
          description: string | null
          file_size: number | null
          file_type: string | null
          id: string
          original_file_name: string
          public_or_signed_url: string | null
          server_file_path: string
          task_id: string
          uploaded_at: string
          uploaded_by: string | null
        }
        Insert: {
          description?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          original_file_name: string
          public_or_signed_url?: string | null
          server_file_path: string
          task_id: string
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Update: {
          description?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          original_file_name?: string
          public_or_signed_url?: string | null
          server_file_path?: string
          task_id?: string
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'attachments_task_id_fkey'
            columns: ['task_id']
            isOneToOne: false
            referencedRelation: 'activities'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'attachments_task_id_fkey'
            columns: ['task_id']
            isOneToOne: false
            referencedRelation: 'calendar_report_view'
            referencedColumns: ['activity_id']
          },
          {
            foreignKeyName: 'attachments_task_id_fkey'
            columns: ['task_id']
            isOneToOne: false
            referencedRelation: 'calendar_report_view'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'attachments_uploaded_by_fkey'
            columns: ['uploaded_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      budget_lines: {
        Row: {
          code: string
          created_at: string | null
          id: string
          name: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          name?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      cost_centers: {
        Row: {
          code: string
          created_at: string | null
          id: string
          name: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          name?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      organizations: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          department: string | null
          email: string | null
          id: string
          name: string | null
          programme_id: string | null
          role: Database['public']['Enums']['user_role'] | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          email?: string | null
          id: string
          name?: string | null
          programme_id?: string | null
          role?: Database['public']['Enums']['user_role'] | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          email?: string | null
          id?: string
          name?: string | null
          programme_id?: string | null
          role?: Database['public']['Enums']['user_role'] | null
        }
        Relationships: [
          {
            foreignKeyName: 'profiles_programme_id_fkey'
            columns: ['programme_id']
            isOneToOne: false
            referencedRelation: 'programmes'
            referencedColumns: ['id']
          },
        ]
      }
      programmes: {
        Row: {
          allotment_manager_id: string | null
          certifying_officer_id: string | null
          cost_center_id: string | null
          created_at: string | null
          id: string
          name: string
          organization_id: string | null
        }
        Insert: {
          allotment_manager_id?: string | null
          certifying_officer_id?: string | null
          cost_center_id?: string | null
          created_at?: string | null
          id?: string
          name: string
          organization_id?: string | null
        }
        Update: {
          allotment_manager_id?: string | null
          certifying_officer_id?: string | null
          cost_center_id?: string | null
          created_at?: string | null
          id?: string
          name?: string
          organization_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'programmes_allotment_manager_id_fkey'
            columns: ['allotment_manager_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'programmes_certifying_officer_id_fkey'
            columns: ['certifying_officer_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'programmes_cost_center_id_fkey'
            columns: ['cost_center_id']
            isOneToOne: false
            referencedRelation: 'cost_centers'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'programmes_organization_id_fkey'
            columns: ['organization_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
        ]
      }
      projects: {
        Row: {
          created_at: string | null
          id: string
          name: string
          programme_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          programme_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          programme_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'projects_programme_id_fkey'
            columns: ['programme_id']
            isOneToOne: false
            referencedRelation: 'programmes'
            referencedColumns: ['id']
          },
        ]
      }
      statuses: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      task_types: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      travel_authorizations: {
        Row: {
          created_at: string | null
          current_stage: string | null
          destination: string | null
          id: string
          linked_activity_id: string | null
          mission_title_or_event_name: string | null
          pm_verifier_id: string | null
          programme_id: string | null
          requester_id: string | null
          status: string | null
          travel_authorization_number: string | null
          travel_end_date: string | null
          travel_start_date: string | null
          travel_type: string | null
          traveler_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_stage?: string | null
          destination?: string | null
          id?: string
          linked_activity_id?: string | null
          mission_title_or_event_name?: string | null
          pm_verifier_id?: string | null
          programme_id?: string | null
          requester_id?: string | null
          status?: string | null
          travel_authorization_number?: string | null
          travel_end_date?: string | null
          travel_start_date?: string | null
          travel_type?: string | null
          traveler_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_stage?: string | null
          destination?: string | null
          id?: string
          linked_activity_id?: string | null
          mission_title_or_event_name?: string | null
          pm_verifier_id?: string | null
          programme_id?: string | null
          requester_id?: string | null
          status?: string | null
          travel_authorization_number?: string | null
          travel_end_date?: string | null
          travel_start_date?: string | null
          travel_type?: string | null
          traveler_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'travel_authorizations_linked_activity_id_fkey'
            columns: ['linked_activity_id']
            isOneToOne: false
            referencedRelation: 'activities'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'travel_authorizations_linked_activity_id_fkey'
            columns: ['linked_activity_id']
            isOneToOne: false
            referencedRelation: 'calendar_report_view'
            referencedColumns: ['activity_id']
          },
          {
            foreignKeyName: 'travel_authorizations_linked_activity_id_fkey'
            columns: ['linked_activity_id']
            isOneToOne: false
            referencedRelation: 'calendar_report_view'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'travel_authorizations_pm_verifier_id_fkey'
            columns: ['pm_verifier_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'travel_authorizations_programme_id_fkey'
            columns: ['programme_id']
            isOneToOne: false
            referencedRelation: 'programmes'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'travel_authorizations_requester_id_fkey'
            columns: ['requester_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'travel_authorizations_traveler_id_fkey'
            columns: ['traveler_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      units: {
        Row: {
          created_at: string | null
          id: string
          name: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      user_units: {
        Row: {
          created_at: string | null
          id: string
          unit_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          unit_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          unit_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'user_units_unit_id_fkey'
            columns: ['unit_id']
            isOneToOne: false
            referencedRelation: 'units'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'user_units_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      workflows: {
        Row: {
          activity_id: string | null
          category: string | null
          created_at: string
          id: string
          role: string
          stage: number
          step: number | null
        }
        Insert: {
          activity_id?: string | null
          category?: string | null
          created_at?: string
          id?: string
          role: string
          stage: number
          step?: number | null
        }
        Update: {
          activity_id?: string | null
          category?: string | null
          created_at?: string
          id?: string
          role?: string
          stage?: number
          step?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'workflows_activity_id_fkey'
            columns: ['activity_id']
            isOneToOne: false
            referencedRelation: 'activities'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'workflows_activity_id_fkey'
            columns: ['activity_id']
            isOneToOne: false
            referencedRelation: 'calendar_report_view'
            referencedColumns: ['activity_id']
          },
          {
            foreignKeyName: 'workflows_activity_id_fkey'
            columns: ['activity_id']
            isOneToOne: false
            referencedRelation: 'calendar_report_view'
            referencedColumns: ['id']
          },
        ]
      }
      workorders: {
        Row: {
          code: string
          created_at: string | null
          id: string
          name: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          name?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          name?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      calendar_report_view: {
        Row: {
          activity_id: string | null
          activity_name: string | null
          approval_status: string | null
          category_id: string | null
          category_name: string | null
          cost_center_code: string | null
          cost_center_id: string | null
          cost_center_name: string | null
          created_at: string | null
          current_stage: string | null
          date_location_status: string | null
          date_status: string | null
          ems_protocol_involvement: string | null
          end_date: string | null
          event_approval_status: string | null
          event_category: string | null
          event_date_status: string | null
          event_include_calendar: boolean | null
          event_location: string | null
          event_location_status: string | null
          event_name: string | null
          event_participants_count: number | null
          id: string | null
          inv_ems: boolean | null
          inv_protocol: boolean | null
          location: string | null
          location_status: string | null
          month_label: string | null
          month_start: string | null
          pax: number | null
          priority: Database['public']['Enums']['task_priority'] | null
          project_owner_id: string | null
          project_owner_name: string | null
          short_description: string | null
          sort_date: string | null
          start_date: string | null
          status: Database['public']['Enums']['task_status'] | null
          task_number: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'activities_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activities_cost_center_id_fkey'
            columns: ['cost_center_id']
            isOneToOne: false
            referencedRelation: 'cost_centers'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activities_project_owner_id_fkey'
            columns: ['project_owner_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      task_priority: 'Low' | 'Medium' | 'High' | 'Urgent'
      task_status:
        | 'To Do'
        | 'In Progress'
        | 'On Hold'
        | 'SPM Clearance'
        | 'Head Clearance'
        | 'Head Approval'
        | 'CPO Approval'
        | 'SG Approval'
        | 'Rejected'
        | 'Done'
      user_role:
        | 'Collaborator'
        | 'Officer'
        | 'Project Manager'
        | 'Head'
        | 'Manager'
        | 'Secretary General'
        | 'Team Assistant'
        | 'Administrator'
        | 'Admin'
        | 'Programme Manager'
        | 'SPM'
        | 'PROD Head'
        | 'CPO'
        | 'PROD Team Assistant'
        | 'Feedback Unit User'
        | 'EOSG Assistant'
        | 'Read Only'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      task_priority: ['Low', 'Medium', 'High', 'Urgent'],
      task_status: [
        'To Do',
        'In Progress',
        'On Hold',
        'SPM Clearance',
        'Head Clearance',
        'Head Approval',
        'CPO Approval',
        'SG Approval',
        'Rejected',
        'Done',
      ],
      user_role: [
        'Collaborator',
        'Officer',
        'Project Manager',
        'Head',
        'Manager',
        'Secretary General',
        'Team Assistant',
        'Administrator',
        'Admin',
        'Programme Manager',
        'SPM',
        'PROD Head',
        'CPO',
        'PROD Team Assistant',
        'Feedback Unit User',
        'EOSG Assistant',
        'Read Only',
      ],
    },
  },
} as const
