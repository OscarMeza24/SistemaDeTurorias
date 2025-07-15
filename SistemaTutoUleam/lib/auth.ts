import { supabase } from "./supabase"
import type { User } from "@supabase/supabase-js"

export interface AuthUser extends User {
  user_metadata: {
    role?: "student" | "teacher"
    first_name?: string
    last_name?: string
  }
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  role: "student" | "teacher"
  // Campos específicos para estudiantes
  studentId?: string
  program?: string
  semester?: string
  // Campos específicos para docentes
  department?: string
  specialization?: string
  bio?: string
  experience?: string
}

export const authService = {
  // Registrar usuario
  async register(data: RegisterData) {
    try {
      // 1. Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            role: data.role,
            first_name: data.firstName,
            last_name: data.lastName,
          },
        },
      })

      if (authError) throw authError

      if (authData.user) {
        // 2. Insertar datos adicionales en la tabla users
        const { error: userError } = await supabase.from("users").insert({
          id: authData.user.id,
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
          role: data.role,
        })

        if (userError) throw userError

        // 3. Insertar datos específicos según el rol
        if (data.role === "student") {
          const { error: studentError } = await supabase.from("students").insert({
            id: authData.user.id,
            student_id: data.studentId!,
            program: data.program!,
            semester: Number.parseInt(data.semester!),
            enrollment_year: new Date().getFullYear(),
          })

          if (studentError) throw studentError
        } else if (data.role === "teacher") {
          const { error: teacherError } = await supabase.from("teachers").insert({
            id: authData.user.id,
            department: data.department!,
            specialization: data.specialization!,
            bio: data.bio || "",
            experience_years: Number.parseInt(data.experience?.split("-")[0] || "1"),
            hourly_rate: 25.0, // Precio por defecto
          })

          if (teacherError) throw teacherError
        }

        // 4. Crear configuraciones por defecto
        await supabase.from("user_settings").insert({
          user_id: authData.user.id,
          theme: "light",
          language: "es",
          accessibility_settings: {
            highContrast: false,
            largeText: false,
            reducedMotion: false,
            screenReader: false,
          },
        })
      }

      return { user: authData.user, error: null }
    } catch (error) {
      console.error("Error en registro:", error)
      return { user: null, error: error as Error }
    }
  },

  // Iniciar sesión
  async login(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      return { user: data.user, error: null }
    } catch (error) {
      console.error("Error en login:", error)
      return { user: null, error: error as Error }
    }
  },

  // Cerrar sesión
  async logout() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Obtener usuario actual
  async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    return { user, error }
  },

  // Obtener perfil completo del usuario
  async getUserProfile(userId: string) {
    try {
      // Obtener datos básicos del usuario
      const { data: userData, error: userError } = await supabase.from("users").select("*").eq("id", userId).single()

      if (userError) throw userError

      let profileData = null

      // Obtener datos específicos según el rol
      if (userData.role === "student") {
        const { data: studentData, error: studentError } = await supabase
          .from("students")
          .select("*")
          .eq("id", userId)
          .single()

        if (studentError) throw studentError
        profileData = studentData
      } else if (userData.role === "teacher") {
        const { data: teacherData, error: teacherError } = await supabase
          .from("teachers")
          .select("*")
          .eq("id", userId)
          .single()

        if (teacherError) throw teacherError
        profileData = teacherData
      }

      // Obtener configuraciones
      const { data: settingsData } = await supabase.from("user_settings").select("*").eq("user_id", userId).single()

      return {
        user: userData,
        profile: profileData,
        settings: settingsData,
        error: null,
      }
    } catch (error) {
      console.error("Error obteniendo perfil:", error)
      return { user: null, profile: null, settings: null, error: error as Error }
    }
  },
}
