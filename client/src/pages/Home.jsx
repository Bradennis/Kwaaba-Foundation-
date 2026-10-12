import { Link } from "react-router-dom";
import HeroSlider from "../components/HeroSlider.jsx";
import {
  Reveal,
  SectionHead,
  StaggerGroup,
  StaggerItem,
  Counter,
  LinkArrow,
} from "../components/ui.jsx";
import { ProgramCard, QuoteMarquee, CtaBand } from "../components/sections.jsx";
import { useContent } from "../cms/ContentContext.jsx";
import { FiArrowRight, FiCalendar } from "react-icons/fi";

export default function Home() {
  const { content } = useContent();
  const { stats, about, founder, programs, events, posts } = content;
  const upcoming = events.filter((e) => e.status === "upcoming").slice(0, 3);
  const news = posts.filter((p) => p.type === "news").slice(0, 3);

  return (
    <>
      <HeroSlider />

      {/* Stats band — fixed background, count-up numbers */}
      <section className='stats-band'>
        <div className='container'>
          <StaggerGroup className='stats-grid'>
            {stats.map((st) => (
              <StaggerItem key={st.id}>
                <div className='stat-num'>
                  <Counter value={st.value} suffix={st.suffix} />
                </div>
                <div className='stat-label'>{st.label}</div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Who We Are */}
      <section className='section'>
        <div className='container split'>
          <Reveal>
            <div className='media-stack'>
              <span className='pattern' />
              <div className='frame'>
                <img src={about.image} alt='Kwaaba Foundation community work' />
              </div>
              <div className='badge'>
                <b>Dua Pa</b>
                <small>Our Adinkra motto</small>
              </div>
            </div>
          </Reveal>
          <div>
            <SectionHead
              kicker={about.title}
              title='When You Climb a Good Tree,'
              em='You Are Given a Push'
            />
            <Reveal delay={0.1}>
              <p className='lead'>{about.lead}</p>
              {about.body.map((para, i) => (
                <p
                  key={i}
                  style={{
                    color: "var(--grey)",
                    lineHeight: 1.8,
                    marginTop: 16,
                    fontSize: ".97rem",
                  }}
                >
                  {para}
                </p>
              ))}
              <div style={{ marginTop: 26 }}>
                <Link to='/about' className='btn btn--blue'>
                  View More
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <QuoteMarquee />

      {/* What We Do */}
      <section className='section section--soft'>
        <div className='container'>
          <SectionHead
            center
            kicker='What We Do'
            title='Programs That Change,'
            em='Lives'
            lead='From blood donation drives to classrooms, boreholes and tree-planting — practical work in health, empowerment, education and community development.'
          />
          <div className='cards' style={{ marginTop: 54 }}>
            {programs.slice(0, 3).map((p, i) => (
              <ProgramCard key={p.id} p={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Our People / Founder */}
      <section className='section section--dark'>
        <div className='container split split--flip'>
          <Reveal>
            <div className='media-stack'>
              <div className='frame' style={{ aspectRatio: "4/4.6" }}>
                <img src={founder.photo} alt={founder.name} />
              </div>
            </div>
          </Reveal>
          <div>
            <SectionHead
              kicker='Our People'
              title='Behind Every Milestone,'
              em='A Dedicated Team'
            />
            <Reveal delay={0.1}>
              <h3 style={{ color: "#fff", fontSize: "1.4rem" }}>
                {founder.name}
              </h3>
              <div
                style={{
                  color: "var(--bronze)",
                  fontWeight: 600,
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                  fontSize: 13,
                  margin: "6px 0 14px",
                }}
              >
                {founder.role}
              </div>
              <p className='lead'>{founder.short}</p>
              <blockquote
                style={{
                  borderLeft: "3px solid var(--orange)",
                  paddingLeft: 18,
                  margin: "24px 0",
                  color: "#dce8f4",
                  fontFamily: "var(--font-head)",
                  fontSize: "1.08rem",
                  fontStyle: "italic",
                }}
              >
                “Empowerment starts the moment people recognize their own power
                — and are supported to act on it.”
              </blockquote>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <Link to='/about' className='btn btn--orange'>
                  About the Founder
                </Link>
                <Link to='/team' className='btn btn--ghost'>
                  Our Team & Board
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Events + News */}
      <section className='section'>
        <div className='container'>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 60,
            }}
          >
            <div>
              <SectionHead kicker='Events' title='Upcoming' em='Events' />
              <div>
                {upcoming.map((e) => {
                  const d = new Date(e.date);
                  return (
                    <Reveal key={e.id}>
                      <div
                        className='event-row'
                        style={{ gridTemplateColumns: "110px 1fr" }}
                      >
                        <div className='event-date'>
                          <span>
                            {d.toLocaleString("en", { month: "short" })}
                          </span>
                          <b>{d.getDate()}</b>
                          <span>{d.getFullYear()}</span>
                        </div>
                        <div>
                          <h3>{e.title}</h3>
                          <p>
                            <FiCalendar
                              style={{ verticalAlign: -2, marginRight: 6 }}
                            />
                            {e.location} — {e.description}
                          </p>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
                <Reveal delay={0.15}>
                  <div style={{ marginTop: 20 }}>
                    <LinkArrow to='/events'>All Events</LinkArrow>
                  </div>
                </Reveal>
              </div>
            </div>
            <div>
              <SectionHead kicker='From The Field' title='NewsLetters' />
              <div style={{ display: "grid", gap: 22 }}>
                {news.map((p, i) => (
                  <Reveal key={p.id} delay={i * 0.08}>
                    <article className='card' style={{ flexDirection: "row" }}>
                      <div style={{ width: 130, flexShrink: 0 }}>
                        <img
                          src={p.image}
                          alt={p.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          loading='lazy'
                        />
                      </div>
                      <div className='card-body' style={{ padding: 18 }}>
                        <span style={{ fontSize: 12, color: "var(--grey)" }}>
                          {new Date(p.date).toLocaleDateString("en", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                        <h3 style={{ fontSize: "1.05rem" }}>{p.title}</h3>
                      </div>
                    </article>
                  </Reveal>
                ))}
                <Reveal delay={0.2}>
                  <LinkArrow to='/resources'>Media & Newsletter</LinkArrow>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title='Give Life, Plant Hope. Join the Giving Cycle!'
        text='Your donation supports blood donation campaigns, health screening, education and clean-water projects across Ghana.'
        button='Donate Now'
      />
    </>
  );
}
