import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Edit3, Clock, Flame, UtensilsCrossed } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { api } from '../../lib/api';
import { EmptyState } from '../shared/EmptyState';
import { ListSkeleton } from '../shared/LoadingSkeleton';
import { Modal } from '../shared/Modal';
import type { NutritionLog } from '../../types';

type MealTab = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
const TABS: MealTab[] = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

const MEAL_EMOJIS: Record<MealTab, string> = {
  Breakfast: '🌅',
  Lunch: '☀️',
  Dinner: '🌙',
  Snack: '🍎',
};

const MEAL_COLORS: Record<MealTab, string> = {
  Breakfast: '#EBD5A5',
  Lunch: '#18B89A',
  Dinner: '#7AB8E8',
  Snack: '#8FD081',
};

export function MealsPage() {
  const { toast, navigate } = useApp();
  const [meals, setMeals] = useState<NutritionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<MealTab>('Breakfast');
  const [deleteTarget, setDeleteTarget] = useState<NutritionLog | null>(null);
  const [editTarget, setEditTarget] = useState<NutritionLog | null>(null);
  const [editQty, setEditQty] = useState(100);

  const fetchMeals = useCallback(async () => {
    setLoading(true);
    const res = await api.get<NutritionLog[]>('/api/v1/nutrition-log');
    setMeals(Array.isArray(res.data) ? res.data : []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchMeals(); }, [fetchMeals]);

  const deleteMeal = async () => {
    if (!deleteTarget) return;
    const res = await api.delete(`/api/v1/nutrition-log/${deleteTarget.id}`);
    if (res.error) {
      toast('error', 'Delete failed', res.error);
    } else {
      toast('success', 'Meal removed');
      setDeleteTarget(null);
      fetchMeals();
    }
  };

  const editMeal = async () => {
    if (!editTarget) return;
    const res = await api.put(`/api/v1/nutrition-log/${editTarget.id}`, {
      ...editTarget,
      quantity: editQty,
    });
    if (res.error) {
      toast('error', 'Update failed', res.error);
    } else {
      toast('success', 'Meal updated');
      setEditTarget(null);
      fetchMeals();
    }
  };

  const tabMeals = meals.filter(m => m.meal_type === activeTab);
  const tabCalories = tabMeals.reduce((s, m) => s + (m.calories || 0), 0);
  const totalCalories = meals.reduce((s, m) => s + (m.calories || 0), 0);

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-0">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-bold text-2xl mb-1" style={{ color: '#E8F2ED' }}>My Meals</h2>
          <p className="text-sm" style={{ color: '#9AB8A8' }}>
            Total today: <span style={{ color: '#18B89A' }}>{totalCalories} kcal</span>
          </p>
        </div>
        <button onClick={() => navigate('nutrition')} className="btn-primary text-sm" style={{ padding: '10px 20px' }}>
          <Plus size={15} /> Add Food
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-2xl mb-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(24,184,154,0.08)' }}>
        {TABS.map(tab => {
          const isActive = activeTab === tab;
          const color = MEAL_COLORS[tab];
          return (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                background: isActive ? `${color}12` : 'transparent',
                border: `1px solid ${isActive ? `${color}25` : 'transparent'}`,
                color: isActive ? color : '#5A7A68',
              }}>
              <span className="text-base">{MEAL_EMOJIS[tab]}</span>
              <span className="hidden sm:inline">{tab}</span>
            </button>
          );
        })}
      </div>

      {/* Tab header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{MEAL_EMOJIS[activeTab]}</span>
          <div>
            <h3 className="font-display font-semibold" style={{ color: '#E8F2ED' }}>{activeTab}</h3>
            <p className="text-xs" style={{ color: '#5A7A68' }}>
              {tabMeals.length} item{tabMeals.length !== 1 ? 's' : ''} · {Math.round(tabCalories)} kcal
            </p>
          </div>
        </div>
        <button onClick={() => navigate('nutrition')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all hover:scale-[1.02]"
          style={{ background: 'rgba(24,184,154,0.08)', border: '1px solid rgba(24,184,154,0.18)', color: '#18B89A' }}>
          <Plus size={12} /> Add {activeTab}
        </button>
      </div>

      {/* Meal list */}
      {loading ? <ListSkeleton count={3} /> : tabMeals.length === 0 ? (
        <EmptyState
          icon={UtensilsCrossed}
          title={`No ${activeTab} logged`}
          description={`Start tracking your ${activeTab.toLowerCase()} by searching for foods.`}
          action={{ label: `Log ${activeTab}`, onClick: () => navigate('nutrition') }}
        />
      ) : (
        <div className="space-y-3">
          {tabMeals.map(meal => (
            <div key={meal.id} className="glass glass-hover rounded-2xl p-4 flex items-center gap-4"
              style={{ border: `1px solid ${MEAL_COLORS[activeTab]}15` }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${MEAL_COLORS[activeTab]}10`, border: `1px solid ${MEAL_COLORS[activeTab]}20` }}>
                <Flame size={18} style={{ color: MEAL_COLORS[activeTab] }} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold truncate" style={{ color: '#E8F2ED' }}>{meal.food_name}</h4>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs" style={{ color: '#5A7A68' }}>{meal.quantity}g</span>
                  {meal.protein && <span className="text-xs" style={{ color: '#9AB8A8' }}>P: {meal.protein?.toFixed(1)}g</span>}
                  {meal.carbs && <span className="text-xs" style={{ color: '#9AB8A8' }}>C: {meal.carbs?.toFixed(1)}g</span>}
                  {meal.fats && <span className="text-xs" style={{ color: '#9AB8A8' }}>F: {meal.fats?.toFixed(1)}g</span>}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold font-mono" style={{ color: MEAL_COLORS[activeTab] }}>
                  {meal.calories ? `${Math.round(meal.calories)} kcal` : `${meal.quantity}g`}
                </p>
                <div className="flex items-center gap-1 justify-end mt-1">
                  <Clock size={10} style={{ color: '#5A7A68' }} />
                  <p className="text-xs" style={{ color: '#5A7A68' }}>
                    {new Date(meal.meal_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 flex-shrink-0">
                <button onClick={() => { setEditTarget(meal); setEditQty(meal.quantity); }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: 'rgba(24,184,154,0.08)', color: '#18B89A' }}>
                  <Edit3 size={13} />
                </button>
                <button onClick={() => setDeleteTarget(meal)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: 'rgba(224,112,112,0.08)', color: '#E07070' }}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Daily summary */}
      {meals.length > 0 && (
        <div className="mt-6 glass rounded-2xl p-5" style={{ border: '1px solid rgba(24,184,154,0.1)' }}>
          <h3 className="font-display font-semibold text-sm mb-4" style={{ color: '#E8F2ED' }}>Daily Summary</h3>
          <div className="grid grid-cols-4 gap-3">
            {TABS.map(tab => {
              const mls = meals.filter(m => m.meal_type === tab);
              const cal = mls.reduce((s, m) => s + (m.calories || 0), 0);
              return (
                <div key={tab} className="text-center">
                  <span className="text-xl">{MEAL_EMOJIS[tab]}</span>
                  <p className="text-xs font-semibold mt-1" style={{ color: MEAL_COLORS[tab] }}>{Math.round(cal)} kcal</p>
                  <p className="text-xs" style={{ color: '#5A7A68' }}>{tab}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(24,184,154,0.06)' }}>
            <div className="flex justify-between mb-1">
              <span className="text-xs" style={{ color: '#9AB8A8' }}>Total Today</span>
              <span className="text-xs font-mono font-semibold" style={{ color: '#18B89A' }}>
                {Math.round(totalCalories)} / 2200 kcal
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(24,184,154,0.1)' }}>
              <div className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(100, (totalCalories / 2200) * 100)}%`, background: 'linear-gradient(90deg,#18B89A,#8FD081)' }} />
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Remove Meal">
        <p className="text-sm mb-6" style={{ color: '#9AB8A8' }}>
          Are you sure you want to remove <strong style={{ color: '#E8F2ED' }}>{deleteTarget?.food_name}</strong> from your log?
        </p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteTarget(null)} className="btn-ghost flex-1 justify-center text-sm">Cancel</button>
          <button onClick={deleteMeal}
            className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
            style={{ background: 'rgba(224,112,112,0.15)', border: '1px solid rgba(224,112,112,0.3)', color: '#E07070' }}>
            Remove
          </button>
        </div>
      </Modal>

      {/* Edit modal */}
      <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title={`Edit ${editTarget?.food_name}`}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#9AB8A8' }}>Quantity (grams)</label>
            <input type="number" value={editQty} onChange={e => setEditQty(Number(e.target.value))}
              className="input-glass" min={1} />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setEditTarget(null)} className="btn-ghost flex-1 justify-center text-sm">Cancel</button>
            <button onClick={editMeal} className="btn-primary flex-1 justify-center text-sm">Save Changes</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
