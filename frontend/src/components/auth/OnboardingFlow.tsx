import { useState } from 'react';
import { Brain, Target, Activity, Leaf, Droplets, Zap, ChevronRight, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { api } from '../../lib/api';
import { storage } from '../../lib/storage';
import type { OnboardingPayload } from '../../types';
import { BrandLogo } from '../shared/BrandLogo';

const GOALS = [
  { id: 'weight_management', label: 'Weight Management', icon: '🎯', desc: 'Optimize calorie balance' },
  { id: 'energy_focus', label: 'Boost Energy & Focus', icon: '⚡', desc: 'Food-performance correlation' },
  { id: 'nutrition', label: 'Optimize Nutrition', icon: '🥗', desc: 'Balanced macro goals' },
  { id: 'hydration', label: 'Improve Hydration', icon: '💧', desc: 'Smart water tracking' },
  { id: 'wellness', label: 'General Wellness', icon: '🌿', desc: 'Holistic health approach' },
];

const ACTIVITY_LEVELS = [
  { id: 'sedentary', label: 'Sedentary', desc: 'Desk work, minimal movement' },
  { id: 'light', label: 'Lightly Active', desc: 'Light exercise 1-3x/week' },
  { id: 'moderate', label: 'Moderately Active', desc: 'Exercise 3-5x/week' },
  { id: 'active', label: 'Very Active', desc: 'Intense exercise 6-7x/week' },
  { id: 'athlete', label: 'Athlete', desc: 'Professional training level' },
];

const DIETS = ['No Restriction', 'Vegetarian', 'Vegan', 'Keto', 'Paleo', 'Mediterranean'];
const ALLERGIES = ['Nuts', 'Gluten', 'Dairy', 'Soy', 'Shellfish', 'Eggs'];
const PRODUCTIVITY_GOALS = [
  { id: 'deep_focus', label: 'Deep Focus Work', icon: '🧠' },
  { id: 'creative', label: 'Creative Work', icon: '🎨' },
  { id: 'physical', label: 'Physical Performance', icon: '💪' },
  { id: 'mixed', label: 'Mixed Goals', icon: '⚖️' },
];

export function OnboardingFlow() {
  const { navigate, state, toast } = useApp();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    goal: string;
    activity_level: string;
    diet_preference: string;
    allergies: string[];
    hydration_goal: number;
    productivity_goal: string;
    height_cm: string;
    weight_kg: string;
    age: string;
    gender: string;
  }>({
    goal: '',
    activity_level: '',
    diet_preference: 'No Restriction',
    allergies: [],
    hydration_goal: 2500,
    productivity_goal: '',
    height_cm: '',
    weight_kg: '',
    age: '',
    gender: '',
  });

  const totalSteps = 5;
  const progress = ((step + 1) / totalSteps) * 100;

  const toggleAllergy = (a: string) => {
    setData(d => ({
      ...d,
      allergies: d.allergies.includes(a) ? d.allergies.filter(x => x !== a) : [...d.allergies, a],
    }));
  };

  const handleFinish = async () => {
    setLoading(true);
    const payload: OnboardingPayload = {
      goal: data.goal || 'wellness',
      activity_level: data.activity_level || 'moderate',
      diet_preference: data.diet_preference,
      hydration_goal: data.hydration_goal,
      allergies: data.allergies,
      productivity_goal: data.productivity_goal || 'mixed',
    };
    await api.post('/api/v1/onboarding', payload);
    if (data.height_cm || data.weight_kg || data.age) {
      await api.put('/api/v1/profile', {
        height_cm: data.height_cm ? Number(data.height_cm) : undefined,
        weight_kg: data.weight_kg ? Number(data.weight_kg) : undefined,
        age: data.age ? Number(data.age) : undefined,
        gender: data.gender || undefined,
        nutrition_goal: data.goal,
      });
    }
    storage.setOnboarded();
    setLoading(false);
    toast('success', 'Profile created!', 'Your AI nutrition profile is ready.');
    navigate('dashboard');
  };

  const canNext = (() => {
    if (step === 0) return !!data.goal;
    if (step === 1) return !!data.activity_level;
    if (step === 3) return !!data.productivity_goal;
    return true;
  })();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: '#060A08' }}>
      {/* Background orb */}
      <div style={{
        position: 'fixed', width: 600, height: 600,
        background: 'radial-gradient(circle, rgba(24,184,154,0.08) 0%, transparent 70%)',
        top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      <div className="w-full max-w-lg relative">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <BrandLogo size="md" showTagline />
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className="flex-1 h-1 rounded-full transition-all duration-500"
              style={{ background: i <= step ? '#18B89A' : 'rgba(24,184,154,0.1)' }} />
          ))}
        </div>

        {/* Card */}
        <div className="glass-2 rounded-3xl p-8" style={{ border: '1px solid rgba(24,184,154,0.15)' }}>
          <div className="page-enter" key={step}>

            {/* STEP 0 — Goal */}
            {step === 0 && (
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Target size={20} style={{ color: '#18B89A' }} />
                  <span className="text-xs font-mono uppercase tracking-widest" style={{ color: '#18B89A' }}>Step 1 of 5</span>
                </div>
                <h2 className="font-display font-bold text-2xl mb-1" style={{ color: '#E8F2ED' }}>
                  What's your primary goal?
                </h2>
                <p className="text-sm mb-6" style={{ color: '#9AB8A8' }}>This shapes your AI nutrition profile.</p>
                <div className="space-y-3">
                  {GOALS.map(g => (
                    <button
                      key={g.id}
                      onClick={() => setData(d => ({ ...d, goal: g.id }))}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-200"
                      style={{
                        background: data.goal === g.id ? 'rgba(24,184,154,0.1)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${data.goal === g.id ? 'rgba(24,184,154,0.35)' : 'rgba(255,255,255,0.06)'}`,
                      }}
                    >
                      <span className="text-2xl">{g.icon}</span>
                      <div className="flex-1">
                        <div className="text-sm font-semibold" style={{ color: '#E8F2ED' }}>{g.label}</div>
                        <div className="text-xs" style={{ color: '#9AB8A8' }}>{g.desc}</div>
                      </div>
                      {data.goal === g.id && <Check size={16} style={{ color: '#18B89A' }} />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 1 — Activity */}
            {step === 1 && (
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Activity size={20} style={{ color: '#18B89A' }} />
                  <span className="text-xs font-mono uppercase tracking-widest" style={{ color: '#18B89A' }}>Step 2 of 5</span>
                </div>
                <h2 className="font-display font-bold text-2xl mb-1" style={{ color: '#E8F2ED' }}>
                  How active are you?
                </h2>
                <p className="text-sm mb-6" style={{ color: '#9AB8A8' }}>Calibrates your calorie and nutrient goals.</p>
                <div className="space-y-3">
                  {ACTIVITY_LEVELS.map(a => (
                    <button
                      key={a.id}
                      onClick={() => setData(d => ({ ...d, activity_level: a.id }))}
                      className="w-full flex items-center justify-between p-4 rounded-2xl text-left transition-all duration-200"
                      style={{
                        background: data.activity_level === a.id ? 'rgba(24,184,154,0.1)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${data.activity_level === a.id ? 'rgba(24,184,154,0.35)' : 'rgba(255,255,255,0.06)'}`,
                      }}
                    >
                      <div>
                        <div className="text-sm font-semibold" style={{ color: '#E8F2ED' }}>{a.label}</div>
                        <div className="text-xs" style={{ color: '#9AB8A8' }}>{a.desc}</div>
                      </div>
                      {data.activity_level === a.id && <Check size={16} style={{ color: '#18B89A' }} />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2 — Diet */}
            {step === 2 && (
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Leaf size={20} style={{ color: '#18B89A' }} />
                  <span className="text-xs font-mono uppercase tracking-widest" style={{ color: '#18B89A' }}>Step 3 of 5</span>
                </div>
                <h2 className="font-display font-bold text-2xl mb-1" style={{ color: '#E8F2ED' }}>
                  Your diet preference
                </h2>
                <p className="text-sm mb-6" style={{ color: '#9AB8A8' }}>AI food suggestions will match your diet type.</p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {DIETS.map(d => (
                    <button
                      key={d}
                      onClick={() => setData(fd => ({ ...fd, diet_preference: d }))}
                      className="p-3 rounded-xl text-sm font-medium transition-all duration-200"
                      style={{
                        background: data.diet_preference === d ? 'rgba(24,184,154,0.12)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${data.diet_preference === d ? 'rgba(24,184,154,0.35)' : 'rgba(255,255,255,0.06)'}`,
                        color: data.diet_preference === d ? '#18B89A' : '#9AB8A8',
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-medium mb-3" style={{ color: '#9AB8A8' }}>Food allergies (optional)</p>
                  <div className="flex flex-wrap gap-2">
                    {ALLERGIES.map(a => (
                      <button
                        key={a}
                        onClick={() => toggleAllergy(a)}
                        className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
                        style={{
                          background: data.allergies.includes(a) ? 'rgba(224,112,112,0.15)' : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${data.allergies.includes(a) ? 'rgba(224,112,112,0.4)' : 'rgba(255,255,255,0.08)'}`,
                          color: data.allergies.includes(a) ? '#E07070' : '#9AB8A8',
                        }}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 — Productivity & Hydration */}
            {step === 3 && (
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Zap size={20} style={{ color: '#18B89A' }} />
                  <span className="text-xs font-mono uppercase tracking-widest" style={{ color: '#18B89A' }}>Step 4 of 5</span>
                </div>
                <h2 className="font-display font-bold text-2xl mb-1" style={{ color: '#E8F2ED' }}>
                  Productivity & Hydration
                </h2>
                <p className="text-sm mb-6" style={{ color: '#9AB8A8' }}>Tailor AI for your work style.</p>

                <p className="text-sm font-medium mb-3" style={{ color: '#9AB8A8' }}>Productivity goal</p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {PRODUCTIVITY_GOALS.map(pg => (
                    <button
                      key={pg.id}
                      onClick={() => setData(d => ({ ...d, productivity_goal: pg.id }))}
                      className="p-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2"
                      style={{
                        background: data.productivity_goal === pg.id ? 'rgba(24,184,154,0.12)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${data.productivity_goal === pg.id ? 'rgba(24,184,154,0.35)' : 'rgba(255,255,255,0.06)'}`,
                        color: data.productivity_goal === pg.id ? '#18B89A' : '#9AB8A8',
                      }}
                    >
                      <span>{pg.icon}</span>{pg.label}
                    </button>
                  ))}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium" style={{ color: '#9AB8A8' }}>Daily hydration goal</p>
                    <span className="font-mono text-sm font-semibold" style={{ color: '#18B89A' }}>
                      {data.hydration_goal}ml
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Droplets size={16} style={{ color: '#7AB8E8', flexShrink: 0 }} />
                    <input
                      type="range"
                      min={1000}
                      max={5000}
                      step={250}
                      value={data.hydration_goal}
                      onChange={e => setData(d => ({ ...d, hydration_goal: Number(e.target.value) }))}
                      className="flex-1"
                      style={{ accentColor: '#18B89A' }}
                    />
                  </div>
                  <div className="flex justify-between text-xs mt-1" style={{ color: '#5A7A68' }}>
                    <span>1.0L</span><span>5.0L</span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4 — Profile */}
            {step === 4 && (
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Brain size={20} style={{ color: '#18B89A' }} />
                  <span className="text-xs font-mono uppercase tracking-widest" style={{ color: '#18B89A' }}>Step 5 of 5</span>
                </div>
                <h2 className="font-display font-bold text-2xl mb-1" style={{ color: '#E8F2ED' }}>
                  Profile Setup
                </h2>
                <p className="text-sm mb-6" style={{ color: '#9AB8A8' }}>Optional — improves AI accuracy. Skip anytime.</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: '#9AB8A8' }}>Height (cm)</label>
                    <input type="number" value={data.height_cm}
                      onChange={e => setData(d => ({ ...d, height_cm: e.target.value }))}
                      placeholder="175" className="input-glass" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: '#9AB8A8' }}>Weight (kg)</label>
                    <input type="number" value={data.weight_kg}
                      onChange={e => setData(d => ({ ...d, weight_kg: e.target.value }))}
                      placeholder="70" className="input-glass" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: '#9AB8A8' }}>Age</label>
                    <input type="number" value={data.age}
                      onChange={e => setData(d => ({ ...d, age: e.target.value }))}
                      placeholder="28" className="input-glass" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: '#9AB8A8' }}>Gender</label>
                    <select value={data.gender}
                      onChange={e => setData(d => ({ ...d, gender: e.target.value }))}
                      className="input-glass" style={{ appearance: 'none' }}>
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div
                  className="mt-6 p-4 rounded-2xl"
                  style={{ background: 'rgba(24,184,154,0.06)', border: '1px solid rgba(24,184,154,0.15)' }}
                >
                  <p className="text-sm font-semibold mb-1" style={{ color: '#18B89A' }}>
                    ✨ Your AI profile is almost ready
                  </p>
                  <p className="text-xs" style={{ color: '#9AB8A8' }}>
                    NUTRI AI will personalize food suggestions, hydration goals, and productivity insights
                    based on your selections.
                  </p>
                </div>

                {state.user?.name && (
                  <p className="text-center text-sm mt-4" style={{ color: '#9AB8A8' }}>
                    Welcome, <span style={{ color: '#18B89A' }}>{state.user.name}</span>! Your journey starts now.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={() => step > 0 ? setStep(s => s - 1) : navigate('landing')}
              className="btn-ghost text-sm" style={{ padding: '10px 20px' }}>
              {step === 0 ? 'Cancel' : 'Back'}
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div key={i} className="rounded-full transition-all duration-300"
                  style={{
                    width: i === step ? 20 : 6,
                    height: 6,
                    background: i === step ? '#18B89A' : i < step ? 'rgba(24,184,154,0.4)' : 'rgba(255,255,255,0.1)',
                  }}
                />
              ))}
            </div>
            {step < totalSteps - 1 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={!canNext}
                className="btn-primary text-sm"
                style={{ padding: '10px 20px', opacity: canNext ? 1 : 0.5 }}>
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={loading}
                className="btn-primary text-sm"
                style={{ padding: '10px 20px', opacity: loading ? 0.7 : 1 }}>
                {loading ? (
                  <span className="flex gap-1"><span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" /></span>
                ) : 'Complete Setup'}
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-xs mt-4" style={{ color: '#5A7A68' }}>
          Progress: {Math.round(progress)}% complete
        </p>
      </div>
    </div>
  );
}
