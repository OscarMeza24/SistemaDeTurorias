"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, BookOpen, Plus, DollarSign, Star, TrendingUp } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/hooks/useAuth"
import { databaseService } from "@/lib/database"
import { useEffect } from "react"

export default function TeacherDashboard() {
  const { user, userProfile } = useAuth()
  const [upcomingTutorials, setUpcomingTutorials] = useState([])
  const [studentRequests, setStudentRequests] = useState([])
  const [stats, setStats] = useState({
    monthlyIncome: 0,
    completedSessions: 0,
    rating: 0,
    totalReviews: 0,
    activeStudents: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        // Fetch tutoring sessions
        const { data: sessions } = await databaseService.getTeacherTutoringSessions(user.id)
        setUpcomingTutorials(sessions || [])

        // Fetch student requests
        const { data: requests } = await databaseService.getTeacherRequests(user.id)
        setStudentRequests(requests || [])

        // Fetch stats
        const teacherStats = await databaseService.getTeacherStats(user.id)
        setStats(teacherStats)
      }
      setLoading(false)
    }

    fetchData()
  }, [user])

  const [availability, setAvailability] = useState("")

  // Datos de ejemplo
  // const upcomingTutorials = [
  //   {
  //     id: 1,
  //     student: "Juan Pérez",
  //     subject: "Cálculo Diferencial",
  //     date: "2024-01-15",
  //     time: "14:00",
  //     duration: "1h",
  //     status: "confirmada",
  //     price: "$25",
  //   },
  //   {
  //     id: 2,
  //     student: "María González",
  //     subject: "Programación en Python",
  //     date: "2024-01-16",
  //     time: "10:00",
  //     duration: "1.5h",
  //     status: "pendiente",
  //     price: "$30",
  //   },
  // ]

  // const studentRequests = [
  //   {
  //     id: 1,
  //     student: "Carlos Ruiz",
  //     subject: "Álgebra Lineal",
  //     preferredDate: "2024-01-17",
  //     preferredTime: "16:00",
  //     message: "Necesito ayuda con matrices y determinantes",
  //     urgency: "alta",
  //   },
  //   {
  //     id: 2,
  //     student: "Ana López",
  //     subject: "Cálculo Integral",
  //     preferredDate: "2024-01-18",
  //     preferredTime: "09:00",
  //     message: "Tengo dificultades con integrales por partes",
  //     urgency: "media",
  //   },
  // ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Panel de Docente</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Bienvenida, {userProfile?.first_name} {userProfile?.last_name}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <Calendar className="h-4 w-4" />
                Gestionar Horarios
              </Button>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nueva Disponibilidad
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Columna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Estadísticas */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Ingresos del Mes</p>
                      <p className="text-2xl font-bold text-green-600">${stats.monthlyIncome}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Tutorías Completadas</p>
                      <p className="text-2xl font-bold">{stats.completedSessions}</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Calificación</p>
                      <p className="text-2xl font-bold">{stats.rating}</p>
                    </div>
                    <Star className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Estudiantes Activos</p>
                      <p className="text-2xl font-bold">{stats.activeStudents}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Próximas Tutorías */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Próximas Tutorías
                </CardTitle>
                <CardDescription>Tus sesiones programadas para esta semana</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingTutorials.map((tutorial) => (
                  <div key={tutorial.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{tutorial.student}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{tutorial.subject}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {tutorial.date} - {tutorial.time}
                        </span>
                        <span>Duración: {tutorial.duration}</span>
                        <span className="font-semibold text-green-600">{tutorial.price}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant={tutorial.status === "confirmada" ? "default" : "secondary"}>
                        {tutorial.status}
                      </Badge>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Contactar
                        </Button>
                        <Button size="sm">Ver Detalles</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Solicitudes de Estudiantes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Nuevas Solicitudes
                </CardTitle>
                <CardDescription>Estudiantes que han solicitado tutorías contigo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {studentRequests.map((request) => (
                  <div key={request.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{request.student}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{request.subject}</p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          request.urgency === "alta"
                            ? "destructive"
                            : request.urgency === "media"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {request.urgency} prioridad
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">"{request.message}"</p>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Fecha preferida: {request.preferredDate} a las {request.preferredTime}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Rechazar
                        </Button>
                        <Button size="sm">Aceptar</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Perfil Rápido */}
            <Card>
              <CardHeader>
                <CardTitle>Mi Perfil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold">Dra. María García</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Matemáticas</p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-semibold">4.9</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">(127 reseñas)</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full bg-transparent">
                  Editar Perfil
                </Button>
              </CardContent>
            </Card>

            {/* Configurar Disponibilidad */}
            <Card>
              <CardHeader>
                <CardTitle>Disponibilidad</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Horarios Disponibles</label>
                  <Textarea
                    placeholder="Ej: Lunes a Viernes 9:00-17:00"
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    rows={3}
                  />
                </div>
                <Button className="w-full">Actualizar Horarios</Button>
              </CardContent>
            </Card>

            {/* Materias que Enseño */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Mis Materias
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <span className="font-medium">Cálculo Diferencial</span>
                  <Badge>$25/h</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="font-medium">Álgebra Lineal</span>
                  <Badge>$25/h</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <span className="font-medium">Cálculo Integral</span>
                  <Badge>$30/h</Badge>
                </div>
                <Button variant="outline" className="w-full bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Materia
                </Button>
              </CardContent>
            </Card>

            {/* Acciones Rápidas */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Calendar className="h-4 w-4 mr-2" />
                  Ver Calendario Completo
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Historial de Pagos
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Star className="h-4 w-4 mr-2" />
                  Ver Reseñas
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
