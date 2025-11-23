# Documentación de Componentes

## 🧩 Componentes React

Todos los componentes están en `src/components/react/` y están construidos con React + TypeScript.

### AppContainer

**Archivo**: `AppContainer.tsx`

Contenedor principal de la aplicación que maneja la autenticación y el layout general.

**Props**: Ninguna

**Características**:

- Verifica autenticación con `useCoupleAuth`
- Muestra `CoupleCodeAuth` si no está autenticado
- Renderiza header con theme toggle, código de pareja y logout
- Organiza todos los componentes en un layout responsive

**Hooks usados**:

- `useCoupleAuth()` - Manejo de autenticación

---

### CoupleCodeAuth

**Archivo**: `CoupleCodeAuth.tsx`

Pantalla de autenticación para crear o unirse a una pareja.

**Props**: Ninguna

**Características**:

- Modal de bienvenida con dos opciones
- Crear nueva pareja (genera código automático)
- Unirse con código existente
- Validación de formularios
- Animaciones suaves de transición

**Estados**:

- `step`: 'welcome' | 'create' | 'join'

---

### DaysCounter

**Archivo**: `DaysCounter.tsx`

Contador animado que muestra el tiempo transcurrido desde el aniversario.

**Props**: Ninguna

**Características**:

- Cuenta días, horas, minutos y segundos
- Actualización en tiempo real cada segundo
- Animación de flotación
- Responsive design

**Hooks usados**:

- `useCoupleAuth()` - Obtiene fecha de aniversario

---

### MoodTracker

**Archivo**: `MoodTracker.tsx`

Permite a cada miembro compartir su estado de ánimo actual.

**Props**: Ninguna

**Características**:

- 5 estados de ánimo: amazing, happy, okay, sad, stressed
- Vista lado a lado: "Mi mood" y "Mood de pareja"
- Sincronización en tiempo real vía Supabase
- Animaciones al seleccionar mood
- Paleta de colores distinta por mood

**Hooks usados**:

- `useMoodTracker()` - Gestión de moods con sync realtime

**Moods disponibles**:

```typescript
'amazing'   → 🥰 (rosa: #ff6b9d)
'happy'     → 😊 (naranja: #ffa726)
'okay'      → 😐 (gris: #9e9e9e)
'sad'       → 😢 (azul: #64b5f6)
'stressed'  → 😰 (morado: #ab47bc)
```

---

### MessageWall

**Archivo**: `MessageWall.tsx`

Muro de mensajes compartidos entre la pareja.

**Props**: Ninguna

**Características**:

- Feed de mensajes en orden cronológico
- Campo de texto multilinea
- Enter para enviar (Shift+Enter para nueva línea)
- Scroll automático a nuevo mensaje
- Contador de mensajes totales
- Límite de 500 caracteres por mensaje

**Hooks usados**:

- `useMessagesSync()` - CRUD de mensajes con realtime

---

### SharedTasks

**Archivo**: `SharedTasks.tsx`

Lista de tareas compartidas con checkboxes.

**Props**: Ninguna

**Características**:

- Añadir tarea con input + botón
- Marcar/desmarcar como completada
- Eliminar tarea
- Sincronización instantánea
- Animación al completar

**Hooks usados**:

- `useTasks()` - Gestión de tareas

---

### BucketList

**Archivo**: `BucketList.tsx`

Lista de sueños/metas por cumplir como pareja.

**Props**: Ninguna

**Características**:

- Categorías: viaje, actividad, gastronomía, aventura, otros
- Prioridades: alta, media, baja
- Notas opcionales
- Filtros por estado (todas/pendientes/logradas)
- Filtros por categoría
- Barra de progreso visual
- Grid responsivo

**Hooks usados**:

- `useBucketList()` - CRUD de bucket list

**Categorías**:

```typescript
'travel'    → ✈️
'activity'  → 🎯
'food'      → 🍽️
'adventure' → 🏔️
'other'     → 💫
```

---

### ImportantDates

**Archivo**: `ImportantDates.tsx`

Calendario de eventos importantes con countdown.

