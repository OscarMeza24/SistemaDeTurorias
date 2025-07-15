"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, BookOpen, Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/hooks/useAuth"
import { databaseService } from "@/lib/database"

export default function StudentDashboard() {
  const [searchTerm, setSearchTerm] = useState("")

  const { user, userProfile } = useAuth()
  const [upcomingTutorials, setUpcomingTutorials] = useState([])
  const [availableTeachers, setAvailableTeachers] = useState([])
  const [stats, setStats] = useState({
    totalSessions: 0,
    completedSessions: 0,
    totalHours: 0,
    activeSubjects: 0,
    progressPercentage: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        // Fetch tutoring sessions
        const { data: sessions } = await databaseService.getStudentTutoringSessions(user.id)
        setUpcomingTutorials(sessions || [])

        // Fetch available teachers
        const { data: teachers } = await databaseService.getAvailableTeachers()
        setAvailableTeachers(teachers || [])

        // Fetch stats
        const studentStats = await databaseService.getStudentStats(user.id)
        setStats(studentStats)
      }
      setLoading(false)
    }

    fetchData()
  }, [user])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Panel de Estudiante</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Bienvenido, {userProfile?.first_name} {userProfile?.last_name}
              </p>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nueva Tutoría
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Columna Principal */}
          <div className="lg:col-span-2 space-y-6">
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
                      <h3 className="font-semibold">{tutorial.subject}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {tutorial.teacher}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {tutorial.date} a las {tutorial.time}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">📍 {tutorial.location}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant={tutorial.status === "confirmada" ? "default" : "secondary"}>
                        {tutorial.status}
                      </Badge>
                      <Button size="sm" variant="outline">
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Buscar Tutores */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Buscar Tutores
                </CardTitle>
                <CardDescription>Encuentra el tutor perfecto para tus necesidades</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <Input
                    placeholder="Buscar por materia o nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                  <Select>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filtrar por materia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="matematicas">Matemáticas</SelectItem>
                      <SelectItem value="fisica">Física</SelectItem>
                      <SelectItem value="programacion">Programación</SelectItem>
                      <SelectItem value="quimica">Química</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  {availableTeachers.map((teacher) => (
                    <div key={teacher.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{teacher.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {teacher.subject} • {teacher.experience}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">⭐ {teacher.rating}</span>
                          <span className="font-semibold text-green-600">{teacher.price}</span>
                          <Badge variant={teacher.available ? "default" : "secondary"}>
                            {teacher.available ? "Disponible" : "Ocupado"}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Ver Perfil
                        </Button>
                        <Button size="sm" disabled={!teacher.available}>
                          Agendar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Estadísticas Rápidas */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Tutorías este mes</span>
                  <span className="font-semibold">{stats.totalSessions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Horas totales</span>
                  <span className="font-semibold">{stats.totalHours}h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Materias activas</span>
                  <span className="font-semibold">{stats.activeSubjects}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Progreso general</span>
                  <span className="font-semibold text-green-600">{stats.progressPercentage}%</span>
                </div>
              </CardContent>
            </Card>

            {/* Materias Favoritas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Mis Materias
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <span className="font-medium">Cálculo</span>
                  <Badge>Activa</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="font-medium">Programación</span>
                  <Badge>Activa</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <span className="font-medium">Física</span>
                  <Badge variant="secondary">Pausada</Badge>
                </div>
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
                  Ver Calendario
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Mis Notas
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <User className="h-4 w-4 mr-2" />
                  Editar Perfil
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
