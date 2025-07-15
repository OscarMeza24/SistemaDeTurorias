import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()

    // Obtener la solicitud
    const { data: requestData, error: requestError } = await supabase
      .from("tutoring_requests")
      .select("*")
      .eq("id", body.request_id)
      .single()

    if (requestError || !requestData) {
      return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 })
    }

    // Crear la sesión de tutoría
    const { data: sessionData, error: sessionError } = await supabase
      .from("tutoring_sessions")
      .insert({
        student_id: requestData.student_id,
        teacher_id: requestData.teacher_id,
        subject_id: requestData.subject_id,
        title: body.title,
        description: body.description || requestData.message,
        scheduled_date: body.scheduled_date,
        start_time: body.start_time,
        end_time: body.end_time,
        duration_minutes: body.duration_minutes,
        location_type: body.location_type || "virtual",
        location_details: body.location_details,
        price: body.price,
        status: "confirmed",
      })
      .select()
      .single()

    if (sessionError) {
      return NextResponse.json({ error: sessionError.message }, { status: 400 })
    }

    // Actualizar el estado de la solicitud
    await supabase.from("tutoring_requests").update({ status: "accepted" }).eq("id", body.request_id)

    // Crear notificación para el estudiante
    await supabase.from("notifications").insert({
      user_id: requestData.student_id,
      title: "Solicitud de Tutoría Aceptada",
      message: `Tu solicitud de tutoría ha sido aceptada. Fecha: ${body.scheduled_date}`,
      type: "tutoring_accepted",
    })

    return NextResponse.json({ data: sessionData })
  } catch (error) {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
