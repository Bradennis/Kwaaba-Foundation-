import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'

/* Scroll-reveal wrapper — fade + rise, like the reference site's inview animations */
export function Reveal({ children, delay = 0, y = 44, className = '', once = true }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-60px' }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/* Stagger children on scroll */
export function StaggerGroup({ children, className = '', gap = 0.09 }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-50px' }}
      variants={{ show: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className = '' }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 46 },
        show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
      }}
    >
      {children}
    </motion.div>
  )
}

/* Animated number counter */
export function Counter({ value, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const mv = useMotionValue(0)
  const spring = useSpring(mv, { duration: 2000, bounce: 0 })
  const [display, setDisplay] = useState(0)

  useEffect(() => { if (inView) mv.set(value) }, [inView, value, mv])
  useEffect(() => spring.on('change', (v) => setDisplay(Math.round(v))), [spring])

  return (
    <span ref={ref}>
      {display.toLocaleString()}
      <span>{suffix}</span>
    </span>
  )
}

/* Word-by-word clip reveal used in the hero + banner titles */
export function SplitWords({ text, className = '', delay = 0, stagger = 0.055, as = 'h1' }) {
  const Cmp = motion[as] || 'h1'
  return (
    <Cmp className={className} initial="hidden" animate="show">
      {String(text).split(' ').map((w, i) => (
        <span key={i} className="word">
          <motion.span
            style={{ display: 'inline-block' }}
            variants={{
              hidden: { y: '108%' },
              show: {
                y: 0,
                transition: { duration: 0.75, delay: delay + i * stagger, ease: [0.22, 1, 0.36, 1] },
              },
            }}
          >
            {w}
          </motion.span>{' '}
        </span>
      ))}
    </Cmp>
  )
}

export function SectionHead({ kicker, title, em, lead, center, light }) {
  return (
    <Reveal>
      <div className={center ? 'text-center' : ''}>
        {kicker && <span className="kicker">{kicker}</span>}
        <h2 className="section-title">
          {title} {em && <em>{em}</em>}
        </h2>
        {lead && <p className="lead">{lead}</p>}
      </div>
    </Reveal>
  )
}

export function LinkArrow({ to, children }) {
  return (
    <Link to={to} className="link-arrow">
      {children} <FiArrowRight />
    </Link>
  )
}
