import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Filter, X, Plus, Info, Flame, ChevronDown, ImageOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { api, BASE_URL } from '../../lib/api';
import { WS_BASE } from '../../lib/ws';
import { Modal } from '../shared/Modal';
import { EmptyState } from '../shared/EmptyState';
import { CardSkeleton } from '../shared/LoadingSkeleton';
import type { Food, NutritionLogPayload, MacroAnalysis } from '../../types';

// ─── Constants ────────────────────────────────────────────────────────────────

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'] as const;
const PAGE_SIZE = 18;

const CATEGORY_GRADIENTS: Record<string, string> = {
  'South Indian Foods':  'linear-gradient(135deg,rgba(232,168,56,0.25),rgba(200,140,40,0.15))',
  'Indian Home Foods':   'linear-gradient(135deg,rgba(235,213,165,0.25),rgba(210,180,100,0.15))',
  'Protein Foods':       'linear-gradient(135deg,rgba(24,184,154,0.3),rgba(14,155,129,0.2))',
  'Fitness Meals':       'linear-gradient(135deg,rgba(143,208,129,0.3),rgba(100,180,80,0.2))',
  'Fruits':              'linear-gradient(135deg,rgba(224,112,112,0.25),rgba(200,80,80,0.15))',
  'Vegetables':          'linear-gradient(135deg,rgba(143,208,129,0.25),rgba(80,180,80,0.15))',
  'Healthy snacks':      'linear-gradient(135deg,rgba(122,184,232,0.25),rgba(80,150,210,0.15))',
  'Healthy Drinks':      'linear-gradient(135deg,rgba(122,184,232,0.3),rgba(60,130,200,0.2))',
  'Snacks':              'linear-gradient(135deg,rgba(232,168,56,0.2),rgba(200,140,40,0.1))',
  'Hydration foods':     'linear-gradient(135deg,rgba(122,184,232,0.35),rgba(80,150,210,0.25))',
  'Breakfast':           'linear-gradient(135deg,rgba(235,213,165,0.3),rgba(210,190,120,0.2))',
  Default:               'linear-gradient(135deg,rgba(24,184,154,0.15),rgba(14,155,129,0.1))',
};

const CATEGORY_EMOJI: Record<string, string> = {
  'South Indian Foods': '🍛',
  'Indian Home Foods':  '🍲',
  'Protein Foods':      '🥩',
  'Fitness Meals':      '💪',
  'Fruits':             '🍎',
  'Vegetables':         '🥦',
  'Healthy snacks':     '🥜',
  'Healthy Drinks':     '🥤',
  'Snacks':             '🍿',
  'Hydration foods':    '💧',
  'Breakfast':          '🌅',
  Default:              '🥗',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getImageUrl(imagePath?: string): string | null {
  if (!imagePath) return null;
  return `${BASE_URL}/${imagePath}`;
}

function parseServingWeight(servingSize: string): number {
  const match = servingSize.match(/(\d+(?:\.\d+)?)\s*(?:g|ml)/i);
  return match ? parseFloat(match[1]) : 100;
}

// ─── FoodImage ────────────────────────────────────────────────────────────────

function FoodImage({ food }: { food: Food }) {
  const [imgError, setImgError] = useState(false);
  const gradient = CATEGORY_GRADIENTS[food.food_category] ?? CATEGORY_GRADIENTS.Default;
  const emoji = CATEGORY_EMOJI[food.food_category] ?? CATEGORY_EMOJI.Default;
  const imgUrl = getImageUrl(food.image_path);

  if (imgUrl && !imgError) {
    return (
      <div className="h-32 relative overflow-hidden" style={{ background: gradient }}>
        <img
          src={imgUrl}
          alt={food.food_name}
          loading="lazy"
          onError={() => setImgError(true)}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            display: 'block',
          }}
        />
        {/* Calorie badge */}
        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold"
          style={{ background: 'rgba(6,10,8,0.75)', color: '#18B89A', backdropFilter: 'blur(8px)' }}>
          <Flame size={10} />{Math.round(food.calories)} kcal
        </div>
      </div>
    );
  }

  // Fallback — emoji + gradient
  return (
    <div className="h-32 flex items-center justify-center relative" style={{ background: gradient }}>
      <span className="text-5xl" role="img" aria-label={food.food_category}>{emoji}</span>
      <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold"
        style={{ background: 'rgba(6,10,8,0.75)', color: '#18B89A', backdropFilter: 'blur(8px)' }}>
        <Flame size={10} />{Math.round(food.calories)} kcal
      </div>
      {imgError && (
        <div className="absolute bottom-2 left-2">
          <ImageOff size={12} style={{ color: 'rgba(255,255,255,0.25)' }} />
        </div>
      )}
    </div>
  );
}

