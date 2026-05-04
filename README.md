# 🧠 PupiAgenda

Agenda clínica moderna para psicólogos.  
Permite gestionar pacientes, sesiones clínicas y evolución terapéutica con foco en usabilidad, privacidad y flujo real de trabajo.

---

## 🚀 Demo

> (Agregar URL cuando esté deployado)

Cuenta demo:
- Email: demo@pupiagenda.com
- Password: ******

---

## 🧩 Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase
  - Auth
  - PostgreSQL
  - RLS

---

## 🎯 Funcionalidades

### 👤 Gestión de pacientes
- Registro completo de pacientes
- Datos clínicos relevantes
- Historial estructurado

### 🧾 Fichas clínicas
- Registro por sesión
- Campos clínicos:
  - motivo
  - desarrollo
  - observaciones
  - intervenciones
- Evolución terapéutica

### 📊 Sesiones
- Estados:
  - draft
  - completed
  - cancelled
  - no_show
- Historial completo por paciente

---

## 🧠 Sistema de sugerencias

Los usuarios pueden enviar:
- ideas
- mejoras
- problemas detectados

Flujo:
```txt
Usuario → sugerencia → panel admin → roadmap