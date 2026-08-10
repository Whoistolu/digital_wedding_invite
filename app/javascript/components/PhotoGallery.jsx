import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";

const photos = [
  { src: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&q=80", alt: "Together at sunset", span: "col-span-2" },
  { src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80", alt: "Engagement shoot" },
  { src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80", alt: "Golden hour portrait" },
  { src: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=600&q=80", alt: "Romantic walk" },
  { src: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&q=80", alt: "Tender moment" },
  { src: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&q=80", alt: "Proposal night", span: "col-span-2" },
  { src: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=600&q=80", alt: "First dance" },
  { src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&q=80", alt: "Joy together" },
];

export default function PhotoGallery() {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const openLightbox = (i) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prev = () => setLightboxIndex((i) => (i - 1 + photos.length) % photos.length);
  const next = () => setLightboxIndex((i) => (i + 1) % photos.length);

  return (
    <section className="gallery-section" ref={ref}>
      <div className="section-container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="section-eyebrow">Captured moments</p>
          <h2 className="section-heading">Our Gallery</h2>
          <div className="ornament-rule">
            <div className="rule-line" />
            <svg className="rule-diamond" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12,2 22,12 12,22 2,12" />
            </svg>
            <div className="rule-line" />
          </div>
        </motion.div>

        <motion.div
          className="gallery-grid"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {photos.map((photo, i) => (
            <motion.div
              key={i}
              className={`gallery-item ${photo.span || ""}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => openLightbox(i)}
            >
              <img src={photo.src} alt={photo.alt} className="gallery-image" loading="lazy" />
              <div className="gallery-overlay">
                <svg className="gallery-zoom-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35M11 8v6M8 11h6"/>
                </svg>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <motion.div
              className="lightbox-content"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="lightbox-close" onClick={closeLightbox}>✕</button>
              <button className="lightbox-nav lightbox-nav--prev" onClick={prev}>‹</button>
              <img
                src={photos[lightboxIndex].src}
                alt={photos[lightboxIndex].alt}
                className="lightbox-image"
              />
              <button className="lightbox-nav lightbox-nav--next" onClick={next}>›</button>
              <p className="lightbox-caption">{photos[lightboxIndex].alt}</p>
              <p className="lightbox-counter">{lightboxIndex + 1} / {photos.length}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
