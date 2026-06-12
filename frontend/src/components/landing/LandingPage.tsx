import { useState } from 'react';
import {
  Brain, Droplets, Zap, BarChart3, MessageSquare, Wifi,
  ChevronDown, Star, ArrowRight, CheckCircle, Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from '../shared/BrandLogo';

const features = [
  {
    icon: Brain,
    title: 'AI Nutrition Intelligence',
    desc: 'RAG-powered food recommendations personalized to your goals, metabolism, and dietary preferences.',
    color: '#18B89A',
  },
  {
    icon: Droplets,
    title: 'Hydration Intelligence',
    desc: 'Smart water tracking with pattern analytics, streak monitoring, and personalized hydration goals.',
    color: '#7AB8E8',
  },
  {
    icon: Zap,
    title: 'Productivity Nutrition',
    desc: 'Discover the food-focus-energy correlation unique to your body and optimize your performance.',
    color: '#8FD081',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    desc: 'Live charts, trend analysis, macro breakdown, and AI-generated weekly wellness reports.',
    color: '#EBD5A5',
  },
  {
    icon: MessageSquare,
    title: 'AI Chat Coach',
    desc: 'Streaming conversational AI with RAG retrieval answers your nutrition questions in real-time.',
    color: '#18B89A',
  },
  {
    icon: Wifi,
    title: 'Live Data Streams',
    desc: 'WebSocket-powered real-time updates keep your dashboard always current, zero refresh needed.',
    color: '#8FD081',
  },
];

const steps = [
  {
    num: '01',
    title: 'Log Your Nutrition',
    desc: 'Search from 146+ foods, log by meal type, and track macros with one tap.',
    icon: Brain,
  },
  {
    num: '02',
    title: 'Track & Hydrate',
    desc: 'Monitor water intake, log energy levels, mood, and sleep quality daily.',
    icon: Droplets,
  },
  {
    num: '03',
    title: 'Get AI Insights',
    desc: 'Receive streaming AI recommendations personalized to your nutrition patterns.',
    icon: Sparkles,
  },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Product Manager, TechCorp',
    text: 'NUTRI AI completely changed how I understand my energy throughout the day. The correlation between my lunch choices and afternoon productivity was eye-opening. I\'ve never felt more in control of my work performance.',
    rating: 5,
    avatar: 'SC',
    color: '#18B89A',
  },
  {
    name: 'Marcus Webb',
    role: 'Entrepreneur & Founder',
    text: 'The AI meal suggestions are genuinely smart — not generic. It knows I\'m on a keto diet and suggests foods that actually fit my macros. The streaming chat is instant. Best wellness investment I\'ve made.',
    rating: 5,
    avatar: 'MW',
    color: '#8FD081',
  },
  {
    name: 'Dr. Priya Nair',
    role: 'Clinical Nutritionist',
    text: 'The RAG-powered nutrition database impresses me professionally. The hydration correlation with energy levels is backed by real science. I recommend this to all my clients seeking data-driven wellness.',
    rating: 5,
    avatar: 'PN',
    color: '#EBD5A5',
  },
];

const faqs = [
  { q: 'How accurate is the AI nutrition analysis?', a: 'Our RAG pipeline retrieves from a curated nutrition dataset of 146+ scientifically verified foods. The AI contextualizes recommendations based on your personal goals, diet type, and logged patterns.' },
  { q: 'Is my health data private and secure?', a: 'All data is processed on your local backend instance. Your nutrition logs, health data, and AI conversations stay on your own server — never on third-party clouds.' },
  { q: 'How large is the food database?', a: 'We currently index 146+ foods with full macro/micronutrient breakdowns, hydration scores, satiety scores, health benefits, and meal-type classifications.' },
  { q: 'How does hydration tracking work?', a: 'Log water intake in ml (quick buttons: 250ml, 330ml, 500ml or custom). The system tracks daily progress, calculates a hydration score, monitors streaks, and shows 7-day trend analytics.' },
  { q: 'Does the AI chat work without an OpenAI key?', a: 'Yes. The AI uses a local RAG fallback pipeline with FAISS vector retrieval. With an OpenAI key, you get GPT-powered responses. Both modes support real-time streaming.' },
  { q: 'What real-time features are available?', a: 'WebSocket channels provide live nutrition log updates, hydration tracking, analytics refreshes, and AI streaming — all without page reload.' },
];

