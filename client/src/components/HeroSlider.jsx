import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useContent } from "../cms/ContentContext.jsx";
import { SplitWords } from "./ui.jsx";

const DURATION = 20000; // ms per slide

export default function HeroSlider() {
  const { content } = useContent();
  const slides = content.slides;
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);

  const go = useCallback(
    (next) => {
      setIdx((cur) => {
        const n = (next + slides.length) % slides.length;
        setDir(n > cur ? 1 : -1);
        return n;
      });
    },
    [slides.length],
  );

  useEffect(() => {
    const t = setTimeout(() => go(idx + 1), DURATION);
    return () => clearTimeout(t);
  }, [idx, go]);

  if (!slides.length) return null;
  const slide = slides[idx];

  return (
    <section className='hero'>
      <AnimatePresence mode='wait' custom={dir}>
        <motion.div
          key={slide.id}
          className='hero-slide'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          transition={{ duration: 0.7 }}
        >
          <div className='hero-img'>
            <motion.img
              src={slide.image}
              alt=''
              initial={{ scale: 1.15 }}
              animate={{ scale: 1 }}
              transition={{ duration: DURATION / 1000, ease: "linear" }}
            />
          </div>
          <div className='hero-overlay' />
          <div className='container hero-content'>
            <motion.p
              className='hero-tag'
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
            >
              {slide.kicker}
            </motion.p>
            <SplitWords
              as='h1'
              text={slide.title}
              className='hero-title'
              delay={0.25}
            />
            <motion.p
              className='hero-sub'
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7 }}
            >
              {slide.sub}
            </motion.p>
            <motion.div
              className='hero-actions'
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.7 }}
            >
              <Link to={slide.ctaLink || "/about"} className='btn btn--orange'>
                {slide.ctaText}
              </Link>
              <Link to='/donate' className='btn btn--ghost'>
                Donate Now
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className='hero-foot'>
        <div className='container hero-foot-inner'>
          <div className='hero-arrows'>
            <button onClick={() => go(idx - 1)} aria-label='Previous slide'>
              <FiChevronLeft />
            </button>
            <button onClick={() => go(idx + 1)} aria-label='Next slide'>
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
