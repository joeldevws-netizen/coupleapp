import { useTheme } from '../../lib/hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button 
      className="theme-toggle" 
      onClick={toggleTheme}
      title={`Cambiar a modo ${isDark ? 'claro' : 'oscuro'}`}
      aria-label={`Cambiar a modo ${isDark ? 'claro' : 'oscuro'}`}
    >
      <div className="toggle-track">
        <div className="toggle-thumb">
          <span className="toggle-icon">{isDark ? '🌙' : '☀️'}</span>
        </div>
      </div>

      <style>{`
        .theme-toggle {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          outline: none;
        }

        .toggle-track {
          width: 60px;
          height: 30px;
          background: ${isDark ? 'linear-gradient(135deg, #1a1a2e, #16213e)' : 'linear-gradient(135deg, #ffc3ee, #fff59d)'};
          border-radius: 30px;
          padding: 3px;
          transition: all 0.3s ease;
          box-shadow: ${isDark 
            ? '0 4px 12px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(0, 0, 0, 0.3)' 
            : '0 4px 12px rgba(255, 107, 157, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.5)'};
        }

        .theme-toggle:hover .toggle-track {
          transform: scale(1.05);
          box-shadow: ${isDark 
            ? '0 6px 16px rgba(0, 0, 0, 0.6), inset 0 2px 4px rgba(0, 0, 0, 0.4)' 
            : '0 6px 16px rgba(255, 107, 157, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.6)'};
        }

        .toggle-thumb {
          width: 24px;
          height: 24px;
          background: ${isDark ? '#ffd700' : '#fff'};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: translateX(${isDark ? '30px' : '0'});
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: ${isDark 
            ? '0 2px 8px rgba(255, 215, 0, 0.5)' 
            : '0 2px 8px rgba(0, 0, 0, 0.2)'};
        }

        .toggle-icon {
          font-size: 0.9rem;
          line-height: 1;
          filter: ${isDark ? 'drop-shadow(0 0 3px rgba(255, 215, 0, 0.8))' : 'none'};
        }

        @media (max-width: 640px) {
          .toggle-track {
            width: 50px;
            height: 26px;
          }

          .toggle-thumb {
            width: 20px;
            height: 20px;
            transform: translateX(${isDark ? '24px' : '0'});
          }

          .toggle-icon {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </button>
  );
}
