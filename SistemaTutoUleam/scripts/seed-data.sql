-- Insertar datos de ejemplo para el sistema de tutorías

-- Insertar materias
INSERT INTO subjects (name, code, description, department, credits) VALUES
('Cálculo Diferencial', 'MAT101', 'Introducción al cálculo diferencial y sus aplicaciones', 'Matemáticas', 4),
('Cálculo Integral', 'MAT102', 'Técnicas de integración y aplicaciones del cálculo integral', 'Matemáticas', 4),
('Álgebra Lineal', 'MAT201', 'Espacios vectoriales, matrices y transformaciones lineales', 'Matemáticas', 3),
('Programación en Python', 'CS101', 'Fundamentos de programación usando Python', 'Ciencias de la Computación', 3),
('Estructuras de Datos', 'CS201', 'Algoritmos y estructuras de datos fundamentales', 'Ciencias de la Computación', 4),
('Física I', 'FIS101', 'Mecánica clásica y termodinámica', 'Física', 4),
('Química General', 'QUI101', 'Principios fundamentales de química', 'Química', 4),
('Estadística', 'EST101', 'Estadística descriptiva e inferencial', 'Matemáticas', 3);

-- Insertar usuarios docentes
INSERT INTO users (id, email, password_hash, first_name, last_name, role, phone) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'maria.garcia@universidad.edu', '$2b$10$example_hash_1', 'María', 'García', 'teacher', '+1234567890'),
('550e8400-e29b-41d4-a716-446655440002', 'carlos.lopez@universidad.edu', '$2b$10$example_hash_2', 'Carlos', 'López', 'teacher', '+1234567891'),
('550e8400-e29b-41d4-a716-446655440003', 'ana.martinez@universidad.edu', '$2b$10$example_hash_3', 'Ana', 'Martínez', 'teacher', '+1234567892'),
('550e8400-e29b-41d4-a716-446655440004', 'pedro.rodriguez@universidad.edu', '$2b$10$example_hash_4', 'Pedro', 'Rodríguez', 'teacher', '+1234567893');

-- Insertar información específica de docentes
INSERT INTO teachers (id, department, specialization, bio, experience_years, hourly_rate, rating, total_reviews, is_verified) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Matemáticas', 'Cálculo, Álgebra Lineal', 'Doctora en Matemáticas con 10 años de experiencia en enseñanza universitaria. Especializada en cálculo diferencial e integral.', 10, 25.00, 4.9, 127, true),
('550e8400-e29b-41d4-a716-446655440002', 'Ciencias de la Computación', 'Programación, Algoritmos', 'Ingeniero en Sistemas con 8 años de experiencia en desarrollo de software y enseñanza de programación.', 8, 30.00, 4.8, 89, true),
('550e8400-e29b-41d4-a716-446655440003', 'Física', 'Mecánica, Termodinámica', 'Doctora en Física con especialización en mecánica clásica y moderna. 12 años de experiencia docente.', 12, 28.00, 4.7, 156, true),
('550e8400-e29b-41d4-a716-446655440004', 'Química', 'Química General, Orgánica', 'Químico con maestría en Química Orgánica. 6 años de experiencia en laboratorio y enseñanza.', 6, 26.00, 4.6, 73, true);

-- Insertar usuarios estudiantes
INSERT INTO users (id, email, password_hash, first_name, last_name, role, phone) VALUES
('550e8400-e29b-41d4-a716-446655440011', 'juan.perez@estudiante.edu', '$2b$10$example_hash_11', 'Juan', 'Pérez', 'student', '+1234567801'),
('550e8400-e29b-41d4-a716-446655440012', 'maria.gonzalez@estudiante.edu', '$2b$10$example_hash_12', 'María', 'González', 'student', '+1234567802'),
('550e8400-e29b-41d4-a716-446655440013', 'carlos.ruiz@estudiante.edu', '$2b$10$example_hash_13', 'Carlos', 'Ruiz', 'student', '+1234567803'),
('550e8400-e29b-41d4-a716-446655440014', 'ana.lopez@estudiante.edu', '$2b$10$example_hash_14', 'Ana', 'López', 'student', '+1234567804');

