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
          assignee_id: string | null
          budget_line_id: string | null
          comments: string | null
          cost_center_id: string | null
          cost_estimated: number | null
          created_at: string | null
          end_date: string | null
          event_can_change_time: boolean | null
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
          priority: Database['public']['Enums']['task_priority'] | null
          programme_id: string | null
          project: string | null
          project_owner_id: string | null
          purpose: string | null
          rbm_outcomes: string | null
          rbm_outputs: string | null
          sg_role: string | null
          sg_speaking_notes: string | null
          short_description: string | null
          start_date: string | null
          status: Database['public']['Enums']['task_status'] | null
          sub_task_id: string | null
          task_number: string | null
          type_id: string | null
          workorder_id: string | null
        }
        Insert: {
          account_id?: string | null
          activity_name: string
          assignee_id?: string | null
          budget_line_id?: string | null
          comments?: string | null
          cost_center_id?: string | null
          cost_estimated?: number | null
          created_at?: string | null
          end_date?: string | null
          event_can_change_time?: boolean | null
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
          priority?: Database['public']['Enums']['task_priority'] | null
          programme_id?: string | null
          project?: string | null
          project_owner_id?: string | null
          purpose?: string | null
          rbm_outcomes?: string | null
          rbm_outputs?: string | null
          sg_role?: string | null
          sg_speaking_notes?: string | null
          short_description?: string | null
          start_date?: string | null
          status?: Database['public']['Enums']['task_status'] | null
          sub_task_id?: string | null
          task_number?: string | null
          type_id?: string | null
          workorder_id?: string | null
        }
        Update: {
          account_id?: string | null
          activity_name?: string
          assignee_id?: string | null
          budget_line_id?: string | null
          comments?: string | null
          cost_center_id?: string | null
          cost_estimated?: number | null
          created_at?: string | null
          end_date?: string | null
          event_can_change_time?: boolean | null
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
          priority?: Database['public']['Enums']['task_priority'] | null
          programme_id?: string | null
          project?: string | null
          project_owner_id?: string | null
          purpose?: string | null
          rbm_outcomes?: string | null
          rbm_outputs?: string | null
          sg_role?: string | null
          sg_speaking_notes?: string | null
          short_description?: string | null
          start_date?: string | null
          status?: Database['public']['Enums']['task_status'] | null
          sub_task_id?: string | null
          task_number?: string | null
          type_id?: string | null
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
            foreignKeyName: 'activities_project_owner_id_fkey'
            columns: ['project_owner_id']
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
            foreignKeyName: 'activities_type_id_fkey'
            columns: ['type_id']
            isOneToOne: false
            referencedRelation: 'task_types'
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
          email: string | null
          id: string
          name: string | null
          programme_id: string | null
          role: Database['public']['Enums']['user_role'] | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          name?: string | null
          programme_id?: string | null
          role?: Database['public']['Enums']['user_role'] | null
        }
        Update: {
          created_at?: string | null
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
          created_at: string | null
          id: string
          name: string
          organization_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          organization_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          organization_id?: string | null
        }
        Relationships: [
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
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
      ],
    },
  },
} as const

// ====== DATABASE EXTENDED CONTEXT (auto-generated) ======
// This section contains actual PostgreSQL column types, constraints, RLS policies,
// functions, triggers, indexes and materialized views not present in the type definitions above.
// IMPORTANT: The TypeScript types above map UUID, TEXT, VARCHAR all to "string".
// Use the COLUMN TYPES section below to know the real PostgreSQL type for each column.
// Always use the correct PostgreSQL type when writing SQL migrations.

