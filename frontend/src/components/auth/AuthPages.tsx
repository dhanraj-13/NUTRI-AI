import { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, Zap, Droplets, BarChart3 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { api } from '../../lib/api';
import { storage } from '../../lib/storage';
import type { AuthResponse, User } from '../../types';
import { BrandLogo } from '../shared/BrandLogo';

const floatingStats = [
  { label: 'Nutrition Score', value: '92', color: '#18B89A' },
  { label: 'Hydration', value: '2.1L', color: '#7AB8E8' },
  { label: 'Focus', value: '84%', color: '#8FD081' },
  { label: 'Protein', value: '142g', color: '#EBD5A5' },
];

function AuthPanel({ onBack }: { onBack: () => void }) {
  return (
    <div
      className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, rgba(24,184,154,0.08) 0%, rgba(6,10,8,0.95) 60%)',
        borderRight: '1px solid rgba(24,184,154,0.1)',
      }}
    >
      {/* Orbs */}
      <div style={{
        position: 'absolute', width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(24,184,154,0.12) 0%, transparent 70%)',
        top: '-100px', left: '-100px', borderRadius: '50%', pointerEvents: 'none',
        animation: 'drift 20s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', width: 300, height: 300,
        background: 'radial-gradient(circle, rgba(143,208,129,0.08) 0%, transparent 70%)',
        bottom: '0px', right: '-50px', borderRadius: '50%', pointerEvents: 'none',
        animation: 'drift 25s ease-in-out infinite reverse',
      }} />

      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm transition-colors self-start"
        style={{ color: '#9AB8A8', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <ArrowLeft size={16} />
        Back to home
      </button>

      <div>
        <div className="mb-8">
          <BrandLogo size="md" showTagline />
        </div>

        <blockquote className="font-display text-3xl font-semibold leading-tight mb-6" style={{ color: '#E8F2ED' }}>
          "What you eat shapes{' '}
          <span className="text-gradient">who you become.</span>"
        </blockquote>
        <p className="text-sm" style={{ color: '#9AB8A8' }}>
          Join thousands using AI-powered nutrition intelligence to optimize their daily performance.
        </p>

        <div className="grid grid-cols-2 gap-3 mt-8">
          {floatingStats.map((s, i) => (
            <div
              key={s.label}
              className="glass rounded-xl p-4 animate-float"
              style={{
                border: `1px solid ${s.color}20`,
                animationDelay: `${i * 0.4}s`,
                animationDuration: `${5 + i}s`,
              }}
            >
              <div className="text-xs mb-1" style={{ color: '#9AB8A8' }}>{s.label}</div>
              <div className="font-display font-bold text-xl" style={{ color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-6">
        {[
          { icon: Zap, label: 'Energy Tracking' },
          { icon: Droplets, label: 'Hydration AI' },
          { icon: BarChart3, label: 'Live Analytics' },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2 text-xs" style={{ color: '#5A7A68' }}>
            <Icon size={13} style={{ color: '#18B89A' }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

export function LoginPage() {
  const { navigate, login, toast } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Invalid email';
    if (!password) e.password = 'Password is required';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    const res = await api.post<AuthResponse>('/api/v1/auth/login', { email, password });
    setLoading(false);
    if (res.error || !res.data) {
      toast('error', 'Login failed', res.error || 'Invalid credentials');
      return;
    }
    storage.setToken(res.data.access_token);
    const profileRes = await api.get<User>('/api/v1/auth/profile');
    const user: User = profileRes.data || { id: 0, name: email.split('@')[0], email };
    login(user, res.data.access_token);
    toast('success', 'Welcome back!', `Good to see you, ${user.name}`);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2" style={{ background: '#060A08' }}>
      <AuthPanel onBack={() => navigate('landing')} />
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="mb-6 lg:hidden">
              <BrandLogo size="sm" />
            </div>
            <h2 className="font-display font-bold text-3xl mb-2" style={{ color: '#E8F2ED' }}>
              Welcome back
            </h2>
            <p className="text-sm" style={{ color: '#9AB8A8' }}>Sign in to your nutrition intelligence hub</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#9AB8A8' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-glass"
                style={errors.email ? { borderColor: 'rgba(224,112,112,0.5)' } : {}}
              />
              {errors.email && <p className="text-xs mt-1" style={{ color: '#E07070' }}>{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#9AB8A8' }}>Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-glass"
                  style={{ paddingRight: 44, ...(errors.password ? { borderColor: 'rgba(224,112,112,0.5)' } : {}) }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#5A7A68', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs mt-1" style={{ color: '#E07070' }}>{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center"
              style={{ marginTop: 8, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="flex gap-1"><span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" /></span>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: '#9AB8A8' }}>
            Don't have an account?{' '}
            <button onClick={() => navigate('register')}
              className="font-semibold hover:underline"
              style={{ color: '#18B89A', background: 'none', border: 'none', cursor: 'pointer' }}>
              Create account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export function RegisterPage() {
  const { navigate, login, toast } = useApp();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm_password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const pwStrength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Min 8 characters';
    if (form.password !== form.confirm_password) e.confirm_password = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    const res = await api.post<AuthResponse>('/api/v1/auth/register', form);
    setLoading(false);
    if (res.error || !res.data) {
      toast('error', 'Registration failed', res.error || 'Please try again');
      return;
    }
    const user: User = { id: 0, name: form.name, email: form.email };
    login(user, res.data.access_token);
    toast('success', 'Account created!', 'Welcome to NUTRI AI');
  };

  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['', '#E07070', '#EBD5A5', '#8FD081', '#18B89A'];

  return (
    <div className="min-h-screen grid lg:grid-cols-2" style={{ background: '#060A08' }}>
      <AuthPanel onBack={() => navigate('landing')} />
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="mb-6 lg:hidden">
              <BrandLogo size="sm" />
            </div>
            <h2 className="font-display font-bold text-3xl mb-2" style={{ color: '#E8F2ED' }}>
              Create your account
            </h2>
            <p className="text-sm" style={{ color: '#9AB8A8' }}>Start your AI nutrition intelligence journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#9AB8A8' }}>Full Name</label>
              <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Alex Johnson" className="input-glass"
                style={errors.name ? { borderColor: 'rgba(224,112,112,0.5)' } : {}} />
              {errors.name && <p className="text-xs mt-1" style={{ color: '#E07070' }}>{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#9AB8A8' }}>Email</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com" className="input-glass"
                style={errors.email ? { borderColor: 'rgba(224,112,112,0.5)' } : {}} />
              {errors.email && <p className="text-xs mt-1" style={{ color: '#E07070' }}>{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#9AB8A8' }}>Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Min 8 characters" className="input-glass"
                  style={{ paddingRight: 44, ...(errors.password ? { borderColor: 'rgba(224,112,112,0.5)' } : {}) }} />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#5A7A68', background: 'none', border: 'none', cursor: 'pointer' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.password && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{ background: i <= pwStrength ? strengthColors[pwStrength] : 'rgba(255,255,255,0.06)' }} />
                    ))}
                  </div>
                  <span className="text-xs" style={{ color: strengthColors[pwStrength] }}>{strengthLabels[pwStrength]}</span>
                </div>
              )}
              {errors.password && <p className="text-xs mt-1" style={{ color: '#E07070' }}>{errors.password}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#9AB8A8' }}>Confirm Password</label>
              <input type="password" value={form.confirm_password}
                onChange={e => setForm(f => ({ ...f, confirm_password: e.target.value }))}
                placeholder="Repeat password" className="input-glass"
                style={errors.confirm_password ? { borderColor: 'rgba(224,112,112,0.5)' } : {}} />
              {errors.confirm_password && <p className="text-xs mt-1" style={{ color: '#E07070' }}>{errors.confirm_password}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center" style={{ marginTop: 8, opacity: loading ? 0.7 : 1 }}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="flex gap-1"><span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" /></span>
                  Creating account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: '#9AB8A8' }}>
            Already have an account?{' '}
            <button onClick={() => navigate('login')}
              className="font-semibold hover:underline"
              style={{ color: '#18B89A', background: 'none', border: 'none', cursor: 'pointer' }}>
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
