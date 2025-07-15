import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from("tutoring_requests")
      .insert({
        student_id: body.student_id,
        teacher_id: body.teacher_id,
        subject_id: body.subject_id,
        preferred_date: body.preferred_date,
        preferred_time: body.preferred_time,
        message: body.message,
        urgency_level: body.urgency_level || "medium",
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Crear notificación para el docente
    await supabase.from("notifications").insert({
      user_id: body.teacher_id,
      title: "Nueva Solicitud de Tutoría",
      message: `Tienes una nueva solicitud de tutoría para ${body.subject_name}`,
      type: "tutoring_request",
    })

    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
