# Comandos Git para Subir a GitHub

## 📋 Pasos para subir el proyecto a GitHub

### 1. Inicializar repositorio local (si no está inicializado)

```bash
cd /home/darkjeizy/Programar/Html/couple-app
git init
```

### 2. Añadir todos los archivos

```bash
git add .
```

### 3. Hacer el primer commit

```bash
git commit -m "Initial commit: couple app v1.0.0"
```

### 4. Crear repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre del repositorio: `couple-app` (o el que prefieras)
3. Descripción: "💕 App web para parejas con sincronización en tiempo real"
4. Público o Privado (tu elección)
5. **NO** marques "Add README" ni "Add .gitignore" (ya los tenemos)
6. Click en "Create repository"

### 5. Conectar repositorio local con GitHub

Reemplaza `TU-USUARIO` con tu nombre de usuario de GitHub:

```bash
git remote add origin https://github.com/TU-USUARIO/couple-app.git
```

O si usas SSH:

```bash
git remote add origin git@github.com:TU-USUARIO/couple-app.git
```

### 6. Subir código a GitHub

```bash
git branch -M main
git push -u origin main
```

## 🔧 Comandos útiles

### Ver estado del repositorio

```bash
git status
```

### Ver archivos que se subirán

```bash
git ls-files
```

### Verificar remote configurado

```bash
git remote -v
```

### Hacer cambios posteriores

```bash
# 1. Ver cambios
git status

# 2. Añadir cambios
git add .

# 3. Commit
git commit -m "descripción del cambio"

# 4. Push
git push
```

## 📝 Mensajes de commit recomendados

Usa estos prefijos para commits:

- `feat:` - Nueva funcionalidad
- `fix:` - Corrección de bug
- `docs:` - Cambios en documentación
- `style:` - Cambios de formato/estilo
- `refactor:` - Refactorización de código
- `test:` - Añadir tests
- `chore:` - Mantenimiento

Ejemplos:

```bash
git commit -m "feat: add photo upload functionality"
git commit -m "fix: resolve sync issue in MoodTracker"
git commit -m "docs: update README with new screenshots"
```

## 🏷️ Crear release/tag

```bash
# Crear tag para versión 1.0.0
git tag -a v1.0.0 -m "Release v1.0.0"

# Subir tag a GitHub
git push origin v1.0.0
```

## ⚠️ Antes de hacer push

### Verificar que .env NO se suba:

```bash
git status | grep .env
```

Si aparece `.env`, asegúrate de que esté en `.gitignore`:

```bash
echo ".env" >> .gitignore
git rm --cached .env  # Si ya fue añadido
git add .gitignore
git commit -m "chore: ensure .env is ignored"
```

### Archivos que SÍ deben subirse:

✅ `.env.example`
✅ `README.md`
✅ `CONTRIBUTING.md`
✅ `COMPONENTS.md`
✅ `CHANGELOG.md`
✅ `LICENSE`
✅ `database-setup.sql`
✅ Todo el código en `src/`
✅ `package.json` y `package-lock.json`
✅ `.gitignore`

### Archivos que NO deben subirse:

❌ `.env`
❌ `node_modules/`
❌ `dist/`
❌ `.astro/`
❌ `.netlify/`
❌ Archivos `.backup`

## 🌐 Después de subir a GitHub

### Configurar GitHub Pages (opcional)

No aplica para este proyecto (usamos Netlify)

### Configurar Netlify desde GitHub

1. Ve a https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Conecta con GitHub
4. Selecciona el repositorio `couple-app`
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Environment variables:
   - `PUBLIC_SUPABASE_URL`: [tu URL]
   - `PUBLIC_SUPABASE_ANON_KEY`: [tu key]
7. Click "Deploy"

### Actualizar README

Después del primer deploy en Netlify, actualiza el README con:

- URL del sitio en vivo
- Screenshots
- Badge de build status (opcional)

```bash
git add README.md
git commit -m "docs: add live demo URL and screenshots"
git push
```

## 🎉 ¡Listo!

Tu proyecto ahora está en GitHub y listo para ser compartido.

URL del repositorio: `https://github.com/TU-USUARIO/couple-app`
