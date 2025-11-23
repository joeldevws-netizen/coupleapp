# 💕 NuestroAmor - App de Pareja

> Una aplicación web moderna para parejas con sincronización en tiempo real, construida con Astro, React y Supabase.

[![Astro](https://img.shields.io/badge/Astro-4.x-orange?logo=astro)](https://astro.build)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-green?logo=supabase)](https://supabase.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## ✨ Características

### 🔄 Sincronización en Tiempo Real

- **Todos los datos se sincronizan automáticamente** entre dispositivos usando Supabase Realtime
- Sin necesidad de recargar la página
- Cambios instantáneos visibles para ambos miembros

### 📊 Funcionalidades

- 📅 **Contador de Días**: Cuenta los días, horas, minutos y segundos juntos
- 💬 **Muro de Mensajes**: Comparte mensajes con tu pareja
- ✅ **Tareas Compartidas**: Lista de tareas con checkbox en tiempo real
- 📝 **Fechas Importantes**: Calendario de eventos especiales con countdown
- 🎯 **Bucket List**: Lista de sueños por cumplir juntos (categorías y prioridades)
- 😊 **Mood Tracker**: Comparte cómo te sientes en tiempo real
- 📸 **Galería de Fotos**: Álbum de recuerdos compartidos
- 🌓 **Modo Oscuro/Claro**: Toggle de tema completo con colores vibrantes

### 🔐 Sistema de Autenticación

- Código único de pareja para acceso compartido
- Sin necesidad de crear cuentas individuales
- Cada pareja tiene su propio código de 6 dígitos

### 🎨 Diseño Premium

- Interfaz moderna con colores rosa pastel y amarillo
- Animaciones suaves y micro-interacciones
- Glassmorphism y gradientes vibrantes
- Totalmente responsive (móvil, tablet, desktop)

## 🚀 Demo

[Ver Demo en Vivo](https://tu-app.netlify.app) _(opcional - añadir tu URL de Netlify)_

## 📸 Screenshots

_Añade capturas de pantalla aquí una vez tengas el proyecto desplegado_

## 🛠️ Stack Tecnológico

| Tecnología                                    | Uso                                    |
| --------------------------------------------- | -------------------------------------- |
| [Astro 4.x](https://astro.build)              | Framework web estático                 |
| [React 18](https://react.dev)                 | Componentes interactivos               |
| [Supabase](https://supabase.com)              | Backend (PostgreSQL + Realtime + Auth) |
| [TypeScript](https://www.typescriptlang.org/) | Tipado estático                        |
| Vanilla CSS                                   | Estilos personalizados                 |
| [Netlify](https://netlify.com)                | Hosting                                |

## 📋 Prerequisitos

- Node.js 18 o superior
- npm o yarn
- Cuenta gratuita en [Supabase](https://supabase.com)
- (Opcional) Cuenta gratuita en [Netlify](https://netlify.com) para deployment

## 🏃‍♂️ Inicio Rápido

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/couple-app.git
cd couple-app
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar Supabase

#### a) Crear proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Espera a que se aprovisione (~2 minutos)

#### b) Ejecutar script de base de datos

1. En Supabase Dashboard → SQL Editor → New Query
2. Copia y pega el contenido de `database-setup.sql`
3. Click en "Run"

Esto creará:

- Tabla `couples` (información de parejas)
- Tabla `important_dates` (fechas especiales)
- Tabla `bucket_list` (lista de sueños)
- Tabla `tasks` (tareas compartidas)
- Tabla `messages` (mensajes)
- Tabla `mood_entries` (estados de ánimo)
- Tabla `photos` (fotos compartidas)
- Índices y triggers automáticos
- Políticas de Row Level Security (RLS)

#### c) Habilitar Realtime

1. Database → Replication
2. Activa todas las tablas creadas

### 4. Configurar variables de entorno

Copia el archivo de ejemplo:

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales de Supabase:

```env
PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon-aqui
```

Obtén estas credenciales en: Supabase Dashboard → Project Settings → API

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:4321](http://localhost:4321)

## 📁 Estructura del Proyecto

```
couple-app/
├── src/
│   ├── components/
│   │   └── react/              # Componentes React
│   │       ├── AppContainer.tsx
│   │       ├── DaysCounter.tsx
│   │       ├── MessageWall.tsx
│   │       ├── SharedTasks.tsx
│   │       ├── BucketList.tsx
│   │       ├── ImportantDates.tsx
│   │       ├── MoodTracker.tsx
│   │       ├── PhotoGallery.tsx
│   │       ├── ThemeToggle.tsx
│   │       └── CoupleCodeAuth.tsx
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   └── index.astro         # Página principal
│   ├── lib/
│   │   ├── hooks/              # Custom hooks
│   │   │   ├── useCoupleAuth.ts
│   │   │   ├── useMoodTracker.ts
│   │   │   ├── useMessagesSync.ts
│   │   │   ├── useTasks.ts
│   │   │   ├── useBucketList.ts
│   │   │   ├── useImportantDates.ts
│   │   │   ├── useTheme.ts
│   │   │   └── useRealtime.ts
│   │   ├── types/
│   │   │   └── database.types.ts
│   │   └── supabase.ts         # Cliente Supabase
│   └── styles/
│       └── global.css          # Estilos globales + temas
├── public/
│   └── favicon.svg
├── database-setup.sql          # Script completo de DB
├── .env.example                # Ejemplo de variables de entorno
├── astro.config.mjs
├── netlify.toml
├── package.json
└── README.md
```

## 🌐 Deployment en Netlify

### Opción 1: Deploy desde Git

1. Push a GitHub:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/tu-usuario/couple-app.git
   git push -u origin main
   ```

2. En Netlify:
   - Click "Add new site" → "Import an existing project"
   - Conecta tu repositorio
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Añade environment variables:
     - `PUBLIC_SUPABASE_URL`
     - `PUBLIC_SUPABASE_ANON_KEY`
   - Click "Deploy"

### Opción 2: Deploy con CLI

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

## 🔧 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo (localhost:4321)
npm run build        # Build de producción
npm run preview      # Preview del build
npm run astro        # CLI de Astro
```

## 🎯 Cómo Usar

### Primera vez

1. Abre la app
2. Verás la pantalla de autenticación
3. Click en "Crear Nueva Pareja"
4. Ingresa:
   - Tu nombre
   - Nombre de tu pareja
   - Fecha de aniversario
5. Se generará un código único de 6 dígitos
6. **Comparte este código con tu pareja**

### Como pareja

1. Ingresa el código compartido por tu pareja
2. Ingresa tu nombre
3. ¡Listo! Ambos verán los mismos datos sincronizados

### Características por componente

- **Contador**: Actualización automática cada segundo
- **Mood Tracker**: Click en un emoji para cambiar tu mood
- **Mensajes**: Escribe y presiona Enter (o click en Enviar)
- **Tareas**: Click en checkbox para marcar completada
- **Bucket List**: Filtra por categoría o estado
- **Fechas**: Añade eventos con countdown automático
- **Tema**: Click en el toggle ☀️/🌙 en el header

## 🎨 Personalización

### Cambiar colores del tema

Edita `src/styles/global.css`:

```css
/* Modo claro */
:root[data-theme="light"] {
  --accent-pink: #ff6b9d;
  --accent-yellow: #ffa726;
  /* ...más colores */
}

/* Modo oscuro */
:root[data-theme="dark"] {
  --accent-pink: #ff6b9d;
  --accent-yellow: #ffb74d;
  /* ...más colores */
}
```

### Añadir nuevas características

1. Crea un nuevo componente React en `src/components/react/`
2. Crea un hook si necesitas datos de Supabase en `src/lib/hooks/`
3. Añade el componente en `AppContainer.tsx`
4. Si necesitas una nueva tabla, actualiza `database-setup.sql`

## 🐛 Troubleshooting

### La sincronización en tiempo real no funciona

- ✅ Verifica que Realtime esté habilitado en Supabase (Database → Replication)
- ✅ Revisa la consola del navegador para errores
- ✅ Confirma que las variables de entorno estén correctas

### Error "Row Level Security"

- ✅ Ejecuta completamente `database-setup.sql`
- ✅ Verifica que el código de pareja sea válido
- ✅ Comprueba las políticas RLS en Supabase

### Build falla en Netlify

- ✅ Asegúrate de que las environment variables estén configuradas
- ✅ Verifica que uses Node.js 18+
- ✅ Revisa los logs de build

### Los cambios no se reflejan

- ✅ Refresca la página (Ctrl/Cmd + R)
- ✅ Limpia la caché del navegador
- ✅ Verifica tu conexión a internet

## 🔐 Seguridad

- **Row Level Security (RLS)**: Cada pareja solo ve sus propios datos
- **Código de pareja**: Autenticación simple sin contraseñas
- **HTTPS**: SSL automático con Netlify
- **Environment Variables**: Claves sensibles nunca en el código
- **Anon Key Pública**: Es seguro exponerla (solo lectura)

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

Ver [CONTRIBUTING.md](CONTRIBUTING.md) para más detalles.

## 📝 Roadmap

- [ ] Notificaciones push
- [ ] Modo offline con sincronización
- [ ] App móvil nativa (React Native)
- [ ] Exportar datos a PDF
- [ ] Integración con calendario
- [ ] Recordatorios automáticos
- [ ] Temas personalizables
- [ ] Múltiples idiomas

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 💖 Agradecimientos

- [Astro](https://astro.build) por el increíble framework
- [Supabase](https://supabase.com) por el backend todo-en-uno
- [React](https://react.dev) por los componentes interactivos
- A todas las parejas que usan esta app ❤️

## 📧 Contacto

¿Preguntas? ¿Sugerencias? ¡Abre un issue!

---

**Hecho con 💕 para parejas que quieren estar más conectadas**
