import { useEffect, useState } from "react";
import { Outlet, NavLink, Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiPhone,
  FiMail,
  FiChevronDown,
  FiMenu,
  FiX,
  FiArrowUp,
} from "react-icons/fi";
import {
  FaFacebookF,
  FaXTwitter,
  FaYoutube,
  FaInstagram,
  FaTiktok,
  FaLinkedinIn,
} from "react-icons/fa6";
import { useContent } from "../cms/ContentContext.jsx";

const MENU = [
  { to: "/", label: "Home" },
  {
    label: "Who We Are",
    children: [
      { to: "/about", label: "About Kwaaba Foundation" },
      { to: "/board", label: "Board of Directors" },
      { to: "/team", label: "Our Team" },
    ],
  },
  {
    label: "What We Do",
    children: [
      {
        to: "/programs/blood-donation",
        label: "Blood Donation Initiatives Campaign",
      },
      { to: "/programs/health", label: "Health Care" },
      { to: "/programs/empowerment", label: "Socio-Economic Empowerment" },
      { to: "/programs/education", label: "Education" },
      { to: "/programs/community-development", label: "Community Development" },
      { to: "/programs/sustainability", label: "Sustainability & Environment" },
    ],
  },
  {
    label: "Support Our Cause",
    children: [
      { to: "/donate", label: "Financial Donations" },
      { to: "/volunteer", label: "Volunteer Opportunities" },
      { to: "/contact", label: "Get In Touch" },
    ],
  },
  { to: "/events", label: "Events" },
  {
    label: "Resources",
    children: [
      { to: "/newsletters", label: "NewsLetters" },
      { to: "/media", label: "Media Mentions" },
      { to: "/gallery", label: "Photos" },
      { to: "/videos", label: "Videos" },
    ],
  },
];

function Navbar() {
  const { content } = useContent();
  const s = content.settings || {};
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openDrop, setOpenDrop] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <>
      <div className='topbar'>
        <div className='container'>
          <div className='topbar-left'>
            <a href={`tel:${s.phoneShort?.replace(/\s/g, "")}`}>
              <FiPhone /> {s.phone}
            </a>
            <a href={`mailto:${s.email}`}>
              <FiMail /> {s.email}
            </a>
          </div>
          <div className='topbar-right'>
            <a
              href={s.facebook}
              aria-label='Facebook'
              target='_blank'
              rel='noreferrer'
            >
              <FaFacebookF />
            </a>
            <a
              href={s.twitter}
              aria-label='Twitter'
              target='_blank'
              rel='noreferrer'
            >
              <FaXTwitter />
            </a>
            <a
              href={s.youtube}
              aria-label='Youtube'
              target='_blank'
              rel='noreferrer'
            >
              <FaYoutube />
            </a>
            <a
              href={s.instagram}
              aria-label='Instagram'
              target='_blank'
              rel='noreferrer'
            >
              <FaInstagram />
            </a>
            <a
              href={s.tiktok}
              aria-label='Tiktok'
              target='_blank'
              rel='noreferrer'
            >
              <FaTiktok />
            </a>
            <a
              href={s.linkedin}
              aria-label='LinkedIn'
              target='_blank'
              rel='noreferrer'
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
        <div className='container'>
          <Link to='/' className='logo' aria-label='Kwaaba Foundation home'>
            <img src='/images/kwaaba_logo.png' alt='Kwaaba Foundation' />
          </Link>

          <nav className='header-nav'>
            <ul className='nav'>
              {MENU.map((item) =>
                item.children ? (
                  <li
                    key={item.label}
                    className={`has-drop ${openDrop === item.label ? "open" : ""}`}
                    onMouseEnter={() => setOpenDrop(item.label)}
                    onMouseLeave={() => setOpenDrop(null)}
                  >
                    <button type='button'>
                      {item.label} <FiChevronDown size={13} />
                    </button>
                    <ul className='drop'>
                      {item.children.map((c) => (
                        <li key={c.to}>
                          <NavLink to={c.to}>{c.label}</NavLink>
                        </li>
                      ))}
                    </ul>
                  </li>
                ) : (
                  <li key={item.to}>
                    <NavLink to={item.to} end={item.to === "/"}>
                      {item.label}
                    </NavLink>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div className='header-cta'>
            <Link to='/donate' className='btn btn--orange btn--sm'>
              {s.donateLabel}
            </Link>
            <button
              className='burger'
              onClick={() => setOpen(true)}
              aria-label='Open menu'
            >
              <FiMenu />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className='mobile-nav'
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className='mn-head'>
              <img src='/images/kwaaba_logo.png' alt='Kwaaba Foundation' />
              <button onClick={() => setOpen(false)} aria-label='Close menu'>
                <FiX />
              </button>
            </div>
            <ul>
              {MENU.map((item) =>
                item.children ? (
                  <li key={item.label} style={{ borderBottom: 0 }}>
                    <div className='mn-group-head'>{item.label}</div>
                    <div className='sub'>
                      {item.children.map((c) => (
                        <NavLink key={c.to} to={c.to}>
                          {c.label}
                        </NavLink>
                      ))}
                    </div>
                  </li>
                ) : (
                  <li key={item.to}>
                    <NavLink to={item.to}>{item.label}</NavLink>
                  </li>
                ),
              )}
              <li style={{ paddingTop: 18 }}>
                <Link to='/donate' className='btn btn--orange'>
                  {s.donateLabel}
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Footer() {
  const { content } = useContent();
  const s = content.settings || {};
  const year = new Date().getFullYear();
  return (
    <footer className='site-footer'>
      <div className='container footer-grid footer-grid--simple'>
        <div className='footer-contact-block'>
          <h4>Contact</h4>
          <ul className='footer-contact'>
            <li>
              <FiPhone />{" "}
              <a href={`tel:${s.phoneShort?.replace(/\s/g, "")}`}>{s.phone}</a>
            </li>
            <li>
              <FiMail /> <a href={`mailto:${s.email}`}>{s.email}</a>
            </li>
          </ul>
        </div>

        <div className='footer-social-block'>
          <h4>Follow Us</h4>
          <div className='footer-socials'>
            <a
              href={s.facebook}
              aria-label='Facebook'
              target='_blank'
              rel='noreferrer'
            >
              <FaFacebookF />
            </a>
            <a
              href={s.twitter}
              aria-label='Twitter'
              target='_blank'
              rel='noreferrer'
            >
              <FaXTwitter />
            </a>
            <a
              href={s.youtube}
              aria-label='Youtube'
              target='_blank'
              rel='noreferrer'
            >
              <FaYoutube />
            </a>
            <a
              href={s.instagram}
              aria-label='Instagram'
              target='_blank'
              rel='noreferrer'
            >
              <FaInstagram />
            </a>
            <a
              href={s.tiktok}
              aria-label='Tiktok'
              target='_blank'
              rel='noreferrer'
            >
              <FaTiktok />
            </a>
            <a
              href={s.linkedin}
              aria-label='LinkedIn'
              target='_blank'
              rel='noreferrer'
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      <div className='container footer-bottom'>
        <span>
          © {year} {s.siteName} — All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}

function ToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          className='to-top'
          aria-label='Back to top'
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
        >
          <FiArrowUp />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export default function Layout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ToTop />
    </>
  );
}
