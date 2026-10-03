import { useEffect } from 'react';

export default function ImageLightbox({ image, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!image) return null;

  return (
    <div className="lightbox-veil" onClick={onClose} role="dialog" aria-modal="true">
      <div className="lightbox-modal" onClick={e => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose} aria-label="Close image preview">
          ✕
        </button>
        <div className="lightbox-imgbox">
          <img src={image.src} alt={image.title || 'KRS KING Machine'} />
        </div>
        <div className="lightbox-details">
          <div>
            <h3>
              {image.title}
              {image.si && <span className="si">{image.si}</span>}
            </h3>
            {image.desc && <p>{image.desc}</p>}
          </div>
          {image.spec && <div className="lightbox-meta mono">▸ {image.spec}</div>}
        </div>
      </div>
    </div>
  );
}
