import { useState, useEffect, useCallback } from 'react';
import { Zap, Droplets, Brain, TrendingUp, Plus, Bot, ChevronRight, Flame, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { api } from '../../lib/api';
import { WS_BASE } from '../../lib/ws';
import { ProgressRing } from '../shared/ProgressRing';
import { MetricSkeleton, ListSkeleton } from '../shared/LoadingSkeleton';
import type { Analytics, NutritionLog, HydrationAnalytics } from '../../types';

function getGreeting(name: string) {
  const h = new Date().getHours();
  const time = h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening';
  return `Good ${time}, ${name?.split(' ')[0] || 'there'}.`;
}

function QuickAction({ icon: Icon, label, color, onClick }: { icon: typeof Zap; label: string; color: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="glass glass-hover rounded-2xl p-4 flex items-center gap-3 w-full transition-all card-hover"
      style={{ border: `1px solid ${color}18` }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
        <Icon size={17} style={{ color }} />
      </div>
      <span className="text-sm font-medium" style={{ color: '#E8F2ED' }}>{label}</span>
      <ChevronRight size={14} style={{ color: '#5A7A68', marginLeft: 'auto' }} />
    </button>
  );
}

export function DashboardPage() {
  const { state, navigate, toast } = useApp();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [meals, setMeals] = useState<NutritionLog[]>([]);
  const [hydration, setHydration] = useState<HydrationAnalytics | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [wsStatus, setWsStatus] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [analyticsRes, mealsRes, hydrationRes, recRes] = await Promise.all([
      api.get<Analytics>('/api/v1/analytics'),
      api.get<NutritionLog[]>('/api/v1/nutrition-log'),
      api.get<HydrationAnalytics>('/api/v1/hydration/analytics'),
      api.get<{ recommendations?: string[]; insights?: string[] }>('/api/v1/recommendations'),
    ]);
    if (analyticsRes.data) setAnalytics(analyticsRes.data);
    if (mealsRes.data) setMeals(Array.isArray(mealsRes.data) ? mealsRes.data : []);
    if (hydrationRes.data) setHydration(hydrationRes.data);
    const rec = recRes.data;
    if (rec) {
      const items = rec.recommendations || rec.insights || [];
      setRecommendations(Array.isArray(items) ? items.slice(0, 3) : []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
    // WebSocket live updates
    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket(`${WS_BASE}/ws/live`);
      ws.onopen = () => setWsStatus(true);
      ws.onclose = () => setWsStatus(false);
      ws.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data.event === 'nutrition_log_added' || data.event === 'hydration_updated') {
            fetchAll();
          }
        } catch { /* ignore */ }
      };
    } catch { /* ignore */ }
    return () => { ws?.close(); };
  }, [fetchAll]);

  const nutritionScore = analytics?.nutrition_score ?? 0;
  const hydrationPct = hydration ? Math.round((hydration.total_today / (hydration.goal || 2500)) * 100) : 0;
  const wellnessScore = Math.round((nutritionScore + Math.min(100, hydrationPct) + (analytics?.productivity_score ?? 0)) / 3);
  const todayMeals = meals.slice(0, 5);
  const totalCalories = analytics?.calories_consumed ?? 0;
  const calGoal = 2200;

  const logWater = async (amount: number) => {
    const res = await api.post('/api/v1/hydration', { water_amount: amount });
    if (!res.error) {
      toast('success', `+${amount}ml logged`, 'Hydration updated');
      fetchAll();
    } else toast('error', 'Failed to log water', res.error);
  };

  const scoreCards = [
    { label: 'Nutrition', value: nutritionScore, color: '#18B89A', icon: Brain, sub: 'score' },
    { label: 'Hydration', value: Math.min(100, hydrationPct), color: '#7AB8E8', icon: Droplets, sub: `${hydration?.total_today ?? 0}ml` },
    { label: 'Wellness', value: wellnessScore, color: '#8FD081', icon: Zap, sub: 'overall' },
    { label: 'Productivity', value: analytics?.productivity_score ?? 0, color: '#EBD5A5', icon: TrendingUp, sub: 'index' },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6 pt-16 lg:pt-0">
      {/* Live indicator */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: '#5A7A68' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <h2 className="font-display font-bold text-2xl md:text-3xl" style={{ color: '#E8F2ED' }}>
            {getGreeting(state.user?.name || '')}
          </h2>
          <p className="text-sm mt-1" style={{ color: '#9AB8A8' }}>Here's your wellness intelligence for today.</p>
        </div>
        {wsStatus && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
            style={{ background: 'rgba(143,208,129,0.08)', border: '1px solid rgba(143,208,129,0.2)', color: '#8FD081' }}>
            <div className="w-1.5 h-1.5 rounded-full animate-pulse-dot" style={{ background: '#8FD081' }} />
            LIVE
          </div>
        )}
      </div>

      {/* Score Cards */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <MetricSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {scoreCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div key={card.label}
                className="glass rounded-2xl p-5 flex flex-col items-center card-hover"
                style={{ border: `1px solid ${card.color}18`, animationDelay: `${i * 0.1}s` }}>
                <ProgressRing value={card.value} size={90} strokeWidth={7} color={card.color} label={String(card.value)} sublabel={card.sub} />
                <div className="mt-3 flex items-center gap-1.5">
                  <Icon size={13} style={{ color: card.color }} />
                  <span className="text-xs font-medium" style={{ color: '#9AB8A8' }}>{card.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Middle row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* AI Card */}
        <div className="lg:col-span-2 glass rounded-2xl p-6 animate-glow" style={{ border: '1px solid rgba(24,184,154,0.18)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(24,184,154,0.1)', border: '1px solid rgba(24,184,154,0.2)' }}>
                <Bot size={18} style={{ color: '#18B89A' }} />
              </div>
              <div>
                <h3 className="font-display font-semibold" style={{ color: '#E8F2ED' }}>AI Nutrition Insights</h3>
                <p className="text-xs" style={{ color: '#5A7A68' }}>RAG-powered recommendations</p>
              </div>
            </div>
            <button onClick={() => navigate('ai-chat')} className="btn-ghost text-xs" style={{ padding: '6px 14px' }}>
              Ask AI <ChevronRight size={12} />
            </button>
          </div>
          {recommendations.length > 0 ? (
            <div className="space-y-3">
              {recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ background: 'rgba(24,184,154,0.04)', border: '1px solid rgba(24,184,154,0.08)' }}>
                  <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: '#18B89A' }} />
                  <p className="text-sm leading-relaxed" style={{ color: '#9AB8A8' }}>
                    {typeof rec === 'string' ? rec : JSON.stringify(rec)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <Bot size={32} style={{ color: '#18B89A', opacity: 0.4, marginBottom: 8 }} />
              <p className="text-sm text-center" style={{ color: '#9AB8A8' }}>
                Log meals and hydration to get personalized AI insights.
              </p>
              <button onClick={() => navigate('ai-chat')} className="btn-primary mt-4 text-sm" style={{ padding: '8px 20px' }}>
                Start AI Chat
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="font-display font-semibold text-sm px-1" style={{ color: '#E8F2ED' }}>Quick Actions</h3>
          <QuickAction icon={Plus} label="Log Meal" color="#18B89A" onClick={() => navigate('meals')} />
          <QuickAction icon={Droplets} label="Log Water" color="#7AB8E8" onClick={() => navigate('hydration')} />
          <QuickAction icon={Zap} label="Log Energy" color="#8FD081" onClick={() => navigate('productivity')} />
          <QuickAction icon={Bot} label="Ask AI Coach" color="#EBD5A5" onClick={() => navigate('ai-chat')} />

          {/* Quick hydration */}
          <div className="glass rounded-2xl p-4" style={{ border: '1px solid rgba(122,184,232,0.15)' }}>
            <p className="text-xs font-medium mb-3" style={{ color: '#9AB8A8' }}>Quick Hydration Log</p>
            <div className="grid grid-cols-3 gap-2">
              {[250, 330, 500].map(ml => (
                <button key={ml} onClick={() => logWater(ml)}
                  className="py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105 active:scale-95"
                  style={{ background: 'rgba(122,184,232,0.1)', border: '1px solid rgba(122,184,232,0.2)', color: '#7AB8E8' }}>
                  +{ml}ml
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Meals */}
        <div className="lg:col-span-2 glass rounded-2xl p-6" style={{ border: '1px solid rgba(24,184,154,0.1)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold" style={{ color: '#E8F2ED' }}>Today's Meals</h3>
            <button onClick={() => navigate('meals')} className="text-xs font-medium hover:underline" style={{ color: '#18B89A', background: 'none', border: 'none', cursor: 'pointer' }}>
              View all
            </button>
          </div>
          {loading ? <ListSkeleton count={3} /> : todayMeals.length > 0 ? (
            <div className="space-y-2">
              {todayMeals.map(meal => (
                <div key={meal.id} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-white/[0.02]">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(24,184,154,0.08)', border: '1px solid rgba(24,184,154,0.12)' }}>
                    <Flame size={14} style={{ color: '#18B89A' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: '#E8F2ED' }}>{meal.food_name}</p>
                    <p className="text-xs" style={{ color: '#5A7A68' }}>{meal.meal_type}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold font-mono" style={{ color: '#18B89A' }}>
                      {meal.calories ? `${meal.calories} kcal` : `${meal.quantity}g`}
                    </p>
                    <div className="flex items-center gap-1 justify-end">
                      <Clock size={10} style={{ color: '#5A7A68' }} />
                      <p className="text-xs" style={{ color: '#5A7A68' }}>
                        {new Date(meal.meal_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-sm" style={{ color: '#9AB8A8' }}>No meals logged today yet.</p>
              <button onClick={() => navigate('nutrition')} className="btn-primary mt-3 text-sm" style={{ padding: '8px 20px' }}>
                + Log First Meal
              </button>
            </div>
          )}

          {/* Calorie progress */}
          {totalCalories > 0 && (
            <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(24,184,154,0.06)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs" style={{ color: '#9AB8A8' }}>Daily Calories</span>
                <span className="text-xs font-mono font-semibold" style={{ color: '#18B89A' }}>
                  {totalCalories} / {calGoal} kcal
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(24,184,154,0.1)' }}>
                <div className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, (totalCalories / calGoal) * 100)}%`, background: 'linear-gradient(90deg,#18B89A,#8FD081)' }} />
              </div>
            </div>
          )}
        </div>

        {/* Hydration widget */}
        <div className="glass rounded-2xl p-6" style={{ border: '1px solid rgba(122,184,232,0.15)' }}>
          <h3 className="font-display font-semibold mb-4" style={{ color: '#E8F2ED' }}>Hydration</h3>
          <div className="flex flex-col items-center">
            <div className="water-container mb-4" style={{ width: 100, height: 100 }}>
              <div className="water-fill" style={{ height: `${Math.min(100, hydrationPct)}%` }}>
                <div className="water-wave" />
              </div>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                <span className="font-display font-bold text-lg" style={{ color: '#E8F2ED' }}>{Math.min(100, hydrationPct)}%</span>
                <span className="text-xs" style={{ color: '#9AB8A8' }}>{hydration?.total_today ?? 0}ml</span>
              </div>
            </div>
            <p className="text-xs mb-3" style={{ color: '#5A7A68' }}>Goal: {hydration?.goal ?? 2500}ml</p>
            <div className="flex gap-2 w-full">
              <button onClick={() => logWater(250)} className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105"
                style={{ background: 'rgba(122,184,232,0.1)', border: '1px solid rgba(122,184,232,0.2)', color: '#7AB8E8' }}>+250ml</button>
              <button onClick={() => logWater(500)} className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105"
                style={{ background: 'rgba(122,184,232,0.1)', border: '1px solid rgba(122,184,232,0.2)', color: '#7AB8E8' }}>+500ml</button>
            </div>
            {hydration?.streak_days ? (
              <p className="text-xs mt-3" style={{ color: '#8FD081' }}>🔥 {hydration.streak_days} day streak!</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
