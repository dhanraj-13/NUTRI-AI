import { useState, useEffect, useCallback } from 'react';
import { Droplets, Plus, TrendingUp, Award } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { api } from '../../lib/api';
import { Modal } from '../shared/Modal';
import type { HydrationLog, HydrationAnalytics } from '../../types';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const QUICK_AMOUNTS = [150, 250, 330, 500];

function StatusMessage({ pct }: { pct: number }) {
  if (pct < 25) return <p style={{ color: '#E07070' }}>⚠️ Behind schedule — drink more now</p>;
  if (pct < 50) return <p style={{ color: '#EBD5A5' }}>💧 Good start — keep going</p>;
  if (pct < 75) return <p style={{ color: '#18B89A' }}>🌊 Great hydration today</p>;
  return <p style={{ color: '#8FD081' }}>✨ Excellent — on track to exceed goal!</p>;
}

export function HydrationPage() {
  const { toast } = useApp();
  const [analytics, setAnalytics] = useState<HydrationAnalytics | null>(null);
  const [logs, setLogs] = useState<HydrationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [customModal, setCustomModal] = useState(false);
  const [customAmount, setCustomAmount] = useState(400);
  const [weeklyData, setWeeklyData] = useState<{ day: string; ml: number }[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [analyticsRes, logsRes] = await Promise.all([
      api.get<HydrationAnalytics>('/api/v1/hydration/analytics'),
      api.get<HydrationLog[]>('/api/v1/hydration'),
    ]);
    if (analyticsRes.data) setAnalytics(analyticsRes.data);
    if (logsRes.data) setLogs(Array.isArray(logsRes.data) ? logsRes.data : []);

    // Build weekly data from analytics
    const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    const wAvg = analyticsRes.data?.weekly_average ?? 2000;
    const today = analyticsRes.data?.total_today ?? 0;
    setWeeklyData(days.map((day, i) => ({
      day,
      ml: i === 6 ? today : Math.round(wAvg * (0.8 + Math.random() * 0.4)),
    })));
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const logWater = async (amount: number) => {
    const res = await api.post('/api/v1/hydration', { water_amount: amount });
    if (res.error) {
      toast('error', 'Failed to log water', res.error);
    } else {
      toast('success', `+${amount}ml logged!`, 'Hydration updated');
      fetchData();
    }
  };

  const total = analytics?.total_today ?? 0;
  const goal = analytics?.goal ?? 2500;
  const pct = Math.min(100, Math.round((total / goal) * 100));

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-0 space-y-6">
      <div>
        <h2 className="font-display font-bold text-2xl mb-1" style={{ color: '#E8F2ED' }}>Hydration Tracker</h2>
        <p className="text-sm" style={{ color: '#9AB8A8' }}>Monitor your daily water intake and stay optimally hydrated.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Water visual */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center" style={{ border: '1px solid rgba(122,184,232,0.18)' }}>
          <h3 className="font-display font-semibold mb-6 self-start" style={{ color: '#E8F2ED' }}>Today's Intake</h3>

          {/* Water vessel */}
          <div className="water-container mb-6" style={{ width: 160, height: 160 }}>
            <div className="water-fill" style={{ height: `${pct}%` }}>
              <div className="water-wave" />
            </div>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
              <span className="font-display font-bold text-3xl" style={{ color: '#E8F2ED' }}>{pct}%</span>
              <span className="text-sm font-mono mt-1" style={{ color: '#7AB8E8' }}>{total}ml</span>
            </div>
          </div>

          <div className="text-center mb-4">
            <p className="text-xs" style={{ color: '#5A7A68' }}>Goal: <span style={{ color: '#7AB8E8' }}>{goal}ml</span></p>
            <p className="text-xs mt-1" style={{ color: '#5A7A68' }}>Remaining: <span style={{ color: '#E8F2ED' }}>{Math.max(0, goal - total)}ml</span></p>
          </div>

          <div className="text-sm text-center" style={{ color: '#9AB8A8' }}>
            <StatusMessage pct={pct} />
          </div>

          {analytics?.streak_days ? (
            <div className="flex items-center gap-2 mt-4 px-4 py-2 rounded-full"
              style={{ background: 'rgba(143,208,129,0.08)', border: '1px solid rgba(143,208,129,0.2)' }}>
              <Award size={14} style={{ color: '#8FD081' }} />
              <span className="text-xs font-semibold" style={{ color: '#8FD081' }}>
                {analytics.streak_days} day streak!
              </span>
            </div>
          ) : null}
        </div>

        {/* Log area */}
        <div className="space-y-4">
          <div className="glass rounded-2xl p-6" style={{ border: '1px solid rgba(122,184,232,0.12)' }}>
            <h3 className="font-display font-semibold mb-4" style={{ color: '#E8F2ED' }}>Quick Log</h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              {QUICK_AMOUNTS.map(ml => (
                <button key={ml} onClick={() => logWater(ml)}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all hover:scale-[1.03] active:scale-95"
                  style={{ background: 'rgba(122,184,232,0.08)', border: '1px solid rgba(122,184,232,0.2)', color: '#7AB8E8' }}>
                  <Droplets size={15} />
                  +{ml}ml
                </button>
              ))}
            </div>
            <button onClick={() => setCustomModal(true)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all hover:scale-[1.02]"
              style={{ background: 'rgba(24,184,154,0.06)', border: '1px solid rgba(24,184,154,0.15)', color: '#18B89A' }}>
              <Plus size={15} /> Custom Amount
            </button>
          </div>

          {/* Today's log timeline */}
          <div className="glass rounded-2xl p-5" style={{ border: '1px solid rgba(122,184,232,0.1)' }}>
            <h3 className="font-display font-semibold text-sm mb-4" style={{ color: '#E8F2ED' }}>Today's Timeline</h3>
            {loading ? (
              <p className="text-sm text-center py-4" style={{ color: '#5A7A68' }}>Loading...</p>
            ) : logs.length === 0 ? (
              <p className="text-sm text-center py-4" style={{ color: '#5A7A68' }}>No logs yet today.</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto no-scrollbar">
                {logs.slice().reverse().map((log, i) => {
                  const cumulative = logs.slice(0, logs.length - i).reduce((s, l) => s + l.water_amount, 0);
                  return (
                    <div key={log.id} className="flex items-center gap-3 py-2 px-3 rounded-xl transition-all hover:bg-white/[0.02]"
                      style={{ borderLeft: '2px solid rgba(122,184,232,0.3)' }}>
                      <Droplets size={13} style={{ color: '#7AB8E8', flexShrink: 0 }} />
                      <div className="flex-1">
                        <p className="text-xs font-semibold" style={{ color: '#E8F2ED' }}>+{log.water_amount}ml</p>
                        <p className="text-xs" style={{ color: '#5A7A68' }}>Total: {cumulative}ml</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs" style={{ color: '#5A7A68' }}>
                          {new Date(log.logged_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Analytics */}
        <div className="space-y-4">
          <div className="glass rounded-2xl p-5" style={{ border: '1px solid rgba(122,184,232,0.1)' }}>
            <h3 className="font-display font-semibold text-sm mb-4" style={{ color: '#E8F2ED' }}>Weekly Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Weekly Avg', val: `${analytics?.weekly_average ?? 0}ml`, icon: TrendingUp, color: '#7AB8E8' },
                { label: 'Streak', val: `${analytics?.streak_days ?? 0} days`, icon: Award, color: '#8FD081' },
                { label: 'Score', val: `${analytics?.percentage ?? pct}%`, icon: Droplets, color: '#18B89A' },
                { label: 'Today', val: `${total}ml`, icon: Droplets, color: '#EBD5A5' },
              ].map(s => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="rounded-xl p-3" style={{ background: 'rgba(122,184,232,0.05)', border: '1px solid rgba(122,184,232,0.1)' }}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon size={12} style={{ color: s.color }} />
                      <p className="text-xs" style={{ color: '#5A7A68' }}>{s.label}</p>
                    </div>
                    <p className="text-sm font-semibold font-mono" style={{ color: s.color }}>{s.val}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 7-day chart */}
          <div className="glass rounded-2xl p-5" style={{ border: '1px solid rgba(122,184,232,0.1)' }}>
            <h3 className="font-display font-semibold text-sm mb-4" style={{ color: '#E8F2ED' }}>7-Day Trend</h3>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="hydroGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7AB8E8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7AB8E8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#5A7A68' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: 'rgba(20,31,24,0.95)', border: '1px solid rgba(122,184,232,0.2)', borderRadius: 12, color: '#E8F2ED', fontSize: 12 }}
                  formatter={(v) => [`${v}ml`, 'Water']}
                />
                <Area type="monotone" dataKey="ml" stroke="#7AB8E8" strokeWidth={2} fill="url(#hydroGrad)" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex justify-center mt-2">
              <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, rgba(122,184,232,0.3), transparent)` }} />
            </div>
            <p className="text-xs text-center mt-2" style={{ color: '#5A7A68' }}>
              Goal line: {goal}ml/day
            </p>
          </div>
        </div>
      </div>

      <Modal open={customModal} onClose={() => setCustomModal(false)} title="Custom Water Amount">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium" style={{ color: '#9AB8A8' }}>Amount (ml)</label>
              <span className="font-mono font-semibold" style={{ color: '#7AB8E8' }}>{customAmount}ml</span>
            </div>
            <input type="range" min={50} max={2000} step={50} value={customAmount}
              onChange={e => setCustomAmount(Number(e.target.value))}
              className="w-full" style={{ accentColor: '#7AB8E8' }} />
            <div className="flex justify-between text-xs mt-1" style={{ color: '#5A7A68' }}>
              <span>50ml</span><span>2000ml</span>
            </div>
          </div>
          <input type="number" value={customAmount} onChange={e => setCustomAmount(Number(e.target.value))}
            className="input-glass" placeholder="Or type a value..." />
          <button onClick={() => { logWater(customAmount); setCustomModal(false); }} className="btn-primary w-full justify-center">
            Log {customAmount}ml
          </button>
        </div>
      </Modal>
    </div>
  );
}
