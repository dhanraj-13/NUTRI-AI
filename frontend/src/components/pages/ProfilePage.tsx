import { useState, useEffect } from 'react';
import { Camera, Edit3, Save, X, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { api } from '../../lib/api';
import type { UserProfile, UserPreferences } from '../../types';

export function ProfilePage() {
  const { state, toast } = useApp();
  const [profile, setProfile] = useState<UserProfile>({});
  const [prefs, setPrefs] = useState<UserPreferences>({});
  const [editingProfile, setEditingProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const [profileRes, prefsRes] = await Promise.all([
        api.get<UserProfile>('/api/v1/profile'),
        api.get<UserPreferences>('/api/v1/user/preferences'),
      ]);
      if (profileRes.data) setProfile(profileRes.data);
      if (prefsRes.data) setPrefs(prefsRes.data);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const saveProfile = async () => {
    setSaving(true);
    const res = await api.put('/api/v1/profile', profile);
    setSaving(false);
    if (res.error) toast('error', 'Save failed', res.error);
    else { toast('success', 'Profile updated!'); setEditingProfile(false); }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    const res = await api.uploadFile('/api/v1/upload/avatar', file);
    setAvatarUploading(false);
    if (res.error) toast('error', 'Upload failed', res.error);
    else toast('success', 'Avatar updated!');
  };

  const initial = state.user?.name?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-0 max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="font-display font-bold text-2xl mb-1" style={{ color: '#E8F2ED' }}>Profile</h2>
        <p className="text-sm" style={{ color: '#9AB8A8' }}>Manage your personal information and preferences.</p>
      </div>

      {/* Profile Header */}
      <div className="glass rounded-2xl p-6 flex items-center gap-6" style={{ border: '1px solid rgba(24,184,154,0.12)' }}>
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center font-display font-bold text-3xl flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#18B89A,#0E9B81)', color: '#fff', boxShadow: '0 0 30px rgba(24,184,154,0.3)' }}>
            {avatarUploading ? '...' : initial}
          </div>
          <label className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer transition-all hover:scale-110"
            style={{ background: 'rgba(24,184,154,0.2)', border: '1px solid rgba(24,184,154,0.3)', color: '#18B89A' }}>
            <Camera size={14} />
            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
          </label>
        </div>
        <div className="flex-1">
          <h3 className="font-display font-bold text-xl" style={{ color: '#E8F2ED' }}>{state.user?.name}</h3>
          <p className="text-sm" style={{ color: '#9AB8A8' }}>{state.user?.email}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{ background: 'rgba(24,184,154,0.1)', border: '1px solid rgba(24,184,154,0.2)', color: '#18B89A' }}>
              Pro Member
            </span>
            {prefs.diet_preference && (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                style={{ background: 'rgba(143,208,129,0.1)', border: '1px solid rgba(143,208,129,0.2)', color: '#8FD081' }}>
                {prefs.diet_preference}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="glass rounded-2xl p-6" style={{ border: '1px solid rgba(24,184,154,0.1)' }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-semibold" style={{ color: '#E8F2ED' }}>Personal Information</h3>
          {!editingProfile ? (
            <button onClick={() => setEditingProfile(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all hover:scale-[1.02]"
              style={{ background: 'rgba(24,184,154,0.08)', border: '1px solid rgba(24,184,154,0.18)', color: '#18B89A' }}>
              <Edit3 size={12} /> Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => setEditingProfile(false)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium"
                style={{ background: 'rgba(255,255,255,0.04)', color: '#9AB8A8' }}>
                <X size={12} /> Cancel
              </button>
              <button onClick={saveProfile} disabled={saving}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
                style={{ background: 'rgba(24,184,154,0.15)', border: '1px solid rgba(24,184,154,0.3)', color: '#18B89A' }}>
                <Save size={12} /> {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3,4].map(i => <div key={i} className="h-12 rounded-xl animate-shimmer" style={{ background: 'rgba(255,255,255,0.03)' }} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Height', key: 'height_cm', unit: 'cm', type: 'number' },
              { label: 'Weight', key: 'weight_kg', unit: 'kg', type: 'number' },
              { label: 'Age', key: 'age', unit: 'years', type: 'number' },
              { label: 'Gender', key: 'gender', unit: '', type: 'select' },
            ].map(field => (
              <div key={field.key} className="rounded-xl p-3" style={{ background: 'rgba(24,184,154,0.03)', border: '1px solid rgba(24,184,154,0.07)' }}>
                <p className="text-xs mb-1.5" style={{ color: '#5A7A68' }}>{field.label}</p>
                {editingProfile ? (
                  field.type === 'select' ? (
                    <select
                      value={(profile[field.key as keyof UserProfile] as string) || ''}
                      onChange={e => setProfile(p => ({ ...p, [field.key]: e.target.value }))}
                      className="input-glass" style={{ padding: '6px 10px', fontSize: 13 }}>
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      value={(profile[field.key as keyof UserProfile] as number | string) || ''}
                      onChange={e => setProfile(p => ({ ...p, [field.key]: field.type === 'number' ? Number(e.target.value) : e.target.value }))}
                      className="input-glass" style={{ padding: '6px 10px', fontSize: 13 }} />
                  )
                ) : (
                  <p className="font-semibold font-mono text-sm" style={{ color: '#E8F2ED' }}>
                    {(profile[field.key as keyof UserProfile] as string | number) || <span style={{ color: '#5A7A68' }}>Not set</span>}
                    {field.unit && profile[field.key as keyof UserProfile] && ` ${field.unit}`}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preferences */}
      <div className="glass rounded-2xl p-6" style={{ border: '1px solid rgba(24,184,154,0.1)' }}>
        <h3 className="font-display font-semibold mb-5" style={{ color: '#E8F2ED' }}>Wellness Preferences</h3>
        <div className="space-y-4">
          {[
            { label: 'Primary Goal', val: prefs.goal, color: '#18B89A' },
            { label: 'Activity Level', val: prefs.activity_level, color: '#8FD081' },
            { label: 'Diet Type', val: prefs.diet_preference, color: '#EBD5A5' },
            { label: 'Hydration Goal', val: prefs.hydration_goal ? `${prefs.hydration_goal}ml/day` : null, color: '#7AB8E8' },
            { label: 'Productivity Goal', val: prefs.productivity_goal, color: '#18B89A' },
          ].map(pref => (
            <div key={pref.label} className="flex items-center justify-between py-3"
              style={{ borderBottom: '1px solid rgba(24,184,154,0.06)' }}>
              <span className="text-sm" style={{ color: '#9AB8A8' }}>{pref.label}</span>
              {pref.val ? (
                <span className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ background: `${pref.color}12`, border: `1px solid ${pref.color}25`, color: pref.color }}>
                  {pref.val}
                </span>
              ) : (
                <span className="text-xs" style={{ color: '#5A7A68' }}>Not set</span>
              )}
            </div>
          ))}
          {prefs.allergies && prefs.allergies.length > 0 && (
            <div className="flex items-center justify-between py-3">
              <span className="text-sm" style={{ color: '#9AB8A8' }}>Allergies</span>
              <div className="flex gap-1 flex-wrap justify-end">
                {prefs.allergies.map(a => (
                  <span key={a} className="px-2 py-0.5 rounded-full text-xs"
                    style={{ background: 'rgba(224,112,112,0.1)', border: '1px solid rgba(224,112,112,0.2)', color: '#E07070' }}>
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Profile */}
      <div className="glass rounded-2xl p-6 animate-glow" style={{ border: '1px solid rgba(24,184,154,0.18)' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(24,184,154,0.1)', border: '1px solid rgba(24,184,154,0.2)' }}>
            <User size={16} style={{ color: '#18B89A' }} />
          </div>
          <div>
            <h3 className="font-display font-semibold text-sm" style={{ color: '#E8F2ED' }}>AI Nutrition Profile</h3>
            <p className="text-xs" style={{ color: '#5A7A68' }}>What your AI coach knows about you</p>
          </div>
        </div>
        <div className="p-3 rounded-xl text-sm leading-relaxed" style={{ background: 'rgba(24,184,154,0.04)', color: '#9AB8A8' }}>
          Your AI coach is personalized to your{' '}
          <span style={{ color: '#18B89A' }}>{prefs.goal || 'wellness'}</span> goal with a{' '}
          <span style={{ color: '#8FD081' }}>{prefs.diet_preference || 'flexible'}</span> diet and{' '}
          <span style={{ color: '#EBD5A5' }}>{prefs.activity_level || 'moderate'}</span> activity level.
          Daily hydration target is{' '}
          <span style={{ color: '#7AB8E8' }}>{prefs.hydration_goal || 2500}ml</span>.
        </div>
      </div>
    </div>
  );
}
