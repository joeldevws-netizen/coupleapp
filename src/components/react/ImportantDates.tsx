import { useState, useEffect } from 'react';
import { useImportantDates } from '../../lib/hooks/useImportantDates';

interface FormData {
  title: string;
  date: string;
  icon: string;
  description: string;
}

const iconOptions = ['💕', '🎂', '🎉', '🎄', '🎊', '💝', '🌟', '🎈', '🎁', '💐', '🌹', '✨'];

export default function ImportantDates() {
  const { dates, loading, addDate, deleteDate } = useImportantDates();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    date: '',
    icon: '🎉',
    description: ''
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.date) return;

    const result = await addDate({
      title: formData.title.trim(),
      date: formData.date,
      type: 'special',
      icon: formData.icon,
      description: formData.description.trim()
    });

    if (result.success) {
      setFormData({ title: '', date: '', icon: '🎉', description: '' });
      setShowAddForm(false);
    } else {
      alert('Error al guardar: ' + (result.error || 'Verifica tu conexión o que las tablas de base de datos existan'));
    }
  };

  const handleDeleteDate = async (id: string) => {
    if (confirm('¿Eliminar esta fecha?')) {
      await deleteDate(id);
    }
  };

  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(dateString);
    targetDate.setHours(0, 0, 0, 0);
    const diffTime = targetDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getCountdown = (dateString: string) => {
    const target = new Date(dateString);
    const diff = target.getTime() - currentTime.getTime();
    if (diff < 0) return null;

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000)
    };
  };

  const getDateLabel = (dateString: string) => {
    const daysUntil = getDaysUntil(dateString);
    if (daysUntil < 0) return `Hace ${Math.abs(daysUntil)} días`;
    if (daysUntil === 0) return '¡Hoy! 🎉';
    if (daysUntil === 1) return '¡Mañana!';
    if (daysUntil <= 7) return `En ${daysUntil} días`;
    if (daysUntil <= 30) return `En ${Math.floor(daysUntil / 7)} semanas`;
    return `En ${Math.floor(daysUntil / 30)} meses`;
  };

  const sortedDates = [...dates].sort((a, b) => Math.abs(getDaysUntil(a.date)) - Math.abs(getDaysUntil(b.date)));
  const upcomingDates = sortedDates.filter(d => getDaysUntil(d.date) >= 0);
  const nextEvent = upcomingDates[0];
  const nextCountdown = nextEvent ? getCountdown(nextEvent.date) : null;

  if (loading) {
    return (
      <div className="important-dates">
        <div className="loading">Cargando fechas...</div>
        <style>{`
          .important-dates { background: var(--bg-surface); padding: 2rem; border-radius: 24px; border: 2px solid var(--border-secondary); }
          .loading { text-align: center; padding: 2rem; color: var(--text-tertiary); }
        `}</style>
      </div>
    );
  }

  return (
    <div className="important-dates">
      <div className="dates-header">
        <h2>📅 Fechas Importantes</h2>
        <div className="header-actions">
          <span className="dates-count">{dates.length} eventos</span>
          <button className="add-date-btn" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? '✕' : '+ Añadir'}
          </button>
        </div>
      </div>

      {showAddForm && (
        <form className="add-date-form" onSubmit={handleAddDate}>
          <div className="form-row">
            <input
              type="text"
              placeholder="Título del evento"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              maxLength={50}
            />
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
          <textarea
            placeholder="Descripción (opcional)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            maxLength={100}
            rows={2}
          />
          <div className="icon-selector">
            <label>Elige un icono:</label>
            <div className="icon-grid">
              {iconOptions.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  className={`icon-option ${formData.icon === icon ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, icon })}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" className="submit-date-btn">
            Guardar Fecha
          </button>
        </form>
      )}

      {nextEvent && nextCountdown && (
        <div className="countdown-section">
          <div className="countdown-title">
            <span className="countdown-icon">{nextEvent.icon}</span>
            <div>
              <h3>{nextEvent.title}</h3>
              <p className="countdown-subtitle">{nextEvent.description}</p>
            </div>
          </div>
          <div className="countdown-timer">
            <div className="time-unit">
              <div className="time-value">{nextCountdown.days}</div>
              <div className="time-label">días</div>
            </div>
            <div className="time-separator">:</div>
            <div className="time-unit">
              <div className="time-value">{String(nextCountdown.hours).padStart(2, '0')}</div>
              <div className="time-label">horas</div>
            </div>
            <div className="time-separator">:</div>
            <div className="time-unit">
              <div className="time-value">{String(nextCountdown.minutes).padStart(2, '0')}</div>
              <div className="time-label">mins</div>
            </div>
            <div className="time-separator">:</div>
            <div className="time-unit">
              <div className="time-value">{String(nextCountdown.seconds).padStart(2, '0')}</div>
              <div className="time-label">segs</div>
            </div>
          </div>
        </div>
      )}

      {dates.length === 0 ? (
        <div className="empty-dates">
          <p>No hay fechas guardadas. ¡Añade tu primera fecha especial! 💕</p>
        </div>
      ) : (
        <div className="dates-timeline">
          {sortedDates.map((date, index) => (
            <div key={date.id} className="timeline-item" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="timeline-line"></div>
              <div className="timeline-dot-wrapper">
                <div className="timeline-dot">{date.icon}</div>
              </div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <span className="timeline-title">{date.title}</span>
                  <div className="timeline-actions">
                    <span className="timeline-badge">{getDateLabel(date.date)}</span>
                    <button
                      onClick={() => handleDeleteDate(date.id)}
                      className="delete-date-btn"
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                {date.description && (
                  <p className="timeline-description">{date.description}</p>
                )}
                <span className="timeline-date">
                  {new Date(date.date).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    weekday: 'long'
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .important-dates {
          background: var(--bg-surface);
          backdrop-filter: blur(20px);
          padding: 2rem;
          border-radius: 24px;
          box-shadow: var(--shadow-md);
          border: 2px solid var(--border-secondary);
        }

        .dates-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .dates-header h2 {
          font-size: 2rem;
          color: var(--text-primary);
          margin: 0;
          font-weight: 800;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .dates-count {
          background: var(--gradient-primary);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--accent-pink);
          border: 2px solid var(--border-primary);
        }

        .add-date-btn {
          padding: 0.75rem 1.5rem;
          background: var(--gradient-accent);
          border: none;
          border-radius: 12px;
          color: var(--text-inverse);
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: var(--shadow-sm);
        }

        .add-date-btn:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .add-date-form {
          background: var(--gradient-subtle);
          border: 2px solid var(--border-primary);
          border-radius: 16px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .form-row {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1rem;
        }

        .add-date-form input,
        .add-date-form textarea {
          padding: 0.75rem;
          border: 2px solid var(--border-primary);
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: var(--bg-input);
          color: var(--text-primary);
        }

        .add-date-form input:focus,
        .add-date-form textarea:focus {
          outline: none;
          border-color: var(--border-hover);
          box-shadow: var(--shadow-sm);
        }

        .icon-selector {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .icon-selector label {
          font-size: 0.875rem;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .icon-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
          gap: 0.5rem;
        }

        .icon-option {
          padding: 0.75rem;
          background: var(--bg-elevated);
          border: 2px solid var(--border-secondary);
          border-radius: 8px;
          font-size: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .icon-option:hover {
          border-color: var(--border-primary);
          transform: scale(1.1);
        }

        .icon-option.selected {
          border-color: var(--border-hover);
          background: var(--gradient-subtle);
          transform: scale(1.1);
        }

        .submit-date-btn {
          padding: 1rem;
          background: var(--gradient-accent);
          border: none;
          border-radius: 12px;
          color: var(--text-inverse);
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1rem;
        }

        .submit-date-btn:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
        }

        .countdown-section {
          background: var(--gradient-subtle);
          border: 2px solid var(--accent-pink);
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2rem;
          position: relative;
          overflow: hidden;
        }

        .countdown-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--gradient-accent);
          background-size: 200% 100%;
          animation: shimmer 3s linear infinite;
        }

        @keyframes shimmer {
          0% { background-position: -100% 0; }
          100% { background-position: 200% 0; }
        }

        .countdown-title {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .countdown-icon {
          font-size: 3rem;
          animation: bounce 2s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .countdown-title h3 {
          margin: 0;
          color: #ff6b9d;
          font-size: 1.5rem;
          font-weight: 800;
        }

        .countdown-subtitle {
          margin: 0;
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        .countdown-timer {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .time-unit {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: var(--bg-elevated);
          padding: 1rem;
          border-radius: 12px;
          min-width: 70px;
          box-shadow: var(--shadow-sm);
        }

        .time-value {
          font-size: 2rem;
          font-weight: 800;
          color: #ff6b9d;
          line-height: 1;
        }

        .time-label {
          font-size: 0.75rem;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 0.5rem;
        }

        .time-separator {
          font-size: 2rem;
          font-weight: bold;
          color: #ff6b9d;
        }

        .empty-dates {
          text-align: center;
          padding: 3rem;
          color: var(--text-tertiary);
          font-size: 1.1rem;
        }

        .dates-timeline {
          display: flex;
          flex-direction: column;
          gap: 0;
          position: relative;
        }

        .timeline-item {
          display: flex;
          gap: 1.5rem;
          padding: 1.5rem 0;
          position: relative;
          animation: slideIn 0.6s ease both;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .timeline-line {
          position: absolute;
          left: 20px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: var(--gradient-primary);
        }

        .timeline-item:last-child .timeline-line {
          display: none;
        }

        .timeline-dot-wrapper {
          position: relative;
          flex-shrink: 0;
        }

        .timeline-dot {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--gradient-primary);
          border-radius: 50%;
          font-size: 1.25rem;
          box-shadow: var(--shadow-sm);
          position: relative;
          z-index: 1;
        }

        .timeline-content {
          flex: 1;
          background: var(--bg-elevated);
          padding: 1.25rem;
          border-radius: 12px;
          border: 2px solid var(--border-primary);
          transition: all 0.3s ease;
        }

        .timeline-item:hover .timeline-content {
          border-color: var(--border-hover);
          box-shadow: var(--shadow-sm);
          transform: translateX(8px);
        }

        .timeline-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
          gap: 1rem;
        }

        .timeline-title {
          font-weight: 700;
          color: var(--text-primary);
          font-size: 1.05rem;
        }

        .timeline-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .timeline-badge {
          font-size: 0.75rem;
          color: var(--accent-pink);
          font-weight: 700;
          padding: 0.35rem 0.75rem;
          background: var(--gradient-subtle);
          border-radius: 12px;
          white-space: nowrap;
        }

        .delete-date-btn {
          background: none;
          border: none;
          font-size: 1.25rem;
          cursor: pointer;
          opacity: 0.4;
          transition: all 0.3s ease;
          padding: 0.25rem;
        }

        .delete-date-btn:hover {
          opacity: 1;
          transform: scale(1.2);
        }

        .timeline-description {
          margin: 0 0 0.5rem 0;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .timeline-date {
          font-size: 0.85rem;
          color: var(--text-tertiary);
          text-transform: capitalize;
        }

        @media (max-width: 640px) {
          .important-dates { padding: 1.5rem; }
          .dates-header { flex-direction: column; align-items: flex-start; }
          .form-row { grid-template-columns: 1fr; }
          .countdown-timer { gap: 0.25rem; }
          .time-unit { min-width: 60px; padding: 0.75rem 0.5rem; }
          .time-value { font-size: 1.5rem; }
          .time-separator { font-size: 1.5rem; }
          .timeline-header { flex-direction: column; align-items: flex-start; }
          .timeline-actions { width: 100%; justify-content: space-between; }
        }
      `}</style>
    </div>
  );
}
