import { supabase } from "./supabase"

export interface Subject {
  id: string
  name: string
  code: string
  description: string
  department: string
  credits: number
}

export interface Teacher {
  id: string
  first_name: string
  last_name: string
  department: string
  specialization: string
  bio: string
  experience_years: number
  hourly_rate: number
  rating: number
  total_reviews: number
  is_verified: boolean
}

export interface TutoringSession {
  id: string
  student_id: string
  teacher_id: string
  subject_id: string
  title: string
  description: string
  scheduled_date: string
  start_time: string
  end_time: string
  duration_minutes: number
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled"
  location_type: "virtual" | "in_person"
  location_details: string
  meeting_url: string
  price: number
  payment_status: "pending" | "paid" | "refunded"
  notes: string
  created_at: string
  updated_at: string
}

export interface TutoringRequest {
  id: string
  student_id: string
  teacher_id: string
  subject_id: string
  preferred_date: string
  preferred_time: string
  message: string
  urgency_level: "low" | "medium" | "high"
  status: "pending" | "accepted" | "rejected" | "expired"
  created_at: string
  expires_at: string
}

export const databaseService = {
  // Obtener todas las materias
  async getSubjects() {
    const { data, error } = await supabase.from("subjects").select("*").order("name")

    return { data, error }
  },

  // Obtener docentes disponibles
  async getAvailableTeachers(subjectId?: string) {
    let query = supabase
      .from("teachers")
      .select(`
        *,
        users!inner(first_name, last_name, email),
        teacher_subjects!inner(subject_id, hourly_rate, subjects(name, code))
      `)
      .eq("users.is_active", true)

    if (subjectId) {
      query = query.eq("teacher_subjects.subject_id", subjectId)
    }

    const { data, error } = await query.order("rating", { ascending: false })

    return { data, error }
  },

  // Obtener sesiones de tutoría de un estudiante
  async getStudentTutoringSessions(studentId: string) {
    const { data, error } = await supabase
      .from("tutoring_sessions")
      .select(`
        *,
        teachers!inner(
          users!inner(first_name, last_name)
        ),
        subjects(name, code)
      `)
      .eq("student_id", studentId)
      .order("scheduled_date", { ascending: true })

    return { data, error }
  },

  // Obtener sesiones de tutoría de un docente
  async getTeacherTutoringSessions(teacherId: string) {
    const { data, error } = await supabase
      .from("tutoring_sessions")
      .select(`
        *,
        students!inner(
          users!inner(first_name, last_name)
        ),
        subjects(name, code)
      `)
      .eq("teacher_id", teacherId)
      .order("scheduled_date", { ascending: true })

    return { data, error }
  },

  // Obtener solicitudes de tutoría para un docente
  async getTeacherRequests(teacherId: string) {
    const { data, error } = await supabase
      .from("tutoring_requests")
      .select(`
        *,
        students!inner(
          users!inner(first_name, last_name)
        ),
        subjects(name, code)
      `)
      .eq("teacher_id", teacherId)
      .eq("status", "pending")
      .order("created_at", { ascending: false })

    return { data, error }
  },

  // Crear nueva solicitud de tutoría
  async createTutoringRequest(request: Omit<TutoringRequest, "id" | "created_at" | "expires_at">) {
    const { data, error } = await supabase.from("tutoring_requests").insert(request).select().single()

    return { data, error }
  },

  // Aceptar solicitud de tutoría
  async acceptTutoringRequest(requestId: string, sessionData: Partial<TutoringSession>) {
    try {
      // 1. Actualizar el estado de la solicitud
      const { error: requestError } = await supabase
        .from("tutoring_requests")
        .update({ status: "accepted" })
        .eq("id", requestId)

      if (requestError) throw requestError

      // 2. Crear la sesión de tutoría
      const { data: sessionResult, error: sessionError } = await supabase
        .from("tutoring_sessions")
        .insert(sessionData)
        .select()
        .single()

      if (sessionError) throw sessionError

      return { data: sessionResult, error: null }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  },

  // Rechazar solicitud de tutoría
  async rejectTutoringRequest(requestId: string) {
    const { error } = await supabase.from("tutoring_requests").update({ status: "rejected" }).eq("id", requestId)

    return { error }
  },

  // Obtener estadísticas del estudiante
  async getStudentStats(studentId: string) {
    try {
      // Total de tutorías
      const { count: totalSessions } = await supabase
        .from("tutoring_sessions")
        .select("*", { count: "exact", head: true })
        .eq("student_id", studentId)

      // Tutorías completadas
      const { count: completedSessions } = await supabase
        .from("tutoring_sessions")
        .select("*", { count: "exact", head: true })
        .eq("student_id", studentId)
        .eq("status", "completed")

      // Horas totales
      const { data: sessionsData } = await supabase
        .from("tutoring_sessions")
        .select("duration_minutes")
        .eq("student_id", studentId)
        .eq("status", "completed")

      const totalHours = sessionsData?.reduce((acc, session) => acc + session.duration_minutes, 0) || 0

      // Materias activas
      const { data: activeSubjects } = await supabase
        .from("tutoring_sessions")
        .select("subject_id")
        .eq("student_id", studentId)
        .in("status", ["pending", "confirmed"])

      const uniqueSubjects = new Set(activeSubjects?.map((s) => s.subject_id))

      return {
        totalSessions: totalSessions || 0,
        completedSessions: completedSessions || 0,
        totalHours: Math.round(totalHours / 60),
        activeSubjects: uniqueSubjects.size,
        progressPercentage: totalSessions ? Math.round(((completedSessions || 0) / totalSessions) * 100) : 0,
      }
    } catch (error) {
      console.error("Error obteniendo estadísticas:", error)
      return {
        totalSessions: 0,
        completedSessions: 0,
        totalHours: 0,
        activeSubjects: 0,
        progressPercentage: 0,
      }
    }
  },

  // Obtener estadísticas del docente
  async getTeacherStats(teacherId: string) {
    try {
      // Ingresos del mes actual
      const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
      const { data: monthlyEarnings } = await supabase
        .from("tutoring_sessions")
        .select("price")
        .eq("teacher_id", teacherId)
        .eq("status", "completed")
        .gte("scheduled_date", `${currentMonth}-01`)
        .lt("scheduled_date", `${currentMonth}-32`)

      const monthlyIncome = monthlyEarnings?.reduce((acc, session) => acc + session.price, 0) || 0

      // Tutorías completadas
      const { count: completedSessions } = await supabase
        .from("tutoring_sessions")
        .select("*", { count: "exact", head: true })
        .eq("teacher_id", teacherId)
        .eq("status", "completed")

      // Calificación promedio
      const { data: teacherData } = await supabase
        .from("teachers")
        .select("rating, total_reviews")
        .eq("id", teacherId)
        .single()

      // Estudiantes únicos
      const { data: studentsData } = await supabase
        .from("tutoring_sessions")
        .select("student_id")
        .eq("teacher_id", teacherId)
        .eq("status", "completed")

      const uniqueStudents = new Set(studentsData?.map((s) => s.student_id))

      return {
        monthlyIncome,
        completedSessions: completedSessions || 0,
        rating: teacherData?.rating || 0,
        totalReviews: teacherData?.total_reviews || 0,
        activeStudents: uniqueStudents.size,
      }
    } catch (error) {
      console.error("Error obteniendo estadísticas del docente:", error)
      return {
        monthlyIncome: 0,
        completedSessions: 0,
        rating: 0,
        totalReviews: 0,
        activeStudents: 0,
      }
    }
  },

  // Actualizar configuraciones de usuario
  async updateUserSettings(userId: string, settings: any) {
    const { data, error } = await supabase
      .from("user_settings")
      .upsert({
        user_id: userId,
        ...settings,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    return { data, error }
  },

  // Obtener notificaciones del usuario
  async getUserNotifications(userId: string) {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10)

    return { data, error }
  },

  // Marcar notificación como leída
  async markNotificationAsRead(notificationId: string) {
    const { error } = await supabase
      .from("notifications")
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq("id", notificationId)

    return { error }
  },
}
