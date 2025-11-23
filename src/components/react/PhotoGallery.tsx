import { useState } from 'react';

interface Photo {
  id: string;
  url: string;
  title: string;
  date: string;
}

/**
 * Galería de fotos y recuerdos compartidos
 * Por ahora con datos demo, se puede integrar con Supabase Storage
 */
export default function PhotoGallery() {
  const [photos] = useState<Photo[]>([
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=400&fit=crop',
      title: 'Primera cita',
      date: '2023-01-14'
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&h=400&fit=crop',
      title: 'Viaje a la playa',
      date: '2023-06-20'
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=400&fit=crop',
      title: 'Atardecer juntos',
      date: '2023-09-15'
    },
    {
      id: '4',
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=400&fit=crop',
      title: 'Cena romántica',
      date: '2024-02-14'
    }
  ]);

  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  return (
    <div className="photo-gallery">
      <div className="gallery-header">
        <h2>📸 Nuestros Recuerdos</h2>
        <span className="photo-count">{photos.length} fotos</span>
      </div>

      <div className="gallery-grid">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="gallery-item"
            onClick={() => setSelectedPhoto(photo)}
          >
            <img src={photo.url} alt={photo.title} loading="lazy" />
            <div className="photo-overlay">
              <span className="photo-title">{photo.title}</span>
              <span className="photo-date">
                {new Date(photo.date).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
        ))}
      </div>

      {selectedPhoto && (
        <div className="photo-modal" onClick={() => setSelectedPhoto(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedPhoto(null)}>
              ×
            </button>
            <img src={selectedPhoto.url} alt={selectedPhoto.title} />
            <div className="modal-info">
              <h3>{selectedPhoto.title}</h3>
              <p>{new Date(selectedPhoto.date).toLocaleDateString('es-ES', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}</p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .photo-gallery {
          background: var(--bg-surface);
          backdrop-filter: blur(10px);
          padding: 2rem;
          border-radius: 20px;
          box-shadow: var(--shadow-md);
          border: 2px solid var(--border-secondary);
        }

        .gallery-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .gallery-header h2 {
          font-size: 1.75rem;
          color: var(--text-primary);
          margin: 0;
        }

        .photo-count {
          background: var(--gradient-primary);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--accent-pink);
          border: 2px solid var(--border-primary);
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 1rem;
        }

        .gallery-item {
          position: relative;
          aspect-ratio: 1;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid var(--border-secondary);
        }

        .gallery-item:hover {
          transform: scale(1.05);
          box-shadow: var(--shadow-sm);
          border-color: var(--border-hover);
        }

        .gallery-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .photo-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .gallery-item:hover .photo-overlay {
          opacity: 1;
        }

        .photo-title {
          color: white;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .photo-date {
          color: var(--accent-pink-light);
          font-size: 0.75rem;
        }

        .photo-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 2rem;
          animation: fadeIn 0.3s ease;
        }

        .modal-content {
          position: relative;
          max-width: 800px;
          max-height: 90vh;
          background: var(--bg-surface);
          border-radius: 20px;
          overflow: hidden;
          animation: scaleIn 0.3s ease;
          border: 2px solid var(--border-primary);
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .modal-content img {
          width: 100%;
          max-height: 70vh;
          object-fit: contain;
          background: #000;
        }

        .modal-info {
          padding: 1.5rem;
          text-align: center;
          background: var(--bg-elevated);
        }

        .modal-info h3 {
          margin: 0 0 0.5rem 0;
          color: var(--accent-pink);
        }

        .modal-info p {
          margin: 0;
          color: var(--text-secondary);
        }

        .close-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 40px;
          height: 40px;
          background: rgba(0, 0, 0, 0.5);
          border: none;
          border-radius: 50%;
          color: white;
          font-size: 2rem;
          line-height: 1;
          cursor: pointer;
          z-index: 10;
          transition: all 0.3s ease;
        }

        .close-btn:hover {
          background: var(--accent-pink);
          transform: scale(1.1);
        }

        @media (max-width: 640px) {
          .photo-gallery {
            padding: 1.5rem;
          }

          .gallery-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
          }

          .gallery-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
