import { useMoodTracker } from '../../lib/hooks/useMoodTracker';
import type { Mood } from '../../lib/hooks/useMoodTracker';

interface MoodEntry {
  mood: Mood;
  emoji: string;
  color: string;
  label: string;
}

const moods: MoodEntry[] = [
  { mood: 'amazing', emoji: '🥰', color: '#ff6b9d', label: 'Increíble' },
  { mood: 'happy', emoji: '😊', color: '#ffa726', label: 'Feliz' },
  { mood: 'okay', emoji: '😐', color: '#9e9e9e', label: 'Normal' },
  { mood: 'sad', emoji: '😢', color: '#64b5f6', label: 'Triste' },
  { mood: 'stressed', emoji: '😰', color: '#ab47bc', label: 'Estresado' }
];

/**
 * Mood Tracker para ambos miembros de la pareja
 * Permite ver cómo se siente cada uno en tiempo real
 */
export default function MoodTracker() {
  const { myMood, partnerMood, loading, setMood } = useMoodTracker();

  const handleMoodSelect = async (mood: Mood) => {
    await setMood(mood);
  };

  const getMoodData = (mood: Mood | null) => {
    if (!mood) return null;
    return moods.find(m => m.mood === mood);
  };

  const myMoodData = getMoodData(myMood);
  const partnerMoodData = getMoodData(partnerMood);

  if (loading) {
    return (
      <div className="mood-tracker">
        <div className="loading">Cargando moods...</div>
        <style>{`
          .mood-tracker {
            background: var(--bg-surface);
            padding: 2rem;
            border-radius: 20px;
            box-shadow: var(--shadow-md);
            border: 2px solid var(--border-secondary);
          }
          .loading {
            text-align: center;
            padding: 2rem;
            color: var(--text-tertiary);
          }
        `}</style>
      </div>
    );
  }


  return (
    <div className="mood-tracker">
      <div className="mood-header">
        <h2>💭 ¿Cómo nos sentimos hoy?</h2>
      </div>

      <div className="mood-display">
        <div className="mood-card">
          <span className="mood-label">Tú</span>
          {myMoodData ? (
            <div className="mood-selected" style={{ borderColor: myMoodData.color }}>
              <span className="mood-emoji">{myMoodData.emoji}</span>
              <span className="mood-text" style={{ color: myMoodData.color }}>
                {myMoodData.label}
              </span>
            </div>
          ) : (
            <div className="mood-placeholder">
              <span className="placeholder-emoji">❔</span>
              <span className="placeholder-text">Selecciona tu mood</span>
            </div>
          )}
        </div>

        <div className="mood-divider">
          <div className="heart-icon">💕</div>
        </div>

        <div className="mood-card">
          <span className="mood-label">Tu pareja</span>
          {partnerMoodData && (
            <div className="mood-selected" style={{ borderColor: partnerMoodData.color }}>
              <span className="mood-emoji">{partnerMoodData.emoji}</span>
              <span className="mood-text" style={{ color: partnerMoodData.color }}>
                {partnerMoodData.label}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mood-selector">
        <p className="selector-title">Selecciona cómo te sientes:</p>
        <div className="mood-options">
          {moods.map((mood) => (
            <button
              key={mood.mood}
              className={`mood-option ${myMood === mood.mood ? 'active' : ''}`}
              onClick={() => handleMoodSelect(mood.mood)}
              style={{
                borderColor: myMood === mood.mood ? mood.color : 'transparent',
                backgroundColor: myMood === mood.mood ? `${mood.color}15` : 'transparent'
              }}
            >
              <span className="option-emoji">{mood.emoji}</span>
              <span className="option-label">{mood.label}</span>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .mood-tracker {
          background: var(--bg-surface);
          backdrop-filter: blur(10px);
          padding: 2rem;
          border-radius: 20px;
          box-shadow: var(--shadow-md);
          border: 2px solid var(--border-secondary);
        }

        .mood-header h2 {
          font-size: 1.75rem;
          color: var(--text-primary);
          margin: 0 0 1.5rem 0;
          text-align: center;
        }

        .mood-display {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
          align-items: center;
        }

        .mood-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }

        .mood-label {
          font-size: 0.875rem;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
        }

        .mood-selected {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1.5rem;
          border: 3px solid;
          border-radius: 16px;
          min-width: 120px;
          transition: all 0.3s ease;
          animation: moodPop 0.4s ease;
          background: var(--bg-elevated);
        }

        @keyframes moodPop {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }

        .mood-emoji {
          font-size: 3rem;
        }

        .mood-text {
          font-weight: 600;
          font-size: 1rem;
        }

        .mood-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1.5rem;
          border: 3px dashed var(--border-secondary);
          border-radius: 16px;
          min-width: 120px;
          background: var(--bg-elevated);
        }

        .placeholder-emoji {
          font-size: 3rem;
          opacity: 0.3;
        }

        .placeholder-text {
          color: var(--text-tertiary);
          font-size: 0.875rem;
          text-align: center;
        }

        .mood-divider {
          display: flex;
          justify-content: center;
        }

        .heart-icon {
          font-size: 2rem;
          animation: heartbeat 1.5s ease-in-out infinite;
        }

        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        .mood-selector {
          padding-top: 2rem;
          border-top: 2px solid var(--border-secondary);
        }

        .selector-title {
          text-align: center;
          color: var(--text-secondary);
          margin-bottom: 1rem;
          font-weight: 500;
        }

        .mood-options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          gap: 0.75rem;
        }

        .mood-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          background: var(--bg-elevated);
          border: 2px solid;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .mood-option:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-sm);
        }

        .mood-option.active {
          transform: scale(1.05);
        }

        .option-emoji {
          font-size: 2rem;
        }

        .option-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        @media (max-width: 640px) {
          .mood-tracker {
            padding: 1.5rem;
          }

          .mood-display {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .mood-divider {
            order: 3;
          }

          .heart-icon {
            transform: rotate(90deg);
          }

          .mood-options {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
