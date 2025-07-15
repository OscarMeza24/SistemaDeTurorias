import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Calendar, Award, ArrowRight, Accessibility } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSelector } from "@/components/language-selector"
import { AccessibilityMenu } from "@/components/accessibility-menu"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">TutorHub</h1>
          </div>

          <div className="flex items-center space-x-4">
            <AccessibilityMenu />
            <LanguageSelector />
            <ThemeToggle />
            <Link href="/auth/login">
              <Button variant="outline">Iniciar Sesión</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Registrarse</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Sistema de Gestión de
            <span className="text-blue-600 dark:text-blue-400"> Tutorías</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Conecta estudiantes y docentes en un ambiente de aprendizaje personalizado. Gestiona tutorías, horarios y
            seguimiento académico de manera eficiente.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/auth/register?role=student">
              <Button size="lg" className="w-full sm:w-auto">
                Soy Estudiante
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth/register?role=teacher">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                Soy Docente
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <Users className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <CardTitle>Gestión de Usuarios</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Sistema completo para docentes y estudiantes con perfiles personalizados
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <Calendar className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
                <CardTitle>Programación</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Agenda y gestiona tutorías con calendario integrado y notificaciones</CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <Award className="h-12 w-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
                <CardTitle>Seguimiento</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Monitorea el progreso académico y genera reportes detallados</CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <Accessibility className="h-12 w-12 text-orange-600 dark:text-orange-400 mx-auto mb-4" />
                <CardTitle>Accesibilidad</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Diseñado para ser accesible para todos los usuarios con diferentes capacidades
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <BookOpen className="h-6 w-6 text-blue-400" />
            <span className="text-xl font-bold">TutorHub</span>
          </div>
          <p className="text-gray-400">© 2024 TutorHub. Sistema de gestión de tutorías accesible e inclusivo.</p>
        </div>
      </footer>
    </div>
  )
}
