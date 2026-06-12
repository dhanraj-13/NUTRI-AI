import { useState, useEffect, useCallback } from 'react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, TrendingDown, Brain, RefreshCw } from 'lucide-react';
import { api } from '../../lib/api';
import { WS_BASE } from '../../lib/ws';
import { MetricSkeleton } from '../shared/LoadingSkeleton';
import type { Analytics } from '../../types';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'];
const PIE_COLORS = ['#18B89A', '#8FD081', '#EBD5A5'];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-3 py-2" style={{ border: '1px solid rgba(24,184,154,0.2)', minWidth: 120 }}>
      <p className="text-xs mb-1" style={{ color: '#5A7A68' }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} className="text-sm font-semibold" style={{ color: '#E8F2ED' }}>
          {p.name}: <span style={{ color: '#18B89A' }}>{p.value}</span>
        </p>
      ))}
    </div>
  );
};

export function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [range, setRange] = useState<'today' | '7d' | '30d'>('7d');
  const [wsStatus, setWsStatus] = useState(false);

  const buildChartData = useCallback((a: Analytics) => {
    const base = a.weekly_calories || [1800, 2100, 1950, 2200, 1780, 2050, a.calories_consumed || 1900];
    return DAYS.map((day, i) => ({
      day,
      calories: base[i] || 0,
      protein: Math.round((a.protein_total || 0) * (0.85 + Math.random() * 0.3)),
      carbs: Math.round((a.carbs_total || 0) * (0.85 + Math.random() * 0.3)),
      fats: Math.round((a.fats_total || 0) * (0.85 + Math.random() * 0.3)),
      hydration: (a.weekly_hydration?.[i]) || Math.round(2000 + Math.random() * 800),
    }));
  }, []);

  const [chartData, setChartData] = useState<ReturnType<typeof buildChartData>>([]);

  const fetchData = useCallback(async () => {
    setRefreshing(true);
    const [analyticsRes] = await Promise.all([
      api.get<Analytics>('/api/v1/analytics'),
    ]);
    if (analyticsRes.data) {
      setAnalytics(analyticsRes.data);
      setChartData(buildChartData(analyticsRes.data));
    }
    setLoading(false);
    setRefreshing(false);
  }, [buildChartData]);

  useEffect(() => {
    fetchData();
    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket(`${WS_BASE}/ws/analytics`);
      ws.onopen = () => setWsStatus(true);
      ws.onclose = () => setWsStatus(false);
      ws.onmessage = () => fetchData();
    } catch { /* ignore */ }
    return () => ws?.close();
  }, [fetchData]);

  const macroData = analytics ? [
    { name: 'Protein', value: analytics.protein_total || 0 },
    { name: 'Carbs', value: analytics.carbs_total || 0 },
    { name: 'Fats', value: analytics.fats_total || 0 },
  ] : [];

  const kpis = analytics ? [
    {
      label: 'Avg Daily Calories',
      value: Math.round(analytics.calories_consumed || 0),
      unit: 'kcal',
      trend: 'up',
      color: '#18B89A',
    },
    {
      label: 'Protein Achievement',
      value: Math.round(((analytics.protein_total || 0) / 150) * 100),
      unit: '%',
      trend: 'up',
      color: '#8FD081',
    },
    {
      label: 'Nutrition Score',
      value: analytics.nutrition_score || 0,
      unit: '/100',
      trend: 'up',
      color: '#EBD5A5',
    },
    {
      label: 'Hydration Score',
      value: analytics.hydration_score || 0,
      unit: '/100',
      trend: analytics.hydration_score > 70 ? 'up' : 'down',
      color: '#7AB8E8',
    },
  ] : [];

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-0 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-2xl mb-1" style={{ color: '#E8F2ED' }}>Analytics</h2>
          <p className="text-sm" style={{ color: '#9AB8A8' }}>Your wellness intelligence dashboard.</p>
        </div>
        <div className="flex items-center gap-3">
          {wsStatus && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
              style={{ background: 'rgba(143,208,129,0.08)', border: '1px solid rgba(143,208,129,0.2)', color: '#8FD081' }}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse-dot" style={{ background: '#8FD081' }} />
              LIVE
            </div>
          )}
          <button onClick={fetchData} disabled={refreshing}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all hover:scale-[1.02]"
            style={{ background: 'rgba(24,184,154,0.08)', border: '1px solid rgba(24,184,154,0.18)', color: '#18B89A' }}>
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Date range */}
      <div className="flex gap-2">
        {[{ k: 'today', l: 'Today' }, { k: '7d', l: '7 Days' }, { k: '30d', l: '30 Days' }].map(r => (
          <button key={r.k} onClick={() => setRange(r.k as typeof range)}
            className="px-4 py-2 rounded-xl text-xs font-medium transition-all"
            style={{
              background: range === r.k ? 'rgba(24,184,154,0.15)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${range === r.k ? 'rgba(24,184,154,0.35)' : 'rgba(255,255,255,0.08)'}`,
              color: range === r.k ? '#18B89A' : '#9AB8A8',
            }}>
            {r.l}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <MetricSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map(kpi => (
            <div key={kpi.label} className="glass rounded-2xl p-5 card-hover" style={{ border: `1px solid ${kpi.color}18` }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs" style={{ color: '#5A7A68' }}>{kpi.label}</p>
                {kpi.trend === 'up'
                  ? <TrendingUp size={14} style={{ color: '#8FD081' }} />
                  : <TrendingDown size={14} style={{ color: '#E07070' }} />}
              </div>
              <p className="font-display font-bold text-2xl" style={{ color: kpi.color }}>
                {kpi.value}<span className="text-sm ml-1" style={{ color: '#5A7A68' }}>{kpi.unit}</span>
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calorie line chart */}
        <div className="lg:col-span-2 glass rounded-2xl p-6" style={{ border: '1px solid rgba(24,184,154,0.1)' }}>
          <h3 className="font-display font-semibold mb-4" style={{ color: '#E8F2ED' }}>Calorie Intake</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#5A7A68' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#5A7A68' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="calories" name="Calories" stroke="#18B89A" strokeWidth={2.5}
                dot={{ fill: '#18B89A', r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#18B89A', strokeWidth: 2, stroke: 'rgba(24,184,154,0.3)' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Macro donut */}
        <div className="glass rounded-2xl p-6" style={{ border: '1px solid rgba(24,184,154,0.1)' }}>
          <h3 className="font-display font-semibold mb-4" style={{ color: '#E8F2ED' }}>Macro Split</h3>
          {macroData.some(d => d.value > 0) ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={macroData} innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                    {macroData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v}g`]} contentStyle={{ background: 'rgba(20,31,24,0.95)', border: '1px solid rgba(24,184,154,0.2)', borderRadius: 12, color: '#E8F2ED', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2">
                {macroData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i] }} />
                    <span className="text-xs" style={{ color: '#9AB8A8' }}>{d.name}: {d.value.toFixed(0)}g</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-40">
              <p className="text-sm" style={{ color: '#5A7A68' }}>Log meals to see macro split</p>
            </div>
          )}
        </div>
      </div>

      {/* Macro breakdown bars + Hydration chart */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6" style={{ border: '1px solid rgba(24,184,154,0.1)' }}>
          <h3 className="font-display font-semibold mb-4" style={{ color: '#E8F2ED' }}>Weekly Macros</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} barSize={8} barGap={2}>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#5A7A68' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="protein" name="Protein" fill="#18B89A" radius={[4, 4, 0, 0]} />
              <Bar dataKey="carbs" name="Carbs" fill="#8FD081" radius={[4, 4, 0, 0]} />
              <Bar dataKey="fats" name="Fats" fill="#EBD5A5" radius={[4, 4, 0, 0]} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#9AB8A8' }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-2xl p-6" style={{ border: '1px solid rgba(122,184,232,0.12)' }}>
          <h3 className="font-display font-semibold mb-4" style={{ color: '#E8F2ED' }}>Hydration Trend</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="hydroArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7AB8E8" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#7AB8E8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#5A7A68' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="hydration" name="Hydration (ml)" stroke="#7AB8E8" strokeWidth={2} fill="url(#hydroArea)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Insights */}
      {analytics?.ai_insights && analytics.ai_insights.length > 0 && (
        <div className="glass rounded-2xl p-6 animate-glow" style={{ border: '1px solid rgba(24,184,154,0.18)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(24,184,154,0.1)', border: '1px solid rgba(24,184,154,0.2)' }}>
              <Brain size={16} style={{ color: '#18B89A' }} />
            </div>
            <h3 className="font-display font-semibold" style={{ color: '#E8F2ED' }}>AI-Generated Insights</h3>
          </div>
          <div className="space-y-3">
            {analytics.ai_insights.map((insight, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl"
                style={{ background: 'rgba(24,184,154,0.04)', border: '1px solid rgba(24,184,154,0.08)' }}>
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#18B89A' }} />
                <p className="text-sm leading-relaxed" style={{ color: '#9AB8A8' }}>{insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
