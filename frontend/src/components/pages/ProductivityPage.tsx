import { useState, useEffect, useCallback } from 'react';
import { Zap, Moon, Smile, Brain, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { api } from '../../lib/api';
import { ProgressRing } from '../shared/ProgressRing';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import type { EnergyLevel, MoodType } from '../../types';

const ENERGY_OPTIONS: { val: EnergyLevel; emoji: string; color: string }[] = [
  { val: 'Low', emoji: '😴', color: '#E07070' },
  { val: 'Medium', emoji: '😊', color: '#EBD5A5' },
  { val: 'High', emoji: '⚡', color: '#8FD081' },
];

const MOOD_OPTIONS: { val: MoodType; emoji: string; color: string }[] = [
  { val: 'Tired', emoji: '😩', color: '#7AB8E8' },
  { val: 'Focused', emoji: '🎯', color: '#18B89A' },
  { val: 'Stressed', emoji: '😤', color: '#E07070' },
  { val: 'Energetic', emoji: '⚡', color: '#8FD081' },
];

export function ProductivityPage() {
  const { toast } = useApp();
  const [energy, setEnergy] = useState<EnergyLevel | null>(null);
  const [mood, setMood] = useState<MoodType | null>(null);
  const [sleepHours, setSleepHours] = useState(7.5);
  const [todayEnergy, setTodayEnergy] = useState<EnergyLevel | null>(null);
  const [todayMood, setTodayMood] = useState<MoodType | null>(null);
  const [todaySleep, setTodaySleep] = useState<number | null>(null);
  const [energyData, setEnergyData] = useState<{ day: string; level: number }[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [eRes, mRes, sRes] = await Promise.all([
      api.get<{ level?: EnergyLevel; latest?: { level: EnergyLevel } }>('/api/v1/energy-analytics'),
      api.get<{ mood?: MoodType; latest?: { mood: MoodType } }>('/api/v1/mood-analytics'),
      api.get<{ sleep_hours?: number; latest?: { sleep_hours: number } }>('/api/v1/sleep-analytics'),
    ]);
    if (eRes.data?.level) setTodayEnergy(eRes.data.level);
    else if (eRes.data?.latest?.level) setTodayEnergy(eRes.data.latest.level);
    if (mRes.data?.mood) setTodayMood(mRes.data.mood);
    else if (mRes.data?.latest?.mood) setTodayMood(mRes.data.latest.mood);
    if (sRes.data?.sleep_hours) setTodaySleep(sRes.data.sleep_hours);
    else if (sRes.data?.latest?.sleep_hours) setTodaySleep(sRes.data.latest.sleep_hours);

    // Mock weekly chart data
    const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    setEnergyData(days.map(day => ({
      day,
      level: Math.round(40 + Math.random() * 60),
    })));
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const logEnergy = async (level: EnergyLevel) => {
    const res = await api.post('/api/v1/energy-level', { level });
    if (res.error) toast('error', 'Failed to log energy', res.error);
    else { toast('success', `Energy logged: ${level}`); setTodayEnergy(level); setEnergy(level); }
  };

  const logMood = async (m: MoodType) => {
    const res = await api.post('/api/v1/mood', { mood: m });
    if (res.error) toast('error', 'Failed to log mood', res.error);
    else { toast('success', `Mood logged: ${m}`); setTodayMood(m); setMood(m); }
  };

  const logSleep = async () => {
    const res = await api.post('/api/v1/sleep', { sleep_hours: sleepHours });
    if (res.error) toast('error', 'Failed to log sleep', res.error);
    else { toast('success', `Sleep logged: ${sleepHours}h`); setTodaySleep(sleepHours); }
  };

  const productivityScore = (() => {
    let s = 50;
    const e = todayEnergy || energy;
    const m = todayMood || mood;
    const sl = todaySleep || sleepHours;
    if (e === 'High') s += 20;
    else if (e === 'Medium') s += 10;
    else if (e === 'Low') s -= 10;
    if (m === 'Focused' || m === 'Energetic') s += 20;
    else if (m === 'Tired' || m === 'Stressed') s -= 10;
    if (sl >= 7 && sl <= 9) s += 10;
    else if (sl < 6) s -= 15;
    return Math.max(0, Math.min(100, Math.round(s)));
  })();

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-0 space-y-6">
      <div>
        <h2 className="font-display font-bold text-2xl mb-1" style={{ color: '#E8F2ED' }}>Productivity & Wellness</h2>
        <p className="text-sm" style={{ color: '#9AB8A8' }}>Track your daily wellness inputs and discover patterns.</p>
      </div>

      {/* Productivity score */}
      <div className="glass rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 animate-glow"
        style={{ border: '1px solid rgba(24,184,154,0.18)' }}>
        <ProgressRing value={productivityScore} size={120} strokeWidth={9} color="#18B89A"
          label={String(productivityScore)} sublabel="score" />
        <div>
          <h3 className="font-display font-semibold text-xl mb-2" style={{ color: '#E8F2ED' }}>
            Productivity Score
          </h3>
          <p className="text-sm mb-3" style={{ color: '#9AB8A8' }}>
            Composite score based on your energy, mood, and sleep quality today.
          </p>
          <div className="flex gap-3 flex-wrap">
            {todayEnergy && (
              <span className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ background: 'rgba(24,184,154,0.1)', border: '1px solid rgba(24,184,154,0.2)', color: '#18B89A' }}>
                Energy: {todayEnergy}
              </span>
            )}
            {todayMood && (
              <span className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ background: 'rgba(143,208,129,0.1)', border: '1px solid rgba(143,208,129,0.2)', color: '#8FD081' }}>
                Mood: {todayMood}
              </span>
            )}
            {todaySleep && (
              <span className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ background: 'rgba(122,184,232,0.1)', border: '1px solid rgba(122,184,232,0.2)', color: '#7AB8E8' }}>
                Sleep: {todaySleep}h
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Log inputs */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Energy */}
        <div className="glass rounded-2xl p-5" style={{ border: '1px solid rgba(143,208,129,0.12)' }}>
          <div className="flex items-center gap-2 mb-4">
            <Zap size={16} style={{ color: '#8FD081' }} />
            <h3 className="font-display font-semibold text-sm" style={{ color: '#E8F2ED' }}>Energy Level</h3>
            {todayEnergy && <Check size={14} style={{ color: '#8FD081', marginLeft: 'auto' }} />}
          </div>
          {todayEnergy ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-2">{ENERGY_OPTIONS.find(e => e.val === todayEnergy)?.emoji}</div>
              <p className="font-semibold" style={{ color: ENERGY_OPTIONS.find(e => e.val === todayEnergy)?.color }}>{todayEnergy}</p>
              <button onClick={() => setTodayEnergy(null)} className="text-xs mt-3 hover:underline" style={{ color: '#5A7A68', background: 'none', border: 'none', cursor: 'pointer' }}>
                Update
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {ENERGY_OPTIONS.map(opt => (
                <button key={opt.val} onClick={() => logEnergy(opt.val)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl transition-all hover:scale-[1.02]"
                  style={{
                    background: energy === opt.val ? `${opt.color}12` : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${energy === opt.val ? `${opt.color}30` : 'rgba(255,255,255,0.06)'}`,
                  }}>
                  <span className="text-xl">{opt.emoji}</span>
                  <span className="text-sm font-medium" style={{ color: '#E8F2ED' }}>{opt.val}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mood */}
        <div className="glass rounded-2xl p-5" style={{ border: '1px solid rgba(24,184,154,0.12)' }}>
          <div className="flex items-center gap-2 mb-4">
            <Smile size={16} style={{ color: '#18B89A' }} />
            <h3 className="font-display font-semibold text-sm" style={{ color: '#E8F2ED' }}>Mood</h3>
            {todayMood && <Check size={14} style={{ color: '#8FD081', marginLeft: 'auto' }} />}
          </div>
          {todayMood ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-2">{MOOD_OPTIONS.find(m => m.val === todayMood)?.emoji}</div>
              <p className="font-semibold" style={{ color: MOOD_OPTIONS.find(m => m.val === todayMood)?.color }}>{todayMood}</p>
              <button onClick={() => setTodayMood(null)} className="text-xs mt-3 hover:underline" style={{ color: '#5A7A68', background: 'none', border: 'none', cursor: 'pointer' }}>
                Update
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {MOOD_OPTIONS.map(opt => (
                <button key={opt.val} onClick={() => logMood(opt.val)}
                  className="flex flex-col items-center gap-1 p-3 rounded-xl transition-all hover:scale-[1.03]"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}>
                  <span className="text-2xl">{opt.emoji}</span>
                  <span className="text-xs" style={{ color: '#9AB8A8' }}>{opt.val}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sleep */}
        <div className="glass rounded-2xl p-5" style={{ border: '1px solid rgba(122,184,232,0.12)' }}>
          <div className="flex items-center gap-2 mb-4">
            <Moon size={16} style={{ color: '#7AB8E8' }} />
            <h3 className="font-display font-semibold text-sm" style={{ color: '#E8F2ED' }}>Sleep</h3>
            {todaySleep && <Check size={14} style={{ color: '#8FD081', marginLeft: 'auto' }} />}
          </div>
          {todaySleep ? (
            <div className="text-center py-4">
              <p className="font-display font-bold text-4xl" style={{ color: '#7AB8E8' }}>{todaySleep}h</p>
              <p className="text-sm mt-1" style={{ color: '#9AB8A8' }}>
                {todaySleep >= 7 ? '😊 Good sleep!' : todaySleep >= 6 ? '😐 Fair sleep' : '😴 Poor sleep'}
              </p>
              <button onClick={() => setTodaySleep(null)} className="text-xs mt-3 hover:underline" style={{ color: '#5A7A68', background: 'none', border: 'none', cursor: 'pointer' }}>
                Update
              </button>
            </div>
          ) : (
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-xs" style={{ color: '#5A7A68' }}>Hours</span>
                <span className="font-mono text-sm font-semibold" style={{ color: '#7AB8E8' }}>{sleepHours}h</span>
              </div>
              <input type="range" min={4} max={12} step={0.5} value={sleepHours}
                onChange={e => setSleepHours(Number(e.target.value))}
                className="w-full mb-4" style={{ accentColor: '#7AB8E8' }} />
              <div className="flex justify-between text-xs mb-4" style={{ color: '#5A7A68' }}>
                <span>4h</span><span>8h</span><span>12h</span>
              </div>
              <button onClick={logSleep} className="btn-primary w-full justify-center text-sm" style={{ padding: '10px' }}>
                Log Sleep
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Energy trend chart */}
      {!loading && energyData.length > 0 && (
        <div className="glass rounded-2xl p-6" style={{ border: '1px solid rgba(24,184,154,0.1)' }}>
          <div className="flex items-center gap-3 mb-4">
            <Brain size={16} style={{ color: '#18B89A' }} />
            <h3 className="font-display font-semibold" style={{ color: '#E8F2ED' }}>7-Day Energy Trend</h3>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={energyData}>
              <defs>
                <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8FD081" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#8FD081" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#5A7A68' }} axisLine={false} tickLine={false} />
              <YAxis hide domain={[0, 100]} />
              <Tooltip contentStyle={{ background: 'rgba(20,31,24,0.95)', border: '1px solid rgba(24,184,154,0.2)', borderRadius: 12, color: '#E8F2ED', fontSize: 12 }} />
              <Area type="monotone" dataKey="level" name="Energy Score" stroke="#8FD081" strokeWidth={2} fill="url(#energyGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
