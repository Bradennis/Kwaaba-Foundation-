import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import {
  FiHeart,
  FiBookOpen,
  FiTrendingUp,
  FiUsers,
  FiDroplet,
  FiFeather,
  FiActivity,
} from "react-icons/fi";
import { useContent } from "../cms/ContentContext.jsx";
import { Reveal, LinkArrow } from "./ui.jsx";

export function PageBanner({ title, text, image, crumbs = [], bgPosition = 'center' }) {
  return (
    <section
      className={`page-banner${image ? ' has-bg' : ''}`}
      style={image ? { backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: bgPosition } : {}}
    >
      <div className='container'>
        <Reveal>
          <h1>{title}</h1>
          {text && <p>{text}</p>}
          <div className='crumbs'>
            <Link to='/'>Home</Link>{" "}
            {crumbs.map((c, i) => (
              <span key={i}>
                {" "}
                / {c.to ? <Link to={c.to}>{c.label}</Link> : <b>{c.label}</b>}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const ICONS = {
  heart: FiHeart,
  medical: FiActivity,
  rise: FiTrendingUp,
  book: FiBookOpen,
  hands: FiUsers,
  leaf: FiDroplet,
  drop: FiDroplet,
  feather: FiFeather,
};

export function ProgramCard({ p, index = 0 }) {
  const Icon = ICONS[p.icon] || FiHeart;
  return (
    <Reveal delay={index * 0.08}>
      <article className='card'>
        <div className='card-media'>
          <img src={p.image} alt={p.title} loading='lazy' />
        </div>
        <div className='card-body'>
          <span className='card-icon'>
            <Icon />
          </span>
          <h3>{p.title}</h3>
          <p>{p.excerpt}</p>
          <LinkArrow to={`/programs/${p.slug}`}>Learn More</LinkArrow>
        </div>
      </article>
    </Reveal>
  );
}

export function PersonCard({ person, index = 0 }) {
  return (
    <Reveal delay={index * 0.06}>
      <div className='person'>
        <div className='person-photo'>
          <img src={person.photo} alt={person.name} loading='lazy' />
        </div>
        <h3>{person.name}</h3>
        <div className='role'>{person.role}</div>
        {person.country && <div className='country'>{person.country}</div>}
      </div>
    </Reveal>
  );
}

export function QuoteMarquee() {
  const { content } = useContent();
  const items = content.quotes;
  const doubled = [...items, ...items];
  return (
    <div className='marquee' aria-hidden='true'>
      <div className='marquee-track'>
        {doubled.map((q, i) => (
          <span className='marquee-item' key={i}>
            “{q.text}” — {q.author}
          </span>
        ))}
      </div>
    </div>
  );
}

export function CtaBand({ title, text, button, to = "/donate" }) {
  return (
    <section className='cta-band'>
      <div className='container'>
        <Reveal>
          <h2>{title}</h2>
          {text && <p>{text}</p>}
        </Reveal>
        <Reveal delay={0.15}>
          <Link to={to} className='btn btn--orange'>
            {button || "Get Involved"} <FiArrowRight />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
