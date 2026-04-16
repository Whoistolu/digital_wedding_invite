import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const milestones = [
  {
    year: "2019",
    month: "March",
    title: "First Meeting",
    description:
      "Two strangers walked into the same room at a mutual friend's dinner party. A glance across the table changed everything. They talked for hours, not noticing the world fade around them.",
    icon: "✦",
    image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=80",
  },
  {
    year: "2019",
    month: "December",
    title: "First Date",
    description:
      "A quiet dinner by the waterfront. Chukwuemeka arrived with a single red rose and a nervous smile that Adaeze found endearing. The evening stretched into midnight without either of them noticing.",
    icon: "♥",
    image: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=600&q=80",
  },
  {
    year: "2021",
    month: "August",
    title: "Our First Trip Together",
    description:
      "Exploring the Maldives together — crystal waters, golden sunsets, and the moment they both knew this was for keeps. Every evening was a new memory written into their hearts.",
    icon: "✈",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
  },
  {
    year: "2023",
    month: "February",
    title: "The Proposal",
    description:
      "On a rooftop under a canopy of fairy lights, Chukwuemeka got down on one knee. Adaeze said yes before he could finish the question. The city lights below felt like a standing ovation.",
    icon: "💍",
    image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&q=80",
  },
  {
    year: "2025",
    month: "June",
    title: "Forever Begins",
    description:
      "On this day, two families become one. Two hearts, one home. Two names, one story written in love, laughter, and the quiet moments in between.",
    icon: "★",
    image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600&q=80",
  },
];

function TimelineItem({ milestone, index }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      className={`timeline-item ${isEven ? "timeline-item--left" : "timeline-item--right"}`}
      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Content card */}
      <div className="timeline-card">
        <div className="timeline-image-wrap">
          <img src={milestone.image} alt={milestone.title} className="timeline-image" loading="lazy" />
          <div className="timeline-image-overlay" />
        </div>
        <div className="timeline-text">
          <div className="timeline-meta">
            <span className="timeline-month">{milestone.month}</span>
            <span className="timeline-year">{milestone.year}</span>
          </div>
          <h3 className="timeline-title">{milestone.title}</h3>
          <p className="timeline-desc">{milestone.description}</p>
        </div>
      </div>

      {/* Center connector */}
      <div className="timeline-connector">
        <motion.div
          className="timeline-dot"
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.5, type: "spring", stiffness: 200 }}
        >
          <span className="timeline-icon">{milestone.icon}</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function LoveStory() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="love-story-section" ref={ref}>
      <div className="section-container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="section-eyebrow">A journey through time</p>
          <h2 className="section-heading">Our Love Story</h2>
          <p className="section-subheading">
            Every great love story has a beginning. Here is ours.
          </p>
          <div className="ornament-rule">
            <div className="rule-line" />
            <svg className="rule-diamond" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12,2 22,12 12,22 2,12" />
            </svg>
            <div className="rule-line" />
          </div>
        </motion.div>

        <div className="timeline">
          {/* Vertical line */}
          <motion.div
            className="timeline-line"
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          {milestones.map((milestone, i) => (
            <TimelineItem key={i} milestone={milestone} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