// --- COLUMN TYPES (actual PostgreSQL types) ---
// Use this to know the real database type when writing migrations.
// "string" in TypeScript types above may be uuid, text, varchar, timestamptz, etc.
// Table: accounts
//   id: uuid (not null, default: gen_random_uuid())
//   code: text (not null)
//   name: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: activities
//   id: uuid (not null, default: gen_random_uuid())
//   task_number: text (nullable)
//   programme_id: uuid (nullable)
//   project: text (nullable)
//   project_owner_id: uuid (nullable)
//   sub_task_id: uuid (nullable)
//   type_id: uuid (nullable)
//   priority: task_priority (nullable, default: 'Medium'::task_priority)
//   status: task_status (nullable, default: 'To Do'::task_status)
//   purpose: text (nullable)
//   activity_name: text (not null)
//   short_description: text (nullable)
//   start_date: date (nullable)
//   end_date: date (nullable)
//   assignee_id: uuid (nullable)
//   cost_center_id: uuid (nullable)
//   budget_line_id: uuid (nullable)
//   workorder_id: uuid (nullable)
//   account_id: uuid (nullable)
//   cost_estimated: numeric (nullable)
//   in_budget: boolean (nullable, default: false)
//   comments: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   event_location: text (nullable)
//   event_participants_count: integer (nullable)
//   event_date_status: text (nullable)
//   event_location_status: text (nullable)
//   event_include_calendar: boolean (nullable, default: false)
//   event_links: text (nullable)
//   event_can_change_time: boolean (nullable, default: false)
//   event_change_time_desc: text (nullable)
//   event_comments: text (nullable)
//   inv_ems: boolean (nullable, default: false)
//   inv_ems_comments: text (nullable)
//   inv_protocol: boolean (nullable, default: false)
//   inv_sg: boolean (nullable, default: false)
//   inv_cop_bod: boolean (nullable, default: false)
//   inv_cop_bod_role: text (nullable)
//   inv_heads: boolean (nullable, default: false)
//   inv_heads_role: text (nullable)
//   inv_commd: boolean (nullable, default: false)
//   inv_commd_role: text (nullable)
//   inv_staff: boolean (nullable, default: false)
//   inv_staff_involvement: text (nullable)
//   inv_kaiciid_delegation: text (nullable)
//   inv_travel_days: text (nullable)
//   inv_orgs_involved: text (nullable)
//   inv_orgs_desc: text (nullable)
//   inv_participants_type: text (nullable)
//   inv_individuals_meet: text (nullable)
//   rbm_outcomes: text (nullable)
//   rbm_outputs: text (nullable)
//   sg_role: text (nullable)
//   sg_speaking_notes: text (nullable)
//   in_workplan: boolean (nullable, default: false)
// Table: budget_lines
//   id: uuid (not null, default: gen_random_uuid())
//   code: text (not null)
//   name: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: cost_centers
//   id: uuid (not null, default: gen_random_uuid())
//   code: text (not null)
//   name: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: organizations
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: profiles
//   id: uuid (not null)
//   name: text (nullable)
//   email: text (nullable)
//   role: user_role (nullable)
//   programme_id: uuid (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: programmes
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   organization_id: uuid (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: projects
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   programme_id: uuid (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: task_types
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: workorders
//   id: uuid (not null, default: gen_random_uuid())
//   code: text (not null)
//   name: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())

// --- CONSTRAINTS ---
// Table: accounts
//   PRIMARY KEY accounts_pkey: PRIMARY KEY (id)
// Table: activities
//   FOREIGN KEY activities_account_id_fkey: FOREIGN KEY (account_id) REFERENCES accounts(id)
//   FOREIGN KEY activities_assignee_id_fkey: FOREIGN KEY (assignee_id) REFERENCES profiles(id)
//   FOREIGN KEY activities_budget_line_id_fkey: FOREIGN KEY (budget_line_id) REFERENCES budget_lines(id)
//   FOREIGN KEY activities_cost_center_id_fkey: FOREIGN KEY (cost_center_id) REFERENCES cost_centers(id)
//   PRIMARY KEY activities_pkey: PRIMARY KEY (id)
//   FOREIGN KEY activities_programme_id_fkey: FOREIGN KEY (programme_id) REFERENCES programmes(id)
//   FOREIGN KEY activities_project_owner_id_fkey: FOREIGN KEY (project_owner_id) REFERENCES profiles(id)
//   FOREIGN KEY activities_sub_task_id_fkey: FOREIGN KEY (sub_task_id) REFERENCES activities(id)
//   UNIQUE activities_task_number_key: UNIQUE (task_number)
//   FOREIGN KEY activities_type_id_fkey: FOREIGN KEY (type_id) REFERENCES task_types(id)
//   FOREIGN KEY activities_workorder_id_fkey: FOREIGN KEY (workorder_id) REFERENCES workorders(id)
// Table: budget_lines
//   PRIMARY KEY budget_lines_pkey: PRIMARY KEY (id)
// Table: cost_centers
//   PRIMARY KEY cost_centers_pkey: PRIMARY KEY (id)
// Table: organizations
//   PRIMARY KEY organizations_pkey: PRIMARY KEY (id)
// Table: profiles
//   FOREIGN KEY profiles_id_fkey: FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
//   PRIMARY KEY profiles_pkey: PRIMARY KEY (id)
//   FOREIGN KEY profiles_programme_id_fkey: FOREIGN KEY (programme_id) REFERENCES programmes(id)
// Table: programmes
//   FOREIGN KEY programmes_organization_id_fkey: FOREIGN KEY (organization_id) REFERENCES organizations(id)
//   PRIMARY KEY programmes_pkey: PRIMARY KEY (id)
// Table: projects
//   PRIMARY KEY projects_pkey: PRIMARY KEY (id)
//   FOREIGN KEY projects_programme_id_fkey: FOREIGN KEY (programme_id) REFERENCES programmes(id)
// Table: task_types
//   PRIMARY KEY task_types_pkey: PRIMARY KEY (id)
// Table: workorders
//   PRIMARY KEY workorders_pkey: PRIMARY KEY (id)

// --- ROW LEVEL SECURITY POLICIES ---
// Table: accounts
//   Policy "auth_all_accounts" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
//   Policy "auth_read_accounts" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
// Table: activities
//   Policy "auth_all_activities" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: budget_lines
//   Policy "auth_all_budget_lines" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
//   Policy "auth_read_budget_lines" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
// Table: cost_centers
//   Policy "auth_all_cost_centers" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
//   Policy "auth_read_cost_centers" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
// Table: organizations
//   Policy "auth_read_org" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
// Table: profiles
//   Policy "auth_all_profiles" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
//   Policy "auth_insert_profiles" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "auth_read_profiles" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "auth_update_profiles" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: true
// Table: programmes
//   Policy "auth_all_programmes" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
//   Policy "auth_read_prog" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
// Table: projects
//   Policy "auth_read_projects" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
// Table: task_types
//   Policy "auth_all_task_types" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
//   Policy "auth_read_task_types" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
// Table: workorders
//   Policy "auth_all_workorders" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
//   Policy "auth_read_workorders" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true

// --- DATABASE FUNCTIONS ---
// FUNCTION generate_task_number()
//   CREATE OR REPLACE FUNCTION public.generate_task_number()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   BEGIN
//     IF NEW.task_number IS NULL THEN
//       NEW.task_number := 'A-' || LPAD(nextval('task_number_seq')::text, 5, '0');
//     END IF;
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION handle_new_user()
//   CREATE OR REPLACE FUNCTION public.handle_new_user()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     INSERT INTO public.profiles (id, email, name)
//     VALUES (NEW.id, NEW.email, split_part(NEW.email, '@', 1))
//     ON CONFLICT (id) DO NOTHING;
//     RETURN NEW;
//   END;
//   $function$
//

// --- TRIGGERS ---
// Table: activities
//   set_task_number: CREATE TRIGGER set_task_number BEFORE INSERT ON public.activities FOR EACH ROW EXECUTE FUNCTION generate_task_number()

// --- INDEXES ---
// Table: activities
//   CREATE UNIQUE INDEX activities_task_number_key ON public.activities USING btree (task_number)
