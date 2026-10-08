import { useEffect, useRef, useState } from 'react'
import {
  motion,
  AnimatePresence,
  MotionConfig,
  animate,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Baby,
  BadgeCheck,
  Building2,
  ClipboardCheck,
  FileCheck2,
  FileText,
  HeartPulse,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Palette,
  Phone,
  Receipt,
  Share2,
  ShieldCheck,
  Star,
  Users,
  Wallet,
  X,
} from 'lucide-react'
import {
  awards,
  corporateFocus,
  flow,
  insuranceServices,
  marketingCards,
  navItems,
  partners,
  schemes,
  skills,
  stats,
  strengths,
  themes,
  timeline,
  trust,
  typedRoles,
  why,
} from './data.js'

/* ------------------------------------------------------------------ */
/* Hooks & small building blocks                                       */
/* ------------------------------------------------------------------ */

function useTyping(phrases, reduced) {
  const [i, setI] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (reduced) {
      setText(phrases[i])
      const t = setTimeout(() => setI((i + 1) % phrases.length), 2800)
      return () => clearTimeout(t)
    }
    const full = phrases[i]
    let t
    if (!deleting && text === full) {
      t = setTimeout(() => setDeleting(true), 1700)
    } else if (deleting && text === '') {
      setDeleting(false)
      setI((i + 1) % phrases.length)
    } else {
      t = setTimeout(
        () => setText(deleting ? full.slice(0, text.length - 1) : full.slice(0, text.length + 1)),
        deleting ? 28 : 62
      )
    }
    return () => clearTimeout(t)
  }, [text, deleting, i, phrases, reduced])

  return [text, i]
}

function Reveal({ children, delay = 0, y = 30, className = '', as = 'div', ...rest }) {
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

function Title({ lines, as: Tag = 'h2', className = '' }) {
  return (
    <Tag className={`display ${className}`}>
      {lines.map((line, i) => {
        const serif = line.startsWith('~')
        return (
          <motion.span
            className="mask"
            key={i}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
          >
            <motion.span
              className={serif ? 'serif-line' : ''}
              style={{ display: 'block' }}
              variants={{
                hidden: { y: '110%' },
                show: { y: 0, transition: { duration: 0.8, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] } },
              }}
            >
              {serif ? line.slice(1) : line}
            </motion.span>
          </motion.span>
        )
      })}
    </Tag>
  )
}

function Label({ n, children }) {
  return (
    <Reveal className="label" y={12}>
      {n && <span className="label-n">{n}</span>}
      <span>— {children}</span>
    </Reveal>
  )
}

