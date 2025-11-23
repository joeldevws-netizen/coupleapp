import { useState } from 'react';
import { useCoupleAuth } from '../../lib/hooks/useCoupleAuth';
import { supabase } from '../../lib/supabase';
import ThemeToggle from './ThemeToggle';

export default function CoupleCodeAuth() {
  const { createCouple, joinCouple, loading } = useCoupleAuth();
  const [mode, setMode] = useState<'choice' | 'create' | 'join'>('choice');
  const [formData, setFormData] = useState({
    partnerName: '',
    anniversaryDate: '2024-11-13',
    coupleCode: '',
  });
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!formData.partnerName.trim()) {
      setError('Por favor ingresa tu nombre');
      return;
    }

    setError(null);
    const result = await createCouple(formData.partnerName, formData.anniversaryDate);
    
    if (result.success && result.coupleCode) {
      setGeneratedCode(result.coupleCode);
    } else {
      setError(result.error || 'Error al crear la pareja');
    }
  };

  const handleJoin = async () => {
    if (!formData.partnerName.trim()) {
      setError('Por favor ingresa tu nombre');
      return;
    }
    if (!formData.coupleCode.trim()) {
      setError('Por favor ingresa el código de pareja');
      return;
    }

    setError(null);
    const result = await joinCouple(formData.coupleCode, formData.partnerName);
    
    if (!result.success) {
      setError(result.error || 'Error al unirse a la pareja');
    }
    // Si es exitoso, el hook actualizará isAuthenticated
    // y AppContainer manejará el cambio automáticamente
  };

  const runDiagnostics = async () => {
    const logs: string[] = [];
    const log = (msg: string) => logs.push(msg);

    try {
      log('Iniciando diagnóstico...');
      log(`URL configurada: ${!!import.meta.env.PUBLIC_SUPABASE_URL ? 'SÍ' : 'NO'}`);
      log(`Key configurada: ${!!import.meta.env.PUBLIC_SUPABASE_KEY || !!import.meta.env.PUBLIC_SUPABASE_ANON_KEY ? 'SÍ' : 'NO'}`);

      log('Probando conexión a Supabase...');
      // @ts-ignore
      const { data, error } = await (supabase as any).from('couples').select('count').limit(1).single();
      
      if (error) {
        log(`❌ Error de conexión: ${error.message}`);
        log(`Detalles: ${JSON.stringify(error)}`);
      } else {
        log('✅ Conexión exitosa a tabla couples');
        log(`Datos recibidos: ${JSON.stringify(data)}`);
      }

    } catch (e: any) {
      log(`❌ Error inesperado: ${e.message}`);
    }

    alert(logs.join('\n'));
  };

  return (
    <div className="auth-container">
      <div className="theme-toggle-wrapper">
        <ThemeToggle />
      </div>
      
      <button 
        onClick={runDiagnostics} 
        style={{ position: 'absolute', top: '1rem', left: '1rem', opacity: 0.5, fontSize: '0.8rem' }}
      >
        🛠️ Diagnóstico
      </button>

      <div className="auth-card">
        <div className="auth-header">
          <h1>💕 Nuestra App de Pareja</h1>
          <p className="auth-subtitle">Juntos, siempre conectados</p>
        </div>

        {mode === 'choice' && (
          <div className="choice-buttons">
            <button className="auth-btn primary" onClick={() => setMode('create')}>
              🌟 Crear Nueva Pareja
            </button>
            <button className="auth-btn secondary" onClick={() => setMode('join')}>
              💑 Unirse a Pareja
            </button>
          </div>
        )}

        {mode === 'create' && !generatedCode && (
          <div className="auth-form">
            <button className="back-btn" onClick={() => { setMode('choice'); setError(null); }}>← Volver</button>
            <h2>Crear Nueva Pareja</h2>
            <input type="text" placeholder="Tu nombre" value={formData.partnerName} onChange={(e) => setFormData({ ...formData, partnerName: e.target.value })} maxLength={30} />
            <label>Fecha de aniversario:</label>
            <input type="date" value={formData.anniversaryDate} onChange={(e) => setFormData({ ...formData, anniversaryDate: e.target.value })} />
            {error && <div className="error-message">{error}</div>}
            <button className="auth-btn primary" onClick={handleCreate} disabled={loading}>
              {loading ? 'Creando...' : 'Crear Pareja'}
            </button>
          </div>
        )}

        {generatedCode && (
          <div className="success-screen">
            <div className="success-icon">✅</div>
            <h2>¡Pareja Creada!</h2>
            <p>Comparte este código con tu pareja:</p>
            <div className="code-display">
              <span className="couple-code">{generatedCode}</span>
              <button className="copy-btn" onClick={() => { navigator.clipboard.writeText(generatedCode); alert('Código copiado'); }}>
                📋 Copiar
              </button>
            </div>
            <p className="code-info">Tu pareja debe usar este código para unirse.</p>
          </div>
        )}

        {mode === 'join' && (
          <div className="auth-form">
            <button className="back-btn" onClick={() => { setMode('choice'); setError(null); }}>← Volver</button>
            <h2>Unirse a Pareja</h2>
            <input type="text" placeholder="Tu nombre" value={formData.partnerName} onChange={(e) => setFormData({ ...formData, partnerName: e.target.value })} maxLength={30} />
            <input type="text" placeholder="Código de pareja (6 caracteres)" value={formData.coupleCode} onChange={(e) => setFormData({ ...formData, coupleCode: e.target.value.toUpperCase() })} maxLength={6} style={{ textTransform: 'uppercase', letterSpacing: '0.2em', textAlign: 'center' }} />
            {error && <div className="error-message">{error}</div>}
            <button className="auth-btn primary" onClick={handleJoin} disabled={loading}>
              {loading ? 'Conectando...' : 'Unirse'}
            </button>
          </div>
        )}
      </div>

      <style>{`
        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
        }

        .theme-toggle-wrapper {
          position: fixed;
          top: 2rem;
          right: 2rem;
          z-index: 100;
        }

        .auth-card {
          background: var(--bg-surface);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 3rem;
          box-shadow: var(--shadow-lg);
          max-width: 500px;
          width: 100%;
          border: 2px solid var(--border-secondary);
          animation: slideUp 0.6s ease;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .auth-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .auth-header h1 {
          font-size: 2.5rem;
          margin: 0 0 0.5rem 0;
          background: var(--gradient-accent);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .auth-subtitle {
          color: var(--text-secondary);
          font-size: 1.1rem;
          margin: 0;
        }

        .choice-buttons {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .auth-btn {
          padding: 1.25rem 2rem;
          border: none;
          border-radius: 16px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
        }

        .auth-btn.primary {
          background: var(--gradient-accent);
          color: var(--text-inverse);
          box-shadow: var(--shadow-sm);
        }

        .auth-btn.primary:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: var(--shadow-glow);
        }

        .auth-btn.secondary {
          background: var(--bg-elevated);
          color: var(--accent-punk);
          border: 2px solid var(--border-primary);
        }

        .auth-btn.secondary:hover {
          background: var(--bg-hover);
          transform: translateY(-2px);
          border-color: var(--border-hover);
        }

        .auth-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .auth-form h2 {
          text-align: center;
          color: var(--text-primary);
          margin: 0;
        }

        .auth-form input, .auth-form label {
          color: var(--text-primary);
        }

        .auth-form input {
          padding: 1rem;
          border: 2px solid var(--border-primary);
          border-radius: 12px;
          font-size: 1rem;
          background: var(--bg-input);
          transition: all 0.3s ease;
        }

        .auth-form input:focus {
          outline: none;
          border-color: var(--border-hover);
          box-shadow: 0 0 0 3px var(--bg-hover);
        }

        .auth-form label {
          font-size: 0.9rem;
          font-weight: 600;
        }

        .back-btn {
          background: none;
          border: none;
          color: var(--accent-pink);
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          padding: 0.5rem;
          align-self: flex-start;
          transition: all 0.3s ease;
        }

        .back-btn:hover {
          transform: translateX(-5px);
        }

        .error-message {
          background: rgba(255, 82, 82, 0.1);
          color: #ff5252;
          padding: 1rem;
          border-radius: 12px;
          text-align: center;
          font-weight: 600;
          border: 2px solid rgba(255, 82, 82, 0.3);
        }

        .success-screen {
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .success-icon {
          font-size: 4rem;
          animation: bounce 1s ease;
        }

        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        .success-screen h2, .success-screen p {
          color: var(--text-primary);
          margin: 0;
        }

        .code-display {
          background: var(--gradient-subtle);
          padding: 2rem;
          border-radius: 16px;
          border: 2px dashed var(--border-primary);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .couple-code {
          font-size: 3rem;
          font-weight: 800;
          letter-spacing: 0.3em;
          color: var(--accent-pink);
          font-family: monospace;
        }

        .copy-btn {
          padding: 0.75rem 1.5rem;
          background: var(--bg-elevated);
          border: 2px solid var(--border-primary);
          border-radius: 12px;
          color: var(--accent-pink);
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .copy-btn:hover {
          background: var(--gradient-accent);
          color: var(--text-inverse);
          border-color: transparent;
          transform: scale(1.05);
        }

        .code-info {
          font-size: 0.9rem;
          color: var(--text-tertiary);
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 5px solid var(--border-secondary);
          border-top: 5px solid var(--accent-pink);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 1rem auto;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 640px) {
          .auth-card { padding: 2rem; }
          .auth-header h1 { font-size: 2rem; }
          .couple-code { font-size: 2rem; }
          .theme-toggle-wrapper { top: 1rem; right: 1rem; }
        }
      `}</style>
    </div>
  );
}
