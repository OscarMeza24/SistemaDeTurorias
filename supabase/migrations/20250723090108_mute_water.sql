/*
  # Datos iniciales para el sistema

  1. Materias básicas
  2. Datos de ejemplo para desarrollo
*/

-- Insertar materias básicas
INSERT INTO subjects (name, code, description, department, credits) VALUES
('Cálculo Diferencial', 'MAT101', 'Introducción al cálculo diferencial y sus aplicaciones', 'Matemáticas', 4),
('Cálculo Integral', 'MAT102', 'Técnicas de integración y aplicaciones del cálculo integral', 'Matemáticas', 4),
('Álgebra Lineal', 'MAT201', 'Espacios vectoriales, matrices y transformaciones lineales', 'Matemáticas', 3),
('Programación en Python', 'CS101', 'Fundamentos de programación usando Python', 'Ciencias de la Computación', 3),
('Estructuras de Datos', 'CS201', 'Algoritmos y estructuras de datos fundamentales', 'Ciencias de la Computación', 4),
('Física I', 'FIS101', 'Mecánica clásica y termodinámica', 'Física', 4),
('Química General', 'QUI101', 'Principios fundamentales de química', 'Química', 4),
('Estadística', 'EST101', 'Estadística descriptiva e inferencial', 'Matemáticas', 3)
ON CONFLICT (code) DO NOTHING;