function Btn({ href, children, variant = 'primary', external, ...rest }) {
  return (
    <a
      href={href}
      className={`btn btn-${variant}`}
      {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
      {...rest}
    >
      <span>{children}</span>
      <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
    </a>
  )
}

function CountUp({ to, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduced = useReducedMotion()
  const [val, setVal] = useState(reduced ? to : 0)
  useEffect(() => {
    if (!inView || reduced) return
    const c = animate(0, to, {
      duration: 1.6,
      ease: 'easeOut',
      onUpdate: (v) => setVal(Math.round(v)),
    })
    return () => c.stop()
  }, [inView, to, reduced])
  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  )
}

function ThemeSwitcher({ themeIdx, auto, setThemeIdx, setAuto }) {
  return (
    <div className="swatches" role="group" aria-label="Accent colour">
      {themes.map((t, i) => (
        <button
          key={t.name}
          className={`swatch ${!auto && themeIdx === i ? 'on' : ''}`}
          style={{ background: t.color }}
          aria-label={`Accent colour: ${t.name}`}
          aria-pressed={!auto && themeIdx === i}
          onClick={() => {
            setAuto(false)
            setThemeIdx(i)
          }}
        />
      ))}
      <button
        className={`swatch-auto ${auto ? 'on' : ''}`}
        aria-label="Colour follows typing animation"
        aria-pressed={auto}
        title="Auto colour change"
        onClick={() => setAuto(!auto)}
      >
        <Palette size={15} strokeWidth={1.75} />
      </button>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

function Nav({ themeProps }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className={`nav ${scrolled || open ? 'nav-solid' : ''}`}>
      <div className="wrap nav-inner">
        <a href="#home" className="nav-brand" aria-label="Ramesh Kumar Naidu — home">
          RKN
        </a>
        <nav className="nav-links" aria-label="Primary">
          {navItems.map(([label, id]) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </nav>
        <div className="nav-tools">
          <div className="nav-swatches">
            <ThemeSwitcher {...themeProps} />
          </div>
          <a href="#contact" className="circle-btn" aria-label="Go to contact">
            <ArrowUpRight size={18} strokeWidth={1.75} />
          </a>
          <button
            className="circle-btn burger"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      <motion.div className="progress" style={{ scaleX: progress }} />
      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <nav aria-label="Mobile">
              {navItems.map(([label, id], i) => (
                <motion.a
                  key={id}
                  href={`#${id}`}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i }}
                >
                  <span className="mm-n">{String(i + 1).padStart(2, '0')}</span>
                  {label}
                </motion.a>
              ))}
            </nav>
            <ThemeSwitcher {...themeProps} />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

function Hero({ typed }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const clip = useTransform(scrollYProgress, [0, 0.55], ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'])
  const [photoFailed, setPhotoFailed] = useState(false)
  const [text] = typed
  const wordRef = useRef(null)

  useEffect(() => {
    const fit = () => {
      const box = wordRef.current
      if (!box || !box.firstElementChild) return
      box.style.fontSize = '100px'
      const w = box.firstElementChild.getBoundingClientRect().width
      if (w > 0) box.style.fontSize = `${(100 * box.clientWidth * 0.995) / w}px`
    }
    fit()
    window.addEventListener('resize', fit)
    document.fonts?.ready.then(fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  return (
    <section id="home" ref={ref} className="hero">
      <div className="wrap">
        <motion.div
          className="hero-meta"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <span>Healthcare • Billing • Insurance</span>
          <span className="hero-meta-r">
            <span>
              <MapPin size={13} aria-hidden="true" /> Visakhapatnam, India
            </span>
            <a href="#contact">
              Available for professional collaborations <ArrowRight size={13} aria-hidden="true" />
            </a>
          </span>
        </motion.div>

        <div className="portfolio-word" aria-hidden="true" ref={wordRef}>
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="pw-base">PORTFOLIO</span>
            <motion.span className="pw-accent" style={{ clipPath: clip }}>
              PORTFOLIO
            </motion.span>
          </motion.div>
        </div>

        <div className="hero-grid">
          <div className="hero-head">
            <motion.p
              className="hello"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              Hello, I’m
            </motion.p>
            <motion.h1
              className="hero-name"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Ramesh Kumar
              <br />
              <em>Naidu</em>
            </motion.h1>
          </div>

          <motion.div
            className="hero-photo"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="hero-circle" aria-hidden="true" />
            {photoFailed ? (
              <div className="photo-placeholder" role="img" aria-label="Photo placeholder">
                ADD YOUR PHOTO HERE
                <small>Replace public/ramesh.png</small>
              </div>
            ) : (
              <img
                src="ramesh.png"
                alt="Ramesh Kumar Naidu"
                onError={() => setPhotoFailed(true)}
              />
            )}
            <motion.div
              className="badge"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1, duration: 0.6 }}
            >
              <span className="dot" aria-hidden="true" />
              Available for
              <br />
              professional
              <br />
              collaborations
            </motion.div>
          </motion.div>

          <motion.div
            className="hero-body"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.8 }}
          >
            <p className="role-kicker">Senior Executive</p>
            <p className="typed" aria-live="off">
              <span className="typed-text">{text}</span>
              <span className="caret" aria-hidden="true" />
            </p>
            <p className="role-sub">
              Hospital Billing • Insurance • Corporate Relations
              <br />
              Marketing &amp; Referrals
            </p>
            <p className="intro">
              Experienced healthcare professional specializing in hospital billing, insurance and TPA
              coordination, corporate billing, patient financial counselling, referrals and healthcare
              relationship management.
            </p>
            <div className="btn-row">
              <Btn href="#contact">Contact me</Btn>
              <Btn href="#experience" variant="ghost">
                View experience
              </Btn>
            </div>
          </motion.div>
        </div>

        <ul className="trust">
          {trust.map((t, i) => (
            <motion.li
              key={t}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + i * 0.08 }}
            >
              <span className="trust-n">{String(i + 1).padStart(2, '0')}</span>
              {t}
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* About + stats                                                       */
/* ------------------------------------------------------------------ */

function About() {
  return (
    <section id="about" className="section">
      <div className="wrap">
        <Label n="01">About</Label>
        <Title lines={['Healthcare', '~meets', 'Relationship', 'Management']} />
        <div className="two-col about-cols">
          <div className="prose">
            <Reveal as="p">
              With extensive experience in hospital billing, insurance processing, corporate billing,
              patient coordination and healthcare marketing, Ramesh Kumar Naidu brings together hospital
              operations knowledge and strong relationship-management skills.
            </Reveal>
            <Reveal as="p" delay={0.08}>
              His professional experience includes inpatient billing, insurance and TPA coordination,
              corporate billing, claim submission, financial counselling, doctor coordination and hospital
              business development.
            </Reveal>
            <Reveal as="p" delay={0.16}>
              With an MBA background in Hospital Administration and Marketing &amp; HR, he combines
              healthcare operations knowledge with marketing and relationship-building expertise.
            </Reveal>
          </div>
          <Reveal className="quote-block" delay={0.1}>
            <blockquote>“Connecting healthcare operations with people, relationships and service.”</blockquote>
            <p className="signature">Ramesh Kumar Naidu</p>
          </Reveal>
        </div>

        <div className="stats">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="stat">
              <div className="stat-num">
                <CountUp to={s.to} suffix={s.suffix} />
              </div>
              <div className="stat-label">
                {s.label}
                {s.sub && <span>{s.sub}</span>}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Experience                                                          */
/* ------------------------------------------------------------------ */

function Experience() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 70%'] })
  const grow = useSpring(scrollYProgress, { stiffness: 90, damping: 28 })

  return (
    <section id="experience" className="section">
      <div className="wrap">
        <Label n="02">Experience</Label>
        <Title lines={['A career built', '~through experience']} />
        <div className="timeline" ref={ref}>
          <div className="tl-rail" aria-hidden="true">
            <motion.div className="tl-fill" style={{ scaleY: grow }} />
          </div>
          {timeline.map((t, i) => (
            <Reveal key={t.role + t.years} className={`tl-item ${t.current ? 'current' : ''}`} delay={0.04}>
              <div className="tl-num">{String(i + 1).padStart(2, '0')}</div>
              <div className="tl-years">
                {t.years}
                {t.current && <span className="now">Current role</span>}
              </div>
              <div className="tl-main">
                <h3>{t.role}</h3>
                <p className="tl-org">{t.org}</p>
                <ul>
                  {t.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Recognition                                                         */
/* ------------------------------------------------------------------ */

function Achievements() {
  return (
    <section id="achievements" className="section">
      <div className="wrap">
        <Label n="03">Recognition</Label>
        <Title lines={['Recognition', '~that matters']} />
        <div className="grid-3">
          {awards.map((a, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <motion.article className="card award">
                <div className="award-top">
                  <span className="big-n">{String(i + 1).padStart(2, '0')}</span>
                  <Award size={22} strokeWidth={1.25} aria-hidden="true" />
                </div>
                <h3 className="award-title">
                  {a.title.map((l) => (
                    <span key={l}>{l}</span>
                  ))}
                </h3>
                <p className="award-org">{a.org}</p>
                <p className="award-note">{a.note}</p>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Insurance & TPA                                                     */
/* ------------------------------------------------------------------ */

const serviceIcons = [FileText, ShieldCheck, ClipboardCheck, Share2, Wallet, BadgeCheck, Receipt, FileCheck2, Building2]

function Insurance() {
  return (
    <section id="insurance" className="section">
      <div className="wrap">
        <Label n="04">Insurance</Label>
        <Title lines={['Insurance', '~&', 'TPA', 'Coordination']} />
        <Reveal as="p" className="lede">
          Supporting smooth coordination between patients, hospitals, doctors, insurance companies and TPA
          partners.
        </Reveal>
        <div className="grid-3 services">
          {insuranceServices.map((s, i) => {
            const Icon = serviceIcons[i]
            return (
              <Reveal key={s} delay={(i % 3) * 0.07}>
                <motion.div className="card service">
                  <div className="service-top">
                    <span className="small-n">{String(i + 1).padStart(2, '0')}</span>
                    <Icon size={20} strokeWidth={1.25} aria-hidden="true" />
                  </div>
                  <h3>{s}</h3>
                </motion.div>
              </Reveal>
            )
          })}
        </div>

        <div className="partners-head">
          <Reveal as="h3" className="serif-h">
            Our Insurance &amp; TPA Partners
          </Reveal>
          <Reveal as="span" className="count" delay={0.05}>
            {partners.length} partners
          </Reveal>
        </div>
        <ul className="partners">
          {partners.map((p, i) => (
            <motion.li
              key={p.src}
              className="partner"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: (i % 8) * 0.04 }}
            >
              <img src={p.src} alt={p.name} loading="lazy" />
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Women & Children                                                    */
/* ------------------------------------------------------------------ */

function WomenChildren() {
  const cards = [
    {
      icon: HeartPulse,
      t: 'Gynaecology',
      d: 'Experienced gynaecology doctors available for women’s healthcare requirements and coordinated insurance cases.',
    },
    {
      icon: Baby,
      t: 'Paediatrics',
      d: 'Experienced paediatric doctors available for children’s healthcare requirements and coordinated insurance cases.',
    },
  ]
  return (
    <section id="women-children" className="section">
      <div className="wrap">
        <Label n="05">Women &amp; Children</Label>
        <Title lines={['Specialized', '~Women &', 'Children', 'Healthcare']} />
        <Reveal as="p" className="lede">
          Motherly Women and Children Hospital provides dedicated healthcare services for women and children
          with experienced doctors and coordinated hospital support.
        </Reveal>
        <div className="grid-2">
          {cards.map((c, i) => (
            <Reveal key={c.t} delay={i * 0.1}>
              <motion.article className="card big-card">
                <c.icon size={30} strokeWidth={1.1} aria-hidden="true" />
                <h3 className="serif-h">{c.t}</h3>
                <p>{c.d}</p>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Marketing & Referrals                                               */
/* ------------------------------------------------------------------ */

function Marketing() {
  return (
    <section id="marketing" className="section">
      <div className="wrap">
        <Label n="06">Marketing &amp; Referrals</Label>
        <Title lines={['Building', '~Healthcare', 'Connections']} />
        <Reveal as="p" className="lede">
          Connecting patients, doctors, hospitals, insurance partners and organizations through professional
          coordination.
        </Reveal>

        <ol className="flow" aria-label="Patient care coordination flow">
          {flow.map((f, i) => (
            <motion.li
              key={f}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.09, duration: 0.55 }}
            >
              <span className="flow-n">{String(i + 1).padStart(2, '0')}</span>
              <span className="flow-t">{f}</span>
              {i < flow.length - 1 && <ArrowRight className="flow-arrow" size={18} strokeWidth={1.5} aria-hidden="true" />}
            </motion.li>
          ))}
        </ol>

        <div className="grid-3">
          {marketingCards.map(([t, d], i) => (
            <Reveal key={t} delay={(i % 3) * 0.07}>
              <motion.article className="card">
                <div className="service-top">
                  <span className="small-n">{String(i + 1).padStart(2, '0')}</span>
                  <Users size={20} strokeWidth={1.25} aria-hidden="true" />
                </div>
                <h3 className="card-h">{t}</h3>
                <p className="card-p">{d}</p>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Corporate + Schemes                                                 */
/* ------------------------------------------------------------------ */

function Corporate() {
  return (
    <section id="corporate" className="section">
      <div className="wrap">
        <Label n="07">Corporate</Label>
        <div className="corp-head">
          <Title lines={['Corporate', 'Healthcare', '~Partnerships']} />
          <motion.div
            className="soon"
            initial={{ opacity: 0, scale: 0.7, rotate: -12 }}
            whileInView={{ opacity: 1, scale: 1, rotate: -8 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            aria-label="Coming soon"
          >
            Coming
            <br />
            Soon
          </motion.div>
        </div>
        <Reveal as="p" className="lede">
          Building stronger corporate healthcare relationships and coordinated healthcare support for
          employees and their families.
        </Reveal>
        <ul className="focus-list">
          {corporateFocus.map((f, i) => (
            <Reveal as="li" key={f} delay={i * 0.07} y={16}>
              <span className="small-n">{String(i + 1).padStart(2, '0')}</span>
              <span className="focus-t">{f}</span>
              <span className="tag">Coming soon</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Schemes() {
  return (
    <section id="schemes" className="section">
      <div className="wrap">
        <Label n="08">Healthcare Schemes</Label>
        <Title lines={['Healthcare', 'Scheme', '~Coordination']} />
        <Reveal as="p" className="lede">
          Handling and coordinating eligible healthcare cases and related documentation as applicable.
        </Reveal>
        <div className="grid-3">
          {schemes.map((s, i) => (
            <Reveal key={s.name} delay={i * 0.08}>
              <motion.div className="card scheme">
                <span className="small-n">{String(i + 1).padStart(2, '0')}</span>
                <div className="scheme-logo">
                  <img src={s.image} alt={s.name} loading="lazy" />
                </div>
                <h3 className="serif-h">{s.name}</h3>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Expertise, Education, Strengths, Why                                */
/* ------------------------------------------------------------------ */

function Expertise() {
  return (
    <section id="expertise" className="section">
      <div className="wrap">
        <Label n="09">Expertise</Label>
        <Title lines={['What I', '~bring to', 'the table']} />
        <div className="skills">
          {skills.map(([name, rating], i) => (
            <Reveal key={name} className="skill" delay={(i % 2) * 0.06} y={16}>
              <div className="skill-row">
                <span>{name}</span>
                <span className="stars" role="img" aria-label={`${rating} out of 5`}>
                  {[0, 1, 2, 3, 4].map((s) => (
                    <Star key={s} size={13} strokeWidth={1.5} fill={s < rating ? 'currentColor' : 'none'} />
                  ))}
                </span>
              </div>
              <div className="skill-line">
                <motion.span
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: rating / 5 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Education() {
  const edu = [
    ['MBA', 'Hospital Administration', '2020 – 2023'],
    ['MBA', 'Marketing & HR', '2008 – 2010'],
  ]
  return (
    <section id="education" className="section">
      <div className="wrap">
        <Label n="10">Education</Label>
        <div className="grid-3">
          {edu.map(([d, s, y], i) => (
            <Reveal key={s} delay={i * 0.08}>
              <motion.div className="card">
                <span className="big-n sm">{d}</span>
                <h3 className="card-h">{s}</h3>
                <p className="card-p">{y}</p>
              </motion.div>
            </Reveal>
          ))}
          <Reveal delay={0.16}>
            <motion.div className="card">
              <span className="small-n">Technical skills</span>
              <h3 className="card-h">MS Office</h3>
              <p className="card-p">Internet / Net Concepts</p>
            </motion.div>
          </Reveal>
        </div>

        <div className="strengths-block">
          <Reveal as="h3" className="serif-h">
            Core Strengths
          </Reveal>
          <ul className="strengths">
            {strengths.map((s, i) => (
              <Reveal as="li" key={s} delay={(i % 3) * 0.06} y={14}>
                <span className="small-n">{String(i + 1).padStart(2, '0')}</span>
                {s}
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function Why() {
  return (
    <section id="why" className="section">
      <div className="wrap">
        <Title lines={['Why', 'Work', '~with me']} />
        <div className="grid-4">
          {why.map(([t, d], i) => (
            <Reveal key={t} delay={i * 0.08}>
              <motion.article className="card">
                <span className="big-n">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="card-h">{t}</h3>
                <p className="card-p">{d}</p>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Brand statement, Contact, Footer                                    */
/* ------------------------------------------------------------------ */

function Brand() {
  return (
    <section className="brand" aria-label="Personal brand statement">
      <div className="wrap">
        <motion.blockquote
          className="brand-quote"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          Healthcare is not only about services.
          <br />
          It is about <span className="accent-text">people, trust</span> and <span className="accent-text">connection.</span>
        </motion.blockquote>
        <Reveal className="brand-sig" delay={0.2}>
          <strong>Ramesh Kumar Naidu | Visakhapatnam</strong>
          <span>Senior Executive</span>
          <span>Hospital Billing • Insurance • Corporate Relations</span>
        </Reveal>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section id="contact" className="section">
      <div className="wrap">
        <Label n="11">Contact</Label>
        <Title lines={['Let’s', '~connect']} />
        <div className="two-col">
          <Reveal as="p" className="lede flush">
            For insurance coordination, corporate healthcare enquiries, referral coordination and
            professional collaborations.
          </Reveal>
          <Reveal className="contact-card" delay={0.1}>
            <h3 className="serif-h">Ramesh Kumar Naidu | Visakhapatnam</h3>
            <ul>
              <li>
                <MapPin size={16} aria-hidden="true" /> Visakhapatnam, Andhra Pradesh
              </li>
              <li>
                <Phone size={16} aria-hidden="true" /> <a href="tel:+919989013287">9989013287</a>
              </li>
              <li>
                <Mail size={16} aria-hidden="true" />
                <a href="mailto:ramesh999.nalam@gmail.com">ramesh999.nalam@gmail.com</a>
              </li>
            </ul>
            <div className="btn-row">
              <Btn href="tel:+919989013287">
                <Phone size={14} aria-hidden="true" /> Call me
              </Btn>
              <Btn href="https://wa.me/919989013287" variant="ghost" external>
                <MessageCircle size={14} aria-hidden="true" /> WhatsApp
              </Btn>
              <Btn href="mailto:ramesh999.nalam@gmail.com" variant="ghost">
                <Mail size={14} aria-hidden="true" /> Email me
              </Btn>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  const links = [
    ['Home', 'home'],
    ['About', 'about'],
    ['Experience', 'experience'],
    ['Insurance', 'insurance'],
    ['Marketing', 'marketing'],
    ['Contact', 'contact'],
  ]
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-top">
          <div>
            <p className="footer-name">Ramesh Kumar Naidu | Visakhapatnam</p>
            <p>Senior Executive</p>
            <p>Hospital Billing | Insurance | Corporate Relations</p>
            <p className="footer-loc">Visakhapatnam • India</p>
          </div>
          <nav aria-label="Footer">
            {links.map(([l, id]) => (
              <a key={id} href={`#${id}`}>
                {l}
              </a>
            ))}
          </nav>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Ramesh Kumar Naidu[cite: Vizag]</span>
          <span>Personal Professional Portfolio</span>
        </div>
      </div>
    </footer>
  )
}

/* ------------------------------------------------------------------ */
/* App                                                                 */
/* ------------------------------------------------------------------ */

export default function App() {
  const reduced = useReducedMotion()
  const typed = useTyping(typedRoles, reduced)
  const [themeIdx, setThemeIdx] = useState(0)
  const [auto, setAuto] = useState(true)

  // Accent colour follows the typed role while "auto" is on.
  const activeIdx = auto ? typed[1] % themes.length : themeIdx
  useEffect(() => {
    document.documentElement.style.setProperty('--accent', themes[activeIdx].color)
  }, [activeIdx])

  const themeProps = { themeIdx: activeIdx, auto, setThemeIdx, setAuto }

  return (
    <MotionConfig reducedMotion="user">
      <a href="#about" className="skip">
        Skip to content
      </a>
      <Nav themeProps={themeProps} />
      <main>
        <Hero typed={typed} />
        <About />
        <Experience />
        <Achievements />
        <Insurance />
        <WomenChildren />
        <Marketing />
        <Corporate />
        <Schemes />
        <Expertise />
        <Education />
        <Why />
        <Brand />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  )
}