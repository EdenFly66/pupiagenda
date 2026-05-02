# 🧠 PupiAgenda

Aplicación clínica web diseñada para psicólogas, orientada a la gestión segura de pacientes, sesiones e historial clínico.

Proyecto desarrollado como producto real, con enfoque en usabilidad, seguridad y escalabilidad.

---

## 🚀 Demo

> ⚠️ Esta aplicación puede contener una cuenta demo con datos ficticios.
> No incluye información clínica real.

---

## ✨ Features principales

### 🔐 Autenticación y seguridad

- Login / logout con Supabase Auth
- Persistencia de sesión
- Row Level Security (RLS)
- Aislamiento de datos por usuario

---

### 👤 Gestión de pacientes

- CRUD completo
- Datos personales y clínicos
- Validaciones de formulario

---

### 🧠 Sesiones clínicas

- Creación y edición de sesiones
- Estados:
  - borrador
  - finalizada
  - cancelada
  - no asistió
- Autosave
- Contenido clínico estructurado

---

### 📚 Historial clínico

- Listado por paciente
- Navegación clara
- Organización temporal

---

### 📎 Documentos

- Subida de archivos
- Integración con Supabase Storage

---

### 📄 Exportación

- Exportación de sesión a PDF
- Exportación de historial clínico

---

### 📊 Dashboard

- Resumen general
- Actividad reciente
- Accesos rápidos

---

## 🆕 V2 Features

### 📢 Sistema de anuncios

- Tablón de novedades del sistema
- Lectura desde Supabase
- Visibilidad de 30 días
- Estados:
  - loading
  - empty
  - error

---

### 💬 Sistema de sugerencias

- Envío de feedback desde la aplicación
- Categorías:
  - idea
  - bug
  - improvement
  - other
- Historial por usuario
- Estados internos:
  - pending
  - reviewed
  - planned
  - done
  - rejected
- RLS: cada usuario solo ve sus sugerencias

---

### 🎨 Personalización visual

- Paletas frutales por usuario:
  - strawberry, blueberry, kiwi, mango, peach, etc.
- Aplicación global del tema
- Diseño consistente y accesible

---

### 🔐 Recuperación de contraseña

- Flujo completo con Supabase Auth
- Reset seguro

---

## 🧱 Stack tecnológico

### Frontend

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui

### Backend

- Supabase:
  - Auth
  - PostgreSQL
  - Storage
  - Row Level Security (RLS)

### Infraestructura

- Vercel (deploy)

---

## 🧠 Decisiones técnicas clave

- Uso de App Router para estructura escalable
- Separación por features (`announcements`, `feedback`, etc.)
- Tipado estricto con TypeScript
- Seguridad basada en RLS (no lógica en frontend)
- Mapeo explícito de DB → dominio (`snake_case → camelCase`)
- Manejo de estados UI (loading / empty / error) en todas las vistas críticas

---

## 🔒 Seguridad

- Aislamiento de datos por usuario mediante RLS
- No exposición de claves sensibles
- Manejo de datos clínicos con enfoque de privacidad

---

## 📱 UX / UI

- Diseño cálido tipo “agenda clínica”
- Responsive (desktop, tablet, móvil)
- Accesibilidad base (WCAG AA)
- Reducción de carga cognitiva

---

## 🧪 Testing / QA (manual)

- Flujos críticos:
  - autenticación
  - creación de sesión
  - historial clínico
  - anuncios
  - sugerencias
- Validación de estados UI
- Verificación de RLS

---

## 📦 Estado del proyecto

```txt
V2 - Producción