-- Insertar información específica de estudiantes
INSERT INTO students (id, student_id, program, semester, enrollment_year, gpa) VALUES
('550e8400-e29b-41d4-a716-446655440011', '2024001234', 'Ingeniería de Sistemas', 3, 2024, 3.8),
('550e8400-e29b-41d4-a716-446655440012', '2024001235', 'Matemáticas', 5, 2023, 3.9),
('550e8400-e29b-41d4-a716-446655440013', '2024001236', 'Física', 2, 2024, 3.7),
('550e8400-e29b-41d4-a716-446655440014', '2024001237', 'Química', 4, 2023, 3.6);

-- Relacionar docentes con materias
INSERT INTO teacher_subjects (teacher_id, subject_id, proficiency_level, hourly_rate) VALUES
-- María García - Matemáticas
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM subjects WHERE code = 'MAT101'), 'expert', 25.00),
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM subjects WHERE code = 'MAT102'), 'expert', 25.00),
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM subjects WHERE code = 'MAT201'), 'advanced', 25.00),
-- Carlos López - Programación
('550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM subjects WHERE code = 'CS101'), 'expert', 30.00),
('550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM subjects WHERE code = 'CS201'), 'expert', 30.00),
-- Ana Martínez - Física
('550e8400-e29b-41d4-a716-446655440003', (SELECT id FROM subjects WHERE code = 'FIS101'), 'expert', 28.00),
-- Pedro Rodríguez - Química
('550e8400-e29b-41d4-a716-446655440004', (SELECT id FROM subjects WHERE code = 'QUI101'), 'expert', 26.00);

-- Insertar algunas sesiones de tutoría de ejemplo
INSERT INTO tutoring_sessions (student_id, teacher_id, subject_id, title, description, scheduled_date, start_time, end_time, duration_minutes, status, price) VALUES
('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM subjects WHERE code = 'MAT101'), 'Límites y Continuidad', 'Repaso de conceptos de límites y continuidad de funciones', '2024-01-15', '14:00', '15:00', 60, 'confirmed', 25.00),
('550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM subjects WHERE code = 'CS101'), 'Introducción a Python', 'Fundamentos de programación en Python', '2024-01-16', '10:00', '11:30', 90, 'pending', 45.00);

-- Insertar solicitudes de tutoría
INSERT INTO tutoring_requests (student_id, teacher_id, subject_id, preferred_date, preferred_time, message, urgency_level) VALUES
('550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM subjects WHERE code = 'MAT201'), '2024-01-17', '16:00', 'Necesito ayuda con matrices y determinantes', 'high'),
('550e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM subjects WHERE code = 'MAT102'), '2024-01-18', '09:00', 'Tengo dificultades con integrales por partes', 'medium');

-- Insertar configuraciones de usuario por defecto
INSERT INTO user_settings (user_id, theme, language, accessibility_settings) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'light', 'es', '{"highContrast": false, "largeText": false, "reducedMotion": false}'),
('550e8400-e29b-41d4-a716-446655440002', 'dark', 'es', '{"highContrast": false, "largeText": false, "reducedMotion": false}'),
('550e8400-e29b-41d4-a716-446655440011', 'light', 'es', '{"highContrast": false, "largeText": false, "reducedMotion": false}'),
('550e8400-e29b-41d4-a716-446655440012', 'light', 'es', '{"highContrast": false, "largeText": false, "reducedMotion": false}');

-- Insertar algunas reseñas de ejemplo
INSERT INTO reviews (tutoring_session_id, student_id, teacher_id, rating, comment) VALUES
((SELECT id FROM tutoring_sessions LIMIT 1), '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440001', 5, 'Excelente explicación, muy clara y paciente. Recomendado 100%');
