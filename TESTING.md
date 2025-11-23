# 🧪 Checklist de Testing - NuestroAmor App

## ✅ Funcionalidades Core

### 1. Autenticación

- [ ] **Crear Nueva Pareja**
  - Ingresar nombre
  - Seleccionar fecha de aniversario
  - Verificar que se genera código de 6 caracteres
  - Verificar que el código se puede copiar
  - Verificar que se guarda en localStorage

- [ ] **Unirse a Pareja**
  - Ingresar nombre
  - Ingresar código válido (6 caracteres)
  - Verificar que conecta correctamente
  - Verificar que NO se queda en loading infinito
  - Verificar que muestra la app principal

- [ ] **Código Inválido**
  - Probar con código que no existe
  - Verificar mensaje de error apropiado

### 2. DaysCounter

- [ ] Muestra días transcurridos desde aniversario
- [ ] Muestra horas, minutos, segundos
- [ ] Se actualiza cada segundo
- [ ] Responsive en móvil

### 3. MoodTracker

- [ ] **Mi Mood**
  - Seleccionar un mood (🥰 😊 😐 😢 😰)
  - Verificar que se guarda en Supabase
  - Verificar que persiste al recargar
- [ ] **Mood de Pareja**
  - Abrir en otra pestaña/navegador
  - Cambiar mood en una ventana
  - Verificar que se actualiza en la otra (tiempo real)

### 4. MessageWall

- [ ] Escribir mensaje
- [ ] Enviar con botón
- [ ] Enviar con Enter
- [ ] Verificar que aparece en tiempo real
- [ ] Verificar límite de 500 caracteres
- [ ] Scroll automático a nuevo mensaje
- [ ] Contador de mensajes se actualiza

### 5. SharedTasks

- [ ] Añadir nueva tarea
- [ ] Marcar como completada
- [ ] Desmarcar tarea
- [ ] Eliminar tarea
- [ ] Verificar sync en tiempo real
- [ ] Persistencia al recargar

### 6. BucketList

- [ ] **Añadir Item**
  - Título
  - Categoría (viaje, actividad, comida, aventura, otro)
  - Prioridad (alta, media, baja)
  - Notas opcionales
- [ ] **Filtros**
  - Filtrar por todas/pendientes/logradas
  - Filtrar por categoría
- [ ] **Acciones**
  - Marcar como logrado
  - Eliminar item
- [ ] **Barra de progreso**
  - Verifica que el porcentaje es correcto

### 7. ImportantDates

- [ ] **Añadir Fecha**
  - Título del evento
  - Fecha
  - Icono (selector de 12 opciones)
  - Descripción opcional
- [ ] **Countdown**
  - Verifica countdown en tiempo real para próximo evento
  - Días, horas, minutos, segundos actualizándose
- [ ] **Timeline**
  - Muestra todas las fechas ordenadas
  - Muestra "En X días" / "Hace X días"
- [ ] **Eliminar**
  - Confirma antes de eliminar
  - Se elimina correctamente

### 8. PhotoGallery

- [ ] Muestra grid de fotos (demo)
- [ ] Click abre modal
- [ ] Modal muestra foto ampliada
- [ ] Cerrar modal funciona
- [ ] Contador de fotos correcto
- [ ] Responsive

**Nota**: PhotoGallery usa datos demo. Para subir fotos reales se necesita Supabase Storage.

### 9. ThemeToggle

- [ ] **Cambiar a Modo Oscuro**
  - Click en toggle (🌙)
  - Todos los componentes cambian de color
  - Buen contraste en todos los textos
  - Acentos rosa/amarillo destacan
- [ ] **Cambiar a Modo Claro**
  - Click en toggle (☀️)
  - Vuelve a colores pasteles
  - Buen contraste
- [ ] **Persistencia**
  - Cambiar tema
  - Recargar página
  - Verificar que mantiene el tema elegido

### 10. Logout

- [ ] Click en botón "Cerrar Sesión"
- [ ] Confirma antes de cerrar
- [ ] Limpia localStorage
- [ ] Vuelve a pantalla de autenticación
- [ ] No muestra datos de la pareja anterior

---

## 🔄 Sync en Tiempo Real

### Test de Dos Dispositivos

1. Abrir app en dos navegadores/pestañas diferentes
2. Usar el mismo código de pareja en ambos
3. Realizar acciones en uno:
   - Cambiar mood
   - Enviar mensaje
   - Añadir tarea
   - Completar bucket list item
4. Verificar que aparece instantáneamente en el otro

---

## 📱 Responsive Design

### Desktop (>1024px)

- [ ] Layout correcto
- [ ] Todos los componentes visibles
- [ ] Sin scroll horizontal

### Tablet (768px - 1024px)

- [ ] Layout se ajusta
- [ ] Readable sin zoom

### Móvil (<768px)

- [ ] Layout en columnas
- [ ] Botones táctiles grandes
- [ ] Texto legible
- [ ] Sin elementos cortados

---

## 🐛 Casos de Error

### Network

- [ ] Sin internet al cargar
  - Muestra mensaje apropiado
- [ ] Sin internet al hacer acción
  - Muestra error
  - No pierde datos al reconectar

### Validaciones

- [ ] Nombre vacío (crear/unir)
- [ ] Código vacío (unir)
- [ ] Código inválido (unir)
- [ ] Mensaje vacío
- [ ] Tarea vacía
- [ ] Bucket item sin título

### Límites

- [ ] Mensaje > 500 caracteres
- [ ] Nombre > 30 caracteres
- [ ] Título tarea > 100 caracteres

---

## 🔒 Seguridad

- [ ] .env no está en el código fuente
- [ ] Credenciales no en console.log
- [ ] RLS habilitado en Supabase
- [ ] Cada pareja solo ve sus datos

---

## ⚡ Performance

- [ ] Página carga en < 3 segundos
- [ ] Actualizaciones en tiempo real < 1 segundo
- [ ] Sin lag al escribir
- [ ] Animaciones suaves (60fps)

---

## 🎯 Prioridad Alta - Arreglar Primero

1. [ ] **Join con código funciona sin quedarse en loading**
2. [ ] **Mood sync en tiempo real funciona**
3. [ ] **Mensajes se sincronizan**
4. [ ] **Tareas se sincronizan**

---

## 📝 Notas de Testing

### Fecha: 2025-11-23

**Problemas encontrados**:

1. ✅ Join se quedaba en loading - ARREGLADO (removido joinSuccess intermediate state)
2. Pendiente verificar sync en tiempo real
3. Pendiente verificar todas las funcionalidades

**Siguiente**:

- Usuario debe probar join flow
- Verificar que todo funciona
- Reportar cualquier issue

---

## 🚀 Testing en Producción (Netlify)

Después de deployment:

- [ ] Crear pareja en producción
- [ ] Unirse desde otro dispositivo
- [ ] Verificar sync funciona
- [ ] Verificar en diferentes navegadores
- [ ] Verificar en móvil real

---

**Instrucciones para el usuario:**

1. Recarga la página completamente (Ctrl/Cmd + Shift + R)
2. Prueba crear una nueva pareja
3. Copia el código
4. Abre otra ventana de incognito
5. Únete con el código
6. Verifica que no se queda en loading
7. Prueba cambiar mood en una ventana
8. Verifica que se actualiza en la otra

Si algo no funciona, reporta exactamente qué paso falló.
