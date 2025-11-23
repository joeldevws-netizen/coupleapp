import { useState, useEffect } from 'react';
import { useCoupleAuth } from '../../lib/hooks/useCoupleAuth';

export default function DaysCounter() {
  const { anniversaryDate, isAuthenticated } = useCoupleAuth();
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!anniversaryDate) return;

    const calculateTime = () => {
      const start = new Date(anniversaryDate);
      const now = new Date();
      const diff = now.getTime() - start.getTime();

      const totalSeconds = Math.floor(diff / 1000);
      const totalMinutes = Math.floor(totalSeconds / 60);
      const totalHours = Math.floor(totalMinutes / 60);
      const totalDays = Math.floor(totalHours / 24);

      setDays(totalDays);
      setHours(totalHours % 24);
      setMinutes(totalMinutes % 60);
      setSeconds(totalSeconds % 60);
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [anniversaryDate]);

  if (!isAuthenticated || !anniversaryDate) {
    return (
      <div className="days-counter">
        <div className="counter-main">
          <span className="counter-number">-</span>
          <span className="counter-label">Esperando...</span>
        </div>
        <style>{`
          .days-counter { background: var(--gradient-primary); padding: 2rem; border-radius: 20px; text-align: center; box-shadow: var(--shadow-md); border: 2px solid var(--border-secondary); transition: all 0.3s ease; }
          .counter-number { display: block; font-size: 4rem; font-weight: 800; background: var(--gradient-accent); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; line-height: 1; margin-bottom: 0.5rem; }
          .counter-label { display: block; font-size: 1.25rem; color: var(--accent-pink); font-weight: 600; text-transform: uppercase; letter-spacing: 2px; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="days-counter">
      <div className="counter-main">
        <span className="counter-number">{days}</span>
        <span className="counter-label">días juntos</span>
      </div>
      
      <div className="counter-details">
        <div className="detail-item">
          <span className="detail-number">{hours}</span>
          <span className="detail-label">horas</span>
        </div>
        <div className="detail-separator">:</div>
        <div className="detail-item">
          <span className="detail-number">{minutes}</span>
          <span className="detail-label">minutos</span>
        </div>
        <div className="detail-separator">:</div>
        <div className="detail-item">
          <span className="detail-number">{seconds}</span>
          <span className="detail-label">segundos</span>
        </div>
      </div>

      <style>{`
        .days-counter {
          background: var(--gradient-primary);
          padding: 2rem;
          border-radius: 20px;
          text-align: center;
          box-shadow: var(--shadow-md);
          animation: float 3s ease-in-out infinite;
          border: 2px solid var(--border-secondary);
          transition: all 0.3s ease;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .counter-main {
          margin-bottom: 1.5rem;
        }

        .counter-number {
          display: block;
          font-size: 4rem;
          font-weight: 800;
          background: var(--gradient-accent);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
          margin-bottom: 0.5rem;
        }

        .counter-label {
          display: block;
          font-size: 1.25rem;
          color: var(--accent-pink);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .counter-details {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          font-family: monospace;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .detail-number {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--accent-pink);
        }

        .detail-label {
          font-size: 0.75rem;
          color: var(--accent-yellow);
          text-transform: uppercase;
        }

        .detail-separator {
          font-size: 1.5rem;
          color: var(--accent-pink);
          font-weight: 700;
        }

        @media (max-width: 640px) {
          .counter-number {
            font-size: 3rem;
          }
          
          .detail-number {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}
