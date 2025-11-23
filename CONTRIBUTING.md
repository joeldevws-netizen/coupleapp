# Guía para Contribuir

¡Gracias por tu interés en contribuir a NuestroAmor! 💕

## 🎯 Cómo Contribuir

### Reportar Bugs

Si encuentras un bug:

1. **Verifica** que no exista ya un issue similar
2. **Crea** un nuevo issue con:
   - Descripción clara del problema
   - Pasos para reproducirlo
   - Comportamiento esperado vs actual
   - Screenshots si es posible
   - Información del navegador/OS

### Sugerir Features

Para proponer nuevas funcionalidades:

1. **Abre** un issue con el tag `enhancement`
2. **Describe** claramente:
   - ¿Qué problema resuelve?
   - ¿Cómo se usaría?
   - Ejemplos de uso
3. **Espera** feedback antes de empezar a codear

### Contribuir Código

1. **Fork** el repositorio
2. **Crea una rama** desde `main`:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Haz tus cambios** siguiendo las guías de estilo
4. **Commit** con mensajes descriptivos:
   ```bash
   git commit -m "feat: add amazing feature"
   ```
5. **Push** a tu fork:
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Abre** un Pull Request

## 📝 Guías de Estilo

### Código TypeScript/JavaScript

- Usa TypeScript para todo el código nuevo
- Sigue las reglas de ESLint (si está configurado)
- Nombres descriptivos para variables y funciones
- Comenta código complejo
- Tipado explícito donde sea posible

```typescript
// ✅ Bien
const fetchUserMood = async (userId: string): Promise<Mood | null> => {
  // ...
};

// ❌ Evitar
const get = async (id: any) => {
  // ...
};
```

### Componentes React

- Un componente por archivo
- Usar hooks personalizados para lógica compartida
- Props con TypeScript interfaces
- Comentarios JSDoc para componentes complejos

```typescript
interface Props {
  userId: string;
  onUpdate?: (mood: Mood) => void;
}

/**
 * Muestra y permite cambiar el mood del usuario
 */
export function MoodSelector({ userId, onUpdate }: Props) {
  // ...
}
```

### CSS

- Usar variables CSS del tema global
- Mobile-first approach
- BEM naming si es necesario
- Evitar `!important`

```css
/* ✅ Bien */
.mood-tracker {
  background: var(--bg-surface);
  color: var(--text-primary);
}

/* ❌ Evitar */
.mood-tracker {
  background: white !important;
  color: #333;
}
```

### Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Formato, sin cambios en código
- `refactor:` Refactorización de código
- `test:` Añadir o modificar tests
- `chore:` Mantenimiento general

```bash
# Ejemplos
git commit -m "feat: add mood history chart"
git commit -m "fix: resolve sync issue in MoodTracker"
git commit -m "docs: update installation steps"
```

## 🧪 Testing

Antes de hacer PR:

1. **Ejecuta** la app localmente:
   ```bash
   npm run dev
   ```
2. **Prueba** tu funcionalidad en:
   - Chrome/Edge
   - Firefox
   - Safari (si es posible)
   - Móvil
3. **Verifica** que el build funcione:
   ```bash
   npm run build
   npm run preview
   ```

## 📦 Pull Requests

### Checklist antes de abrir PR

- [ ] El código sigue las guías de estilo
- [ ] Los commits tienen mensajes descriptivos
- [ ] La funcionalidad fue probada localmente
- [ ] No hay console.logs olvidados
- [ ] Se actualizó la documentación si es necesario
- [ ] El build pasa sin errores

### Template de PR

```markdown
## Descripción

Breve descripción de los cambios

## Tipo de cambio

- [ ] Bug fix
- [ ] Nueva funcionalidad
- [ ] Breaking change
- [ ] Documentación

## ¿Cómo se probó?

Describe los pasos para probar

## Screenshots

Si aplica, añade screenshots

## Checklist

- [ ] Mi código sigue las guías del proyecto
- [ ] Probé localmente
- [ ] Actualicé la documentación
```

## 🏗️ Arquitectura del Proyecto

### Flujo de Datos

```
Component → Custom Hook → Supabase Client → PostgreSQL
                ↓
          Realtime Updates
                ↓
          All Clients
```

### Añadir Nueva Funcionalidad

1. **Base de datos**: Actualiza `database-setup.sql`
2. **Tipos**: Añade tipos en `database.types.ts`
3. **Hook**: Crea hook en `src/lib/hooks/`
4. **Componente**: Crea componente en `src/components/react/`
5. **Integración**: Añade en `AppContainer.tsx`

### Ejemplo completo

```typescript
// 1. database-setup.sql
CREATE TABLE new_feature (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id uuid REFERENCES couples(id),
  data text NOT NULL
);

// 2. database.types.ts
new_feature: {
  Row: {
    id: string;
    couple_id: string;
    data: string;
  }
}

// 3. useNewFeature.ts
export function useNewFeature() {
  const { coupleId } = useCoupleAuth();
  // ... lógica
}

// 4. NewFeature.tsx
export function NewFeature() {
  const { data } = useNewFeature();
  return <div>{data}</div>
}

// 5. AppContainer.tsx
<NewFeature />
```

## 🤔 ¿Dudas?

Si tienes preguntas:

1. Revisa los [issues existentes](https://github.com/tu-usuario/couple-app/issues)
2. Abre un nuevo issue con el tag `question`
3. Sé específico y proporciona contexto

## 📜 Código de Conducta

- Sé respetuoso y constructivo
- Acepta críticas constructivas
- Enfócate en lo mejor para el proyecto
- Ayuda a otros contributors

## 🎉 ¡Gracias!

Cada contribución, por pequeña que sea, es muy apreciada. ¡Gracias por ayudar a mejorar NuestroAmor! 💕
