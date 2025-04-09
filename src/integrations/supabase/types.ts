export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      caballos: {
        Row: {
          altura: string | null
          color: string | null
          created_at: string
          edad: number | null
          entrenamiento: string | null
          historial_medico: string | null
          id: string
          nombre: string
          peso: string | null
          raza: string | null
          temperamento: string | null
          updated_at: string
        }
        Insert: {
          altura?: string | null
          color?: string | null
          created_at?: string
          edad?: number | null
          entrenamiento?: string | null
          historial_medico?: string | null
          id?: string
          nombre: string
          peso?: string | null
          raza?: string | null
          temperamento?: string | null
          updated_at?: string
        }
        Update: {
          altura?: string | null
          color?: string | null
          created_at?: string
          edad?: number | null
          entrenamiento?: string | null
          historial_medico?: string | null
          id?: string
          nombre?: string
          peso?: string | null
          raza?: string | null
          temperamento?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      pacientes: {
        Row: {
          apellido: string
          cedula: string
          created_at: string
          diagnostico: string | null
          email: string | null
          fecha_nacimiento: string | null
          id: string
          nombre: string
          objetivos: string | null
          observaciones: string | null
          telefono: string | null
          updated_at: string
        }
        Insert: {
          apellido: string
          cedula: string
          created_at?: string
          diagnostico?: string | null
          email?: string | null
          fecha_nacimiento?: string | null
          id?: string
          nombre: string
          objetivos?: string | null
          observaciones?: string | null
          telefono?: string | null
          updated_at?: string
        }
        Update: {
          apellido?: string
          cedula?: string
          created_at?: string
          diagnostico?: string | null
          email?: string | null
          fecha_nacimiento?: string | null
          id?: string
          nombre?: string
          objetivos?: string | null
          observaciones?: string | null
          telefono?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      personal: {
        Row: {
          apellido: string
          cargo: string | null
          cedula: string
          created_at: string
          email: string | null
          especialidad: string | null
          fecha_contratacion: string | null
          id: string
          nombre: string
          telefono: string | null
          updated_at: string
        }
        Insert: {
          apellido: string
          cargo?: string | null
          cedula: string
          created_at?: string
          email?: string | null
          especialidad?: string | null
          fecha_contratacion?: string | null
          id?: string
          nombre: string
          telefono?: string | null
          updated_at?: string
        }
        Update: {
          apellido?: string
          cargo?: string | null
          cedula?: string
          created_at?: string
          email?: string | null
          especialidad?: string | null
          fecha_contratacion?: string | null
          id?: string
          nombre?: string
          telefono?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sesiones: {
        Row: {
          actividades: string | null
          caballo_id: string
          created_at: string
          duracion: string | null
          estado: string | null
          fecha: string
          hora: string
          id: string
          observaciones: string | null
          paciente_id: string
          personal_id: string
          updated_at: string
        }
        Insert: {
          actividades?: string | null
          caballo_id: string
          created_at?: string
          duracion?: string | null
          estado?: string | null
          fecha: string
          hora: string
          id?: string
          observaciones?: string | null
          paciente_id: string
          personal_id: string
          updated_at?: string
        }
        Update: {
          actividades?: string | null
          caballo_id?: string
          created_at?: string
          duracion?: string | null
          estado?: string | null
          fecha?: string
          hora?: string
          id?: string
          observaciones?: string | null
          paciente_id?: string
          personal_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sesiones_caballo_id_fkey"
            columns: ["caballo_id"]
            isOneToOne: false
            referencedRelation: "caballos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sesiones_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sesiones_personal_id_fkey"
            columns: ["personal_id"]
            isOneToOne: false
            referencedRelation: "personal"
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
