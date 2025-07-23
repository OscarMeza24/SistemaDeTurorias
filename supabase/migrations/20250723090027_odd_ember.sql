/*
  # Schema inicial para el sistema de tutorías

  1. Nuevas tablas
    - `users` - Usuarios del sistema (estudiantes y docentes)
    - `students` - Información específica de estudiantes
    - `teachers` - Información específica de docentes
    - `subjects` - Materias disponibles
    - `teacher_subjects` - Relación docente-materia
    - `tutoring_sessions` - Sesiones de tutoría
    - `tutoring_requests` - Solicitudes de tutoría
    - `reviews` - Reseñas y calificaciones
    - `payments` - Información de pagos
    - `notifications` - Notificaciones del sistema
    - `user_settings` - Configuraciones de usuario

  2. Seguridad
    - Habilitar RLS en todas las tablas
    - Políticas de acceso basadas en roles
*/

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de usuarios (tanto estudiantes como docentes)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'teacher')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    profile_image_url TEXT,
    phone VARCHAR(20),
    timezone VARCHAR(50) DEFAULT 'UTC'
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Tabla específica para estudiantes
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    program VARCHAR(100) NOT NULL,
    semester INTEGER,
    enrollment_year INTEGER,
    gpa DECIMAL(3,2),
    preferred_language VARCHAR(10) DEFAULT 'es'
);

ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Tabla específica para docentes
CREATE TABLE IF NOT EXISTS teachers (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    department VARCHAR(100) NOT NULL,
    specialization TEXT NOT NULL,
    bio TEXT,
    experience_years INTEGER,
    hourly_rate DECIMAL(10,2),
    rating DECIMAL(3,2) DEFAULT 0.0,
    total_reviews INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT false,
    availability_schedule JSONB
);

ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

-- Tabla de materias
CREATE TABLE IF NOT EXISTS subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    department VARCHAR(100),
    credits INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

-- Tabla de relación docente-materia
CREATE TABLE IF NOT EXISTS teacher_subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    proficiency_level VARCHAR(20) CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    hourly_rate DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(teacher_id, subject_id)
);

ALTER TABLE teacher_subjects ENABLE ROW LEVEL SECURITY;

-- Tabla de tutorías
CREATE TABLE IF NOT EXISTS tutoring_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    scheduled_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_minutes INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    location_type VARCHAR(20) DEFAULT 'virtual' CHECK (location_type IN ('virtual', 'in_person')),
    location_details TEXT,
    meeting_url TEXT,
    price DECIMAL(10,2) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE tutoring_sessions ENABLE ROW LEVEL SECURITY;

-- Tabla de solicitudes de tutoría
CREATE TABLE IF NOT EXISTS tutoring_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    preferred_date DATE,
    preferred_time TIME,
    message TEXT,
    urgency_level VARCHAR(20) DEFAULT 'medium' CHECK (urgency_level IN ('low', 'medium', 'high')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days')
);

ALTER TABLE tutoring_requests ENABLE ROW LEVEL SECURITY;

-- Tabla de reseñas y calificaciones
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tutoring_session_id UUID REFERENCES tutoring_sessions(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_anonymous BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Tabla de pagos
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tutoring_session_id UUID REFERENCES tutoring_sessions(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method VARCHAR(50),
    transaction_id VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Tabla de notificaciones
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Tabla de configuraciones de usuario
CREATE TABLE IF NOT EXISTS user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    theme VARCHAR(20) DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'auto')),
    language VARCHAR(10) DEFAULT 'es',
    timezone VARCHAR(50) DEFAULT 'UTC',
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    accessibility_settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_tutoring_sessions_student ON tutoring_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_tutoring_sessions_teacher ON tutoring_sessions(teacher_id);
CREATE INDEX IF NOT EXISTS idx_tutoring_sessions_date ON tutoring_sessions(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_tutoring_sessions_status ON tutoring_sessions(status);
CREATE INDEX IF NOT EXISTS idx_reviews_teacher ON reviews(teacher_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read);

-- Crear función para actualizar timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear triggers para actualizar timestamps automáticamente
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tutoring_sessions_updated_at BEFORE UPDATE ON tutoring_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Políticas RLS para users
CREATE POLICY "Users can read own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Políticas RLS para students
CREATE POLICY "Students can read own data" ON students
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Students can update own data" ON students
    FOR UPDATE USING (auth.uid() = id);

-- Políticas RLS para teachers
CREATE POLICY "Teachers can read own data" ON teachers
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Teachers can update own data" ON teachers
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can read teacher profiles" ON teachers
    FOR SELECT USING (true);

-- Políticas RLS para subjects
CREATE POLICY "Anyone can read subjects" ON subjects
    FOR SELECT USING (true);

-- Políticas RLS para teacher_subjects
CREATE POLICY "Anyone can read teacher subjects" ON teacher_subjects
    FOR SELECT USING (true);

CREATE POLICY "Teachers can manage own subjects" ON teacher_subjects
    FOR ALL USING (auth.uid() = teacher_id);

-- Políticas RLS para tutoring_sessions
CREATE POLICY "Students can read own sessions" ON tutoring_sessions
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Teachers can read own sessions" ON tutoring_sessions
    FOR SELECT USING (auth.uid() = teacher_id);

CREATE POLICY "Students can create sessions" ON tutoring_sessions
    FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Teachers can update sessions" ON tutoring_sessions
    FOR UPDATE USING (auth.uid() = teacher_id);

-- Políticas RLS para tutoring_requests
CREATE POLICY "Students can read own requests" ON tutoring_requests
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Teachers can read requests for them" ON tutoring_requests
    FOR SELECT USING (auth.uid() = teacher_id);

CREATE POLICY "Students can create requests" ON tutoring_requests
    FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Teachers can update requests" ON tutoring_requests
    FOR UPDATE USING (auth.uid() = teacher_id);

-- Políticas RLS para reviews
CREATE POLICY "Students can create reviews" ON reviews
    FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Anyone can read reviews" ON reviews
    FOR SELECT USING (true);

-- Políticas RLS para notifications
CREATE POLICY "Users can read own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Políticas RLS para user_settings
CREATE POLICY "Users can manage own settings" ON user_settings
    FOR ALL USING (auth.uid() = user_id);

-- Función para crear perfil de usuario automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  
  -- Crear configuraciones por defecto
  INSERT INTO public.user_settings (user_id, theme, language, accessibility_settings)
  VALUES (
    NEW.id,
    'light',
    'es',
    '{"highContrast": false, "largeText": false, "reducedMotion": false, "screenReader": false}'::jsonb
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil automáticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();