**Props**: Ninguna

**Características**:

- Añadir fechas especiales
- Selector de iconos (12 emojis disponibles)
- Descripción opcional
- Countdown en tiempo real para próximo evento
- Timeline visual de todas las fechas
- Ordenadas por proximidad
- Auto-cálculo de "días hasta" / "hace X días"

**Hooks usados**:

- `useImportantDates()` - Gestión de fechas

**Tipos de fecha**:

- anniversary
- birthday
- special
- recurring

---

### PhotoGallery

**Archivo**: `PhotoGallery.tsx`

Galería de fotos compartidas (actualmente con datos demo).

**Props**: Ninguna

**Características**:

- Grid responsive de fotos
- Modal de vista ampliada
- Overlay con título y fecha al hover
- Animación de apertura
- Contador de fotos

**Estado**: Demo mode (fotos de Unsplash)

**⚠️ Nota**: Requiere integración con Supabase Storage para subir fotos reales.

---

### ThemeToggle

**Archivo**: `ThemeToggle.tsx`

Toggle para cambiar entre modo claro y oscuro.

**Props**: Ninguna

**Características**:

- Botón animado con track y thumb
- Iconos: ☀️ (light) / 🌙 (dark)
- Transición suave de colores
- Guarda preferencia en localStorage
- Detecta `prefers-color-scheme` del sistema

**Hooks usados**:

- `useTheme()` - Gestión de tema global

---

## 🪝 Custom Hooks

Todos los hooks están en `src/lib/hooks/`.

### useCoupleAuth

**Archivo**: `useCoupleAuth.ts`

**Propósito**: Gestionar autenticación y datos de la pareja

**Retorna**:

```typescript
{
  isAuthenticated: boolean;
  loading: boolean;
  coupleId: string | null;
  coupleCode: string | null;
  partnerName: string | null;
  anniversaryDate: string | null;
  createCouple: (data) => Promise<Result>;
  joinCouple: (code, name) => Promise<Result>;
  logout: () => void;
}
```

**Storage**: localStorage (clave: `couple-auth-data`)

---

### useMoodTracker

**Archivo**: `useMoodTracker.ts`

**Propósito**: Gestionar moods con sincronización en tiempo real

**Retorna**:

```typescript
{
  myMood: Mood | null;
  partnerMood: Mood | null;
  loading: boolean;
  setMood: (mood: Mood, note?: string) => Promise<Result>;
}
```

**Realtime**: Sí (Supabase PostgreSQL changes)

**Tabla**: `mood_entries`

---

### useMessagesSync

**Archivo**: `useMessagesSync.ts`

**Propósito**: Gestionar mensajes con sync en tiempo real

**Retorna**:

```typescript
{
  messages: Message[];
  loading: boolean;
  sendMessage: (content: string, senderName: string) => Promise<Result>;
}
```

**Realtime**: Sí

**Tabla**: `messages`

---

### useTasks

**Archivo**: `useTasks.ts`

**Propósito**: CRUD de tareas compartidas

**Retorna**:

```typescript
{
  tasks: Task[];
  loading: boolean;
  addTask: (title: string) => Promise<Result>;
  toggleTask: (id: string, completed: boolean) => Promise<Result>;
  deleteTask: (id: string) => Promise<Result>;
}
```

**Realtime**: Sí

**Tabla**: `tasks`

---

### useBucketList

**Archivo**: `useBucketList.ts`

**Propósito**: Gestionar bucket list

**Retorna**:

```typescript
{
  items: BucketItem[];
  loading: boolean;
  addItem: (data: BucketItemData) => Promise<Result>;
  toggleItem: (id: string, completed: boolean) => Promise<Result>;
  deleteItem: (id: string) => Promise<Result>;
}
```

**Realtime**: Sí

**Tabla**: `bucket_list`

---

### useImportantDates

**Archivo**: `useImportantDates.ts`

**Propósito**: Gestionar fechas importantes

**Retorna**:

