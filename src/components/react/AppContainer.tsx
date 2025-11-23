import { useCoupleAuth } from '../../lib/hooks/useCoupleAuth';
import CoupleCodeAuth from './CoupleCodeAuth';
import DaysCounter from './DaysCounter';
import SharedTasks from './SharedTasks';
import MessageWall from './MessageWall';
import PhotoGallery from './PhotoGallery';
import MoodTracker from './MoodTracker';
import BucketList from './BucketList';
import ImportantDates from './ImportantDates';
import ThemeToggle from './ThemeToggle';

export default function AppContainer() {
  const { isAuthenticated, loading, coupleId, coupleCode, partnerName, logout } = useCoupleAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Cargando...</p>
        <style>{`
          .loading-container {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #ffc3ee 0%, #fff59d 100%);
            gap: 1rem;
          }
          .loader {
            width: 50px;
            height: 50px;
            border: 5px solid rgba(255, 255, 255, 0.3);
            border-top: 5px solid #ff6b9d;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .loading-container p {
            color: #ff6b9d;
            font-weight: 700;
            font-size: 1.2rem;
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <CoupleCodeAuth />;
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>💕 Nuestra App de Pareja</h1>
          <p className="subtitle">Juntos, siempre conectados</p>
        </div>
        <div className="header-info">
          <ThemeToggle />
          <div className="user-badge">
            <span>👤 {partnerName}</span>
          </div>
          <div className="code-badge" title="Código de pareja">
            <span>🔑 {coupleCode}</span>
          </div>
          <button className="logout-btn" onClick={logout} title="Cerrar sesión">
            🚪
          </button>
        </div>
      </header>

      <section className="counter-section">
        <DaysCounter />
      </section>

      <section className="mood-section">
        <MoodTracker />
      </section>

      <div className="main-grid">
        <section className="tasks-section">
          <SharedTasks />
        </section>

        <section className="messages-section">
          <MessageWall />
        </section>
      </div>

      <div className="secondary-grid">
        <section className="bucket-section">
          <BucketList />
        </section>

        <section className="dates-section">
          <ImportantDates />
        </section>
      </div>

      <section className="gallery-section">
        <PhotoGallery />
      </section>

      <footer className="app-footer">
        <p>Hecho con 💖 usando Astro + Supabase + React</p>
        <p className="sync-status">✅ Sincronizado en tiempo real</p>
      </footer>

      <style>{`
        .app-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .app-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: var(--bg-surface);
          border-radius: 20px;
          box-shadow: var(--shadow-md);
          animation: fadeIn 0.8s ease;
          flex-wrap: wrap;
          gap: 1rem;
          border: 2px solid var(--border-secondary);
          transition: all 0.3s ease;
        }

        .header-content {
          flex: 1;
          min-width: 200px;
        }

        .header-content h1 {
          margin: 0 0 0.5rem 0;
          font-size: 2rem;
          color: var(--text-primary);
        }

        .subtitle {
          font-size: 1.25rem;
          color: var(--accent-pink);
          margin: 0;
          font-weight: 600;
        }

        .header-info {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .user-badge, .code-badge {
          padding: 0.75rem 1.25rem;
          background: var(--gradient-primary);
          border-radius: 20px;
          font-weight: 700;
          color: var(--accent-pink);
          font-size: 0.9rem;
          border: 2px solid var(--border-primary);
          transition: all 0.3s ease;
        }

        .code-badge {
          font-family: monospace;
          letter-spacing: 0.1em;
          cursor: pointer;
        }

        .code-badge:hover {
          transform: scale(1.05);
          border-color: var(--border-hover);
          box-shadow: var(--shadow-sm);
        }

        .logout-btn {
          padding: 0.75rem 1rem;
          background: var(--bg-elevated);
          border: 2px solid var(--accent-pink);
          border-radius: 12px;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s ease;
          color: var(--text-primary);
        }

        .logout-btn:hover {
          background: var(--accent-pink);
          color: var(--text-inverse);
          transform: scale(1.05);
          box-shadow: var(--shadow-sm);
        }

        .counter-section {
          margin-bottom: 2rem;
          animation: fadeIn 1s ease 0.2s both;
        }

        .mood-section {
          margin-bottom: 2rem;
          animation: fadeIn 1s ease 0.3s both;
        }

        .main-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
          animation: fadeIn 1s ease 0.4s both;
        }

        .secondary-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
          animation: fadeIn 1s ease 0.5s both;
        }

        .gallery-section {
          margin-bottom: 3rem;
          animation: fadeIn 1s ease 0.6s both;
        }

        .app-footer {
          text-align: center;
          padding: 2rem;
          color: var(--color-gray-medium);
          font-size: 0.9rem;
        }

        .app-footer p {
          margin: 0.5rem 0;
        }

        .sync-status {
          color: #4caf50;
          font-weight: 600;
        }

        @media (max-width: 1024px) {
          .main-grid,
          .secondary-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .app-header {
            flex-direction: column;
            align-items: stretch;
          }

          .header-info {
            justify-content: center;
          }

          .app-header h1 {
            font-size: 1.75rem;
            text-align: center;
          }

          .subtitle {
            font-size: 1rem;
            text-align: center;
          }

          .main-grid,
          .secondary-grid {
            gap: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