export function LandingPage() {
  const { navigate } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ background: '#060A08', minHeight: '100vh', overflow: 'hidden' }}>

      {/* ===== NAV ===== */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4"
        style={{ background: 'rgba(6,10,8,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(24,184,154,0.08)' }}
      >
        <BrandLogo size="sm" />
        <div className="hidden md:flex items-center gap-8">
          {['Features', 'How It Works', 'Testimonials', 'FAQ'].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`}
              className="text-sm transition-colors hover:text-primary"
              style={{ color: '#9AB8A8', textDecoration: 'none' }}>
              {item}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('login')} className="btn-ghost text-sm" style={{ padding: '8px 16px' }}>
            Sign In
          </button>
          <button onClick={() => navigate('register')} className="btn-primary text-sm" style={{ padding: '8px 16px' }}>
            Get Started
          </button>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20">
        {/* Orbs */}
        <div className="orb" style={{
          width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(24,184,154,0.12) 0%, transparent 70%)',
          top: '5%', left: '50%', transform: 'translateX(-50%)',
          animation: 'drift 25s ease-in-out infinite',
        }} />
        <div className="orb" style={{
          width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(143,208,129,0.08) 0%, transparent 70%)',
          top: '20%', right: '-100px',
          animation: 'drift 30s ease-in-out infinite reverse',
        }} />
        <div className="orb" style={{
          width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(235,213,165,0.06) 0%, transparent 70%)',
          bottom: '10%', left: '-50px',
          animation: 'drift 20s ease-in-out infinite',
        }} />

        {/* Announcement pill */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 animate-fade-up animate-border-glow"
          style={{
            background: 'rgba(24,184,154,0.06)',
            border: '1px solid rgba(24,184,154,0.2)',
            fontSize: 13, color: '#18B89A',
          }}
        >
          <Sparkles size={13} />
          <span>Now with RAG-Powered Nutrition Intelligence</span>
        </div>

        {/* Headline */}
        <h1
          className="font-display font-bold mb-6 animate-fade-up delay-100"
          style={{
            fontSize: 'clamp(40px, 7vw, 80px)',
            lineHeight: 1.1,
            color: '#E8F2ED',
            maxWidth: 900,
          }}
        >
          Your Body's Intelligence,{' '}
          <span className="text-gradient">Amplified.</span>
        </h1>

        {/* Subheadline */}
        <p
          className="text-lg md:text-xl mb-10 animate-fade-up delay-200"
          style={{ color: '#9AB8A8', maxWidth: 600, lineHeight: 1.7 }}
        >
          The only AI platform that connects what you eat to how you think,
          focus, and perform — in real time.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-fade-up delay-300">
          <button onClick={() => navigate('register')} className="btn-primary text-base" style={{ padding: '14px 32px', fontSize: 16 }}>
            Start Free <ArrowRight size={18} />
          </button>
          <button onClick={() => {
            document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
          }} className="btn-ghost text-base" style={{ padding: '14px 32px', fontSize: 16 }}>
            See How It Works
          </button>
        </div>

        {/* Floating hero cards */}
        <div className="relative w-full max-w-4xl animate-fade-up delay-400">
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { label: 'Nutrition Score', value: '92', unit: 'today', color: '#18B89A' },
              { label: 'Hydration', value: '2.1L', unit: 'logged', color: '#7AB8E8' },
              { label: 'Focus Score', value: '84', unit: 'excellent', color: '#8FD081' },
              { label: 'Protein', value: '142g', unit: '↑ on track', color: '#EBD5A5' },
            ].map((card, i) => (
              <div
                key={card.label}
                className="glass rounded-2xl px-6 py-4 animate-float"
                style={{
                  animationDelay: `${i * 0.5}s`,
                  border: `1px solid ${card.color}22`,
                  boxShadow: `0 0 20px ${card.color}15`,
                  minWidth: 140,
                }}
              >
                <div className="text-xs mb-1" style={{ color: '#9AB8A8' }}>{card.label}</div>
                <div className="font-display font-bold text-2xl" style={{ color: card.color }}>
                  {card.value}
                </div>
                <div className="text-xs mt-1" style={{ color: '#5A7A68' }}>{card.unit}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SOCIAL PROOF BAR ===== */}
      <section className="py-12 px-6" style={{ borderTop: '1px solid rgba(24,184,154,0.06)', borderBottom: '1px solid rgba(24,184,154,0.06)' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-sm mb-8" style={{ color: '#5A7A68' }}>
            TRUSTED BY WELLNESS-FOCUSED PROFESSIONALS
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: '146+', label: 'Foods in AI Database' },
              { num: 'Real-Time', label: 'Nutrition Intelligence' },
              { num: '4 Channels', label: 'Live Data Streams' },
              { num: 'RAG-Powered', label: 'AI Recommendations' },
            ].map(s => (
              <div key={s.label}>
                <div className="font-display font-bold text-2xl md:text-3xl mb-1 text-gradient">{s.num}</div>
                <div className="text-xs" style={{ color: '#9AB8A8' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-4" style={{ color: '#E8F2ED' }}>
              Everything You Need,{' '}
              <span className="text-gradient">Nothing You Don't</span>
            </h2>
            <p className="text-lg" style={{ color: '#9AB8A8' }}>
              Six intelligent systems working in harmony.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="glass glass-hover rounded-2xl p-6 card-hover"
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    border: '1px solid rgba(24,184,154,0.1)',
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${f.color}15`, border: `1px solid ${f.color}25` }}
                  >
                    <Icon size={22} style={{ color: f.color }} />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2" style={{ color: '#E8F2ED' }}>
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#9AB8A8' }}>
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="py-24 px-6" style={{ background: 'rgba(24,184,154,0.02)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-4" style={{ color: '#E8F2ED' }}>
              How It Works
            </h2>
            <p className="text-lg" style={{ color: '#9AB8A8' }}>Three steps to nutritional intelligence.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div
              className="hidden md:block absolute top-10 left-1/3 right-1/3 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(24,184,154,0.3), transparent)' }}
            />
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.num} className="text-center">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 animate-glow"
                      style={{
                        background: 'rgba(24,184,154,0.08)',
                        border: '1px solid rgba(24,184,154,0.2)',
                        animationDelay: `${i * 1.3}s`,
                      }}
                    >
                      <Icon size={28} style={{ color: '#18B89A' }} />
                    </div>
                    <div className="font-mono text-xs mb-2" style={{ color: '#18B89A' }}>{step.num}</div>
                    <h3 className="font-display font-semibold text-xl mb-3" style={{ color: '#E8F2ED' }}>
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#9AB8A8' }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section id="testimonials" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-4" style={{ color: '#E8F2ED' }}>
              What People Are Saying
            </h2>
            <p className="text-lg" style={{ color: '#9AB8A8' }}>Real results from real wellness journeys.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="glass glass-hover rounded-2xl p-6 flex flex-col"
                style={{ border: '1px solid rgba(24,184,154,0.1)' }}
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} style={{ color: '#EBD5A5', fill: '#EBD5A5' }} />
                  ))}
                </div>
                <p className="text-sm leading-relaxed flex-1 mb-6" style={{ color: '#9AB8A8' }}>
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-semibold text-sm"
                    style={{ background: `${t.color}20`, color: t.color, border: `1px solid ${t.color}30` }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: '#E8F2ED' }}>{t.name}</div>
                    <div className="text-xs" style={{ color: '#5A7A68' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="py-24 px-6" style={{ background: 'rgba(24,184,154,0.02)' }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-4" style={{ color: '#E8F2ED' }}>
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="glass rounded-2xl overflow-hidden"
                style={{ border: '1px solid rgba(24,184,154,0.1)' }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left transition-colors"
                  style={{ color: '#E8F2ED' }}
                >
                  <span className="font-medium text-sm">{faq.q}</span>
                  <ChevronDown
                    size={18}
                    style={{
                      color: '#18B89A',
                      transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 200ms',
                      flexShrink: 0,
                    }}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 animate-slide-down">
                    <p className="text-sm leading-relaxed" style={{ color: '#9AB8A8' }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-3xl p-12 text-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(24,184,154,0.12), rgba(143,208,129,0.06))',
              border: '1px solid rgba(24,184,154,0.2)',
            }}
          >
            <div className="orb" style={{
              width: 400, height: 400,
              background: 'radial-gradient(circle, rgba(24,184,154,0.1) 0%, transparent 70%)',
              top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            }} />
            <h2 className="font-display font-bold text-3xl md:text-5xl mb-4 relative" style={{ color: '#E8F2ED' }}>
              Start Your Nutrition{' '}
              <span className="text-gradient">Intelligence Journey</span>
            </h2>
            <p className="text-lg mb-8 relative" style={{ color: '#9AB8A8' }}>
              Join the AI wellness revolution. Your body's data, finally making sense.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center relative">
              <button onClick={() => navigate('register')} className="btn-primary text-base" style={{ padding: '14px 32px' }}>
                Create Free Account <ArrowRight size={18} />
              </button>
              <button onClick={() => navigate('login')} className="btn-ghost text-base" style={{ padding: '14px 32px' }}>
                Sign In
              </button>
            </div>
            <div className="flex items-center justify-center gap-6 mt-8 relative">
              {['Free to start', 'Local & private', 'AI-powered'].map(item => (
                <div key={item} className="flex items-center gap-2 text-sm" style={{ color: '#9AB8A8' }}>
                  <CheckCircle size={14} style={{ color: '#8FD081' }} />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-12 px-6" style={{ borderTop: '1px solid rgba(24,184,154,0.08)' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#18B89A,#0E9B81)' }}>
              <img src="/nutri-ai-logo.png" alt="NUTRI AI logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-display font-semibold" style={{ color: '#E8F2ED' }}>NUTRI AI</span>
          </div>
          <p className="text-xs" style={{ color: '#5A7A68' }}>
            © 2026 NUTRI AI — Powered by RAG Intelligence
          </p>
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
            style={{ background: 'rgba(24,184,154,0.08)', border: '1px solid rgba(24,184,154,0.15)', color: '#18B89A' }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-dot" />
            RAG-Powered AI
          </div>
        </div>
      </footer>
    </div>
  );
}
