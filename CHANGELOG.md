# Changelog

Todos los cambios notables de este proyecto estarán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [1.0.0] - 2025-11-23

### ✨ Añadido

#### Características Principales

- **Sistema de autenticación** con código único de pareja (6 dígitos)
- **Contador de días juntos** con actualización en tiempo real (segundos, minutos, horas, días)
- **Mood Tracker** - Sistema de estado de ánimo sincronizado en tiempo real
  - 5 moods disponibles: increíble, feliz, normal, triste, estresado
  - Vista de mood propio y de pareja
  - Sincronización instantánea vía Supabase Realtime
- **Muro de Mensajes** - Feed de mensajes compartidos
  - Límite de 500 caracteres por mensaje
  - Scroll automático a nuevos mensajes
  - Sincronización en tiempo real
- **Tareas Compartidas** - Lista de tareas con checkboxes
  - Añadir, completar y eliminar tareas
  - Estado sincronizado entre dispositivos
- **Bucket List** - Lista de sueños por cumplir
  - 5 categorías: viaje, actividad, gastronomía, aventura, otros
  - 3 niveles de prioridad: alta, media, baja
  - Notas opcionales
  - Filtros por categoría y estado
  - Barra de progreso visual
- **Fechas Importantes** - Calendario de eventos especiales
  - Selector de 12 iconos diferentes
  - Countdown en tiempo real para próximo evento
  - Timeline visual ordenada por proximidad
  - Descripciones opcionales
- **Galería de Fotos** - Álbum compartido (datos demo)
  - Grid responsive
  - Modal de vista ampliada
  - Overlays con información
- **Sistema de Temas** - Modo claro y oscuro completo
  - Toggle animado con icono sol/luna
  - Colores vibrantes en ambos modos
  - Variables CSS reutilizables
  - Preferencia guardada en localStorage
  - Detección de preferencia del sistema

#### Sincronización en Tiempo Real

- Implementado Supabase Realtime en todas las funcionalidades
- WebSocket connection automática
- Actualizaciones instantáneas sin polling
- Manejo de reconexión automática

#### Base de Datos

- Schema completo de PostgreSQL con 7 tablas
- Row Level Security (RLS) habilitado
- Políticas de acceso configuradas
- Índices para optimización de queries
- Triggers automáticos para `updated_at`
- Función para generar códigos únicos de pareja

#### Diseño y UX

- Interfaz premium con colores rosa pastel y amarillo
- Animaciones suaves en todas las interacciones
- Micro-animaciones para feedback visual
- Glassmorphism y gradientes
- Responsive design (móvil, tablet, desktop)
- Scroll personalizado
- Loading states para todas las operaciones

#### Documentación

- README.md completo con instrucciones paso a paso
- CONTRIBUTING.md con guías para contribuidores
- COMPONENTS.md con documentación técnica de todos los componentes
- LICENSE (MIT)
- Comentarios JSDoc en funciones principales
- Script SQL documentado

#### Development

- TypeScript en todo el proyecto
- Custom hooks para lógica reutilizable
- Tipos completos de base de datos
- Environment variables configurables
- Build optimizado para producción
- Hot reload en desarrollo

### 🔧 Técnico

#### Stack

- Astro 4.x como framework web
- React 18 para componentes interactivos
- Supabase para backend (PostgreSQL + Realtime + Auth)
- TypeScript 5.x
- Vanilla CSS con variables
- Netlify para deployment

#### Estructura

```
src/
├── components/react/    # 9 componentes React
├── lib/
│   ├── hooks/          # 8 custom hooks
│   ├── types/          # TypeScript types
│   └── supabase.ts     # Cliente configurado
├── pages/              # Páginas Astro
├── styles/             # CSS global + temas
└── layouts/            # Layouts
```

#### Hooks Implementados

- `useCoupleAuth` - Autenticación y gestión de pareja
- `useMoodTracker` - Moods sincronizados
- `useMessagesSync` - Mensajes en tiempo real
- `useTasks` - CRUD de tareas
- `useBucketList` - Gestión de bucket list
- `useImportantDates` - Fechas importantes
- `useTheme` - Tema light/dark
- `useRealtime` - Hook genérico para subscripciones

#### Componentes

- `AppContainer` - Container principal + auth
- `CoupleCodeAuth` - Pantalla de login
- `DaysCounter` - Contador animado
- `MoodTracker` - Estados de ánimo
- `MessageWall` - Muro de mensajes
- `SharedTasks` - Lista de tareas
- `BucketList` - Lista de sueños
- `ImportantDates` - Calendario de eventos
- `PhotoGallery` - Galería de fotos
- `ThemeToggle` - Toggle de tema

### 🎨 Diseño

#### Paleta de Colores (Modo Claro)

- Rosa pastel: #ffc3ee
- Rosa medio: #ff6b9d
- Amarillo pastel: #fff59d
- Naranja: #ffa726
- Texto oscuro: #2d2d2d

#### Paleta de Colores (Modo Oscuro)

- Fondo oscuro: #0a0a0a → #1a1a1a
- Superficie: rgba(25, 25, 35, 0.98)
- Texto claro: #f5f5f5
- Acentos: Mismos rosas y amarillos brillantes

### 📦 Deployment

- Configuración lista para Netlify
- Build command: `npm run build`
- Publish directory: `dist`
- Environment variables documentadas
- Redirects configurados

### 🔒 Seguridad

- Row Level Security en todas las tablas
- Environment variables para claves sensibles
- `.gitignore` completo
- Validación de inputs
- Límites de caracteres
- HTTPS automático (Netlify)

### 📝 Notas

- Versión inicial estable
- Todas las características core implementadas
- Build sin errores (solo 4 hints menores)
- Listo para producción

---

## [Unreleased]

### 🚧 Planeado para futuras versiones

- [ ] Subida real de fotos con Supabase Storage
- [ ] Notificaciones push
- [ ] Modo offline con sincronización
- [ ] Exportar datos a PDF
- [ ] Integración con calendario
- [ ] Recordatorios automáticos
- [ ] Temas personalizables
- [ ] Soporte multi-idioma
- [ ] App móvil nativa
- [ ] Historial de moods con gráficos
- [ ] Búsqueda en mensajes
- [ ] Tags en bucket list

---

[1.0.0]: https://github.com/tu-usuario/couple-app/releases/tag/v1.0.0