```typescript
{
  dates: ImportantDate[];
  loading: boolean;
  addDate: (data: DateData) => Promise<Result>;
  deleteDate: (id: string) => Promise<Result>;
}
```

**Realtime**: Sí

**Tabla**: `important_dates`

---

### useTheme

**Archivo**: `useTheme.ts`

**Propósito**: Gestionar tema (light/dark mode)

**Retorna**:

```typescript
{
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isDark: boolean;
}
```

**Storage**: localStorage (clave: `couple-app-theme`)

**Efecto**: Cambia atributo `data-theme` en `<html>`

---

### useRealtime

**Archivo**: `useRealtime.ts`

**Propósito**: Hook genérico para suscripciones de Supabase Realtime

**Uso**:

```typescript
useRealtime<T>({
  table: 'table_name',
  filter: 'column=eq.value',
  event: 'INSERT' | 'UPDATE' | 'DELETE',
  onInsert?: (payload) => void,
  onUpdate?: (payload) => void,
  onDelete?: (payload) => void,
})
```

---

## 🎨 Sistema de Temas

**Archivo**: `src/styles/global.css`

### Variables CSS

#### Modo Claro

```css
--bg-primary: linear-gradient(135deg, #ffc3ee, #fff59d);
--bg-surface: rgba(255, 255, 255, 0.95);
--bg-elevated: #ffffff;
--text-primary: #2d2d2d;
--accent-pink: #ff6b9d;
--accent-yellow: #ffa726;
```

#### Modo Oscuro

```css
--bg-primary: linear-gradient(135deg, #0a0a0a, #1a1a1a);
--bg-surface: rgba(25, 25, 35, 0.98);
--bg-elevated: #1e1e2e;
--text-primary: #f5f5f5;
--accent-pink: #ff6b9d; /* Mismos acentos */
--accent-yellow: #ffb74d;
```

### Cómo Usar

```css
.my-component {
  background: var(--bg-surface);
  color: var(--text-primary);
  border: 2px solid var(--border-primary);
}
```

El tema se aplica automáticamente vía `data-theme="light|dark"` en `<html>`.

---

## 📊 Base de Datos

Ver `database-setup.sql` para el schema completo.

### Tablas principales

1. **couples** - Información de parejas
2. **messages** - Mensajes enviados
3. **tasks** - Tareas compartidas
4. **bucket_list** - Lista de sueños
5. **important_dates** - Fechas especiales
6. **mood_entries** - Historial de moods
7. **photos** - Fotos compartidas (futuro)

Todas tienen:

- UUID como primary key
- `couple_id` como foreign key
- `created_at` timestamp
- Row Level Security habilitado
- Realtime habilitado

---

## 🔄 Flujo de Datos

```
Usuario interactúa con Component
         ↓
Component usa Custom Hook
         ↓
Hook llama a Supabase Client
         ↓
Supabase actualiza PostgreSQL
         ↓
PostgreSQL emite evento de cambio
         ↓
Supabase Realtime notifica a todos los clientes
         ↓
Hook recibe update y actualiza estado
         ↓
Component re-renderiza automáticamente
```

---

## 📝 Convenciones

### Naming

- **Componentes**: PascalCase (`MoodTracker.tsx`)
- **Hooks**: camelCase con `use` prefix (`useMoodTracker.ts`)
- **Tipos**: PascalCase (`MoodEntry`)
- **Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE

### Estructura de archivo de componente

```typescript
// 1. Imports
import { useState } from 'react';
import { useMyHook } from '../../lib/hooks/useMyHook';

// 2. Types/Interfaces
interface Props {
  // ...
}

// 3. Constants (si aplica)
const ITEMS = [...];

// 4. Component
export default function MyComponent({ prop }: Props) {
  // 4a. Hooks
  const { data } = useMyHook();
  const [state, setState] = useState();

  // 4b. Handlers
  const handleClick = () => { };

  // 4c. Render
  return (
    <div>
      {/* JSX */}
      <style>{/* CSS */}</style>
    </div>
  );
}
```

---

Esta documentación está actualizada a la última versión del código. Para más detalles, revisa el código fuente directamente.
