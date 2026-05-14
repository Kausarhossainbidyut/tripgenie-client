import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { APP_NAME } from '../constants';
import {
  FiMapPin, FiMessageSquare, FiHeart, FiStar, FiArrowRight,
  FiShield, FiZap, FiCheck, FiPlay, FiTrendingUp, FiAward,
  FiGlobe, FiUsers, FiClock, FiCamera, FiCompass, FiSun,
  FiWifi, FiCoffee, FiPackage, FiThumbsUp, FiMail, FiPhone
} from 'react-icons/fi';

/* COLOUR TOKENS — matches teal navbar */
const T = {
  teal:    '#0d9488',
  tealLt:  '#14b8a6',
  cyan:    '#06b6d4',
  emerald: '#059669',
  grad:    'linear-gradient(135deg, #0d9488, #06b6d4)',
  gradWarm:'linear-gradient(135deg, #f59e0b, #ef4444)',
  dark:    '#0f172a',
  darkMid: '#1e293b',
};

/* ── Scroll-triggered fade-up ── */
function FadeUp({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 44 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >{children}</motion.div>
  );
}

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.55, delay }}
    >{children}</motion.div>
  );
}

function ScaleIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, scale: 0.88 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
    >{children}</motion.div>
  );
}

/* ── Animated counter ── */
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useRef(() => {
    let start = 0;
    const step = target / 60;
    const id = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(id); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(id);
  });
  return <span ref={ref}>{inView ? target : val}{suffix}</span>;
}

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
export function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY       = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <div style={{ overflow: 'hidden', background: '#f8fafc' }}>

      {/* ══════════ HERO ══════════ */}
      <section ref={heroRef} style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <motion.div style={{ y: heroY, position: 'absolute', inset: 0 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #042f2e 0%, #0f4c4c 35%, #134e4a 65%, #0c4a6e 100%)' }} />
          <motion.div animate={{ scale: [1, 1.25, 1], opacity: [0.35, 0.55, 0.35] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'absolute', top: '8%', left: '12%', width: '520px', height: '520px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(13,148,136,0.5) 0%, transparent 70%)', filter: 'blur(50px)' }} />
          <motion.div animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            style={{ position: 'absolute', bottom: '12%', right: '8%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.4) 0%, transparent 70%)', filter: 'blur(60px)' }} />
          <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.12, 0.28, 0.12] }} transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
            style={{ position: 'absolute', top: '45%', right: '28%', width: '380px', height: '380px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(5,150,105,0.35) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
        </motion.div>

        <motion.div style={{ opacity: heroOpacity, position: 'relative', zIndex: 10, width: '100%' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem', textAlign: 'center' }}>

            {/* Badge */}
            <motion.div initial={{ opacity: 0, y: 22, scale: 0.88 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.65, ease: [0.16,1,0.3,1] }}
              style={{ display: 'inline-flex', marginBottom: '2rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 1.125rem', background: 'rgba(13,148,136,0.18)', border: '1px solid rgba(13,148,136,0.4)', borderRadius: '9999px', backdropFilter: 'blur(12px)' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}>
                  <FiGlobe size={14} color="#5eead4" />
                </motion.div>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#5eead4', letterSpacing: '0.02em' }}>AI-Powered Travel Platform</span>
                <span style={{ padding: '0.125rem 0.5rem', background: T.grad, borderRadius: '9999px', fontSize: '0.6875rem', fontWeight: 700, color: 'white' }}>NEW</span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1 initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.15, ease: [0.16,1,0.3,1] }}
              style={{ fontSize: 'clamp(2.75rem, 8vw, 5.75rem)', fontWeight: 900, lineHeight: 1.04, letterSpacing: '-0.04em', color: 'white', marginBottom: '1.5rem' }}>
              Discover Your
              <br />
              <span style={{ background: 'linear-gradient(135deg, #5eead4 0%, #67e8f9 50%, #a7f3d0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Perfect Journey
              </span>
            </motion.h1>

            {/* Sub */}
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: 0.3, ease: [0.16,1,0.3,1] }}
              style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', color: 'rgba(255,255,255,0.68)', maxWidth: '620px', margin: '0 auto 2.75rem', lineHeight: 1.78, fontWeight: 400 }}>
              AI-powered travel planning meets seamless booking. Explore breathtaking destinations and create memories that last a lifetime.
            </motion.p>

            {/* CTAs */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.45 }}
              style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '4.5rem' }}>
              <Link to="/items" style={{ textDecoration: 'none' }}>
                <motion.button whileHover={{ scale: 1.05, y: -4 }} whileTap={{ scale: 0.96 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '1rem 2.25rem', background: T.grad, border: 'none', borderRadius: '14px', fontSize: '1rem', fontWeight: 700, color: 'white', cursor: 'pointer', boxShadow: '0 8px 32px rgba(13,148,136,0.55)', letterSpacing: '-0.01em' }}>
                  <FiMapPin size={18} /> Explore Destinations <FiArrowRight size={16} />
                </motion.button>
              </Link>
              <Link to="/ai-chat" style={{ textDecoration: 'none' }}>
                <motion.button whileHover={{ scale: 1.05, y: -4 }} whileTap={{ scale: 0.96 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '1rem 2.25rem', background: 'rgba(255,255,255,0.09)', border: '1.5px solid rgba(255,255,255,0.22)', borderRadius: '14px', fontSize: '1rem', fontWeight: 600, color: 'white', cursor: 'pointer', backdropFilter: 'blur(10px)', letterSpacing: '-0.01em' }}>
                  <FiPlay size={16} /> Ask AI Assistant
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.6 }}
              style={{ display: 'inline-flex', flexWrap: 'wrap', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', backdropFilter: 'blur(12px)', padding: '0.5rem' }}>
              {[
                { value: '500+', label: 'Destinations', icon: <FiMapPin size={15}/> },
                { value: '10K+', label: 'Travelers',    icon: <FiUsers size={15}/> },
                { value: '24/7', label: 'AI Support',   icon: <FiClock size={15}/> },
                { value: '4.9★', label: 'Avg Rating',   icon: <FiStar size={15}/> },
              ].map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.72 + i * 0.08 }}
                  style={{ padding: '1rem 1.75rem', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none', textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem', marginBottom: '0.2rem' }}>
                    <span style={{ color: '#5eead4' }}>{s.icon}</span>
                    <span style={{ fontSize: 'clamp(1.375rem, 3vw, 1.875rem)', fontWeight: 800, color: 'white', letterSpacing: '-0.03em' }}>{s.value}</span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', fontWeight: 500, margin: 0 }}>{s.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
          style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Scroll</span>
          <motion.div animate={{ y: [0, 9, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: '22px', height: '38px', border: '1.5px solid rgba(255,255,255,0.18)', borderRadius: '11px', display: 'flex', justifyContent: 'center', paddingTop: '5px' }}>
            <div style={{ width: '3px', height: '7px', background: 'rgba(94,234,212,0.7)', borderRadius: '2px' }} />
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════ TRUST BAR ══════════ */}
      <section style={{ background: '#ffffff', borderBottom: '1px solid #f1f5f9', padding: '1.25rem 1.5rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2.5rem', flexWrap: 'wrap' }}>
          {[
            { icon: '�', text: 'SSL Secured Payments' },
            { icon: '⚡', text: 'Instant Confirmation' },
            { icon: '�', text: 'AI-Powered Planning' },
            { icon: '�', text: '500+ Destinations' },
            { icon: '⭐', text: '4.9 / 5 Rating' },
          ].map((item) => (
            <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.125rem' }}>{item.icon}</span>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap' }}>{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ FEATURES ══════════ */}
      <section style={{ padding: 'clamp(4rem,8vw,7rem) 1.5rem', background: '#ffffff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 1rem', background: 'rgba(13,148,136,0.08)', border: '1px solid rgba(13,148,136,0.18)', borderRadius: '9999px', marginBottom: '1.25rem' }}>
                <FiAward size={14} color={T.teal} />
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: T.teal }}>Why TripGenie</span>
              </div>
              <h2 style={{ fontSize: 'clamp(2rem,5vw,3.25rem)', fontWeight: 800, letterSpacing: '-0.03em', color: T.dark, marginBottom: '1rem' }}>
                Everything for the{' '}
                <span style={{ background: T.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>perfect trip</span>
              </h2>
              <p style={{ fontSize: '1.0625rem', color: '#64748b', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
                Powered by AI, built for travelers who want more than just a booking platform.
              </p>
            </div>
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: <FiMapPin size={24}/>, color: T.teal,    bg: 'rgba(13,148,136,0.08)',  title: 'Explore Destinations', delay: 0,    desc: 'Discover amazing places across Bangladesh and beyond. From Cox’s Bazar to Sylhet, find your perfect getaway.' },
              { icon: <FiMessageSquare size={24}/>, color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', title: 'AI-Powered Planning',  delay: 0.08, desc: 'Get personalized travel suggestions based on your preferences, budget, and travel dates from our smart AI.' },
              { icon: <FiHeart size={24}/>, color: '#f43f5e', bg: 'rgba(244,63,94,0.08)',  title: 'Easy Booking',          delay: 0.16, desc: 'Save favorites and book instantly. Manage all your trips in one beautifully designed dashboard.' },
              { icon: <FiStar size={24}/>,  color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', title: 'Verified Reviews',       delay: 0.24, desc: 'Read honest reviews from verified travelers and make informed decisions with confidence.' },
              { icon: <FiShield size={24}/>, color: T.emerald, bg: 'rgba(5,150,105,0.08)',  title: 'Secure Payments',        delay: 0.32, desc: 'Your transactions are protected with bank-level security and end-to-end encryption.' },
              { icon: <FiZap size={24}/>,   color: T.cyan,    bg: 'rgba(6,182,212,0.08)',  title: 'Instant Confirmation',   delay: 0.4,  desc: 'Get immediate booking confirmation with e-tickets sent directly to your email.' },
            ].map((f) => (
              <FadeUp key={f.title} delay={f.delay}>
                <FeatureCard icon={f.icon} color={f.color} bg={f.bg} title={f.title} description={f.desc} />
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ HOW IT WORKS ══════ */}
      <section style={{ padding: 'clamp(4rem,8vw,7rem) 1.5rem', background: 'linear-gradient(180deg,#f0fdfa 0%,#e0f2fe 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(13,148,136,0.07) 0%,transparent 70%)' }} />
        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <div className="section-pill" style={{ marginBottom: '1.25rem' }}><FiTrendingUp size={13} /> Simple Process</div>
              <h2 className="section-title" style={{ marginBottom: '1rem' }}>Book in <span style={{ background: T.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>3 simple steps</span></h2>
              <p className="section-sub">From discovery to departure — we make it effortless.</p>
            </div>
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '2rem' }}>
            {[
              { step: '01', icon: <FiMapPin size={28}/>, color: T.teal, title: 'Search & Discover', delay: 0, desc: 'Browse hundreds of curated destinations. Filter by category, price, and location to find your ideal trip.' },
              { step: '02', icon: <FiMessageSquare size={28}/>, color: '#8b5cf6', title: 'Plan with AI', delay: 0.12, desc: 'Chat with our AI assistant to get personalized itineraries, local tips, and budget recommendations.' },
              { step: '03', icon: <FiCheck size={28}/>, color: T.emerald, title: 'Book & Go', delay: 0.24, desc: 'Complete your secure booking in seconds. Receive instant confirmation and e-tickets via email.' },
            ].map(s => (
              <FadeUp key={s.step} delay={s.delay}>
                <StepCard {...s} />
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ CATEGORIES ══════ */}
      <section style={{ padding: 'clamp(4rem,8vw,7rem) 1.5rem', background: '#ffffff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <h2 className="section-title" style={{ marginBottom: '1rem' }}>Explore by <span style={{ background: T.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Category</span></h2>
              <p className="section-sub">Find experiences that match your travel style</p>
            </div>
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(155px,1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
            {[
              { name: 'Beach',      emoji: '🏖️', color: '#0ea5e9', delay: 0 },
              { name: 'Mountain',   emoji: '🏔️', color: '#8b5cf6', delay: 0.06 },
              { name: 'Forest',     emoji: '🌲', color: T.emerald, delay: 0.12 },
              { name: 'Historical', emoji: '🏛️', color: '#f59e0b', delay: 0.18 },
              { name: 'City Tour',  emoji: '🏙️', color: T.teal,   delay: 0.24 },
              { name: 'Adventure',  emoji: '🎒', color: '#ef4444', delay: 0.30 },
            ].map(c => (
              <FadeUp key={c.name} delay={c.delay}>
                <CategoryCard {...c} />
              </FadeUp>
            ))}
          </div>
          <FadeIn>
            <div style={{ textAlign: 'center' }}>
              <Link to="/items" style={{ textDecoration: 'none' }}>
                <motion.button whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.625rem', padding: '0.9375rem 2.5rem', background: T.grad, border: 'none', borderRadius: '14px', fontSize: '1rem', fontWeight: 700, color: 'white', cursor: 'pointer', boxShadow: '0 8px 28px rgba(13,148,136,0.38)' }}>
                  View All Destinations <FiArrowRight size={18}/>
                </motion.button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════ TESTIMONIALS ══════ */}
      <section style={{ padding: 'clamp(4rem,8vw,7rem) 1.5rem', background: 'linear-gradient(180deg,#f0fdfa 0%,#e0f2fe 100%)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <div className="section-pill" style={{ marginBottom: '1.25rem' }}><FiStar size={13}/> Traveler Stories</div>
              <h2 className="section-title" style={{ marginBottom: '1rem' }}>Loved by <span style={{ background: T.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>travelers</span></h2>
              <p className="section-sub">Real stories from real adventurers</p>
            </div>
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '1.5rem' }}>
            {[
              { name: 'Rahim Ahmed',  loc: 'Dhaka',      rating: 5, delay: 0,    text: 'TripGenie made planning my Cox\u2019s Bazar trip incredibly easy. The AI suggestions were spot-on and the booking was seamless!' },
              { name: 'Priya Sharma', loc: 'Chittagong', rating: 5, delay: 0.1,  text: 'I\u2019ve used many travel apps but nothing compares to TripGenie. The personalized recommendations saved me hours of research.' },
              { name: 'Karim Hassan', loc: 'Sylhet',     rating: 5, delay: 0.2,  text: 'Booked a Sundarbans tour through TripGenie. Everything was perfect \u2014 from the itinerary to the instant confirmation.' },
            ].map(r => (
              <FadeUp key={r.name} delay={r.delay}>
                <TestimonialCard {...r} />
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ APP PROMO ══════ */}
      <section style={{ padding: 'clamp(4rem,8vw,7rem) 1.5rem', background: '#ffffff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <FadeUp>
            <div style={{ background: 'linear-gradient(135deg,#042f2e 0%,#0f4c4c 50%,#0c4a6e 100%)', borderRadius: '28px', padding: 'clamp(2.5rem,5vw,4rem)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(13,148,136,0.3) 0%,transparent 70%)', filter: 'blur(40px)' }} />
              <div style={{ position: 'relative', zIndex: 1, maxWidth: '520px' }}>
                <div className="section-pill" style={{ marginBottom: '1.25rem', background: 'rgba(13,148,136,0.2)', borderColor: 'rgba(13,148,136,0.4)', color: '#5eead4' }}><FiZap size={13}/> AI-Powered</div>
                <h2 style={{ fontSize: 'clamp(1.75rem,4vw,2.75rem)', fontWeight: 900, color: 'white', letterSpacing: '-0.04em', marginBottom: '1rem', lineHeight: 1.1 }}>
                  Plan smarter with<br/><span style={{ background: 'linear-gradient(135deg,#5eead4,#67e8f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI assistance</span>
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                  Get personalized itineraries, budget tips, and local insights — all powered by our intelligent travel AI.
                </p>
                <Link to="/ai-chat" style={{ textDecoration: 'none' }}>
                  <motion.button whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.625rem', padding: '0.9375rem 2rem', background: T.grad, border: 'none', borderRadius: '14px', fontSize: '1rem', fontWeight: 700, color: 'white', cursor: 'pointer', boxShadow: '0 8px 28px rgba(13,148,136,0.5)' }}>
                    <FiMessageSquare size={18}/> Try AI Assistant <FiArrowRight size={16}/>
                  </motion.button>
                </Link>
              </div>
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: '240px' }}>
                {[
                  { icon: <FiMapPin size={18}/>, text: 'Personalized destination picks' },
                  { icon: <FiStar size={18}/>, text: 'Budget-optimized itineraries' },
                  { icon: <FiShield size={18}/>, text: 'Local tips & hidden gems' },
                  { icon: <FiZap size={18}/>, text: 'Instant travel recommendations' },
                ].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1.125rem', background: 'rgba(255,255,255,0.07)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ color: '#5eead4', flexShrink: 0 }}>{item.icon}</div>
                    <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ══════ CTA ══════ */}
      <section style={{ padding: 'clamp(4rem,8vw,7rem) 1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#042f2e 0%,#0f4c4c 40%,#134e4a 70%,#0c4a6e 100%)' }} />
        <motion.div animate={{ scale: [1,1.3,1], opacity: [0.3,0.5,0.3] }} transition={{ duration: 9, repeat: Infinity }}
          style={{ position: 'absolute', top: '-50px', left: '-50px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(13,148,136,0.4) 0%,transparent 70%)', filter: 'blur(40px)' }} />
        <motion.div animate={{ scale: [1.2,1,1.2], opacity: [0.2,0.4,0.2] }} transition={{ duration: 11, repeat: Infinity, delay: 3 }}
          style={{ position: 'absolute', bottom: '-50px', right: '-50px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(6,182,212,0.3) 0%,transparent 70%)', filter: 'blur(50px)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)', backgroundSize: '64px 64px' }} />
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <FadeUp>
            <div className="section-pill" style={{ marginBottom: '1.5rem', background: 'rgba(13,148,136,0.2)', borderColor: 'rgba(13,148,136,0.4)', color: '#5eead4' }}><FiZap size={13}/> Start for free today</div>
            <h2 style={{ fontSize: 'clamp(2rem,6vw,3.75rem)', fontWeight: 900, letterSpacing: '-0.04em', color: 'white', marginBottom: '1.25rem', lineHeight: 1.1 }}>
              Ready to start your<br/><span style={{ background: 'linear-gradient(135deg,#5eead4,#67e8f9,#a7f3d0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>next adventure?</span>
            </h2>
            <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.6)', marginBottom: '2.5rem', lineHeight: 1.7, maxWidth: '520px', margin: '0 auto 2.5rem' }}>
              Join thousands of happy travelers who discovered their perfect adventures with {APP_NAME}.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <motion.button whileHover={{ scale: 1.04, y: -3 }} whileTap={{ scale: 0.97 }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.625rem', padding: '1rem 2.5rem', background: T.grad, border: 'none', borderRadius: '14px', fontSize: '1.0625rem', fontWeight: 700, color: 'white', cursor: 'pointer', boxShadow: '0 8px 32px rgba(13,148,136,0.55)' }}>
                  Get Started Free <FiArrowRight size={18}/>
                </motion.button>
              </Link>
              <Link to="/items" style={{ textDecoration: 'none' }}>
                <motion.button whileHover={{ scale: 1.04, y: -3 }} whileTap={{ scale: 0.97 }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.625rem', padding: '1rem 2.5rem', background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.2)', borderRadius: '14px', fontSize: '1.0625rem', fontWeight: 600, color: 'white', cursor: 'pointer', backdropFilter: 'blur(10px)' }}>
                  <FiMapPin size={18}/> Browse Destinations
                </motion.button>
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

    </div>
  );
}

/* ── Sub-components ── */
function FeatureCard({ icon, color, bg, title, description }: { icon: React.ReactNode; color: string; bg: string; title: string; description: string }) {
  return (
    <motion.div whileHover={{ y: -6, boxShadow: `0 20px 48px ${color}18` }} transition={{ duration: 0.3, ease: [0.16,1,0.3,1] }}
      style={{ padding: '2rem', background: 'white', borderRadius: '20px', border: '1px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', height: '100%' }}>
      <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', color }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.625rem', letterSpacing: '-0.02em' }}>{title}</h3>
      <p style={{ fontSize: '0.9375rem', color: '#64748b', lineHeight: 1.7, margin: 0 }}>{description}</p>
    </motion.div>
  );
}

function StepCard({ step, icon, color, title, description }: { step: string; icon: React.ReactNode; color: string; title: string; description: string }) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.3 }}
      style={{ padding: '2.5rem 2rem', background: 'white', borderRadius: '20px', border: '1px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', textAlign: 'center', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '-1px', left: '50%', transform: 'translateX(-50%)', padding: '0.2rem 0.875rem', background: color, borderRadius: '0 0 10px 10px', fontSize: '0.6875rem', fontWeight: 800, color: 'white', letterSpacing: '0.05em' }}>
        STEP {step}
      </div>
      <div style={{ width: '68px', height: '68px', borderRadius: '50%', background: `${color}12`, border: `2px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '1.5rem auto 1.5rem', color }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '1.1875rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>{title}</h3>
      <p style={{ fontSize: '0.9375rem', color: '#64748b', lineHeight: 1.7, margin: 0 }}>{description}</p>
    </motion.div>
  );
}

function CategoryCard({ name, emoji, color }: { name: string; emoji: string; color: string }) {
  return (
    <Link to={`/items?category=${encodeURIComponent(name.toLowerCase())}`} style={{ textDecoration: 'none' }}>
      <motion.div whileHover={{ y: -8, boxShadow: `0 16px 40px ${color}25` }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.3, ease: [0.16,1,0.3,1] }}
        style={{ padding: '1.75rem 1rem', background: 'white', borderRadius: '20px', border: `1.5px solid ${color}20`, textAlign: 'center', cursor: 'pointer', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', lineHeight: 1 }}>{emoji}</div>
        <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.01em' }}>{name}</span>
      </motion.div>
    </Link>
  );
}

function TestimonialCard({ name, loc, rating, text }: { name: string; loc: string; rating: number; text: string }) {
  return (
    <motion.div whileHover={{ y: -4, boxShadow: '0 20px 48px rgba(13,148,136,0.1)' }} transition={{ duration: 0.3 }}
      style={{ padding: '2rem', background: 'white', borderRadius: '20px', border: '1px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
        {Array.from({ length: rating }).map((_, i) => (
          <FiStar key={i} size={15} color="#f59e0b" fill="#f59e0b" />
        ))}
      </div>
      <p style={{ fontSize: '0.9375rem', color: '#334155', lineHeight: 1.75, marginBottom: '1.5rem', fontStyle: 'italic' }}>"{text}"</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg,#0d9488,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1rem', flexShrink: 0 }}>
          {name.charAt(0)}
        </div>
        <div>
          <p style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9375rem', margin: 0 }}>{name}</p>
          <p style={{ fontSize: '0.8125rem', color: '#94a3b8', margin: 0 }}>{loc}</p>
        </div>
      </div>
    </motion.div>
  );
}