// ─── FoodCard ─────────────────────────────────────────────────────────────────

function FoodCard({ food, onLog }: { food: Food; onLog: (food: Food) => void }) {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <>
      <div className="glass rounded-2xl overflow-hidden card-hover" style={{ border: '1px solid rgba(24,184,154,0.1)' }}>
        <FoodImage food={food} />

        <div className="p-4">
          <h3 className="font-display font-semibold text-sm mb-0.5 leading-tight truncate" style={{ color: '#E8F2ED' }}>
            {food.food_name}
          </h3>
          <p className="text-xs mb-3 truncate" style={{ color: '#5A7A68' }}>
            {food.food_category} · {food.serving_size}
          </p>

          {/* Macros row */}
          <div className="flex gap-2 mb-3">
            {[
              { label: 'P', val: food.protein, color: '#18B89A' },
              { label: 'C', val: food.carbs,   color: '#8FD081' },
              { label: 'F', val: food.fats,    color: '#EBD5A5' },
            ].map(m => (
              <div key={m.label} className="flex-1 rounded-lg py-1 text-center"
                style={{ background: `${m.color}12`, border: `1px solid ${m.color}20` }}>
                <span className="text-xs font-mono font-semibold" style={{ color: m.color }}>
                  {m.val?.toFixed(0)}g
                </span>
                <span className="block" style={{ color: '#5A7A68', fontSize: 9 }}>{m.label}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowDetail(true)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-all hover:scale-[1.02]"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#9AB8A8' }}
            >
              <Info size={12} /> Details
            </button>
            <button
              onClick={() => onLog(food)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-all hover:scale-[1.02]"
              style={{ background: 'rgba(24,184,154,0.12)', border: '1px solid rgba(24,184,154,0.22)', color: '#18B89A' }}
            >
              <Plus size={12} /> Log
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal open={showDetail} onClose={() => setShowDetail(false)} title={food.food_name}>
        <div className="space-y-4">
          {/* Image in modal */}
          <div className="rounded-xl overflow-hidden" style={{ height: 140 }}>
            <FoodImage food={food} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Calories',       val: `${Math.round(food.calories)} kcal`, color: '#18B89A' },
              { label: 'Serving Size',   val: food.serving_size,                   color: '#9AB8A8' },
              { label: 'Protein',        val: `${food.protein?.toFixed(1)}g`,       color: '#18B89A' },
              { label: 'Carbs',          val: `${food.carbs?.toFixed(1)}g`,         color: '#8FD081' },
              { label: 'Fats',           val: `${food.fats?.toFixed(1)}g`,          color: '#EBD5A5' },
              { label: 'Fiber',          val: `${food.fiber?.toFixed(1)}g`,         color: '#7AB8E8' },
              { label: 'Diet Type',      val: food.diet_type,                       color: '#8FD081' },
              { label: 'Meal Type',      val: food.meal_type,                       color: '#9AB8A8' },
            ].map(item => (
              <div key={item.label} className="rounded-xl p-3"
                style={{ background: 'rgba(24,184,154,0.04)', border: '1px solid rgba(24,184,154,0.08)' }}>
                <p className="text-xs mb-1" style={{ color: '#5A7A68' }}>{item.label}</p>
                <p className="text-sm font-semibold font-mono" style={{ color: item.color }}>{item.val}</p>
              </div>
            ))}
          </div>
          {food.health_benefits && (
            <div className="rounded-xl p-3"
              style={{ background: 'rgba(143,208,129,0.05)', border: '1px solid rgba(143,208,129,0.12)' }}>
              <p className="text-xs font-medium mb-1" style={{ color: '#8FD081' }}>Health Benefits</p>
              <p className="text-xs leading-relaxed" style={{ color: '#9AB8A8' }}>{food.health_benefits}</p>
            </div>
          )}
          <button
            onClick={() => { setShowDetail(false); onLog(food); }}
            className="btn-primary w-full justify-center text-sm"
          >
            <Plus size={15} /> Log This Food
          </button>
        </div>
      </Modal>
    </>
  );
}

// ─── LogMealModal ─────────────────────────────────────────────────────────────

function LogMealModal({
  food, open, onClose, onLogged,
}: {
  food: Food | null; open: boolean; onClose: () => void; onLogged: () => void;
}) {
  const { toast } = useApp();
  const [quantity, setQuantity] = useState(100);
  const [mealType, setMealType] = useState<typeof MEAL_TYPES[number]>('Lunch');
  const [loading, setLoading] = useState(false);

  // Reset quantity to the food's serving weight when food changes
  useEffect(() => {
    if (food?.serving_size) {
      const w = parseServingWeight(food.serving_size);
      setQuantity(Math.round(w));
    } else {
      setQuantity(100);
    }
  }, [food]);

  const estimatedCals = food
    ? Math.round((food.calories / parseServingWeight(food.serving_size)) * quantity)
    : 0;
  const estimatedProtein = food
    ? ((food.protein / parseServingWeight(food.serving_size)) * quantity).toFixed(1)
    : '0';

  const handleLog = async () => {
    if (!food) return;
    setLoading(true);
    const payload: NutritionLogPayload = {
      food_name: food.food_name,
      quantity,
      meal_type: mealType,
      meal_time: new Date().toISOString(),
    };
    const res = await api.post('/api/v1/nutrition-log', payload);
    setLoading(false);
    if (res.error) {
      toast('error', 'Failed to log meal', res.error);
    } else {
      toast('success', 'Meal logged! 🎉', `${food.food_name} added to ${mealType}`);
      onLogged();
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={`Log ${food?.food_name || 'Meal'}`}>
      <div className="space-y-4">
        {food && (
          <div className="rounded-xl overflow-hidden" style={{ height: 100 }}>
            <FoodImage food={food} />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: '#9AB8A8' }}>
            Quantity (grams / ml)
          </label>
          <input
            type="number"
            value={quantity}
            onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
            className="input-glass"
            min={1}
          />
          {food && (
            <p className="text-xs mt-1" style={{ color: '#5A7A68' }}>
              Serving size: {food.serving_size}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: '#9AB8A8' }}>Meal Type</label>
          <div className="grid grid-cols-4 gap-2">
            {MEAL_TYPES.map(mt => (
              <button
                key={mt}
                onClick={() => setMealType(mt)}
                className="py-2 rounded-xl text-xs font-medium transition-all"
                style={{
                  background: mealType === mt ? 'rgba(24,184,154,0.15)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${mealType === mt ? 'rgba(24,184,154,0.35)' : 'rgba(255,255,255,0.08)'}`,
                  color: mealType === mt ? '#18B89A' : '#9AB8A8',
                }}
              >
                {mt}
              </button>
            ))}
          </div>
        </div>
        {food && (
          <div className="rounded-xl p-3" style={{ background: 'rgba(24,184,154,0.05)', border: '1px solid rgba(24,184,154,0.1)' }}>
            <p className="text-xs" style={{ color: '#5A7A68' }}>Estimated for {quantity}g/ml:</p>
            <p className="text-sm font-semibold" style={{ color: '#18B89A' }}>
              ~{estimatedCals} kcal · {estimatedProtein}g protein
            </p>
          </div>
        )}
        <button
          onClick={handleLog}
          disabled={loading}
          className="btn-primary w-full justify-center"
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Logging…' : 'Log Meal'}
        </button>
      </div>
    </Modal>
  );
}

// ─── NutritionPage ────────────────────────────────────────────────────────────

export function NutritionPage() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  const [dietFilter, setDietFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [dietTypes, setDietTypes] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [logTarget, setLogTarget] = useState<Food | null>(null);
  const [macros, setMacros] = useState<MacroAnalysis | null>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const { toast } = useApp();

  // ── Dynamic filter lists from DB ──────────────────────────────────────────
  useEffect(() => {
    api.get<string[]>('/api/v1/foods/diet-types').then(r => {
      if (r.data) setDietTypes(['All', ...r.data]);
    });
    api.get<string[]>('/api/v1/foods/categories').then(r => {
      if (r.data) setCategories(['All', ...r.data]);
    });
  }, []);

  // ── Fetch foods (first page) ───────────────────────────────────────────────
  const fetchFoods = useCallback(async (q: string, diet: string, cat: string, pageNum: number, append = false) => {
    if (pageNum === 1) setLoading(true); else setLoadingMore(true);

    const params = new URLSearchParams({ page: String(pageNum), limit: String(PAGE_SIZE) });
    if (q.trim()) params.set('q', q.trim());
    if (diet !== 'All') params.set('diet_type', diet);
    if (cat !== 'All') params.set('food_category', cat);

    const res = await api.get<Food[]>(`/api/v1/foods?${params}`);
    const data = Array.isArray(res.data) ? res.data : [];

    setFoods(prev => append ? [...prev, ...data] : data);
    setHasMore(data.length === PAGE_SIZE);
    if (pageNum === 1) setLoading(false); else setLoadingMore(false);
  }, []);

  // ── Debounced re-fetch on filter changes ──────────────────────────────────
  useEffect(() => {
    setPage(1);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => fetchFoods(search, dietFilter, categoryFilter, 1), 300);
    return () => clearTimeout(searchTimer.current);
  }, [search, dietFilter, categoryFilter, fetchFoods]);

  // ── Load macros ────────────────────────────────────────────────────────────
  const refreshMacros = useCallback(() => {
    api.get<MacroAnalysis>('/api/v1/macro-analysis').then(r => {
      if (r.data) setMacros(r.data);
    });
  }, []);

  useEffect(() => { refreshMacros(); }, [refreshMacros]);

  // ── WebSocket: refresh macros when a new log is added ─────────────────────
  useEffect(() => {
    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket(`${WS_BASE}/ws/live`);
      ws.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data.event === 'nutrition_log_added') refreshMacros();
        } catch { /* ignore */ }
      };
    } catch { /* WS unavailable */ }
    return () => ws?.close();
  }, [refreshMacros]);

  // ── Load More ─────────────────────────────────────────────────────────────
  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchFoods(search, dietFilter, categoryFilter, nextPage, true);
  };

  const resetFilters = () => {
    setSearch('');
    setDietFilter('All');
    setCategoryFilter('All');
  };

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-0">
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-display font-bold text-2xl mb-1" style={{ color: '#E8F2ED' }}>
          Nutrition Database
        </h2>
        <p className="text-sm" style={{ color: '#9AB8A8' }}>
          {loading ? 'Loading…' : `Browsing real foods from dataset · ${PAGE_SIZE * page}+ loaded`}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ── Main content ── */}
        <div className="flex-1 min-w-0">

          {/* Search bar */}
          <div className="relative mb-3">
            <Search size={17} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#5A7A68', pointerEvents: 'none' }} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search foods, categories, benefits…"
              className="input-glass"
              style={{ paddingLeft: 42, paddingRight: search ? 40 : 16 }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#5A7A68', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Diet Type filter pills */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-2 pb-1">
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs flex-shrink-0" style={{ color: '#5A7A68' }}>
              <Filter size={12} /> Diet:
            </div>
            {dietTypes.map(f => (
              <button
                key={f}
                onClick={() => setDietFilter(f)}
                className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all capitalize"
                style={{
                  background: dietFilter === f ? 'rgba(24,184,154,0.15)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${dietFilter === f ? 'rgba(24,184,154,0.35)' : 'rgba(255,255,255,0.08)'}`,
                  color: dietFilter === f ? '#18B89A' : '#9AB8A8',
                }}
              >
                {f.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Category filter pills */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-1">
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs flex-shrink-0" style={{ color: '#5A7A68' }}>
              <Filter size={12} /> Category:
            </div>
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setCategoryFilter(c)}
                className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all"
                style={{
                  background: categoryFilter === c ? 'rgba(143,208,129,0.15)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${categoryFilter === c ? 'rgba(143,208,129,0.35)' : 'rgba(255,255,255,0.08)'}`,
                  color: categoryFilter === c ? '#8FD081' : '#9AB8A8',
                }}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Food grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : foods.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No foods found"
              description="Try a different search term or clear filters."
              action={{ label: 'Clear All Filters', onClick: resetFilters }}
            />
          ) : (
            <>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {foods.map(food => (
                  <FoodCard key={food.id} food={food} onLog={f => setLogTarget(f)} />
                ))}
              </div>

              {/* Load More */}
              {hasMore && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-[1.02]"
                    style={{
                      background: 'rgba(24,184,154,0.1)',
                      border: '1px solid rgba(24,184,154,0.2)',
                      color: '#18B89A',
                      opacity: loadingMore ? 0.6 : 1,
                    }}
                  >
                    {loadingMore ? (
                      <span>Loading…</span>
                    ) : (
                      <><ChevronDown size={15} /> Load More Foods</>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Macro sidebar ── */}
        {macros && (
          <div className="lg:w-64 xl:w-72 flex-shrink-0 space-y-4">
            <div className="glass rounded-2xl p-5 sticky top-20" style={{ border: '1px solid rgba(24,184,154,0.12)' }}>
              <h3 className="font-display font-semibold mb-4 text-sm" style={{ color: '#E8F2ED' }}>Today's Macros</h3>
              <div className="text-center mb-4">
                <span className="font-display font-bold text-3xl" style={{ color: '#18B89A' }}>
                  {macros.calories?.toFixed(0) || 0}
                </span>
                <span className="text-xs block mt-1" style={{ color: '#9AB8A8' }}>
                  / {macros.calories_goal || 2200} kcal
                </span>
              </div>
              {[
                { label: 'Protein', val: macros.protein, goal: macros.protein_goal, color: '#18B89A', unit: 'g' },
                { label: 'Carbs',   val: macros.carbs,   goal: macros.carbs_goal,   color: '#8FD081', unit: 'g' },
                { label: 'Fats',    val: macros.fats,    goal: macros.fats_goal,    color: '#EBD5A5', unit: 'g' },
              ].map(m => {
                const pct = m.goal ? Math.min(100, (m.val / m.goal) * 100) : 0;
                return (
                  <div key={m.label} className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs" style={{ color: '#9AB8A8' }}>{m.label}</span>
                      <span className="text-xs font-mono" style={{ color: m.color }}>
                        {m.val?.toFixed(1)}{m.unit}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${pct}%`, background: m.color }}
                      />
                    </div>
                    {m.goal && (
                      <p className="text-xs mt-0.5" style={{ color: '#5A7A68' }}>Goal: {m.goal}g</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <LogMealModal
        food={logTarget}
        open={!!logTarget}
        onClose={() => setLogTarget(null)}
        onLogged={() => {
          refreshMacros();
          toast('success', 'Nutrition updated', 'Dashboard reflects new log');
        }}
      />
    </div>
  );
}
