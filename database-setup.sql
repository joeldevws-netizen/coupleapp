-- ============================================
-- COUPLE APP - SUPABASE DATABASE SETUP
-- ============================================
-- Ejecuta este script en Supabase SQL Editor
-- Crea todas las tablas necesarias para la app
-- ============================================

-- 1. TABLA DE PAREJAS con código compartido
CREATE TABLE IF NOT EXISTS couples (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_code TEXT UNIQUE NOT NULL,
  partner1_name TEXT,
  partner2_name TEXT,
  anniversary_date DATE NOT NULL DEFAULT CURRENT_DATE,
  theme_color TEXT DEFAULT 'pink',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. FECHAS IMPORTANTES
CREATE TABLE IF NOT EXISTS important_dates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id uuid REFERENCES couples(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('anniversary', 'birthday', 'special', 'recurring')),
  icon TEXT NOT NULL DEFAULT '🎉',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BUCKET LIST
CREATE TABLE IF NOT EXISTS bucket_list (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id uuid REFERENCES couples(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('travel', 'activity', 'food', 'adventure', 'other')),
  priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
  completed BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 4. TAREAS COMPARTIDAS
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id uuid REFERENCES couples(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. MENSAJES
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id uuid REFERENCES couples(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. FOTOS
CREATE TABLE IF NOT EXISTS photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id uuid REFERENCES couples(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption TEXT,
  date_taken DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. MOOD TRACKER
CREATE TABLE IF NOT EXISTS mood_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id uuid REFERENCES couples(id) ON DELETE CASCADE,
  partner_name TEXT NOT NULL,
  mood TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_dates_couple ON important_dates(couple_id);
CREATE INDEX IF NOT EXISTS idx_dates_date ON important_dates(date);
CREATE INDEX IF NOT EXISTS idx_bucket_couple ON bucket_list(couple_id);
CREATE INDEX IF NOT EXISTS idx_bucket_completed ON bucket_list(completed);
CREATE INDEX IF NOT EXISTS idx_photos_couple ON photos(couple_id);
CREATE INDEX IF NOT EXISTS idx_mood_couple ON mood_entries(couple_id);
CREATE INDEX IF NOT EXISTS idx_mood_created ON mood_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tasks_couple ON tasks(couple_id);
CREATE INDEX IF NOT EXISTS idx_messages_couple ON messages(couple_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_couples_code ON couples(couple_code);

-- ============================================
-- TRIGGER PARA UPDATED_AT AUTOMÁTICO
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a todas las tablas con updated_at
DROP TRIGGER IF EXISTS update_couples_updated_at ON couples;
CREATE TRIGGER update_couples_updated_at BEFORE UPDATE ON couples
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_dates_updated_at ON important_dates;
CREATE TRIGGER update_dates_updated_at BEFORE UPDATE ON important_dates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bucket_updated_at ON bucket_list;
CREATE TRIGGER update_bucket_updated_at BEFORE UPDATE ON bucket_list
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_photos_updated_at ON photos;
CREATE TRIGGER update_photos_updated_at BEFORE UPDATE ON photos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE couples ENABLE ROW LEVEL SECURITY;
ALTER TABLE important_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE bucket_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS DE ACCESO PÚBLICO
-- (Permitir acceso a todos con anon key)
-- ============================================

-- Couples: Permitir todo
DROP POLICY IF EXISTS "Enable all for couples" ON couples;
CREATE POLICY "Enable all for couples" ON couples
    FOR ALL USING (true) WITH CHECK (true);

-- Important Dates: Permitir todo
DROP POLICY IF EXISTS "Enable all for important_dates" ON important_dates;
CREATE POLICY "Enable all for important_dates" ON important_dates
    FOR ALL USING (true) WITH CHECK (true);

-- Bucket List: Permitir todo
DROP POLICY IF EXISTS "Enable all for bucket_list" ON bucket_list;
CREATE POLICY "Enable all for bucket_list" ON bucket_list
    FOR ALL USING (true) WITH CHECK (true);

-- Tasks: Permitir todo
DROP POLICY IF EXISTS "Enable all for tasks" ON tasks;
CREATE POLICY "Enable all for tasks" ON tasks
    FOR ALL USING (true) WITH CHECK (true);

-- Messages: Permitir todo
DROP POLICY IF EXISTS "Enable all for messages" ON messages;
CREATE POLICY "Enable all for messages" ON messages
    FOR ALL USING (true) WITH CHECK (true);

-- Photos: Permitir todo
DROP POLICY IF EXISTS "Enable all for photos" ON photos;
CREATE POLICY "Enable all for photos" ON photos
    FOR ALL USING (true) WITH CHECK (true);

-- Mood Entries: Permitir todo
DROP POLICY IF EXISTS "Enable all for mood_entries" ON mood_entries;
CREATE POLICY "Enable all for mood_entries" ON mood_entries
    FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- FUNCIÓN PARA GENERAR CÓDIGO DE PAREJA
-- ============================================

CREATE OR REPLACE FUNCTION generate_couple_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- Sin O, I, 0, 1 para evitar confusión
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- DATOS DE EJEMPLO (OPCIONAL - PARA TESTING)
-- ============================================
-- Descomenta estas líneas si quieres datos de prueba

-- INSERT INTO couples (couple_code, partner1_name, partner2_name, anniversary_date)
-- VALUES ('DEMO99', 'Alex', 'Jordan', '2024-11-13');

-- ============================================
-- ✅ CONFIGURACIÓN COMPLETADA
-- ============================================
-- Ahora puedes usar la aplicación con sincronización en tiempo real
