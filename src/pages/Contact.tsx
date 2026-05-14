import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiCheck } from 'react-icons/fi';

const T = { grad: 'linear-gradient(135deg, #0d9488, #06b6d4)', teal: '#0d9488', cyan: '#06b6d4' };

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
  };

  const contacts = [
    { icon: <FiMail size={22}/>, title: 'Email Us', value: 'support@tripgenie.com', sub: 'Reply within 24 hours', href: 'mailto:support@tripgenie.com', color: T.teal },
    { icon: <FiPhone size={22}/>, title: 'Call Us', value: '+880 1234 567 890', sub: 'Mon–Fri, 9AM–6PM BDT', href: 'tel:+8801234567890', color: '#8b5cf6' },
    { icon: <FiMapPin size={22}/>, title: 'Visit Us', value: 'House #123, Road #45', sub: 'Dhaka 1212, Bangladesh', color: '#f59e0b' },
    { icon: <FiClock size={22}/>, title: 'Business Hours', value: 'Sun – Fri', sub: '9:00 AM – 6:00 PM BDT', color: '#ef4444' },
  ];

  return (
    <div style={{ background: '#f8fafc', minHeight: 'calc(100vh - 68px)' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #042f2e 0%, #0f4c4c 50%, #0c4a6e 100%)', padding: 'clamp(3rem,6vw,5rem) 1.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-60px', left: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(13,148,136,0.3) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '-40px', right: '-40px', width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.25) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 1rem', background: 'rgba(13,148,136,0.2)', border: '1px solid rgba(13,148,136,0.4)', borderRadius: '9999px', marginBottom: '1.25rem' }}>
            <FiMail size={13} color="#5eead4" />
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#5eead4' }}>Get in Touch</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 900, color: 'white', letterSpacing: '-0.04em', marginBottom: '1rem' }}>
            We'd love to <span style={{ background: 'linear-gradient(135deg, #5eead4, #67e8f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>hear from you</span>
          </h1>
          <p style={{ fontSize: '1.0625rem', color: 'rgba(255,255,255,0.65)', maxWidth: '500px', margin: '0 auto' }}>
            Have a question, feedback, or partnership inquiry? Our team is ready to help.
          </p>
        </motion.div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(3rem,6vw,5rem) 1.5rem' }}>
        {/* Contact cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '4rem' }}>
          {contacts.map((c, i) => (
            <FadeUp key={c.title} delay={i * 0.08}>
              <motion.div whileHover={{ y: -6, boxShadow: `0 16px 40px ${c.color}20` }} transition={{ duration: 0.3 }}>
                {c.href ? (
                  <a href={c.href} style={{ textDecoration: 'none', display: 'block' }}>
                    <ContactCard {...c} />
                  </a>
                ) : <ContactCard {...c} />}
              </motion.div>
            </FadeUp>
          ))}
        </div>

        {/* Form */}
        <FadeUp delay={0.2}>
          <div style={{ maxWidth: '720px', margin: '0 auto' }}>
            <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
              <div style={{ height: '4px', background: T.grad }} />
              <div style={{ padding: 'clamp(1.5rem,4vw,2.5rem)' }}>
                {sent ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                    <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #0d9488, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 8px 24px rgba(13,148,136,0.35)' }}>
                      <FiCheck size={32} color="white" />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>Message Sent!</h3>
                    <p style={{ color: '#64748b', fontSize: '1rem' }}>We'll get back to you within 24 hours.</p>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setSent(false)}
                      style={{ marginTop: '1.5rem', padding: '0.75rem 2rem', background: T.grad, border: 'none', borderRadius: '12px', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.9375rem' }}>
                      Send Another
                    </motion.button>
                  </motion.div>
                ) : (
                  <>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Send us a message</h2>
                    <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '0.9375rem' }}>Fill out the form and we'll respond promptly.</p>
                    <form onSubmit={handleSubmit}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                        {[
                          { label: 'Full Name', id: 'name', placeholder: 'John Doe', type: 'text' },
                          { label: 'Email Address', id: 'email', placeholder: 'john@example.com', type: 'email' },
                        ].map(f => (
                          <div key={f.id}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>{f.label} *</label>
                            <input type={f.type} required placeholder={f.placeholder}
                              value={(form as any)[f.id]} onChange={e => setForm(p => ({ ...p, [f.id]: e.target.value }))}
                              style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '0.9375rem', outline: 'none', background: '#f8fafc', fontFamily: 'inherit', transition: 'all 0.2s' }}
                              onFocus={e => { e.currentTarget.style.borderColor = T.teal; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(13,148,136,0.1)'; e.currentTarget.style.background = '#fff'; }}
                              onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = '#f8fafc'; }}
                            />
                          </div>
                        ))}
                      </div>
                      <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Subject *</label>
                        <select required value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                          style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '0.9375rem', outline: 'none', background: '#f8fafc', fontFamily: 'inherit', transition: 'all 0.2s', cursor: 'pointer' }}
                          onFocus={e => { e.currentTarget.style.borderColor = T.teal; e.currentTarget.style.background = '#fff'; }}
                          onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; }}>
                          <option value="">Select a subject</option>
                          <option value="booking">Booking Inquiry</option>
                          <option value="support">Technical Support</option>
                          <option value="feedback">Feedback</option>
                          <option value="partnership">Partnership</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div style={{ marginBottom: '1.75rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Message *</label>
                        <textarea required rows={5} placeholder="How can we help you?" value={form.message}
                          onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                          style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '0.9375rem', outline: 'none', background: '#f8fafc', fontFamily: 'inherit', resize: 'vertical', transition: 'all 0.2s' }}
                          onFocus={e => { e.currentTarget.style.borderColor = T.teal; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(13,148,136,0.1)'; e.currentTarget.style.background = '#fff'; }}
                          onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = '#f8fafc'; }}
                        />
                      </div>
                      <motion.button type="submit" disabled={loading}
                        whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
                        style={{ width: '100%', padding: '0.9375rem', background: loading ? '#94a3b8' : T.grad, border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, color: 'white', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: loading ? 'none' : '0 6px 20px rgba(13,148,136,0.4)', transition: 'all 0.2s' }}>
                        {loading ? (
                          <><div className="animate-spin" style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%' }} /> Sending...</>
                        ) : (
                          <><FiSend size={18}/> Send Message</>
                        )}
                      </motion.button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}

function ContactCard({ icon, title, value, sub, color }: { icon: React.ReactNode; title: string; value: string; sub: string; color: string }) {
  return (
    <div style={{ background: 'white', borderRadius: '20px', padding: '1.75rem', border: '1px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', textAlign: 'center', height: '100%' }}>
      <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', color }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ fontSize: '0.9375rem', color, fontWeight: 600, marginBottom: '0.25rem' }}>{value}</p>
      <p style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>{sub}</p>
    </div>
  );
}
