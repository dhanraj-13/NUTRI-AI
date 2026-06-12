import { useState, useEffect, useCallback } from 'react';
import { Bell, Shield, Info, CheckCircle, Server, Cpu, Database, Wifi, Activity, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { api } from '../../lib/api';
import type { Reminders, SystemHealth, RAGHealth, CacheHealth, WorkerHealth, UploadResult } from '../../types';

// ============================================================
// SETTINGS PAGE
// ============================================================
export function SettingsPage() {
  const { toast } = useApp();
  const [reminders, setReminders] = useState<Reminders>({
    meal_reminders: true,
    hydration_reminders: true,
    ai_notifications: true,
  });
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState<string>('Checking...');

  useEffect(() => {
    api.get<Reminders>('/api/v1/reminders').then(r => {
      if (r.data) setReminders(r.data);
      setLoading(false);
    });
    api.get('/health').then(r => {
      setBackendStatus(r.status === 200 ? 'Online ✓' : 'Offline ✗');
    }).catch(() => setBackendStatus('Offline ✗'));
  }, []);

  const updateReminder = async (key: keyof Reminders, val: boolean) => {
    const updated = { ...reminders, [key]: val };
    setReminders(updated);
    const res = await api.put('/api/v1/reminders', updated);
    if (res.error) toast('error', 'Failed to update', res.error);
    else toast('success', 'Settings saved');
  };

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <button onClick={() => onChange(!checked)} className={`toggle ${checked ? 'active' : ''}`}>
      <div className="toggle-thumb" />
    </button>
  );

  const sections = [
    {
      title: 'Notifications & Reminders',
      icon: Bell,
      items: [
        { label: 'Meal Reminders', desc: 'Get reminded to log your meals', key: 'meal_reminders' as keyof Reminders },
        { label: 'Hydration Reminders', desc: 'Stay on track with water intake', key: 'hydration_reminders' as keyof Reminders },
        { label: 'AI Notifications', desc: 'Receive personalized AI insights', key: 'ai_notifications' as keyof Reminders },
      ],
    },
  ];

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-0 max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="font-display font-bold text-2xl mb-1" style={{ color: '#E8F2ED' }}>Settings</h2>
        <p className="text-sm" style={{ color: '#9AB8A8' }}>Customize your NUTRI AI experience.</p>
      </div>

      {/* Reminders */}
      {sections.map(section => {
        const Icon = section.icon;
        return (
          <div key={section.title} className="glass rounded-2xl p-6" style={{ border: '1px solid rgba(24,184,154,0.1)' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(24,184,154,0.1)', border: '1px solid rgba(24,184,154,0.2)' }}>
                <Icon size={16} style={{ color: '#18B89A' }} />
              </div>
              <h3 className="font-display font-semibold" style={{ color: '#E8F2ED' }}>{section.title}</h3>
            </div>
            <div className="space-y-4">
              {section.items.map(item => (
                <div key={item.key} className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid rgba(24,184,154,0.06)' }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#E8F2ED' }}>{item.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#5A7A68' }}>{item.desc}</p>
                  </div>
                  {loading ? (
                    <div className="w-11 h-6 rounded-full animate-shimmer" style={{ background: 'rgba(255,255,255,0.05)' }} />
                  ) : (
                    <Toggle checked={reminders[item.key]} onChange={v => updateReminder(item.key, v)} />
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Appearance */}
      <div className="glass rounded-2xl p-6" style={{ border: '1px solid rgba(24,184,154,0.1)' }}>
        <h3 className="font-display font-semibold mb-4" style={{ color: '#E8F2ED' }}>Appearance</h3>
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-medium" style={{ color: '#E8F2ED' }}>Theme</p>
            <p className="text-xs mt-0.5" style={{ color: '#5A7A68' }}>Optimized for dark mode performance</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{ background: 'rgba(24,184,154,0.08)', border: '1px solid rgba(24,184,154,0.15)', color: '#18B89A' }}>
            🌙 Dark
          </span>
        </div>
      </div>

      {/* Privacy */}
      <div className="glass rounded-2xl p-6" style={{ border: '1px solid rgba(24,184,154,0.1)' }}>
        <div className="flex items-center gap-3 mb-4">
          <Shield size={16} style={{ color: '#8FD081' }} />
          <h3 className="font-display font-semibold" style={{ color: '#E8F2ED' }}>Privacy & Security</h3>
        </div>
        <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(143,208,129,0.05)', border: '1px solid rgba(143,208,129,0.12)', color: '#9AB8A8' }}>
          🔒 Your data stays on your local backend. No third-party cloud storage.
        </div>
      </div>

      {/* About */}
      <div className="glass rounded-2xl p-6" style={{ border: '1px solid rgba(24,184,154,0.1)' }}>
        <div className="flex items-center gap-3 mb-4">
          <Info size={16} style={{ color: '#EBD5A5' }} />
          <h3 className="font-display font-semibold" style={{ color: '#E8F2ED' }}>About</h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm" style={{ color: '#9AB8A8' }}>App Version</span>
            <span className="text-sm font-mono" style={{ color: '#18B89A' }}>1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm" style={{ color: '#9AB8A8' }}>Backend URL</span>
            <span className="text-xs font-mono" style={{ color: '#5A7A68' }}>http://127.0.0.1:8000</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm" style={{ color: '#9AB8A8' }}>Backend Status</span>
            <span className="text-sm font-mono" style={{ color: backendStatus.includes('Online') ? '#8FD081' : '#E07070' }}>
              {backendStatus}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm" style={{ color: '#9AB8A8' }}>AI Engine</span>
            <span className="text-sm" style={{ color: '#EBD5A5' }}>RAG + FAISS</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// REMINDERS PAGE
// ============================================================
export function RemindersPage() {
  const { toast } = useApp();
  const [reminders, setReminders] = useState<Reminders>({ meal_reminders: true, hydration_reminders: true, ai_notifications: true });

  useEffect(() => {
    api.get<Reminders>('/api/v1/reminders').then(r => { if (r.data) setReminders(r.data); });
  }, []);

  const save = async (updated: Reminders) => {
    setReminders(updated);
    const res = await api.put('/api/v1/reminders', updated);
    if (res.error) toast('error', 'Save failed', res.error);
    else toast('success', 'Reminders updated');
  };

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <button onClick={() => onChange(!checked)} className={`toggle ${checked ? 'active' : ''}`}>
      <div className="toggle-thumb" />
    </button>
  );

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-0 max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="font-display font-bold text-2xl mb-1" style={{ color: '#E8F2ED' }}>Reminders</h2>
        <p className="text-sm" style={{ color: '#9AB8A8' }}>Manage your notification preferences.</p>
      </div>
      <div className="glass rounded-2xl p-6 space-y-4" style={{ border: '1px solid rgba(24,184,154,0.1)' }}>
        {[
          { key: 'meal_reminders' as keyof Reminders, label: '🍽️ Meal Reminders', desc: 'Get reminded to log breakfast, lunch, dinner, and snacks.' },
          { key: 'hydration_reminders' as keyof Reminders, label: '💧 Hydration Reminders', desc: 'Stay on track with your daily water intake goal.' },
          { key: 'ai_notifications' as keyof Reminders, label: '🤖 AI Notifications', desc: 'Receive personalized insights and recommendations from your AI coach.' },
        ].map(item => (
          <div key={item.key} className="flex items-center justify-between p-4 rounded-xl"
            style={{ background: 'rgba(24,184,154,0.03)', border: '1px solid rgba(24,184,154,0.07)' }}>
            <div>
              <p className="text-sm font-medium" style={{ color: '#E8F2ED' }}>{item.label}</p>
              <p className="text-xs mt-0.5" style={{ color: '#5A7A68' }}>{item.desc}</p>
            </div>
            <Toggle checked={reminders[item.key]} onChange={v => save({ ...reminders, [item.key]: v })} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// UPLOADS PAGE
// ============================================================
export function UploadsPage() {
  const { toast } = useApp();
  const [uploads, setUploads] = useState<{ path: string; result: UploadResult }[]>([]);
  const [dragging, setDragging] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);

  const handleUpload = async (file: File, type: 'image' | 'meal' | 'avatar') => {
    setUploading(type);
    const res = await api.uploadFile<UploadResult>(`/api/v1/upload/${type}`, file);
    setUploading(null);
    if (res.error || !res.data) {
      toast('error', 'Upload failed', res.error || 'Unknown error');
    } else {
      toast('success', `${type} uploaded!`, `${res.data.filename} (${(res.data.bytes / 1024).toFixed(1)}KB)`);
      setUploads(prev => [...prev, { path: type, result: res.data! }]);
    }
  };

  const UploadZone = ({ type, label, emoji }: { type: 'image' | 'meal' | 'avatar'; label: string; emoji: string }) => (
    <div
      className="glass rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all"
      style={{
        border: `2px dashed ${dragging === type ? 'rgba(24,184,154,0.4)' : 'rgba(24,184,154,0.15)'}`,
        background: dragging === type ? 'rgba(24,184,154,0.05)' : undefined,
        minHeight: 200,
      }}
      onDragOver={e => { e.preventDefault(); setDragging(type); }}
      onDragLeave={() => setDragging(null)}
      onDrop={e => {
        e.preventDefault();
        setDragging(null);
        const file = e.dataTransfer.files[0];
        if (file) handleUpload(file, type);
      }}
    >
      <div className="text-5xl mb-4">{emoji}</div>
      <p className="font-display font-semibold mb-1" style={{ color: '#E8F2ED' }}>{label}</p>
      <p className="text-xs mb-4" style={{ color: '#5A7A68' }}>Drag & drop or click to select · JPG, PNG, WebP</p>
      <label className="btn-primary text-sm cursor-pointer" style={{ padding: '10px 20px' }}>
        {uploading === type ? (
          <span className="flex gap-1"><span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" /></span>
        ) : 'Choose File'}
        <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f, type); }} />
      </label>
    </div>
  );

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-0 space-y-6">
      <div>
        <h2 className="font-display font-bold text-2xl mb-1" style={{ color: '#E8F2ED' }}>Uploads</h2>
        <p className="text-sm" style={{ color: '#9AB8A8' }}>Upload meal photos, images, and your profile avatar.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <UploadZone type="meal" label="Meal Photo" emoji="🍽️" />
        <UploadZone type="image" label="General Image" emoji="🖼️" />
        <UploadZone type="avatar" label="Profile Avatar" emoji="👤" />
      </div>

      {uploads.length > 0 && (
        <div className="glass rounded-2xl p-6" style={{ border: '1px solid rgba(24,184,154,0.1)' }}>
          <h3 className="font-display font-semibold mb-4" style={{ color: '#E8F2ED' }}>Recent Uploads</h3>
          <div className="space-y-3">
            {uploads.map((u, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl"
                style={{ background: 'rgba(143,208,129,0.05)', border: '1px solid rgba(143,208,129,0.1)' }}>
                <CheckCircle size={18} style={{ color: '#8FD081', flexShrink: 0 }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: '#E8F2ED' }}>{u.result.filename}</p>
                  <p className="text-xs" style={{ color: '#5A7A68' }}>{(u.result.bytes / 1024).toFixed(1)}KB · {u.path}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// MONITORING PAGE
// ============================================================
export function MonitoringPage() {
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [ragHealth, setRagHealth] = useState<RAGHealth | null>(null);
  const [_cacheHealth, setCacheHealth] = useState<CacheHealth | null>(null);
  const [workerHealth, setWorkerHealth] = useState<WorkerHealth | null>(null);
  const [metrics, setMetrics] = useState<string>('');
  const [ragChunks, setRagChunks] = useState<unknown[]>([]);
  const [ragSearch, setRagSearch] = useState('');
  const [ragResult, setRagResult] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [sys, ai, cache, worker, met, chunks] = await Promise.all([
      api.get<SystemHealth>('/system-health'),
      api.get<RAGHealth>('/ai-health'),
      api.get<CacheHealth>('/cache-health'),
      api.get<WorkerHealth>('/worker-health'),
      api.get<string>('/metrics'),
      api.get<unknown[]>('/api/v1/rag/chunks?limit=5'),
    ]);
    if (sys.data) setSystemHealth(sys.data);
    if (ai.data) setRagHealth(ai.data);
    if (cache.data) setCacheHealth(cache.data);
    if (worker.data) setWorkerHealth(worker.data);
    if (met.data) setMetrics(typeof met.data === 'string' ? met.data : JSON.stringify(met.data, null, 2));
    if (chunks.data) setRagChunks(Array.isArray(chunks.data) ? chunks.data : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
    let interval: ReturnType<typeof setInterval> | null = null;
    if (autoRefresh) interval = setInterval(fetchAll, 30000);
    return () => { if (interval) clearInterval(interval); };
  }, [fetchAll, autoRefresh]);

  const ragSearchTest = async () => {
    const res = await api.get<{ results?: string; answer?: string }>(`/api/v1/rag/search?q=${encodeURIComponent(ragSearch)}`);
    setRagResult(res.data?.results || res.data?.answer || JSON.stringify(res.data) || 'No results');
  };

  const ServiceCard = ({
    title, icon: Icon, status, detail
  }: { title: string; icon: typeof Server; status: 'ok' | 'warn' | 'error' | 'off'; detail: string }) => {
    const statusColors = { ok: '#8FD081', warn: '#EBD5A5', error: '#E07070', off: '#5A7A68' };
    const sc = statusColors[status];
    return (
      <div className="glass rounded-2xl p-5" style={{ border: `1px solid ${sc}20` }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${sc}12` }}>
            <Icon size={16} style={{ color: sc }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold" style={{ color: '#E8F2ED' }}>{title}</p>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold"
            style={{ background: `${sc}12`, color: sc }}>
            <div className="w-1.5 h-1.5 rounded-full animate-pulse-dot" style={{ background: sc }} />
            {status === 'ok' ? 'Online' : status === 'warn' ? 'Fallback' : status === 'off' ? 'Not Configured' : 'Offline'}
          </div>
        </div>
        <p className="text-xs" style={{ color: '#5A7A68' }}>{detail}</p>
      </div>
    );
  };

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-0 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-2xl mb-1" style={{ color: '#E8F2ED' }}>System Monitoring</h2>
          <p className="text-sm" style={{ color: '#9AB8A8' }}>Backend health, RAG intelligence, and metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setAutoRefresh(v => !v)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all"
            style={{
              background: autoRefresh ? 'rgba(24,184,154,0.12)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${autoRefresh ? 'rgba(24,184,154,0.3)' : 'rgba(255,255,255,0.08)'}`,
              color: autoRefresh ? '#18B89A' : '#9AB8A8',
            }}>
            <Activity size={12} className={autoRefresh ? 'animate-pulse' : ''} />
            Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
          </button>
          <button onClick={fetchAll} disabled={loading}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all"
            style={{ background: 'rgba(24,184,154,0.08)', border: '1px solid rgba(24,184,154,0.18)', color: '#18B89A' }}>
            Refresh Now
          </button>
        </div>
      </div>

      {/* Service status cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ServiceCard title="FastAPI Core" icon={Server} status="ok"
          detail={`Service: ${systemHealth?.service || 'AI Nutrition Agent'}`} />
        <ServiceCard title="Database" icon={Database}
          status={systemHealth?.database_fallback_mode ? 'warn' : 'ok'}
          detail={systemHealth?.database_fallback_mode ? 'Running in SQLite fallback mode' : 'PostgreSQL connected'} />
        <ServiceCard title="Redis Cache" icon={Cpu}
          status={systemHealth?.redis_configured ? 'warn' : 'off'}
          detail={systemHealth?.redis_configured ? 'Configured — using memory fallback' : 'Not configured'} />
        <ServiceCard title="AI / RAG Pipeline" icon={Brain}
          status={ragHealth?.status === 'operational' ? 'ok' : 'warn'}
          detail={`${ragHealth?.vector_count || 146} vectors · ${ragHealth?.retriever || 'faiss_fallback'}`} />
        <ServiceCard title="OpenAI" icon={Wifi}
          status={systemHealth?.openai_configured ? 'ok' : 'off'}
          detail={systemHealth?.openai_configured ? 'GPT mode active' : 'Not configured — local RAG fallback active'} />
        <ServiceCard title="Celery Workers" icon={Activity}
          status={workerHealth?.status === 'operational' ? 'ok' : 'warn'}
          detail={workerHealth?.status || 'Configured but not running as worker'} />
      </div>

      {/* RAG Debug */}
      <div className="glass rounded-2xl p-6" style={{ border: '1px solid rgba(24,184,154,0.12)' }}>
        <h3 className="font-display font-semibold mb-4" style={{ color: '#E8F2ED' }}>RAG Intelligence</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-medium mb-3" style={{ color: '#9AB8A8' }}>Test RAG Search</p>
            <div className="flex gap-2">
              <input type="text" value={ragSearch} onChange={e => setRagSearch(e.target.value)}
                placeholder="e.g. foods for focus" className="input-glass flex-1" />
              <button onClick={ragSearchTest} disabled={!ragSearch}
                className="btn-primary text-sm" style={{ padding: '10px 16px', flexShrink: 0 }}>
                Search
              </button>
            </div>
            {ragResult && (
              <div className="mt-3 p-3 rounded-xl text-xs leading-relaxed"
                style={{ background: 'rgba(24,184,154,0.05)', border: '1px solid rgba(24,184,154,0.1)', color: '#9AB8A8', maxHeight: 200, overflow: 'auto' }}>
                {ragResult}
              </div>
            )}
          </div>
          <div>
            <p className="text-xs font-medium mb-3" style={{ color: '#9AB8A8' }}>Sample Knowledge Chunks ({ragChunks.length})</p>
            <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
              {ragChunks.length === 0 ? (
                <p className="text-xs" style={{ color: '#5A7A68' }}>No chunks loaded</p>
              ) : ragChunks.map((chunk, i) => (
                <div key={i} className="p-2 rounded-lg text-xs"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(24,184,154,0.08)', color: '#9AB8A8' }}>
                  {typeof chunk === 'string' ? chunk.slice(0, 120) : JSON.stringify(chunk).slice(0, 120)}...
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Metrics */}
      {metrics && (
        <div className="glass rounded-2xl p-6" style={{ border: '1px solid rgba(24,184,154,0.1)' }}>
          <div className="flex items-center gap-3 mb-4">
            <FileText size={16} style={{ color: '#EBD5A5' }} />
            <h3 className="font-display font-semibold" style={{ color: '#E8F2ED' }}>Prometheus Metrics</h3>
          </div>
          <pre className="text-xs overflow-x-auto p-4 rounded-xl no-scrollbar"
            style={{
              background: 'rgba(6,10,8,0.8)',
              border: '1px solid rgba(24,184,154,0.08)',
              color: '#8FD081',
              fontFamily: '"JetBrains Mono", monospace',
              maxHeight: 300,
              overflow: 'auto',
            }}>
            {metrics}
          </pre>
        </div>
      )}
    </div>
  );
}

// ============================================================
// PLANNER PAGE
// ============================================================
export function PlannerPage() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date().getDay();
  const [habits, setHabits] = useState<Record<string, boolean[]>>({
    'Breakfast Logged': Array(7).fill(false),
    '2L Water': Array(7).fill(false),
    'Sleep 7h+': Array(7).fill(false),
    'Lunch Logged': Array(7).fill(false),
    'Dinner Logged': Array(7).fill(false),
  });

  const toggleHabit = (habit: string, dayIdx: number) => {
    setHabits(prev => ({
      ...prev,
      [habit]: prev[habit].map((v, i) => i === dayIdx ? !v : v),
    }));
  };

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-0 space-y-6">
      <div>
        <h2 className="font-display font-bold text-2xl mb-1" style={{ color: '#E8F2ED' }}>Weekly Planner</h2>
        <p className="text-sm" style={{ color: '#9AB8A8' }}>Track habits and plan your wellness week.</p>
      </div>

      {/* Week header */}
      <div className="glass rounded-2xl p-5" style={{ border: '1px solid rgba(24,184,154,0.1)' }}>
        <h3 className="font-display font-semibold mb-4" style={{ color: '#E8F2ED' }}>This Week</h3>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, i) => {
            const isToday = (today === 0 ? 6 : today - 1) === i;
            return (
              <div key={day} className="text-center">
                <p className="text-xs mb-2" style={{ color: isToday ? '#18B89A' : '#5A7A68' }}>{day}</p>
                <div className="w-full aspect-square rounded-xl flex items-center justify-center"
                  style={{
                    background: isToday ? 'rgba(24,184,154,0.15)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${isToday ? 'rgba(24,184,154,0.3)' : 'rgba(255,255,255,0.06)'}`,
                  }}>
                  <span className="text-xs font-semibold" style={{ color: isToday ? '#18B89A' : '#9AB8A8' }}>
                    {new Date(Date.now() - (((today === 0 ? 6 : today - 1) - i) * 86400000)).getDate()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Habit tracker */}
      <div className="glass rounded-2xl p-6" style={{ border: '1px solid rgba(24,184,154,0.1)' }}>
        <h3 className="font-display font-semibold mb-4" style={{ color: '#E8F2ED' }}>Habit Tracker</h3>
        <div className="space-y-4">
          {Object.entries(habits).map(([habit, vals]) => {
            const completed = vals.filter(Boolean).length;
            return (
              <div key={habit}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium" style={{ color: '#E8F2ED' }}>{habit}</span>
                  <span className="text-xs font-mono" style={{ color: '#18B89A' }}>{completed}/7</span>
                </div>
                <div className="grid grid-cols-7 gap-1.5">
                  {vals.map((done, i) => (
                    <button key={i} onClick={() => toggleHabit(habit, i)}
                      className="aspect-square rounded-lg transition-all hover:scale-110"
                      style={{
                        background: done ? 'rgba(24,184,154,0.25)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${done ? 'rgba(24,184,154,0.4)' : 'rgba(255,255,255,0.06)'}`,
                      }} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick plan templates */}
      <div className="glass rounded-2xl p-6" style={{ border: '1px solid rgba(24,184,154,0.1)' }}>
        <h3 className="font-display font-semibold mb-4" style={{ color: '#E8F2ED' }}>AI Plan Templates</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { emoji: '🌅', title: 'High Energy Morning', desc: 'Protein-rich breakfast + hydration start', color: '#EBD5A5' },
            { emoji: '🧠', title: 'Focus Afternoon', desc: 'Omega-3 rich lunch + light snack', color: '#18B89A' },
            { emoji: '🌙', title: 'Recovery Evening', desc: 'Anti-inflammatory dinner + sleep prep', color: '#7AB8E8' },
          ].map(template => (
            <div key={template.title} className="glass-hover rounded-2xl p-4 cursor-pointer card-hover"
              style={{ background: `${template.color}06`, border: `1px solid ${template.color}18` }}>
              <span className="text-3xl">{template.emoji}</span>
              <h4 className="font-display font-semibold text-sm mt-2 mb-1" style={{ color: '#E8F2ED' }}>{template.title}</h4>
              <p className="text-xs" style={{ color: '#9AB8A8' }}>{template.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// GOALS PAGE
// ============================================================
export function GoalsPage() {
  const [prefs, setPrefs] = useState<{ hydration_goal?: number; nutrition_goal?: string; goal?: string }>({});
  const [analytics, setAnalytics] = useState<{ calories_consumed?: number; hydration_score?: number; nutrition_score?: number } | null>(null);

  useEffect(() => {
    api.get<typeof prefs>('/api/v1/user/preferences').then(r => { if (r.data) setPrefs(r.data); });
    api.get<typeof analytics>('/api/v1/analytics').then(r => { if (r.data) setAnalytics(r.data); });
  }, []);

  const goalCards = [
    {
      title: 'Nutrition Goal',
      target: 'Balanced macros',
      current: analytics?.nutrition_score || 0,
      maxVal: 100,
      unit: '/100',
      color: '#18B89A',
      emoji: '🥗',
    },
    {
      title: 'Hydration Goal',
      target: `${prefs.hydration_goal || 2500}ml/day`,
      current: (analytics?.hydration_score || 0),
      maxVal: 100,
      unit: '/100',
      color: '#7AB8E8',
      emoji: '💧',
    },
    {
      title: 'Calorie Goal',
      target: '2200 kcal/day',
      current: Math.min(100, Math.round(((analytics?.calories_consumed || 0) / 2200) * 100)),
      maxVal: 100,
      unit: '%',
      color: '#8FD081',
      emoji: '🔥',
    },
    {
      title: 'Wellness Goal',
      target: prefs.goal || 'General wellness',
      current: Math.round(((analytics?.nutrition_score || 0) + (analytics?.hydration_score || 0)) / 2),
      maxVal: 100,
      unit: '/100',
      color: '#EBD5A5',
      emoji: '🌿',
    },
  ];

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-0 space-y-6">
      <div>
        <h2 className="font-display font-bold text-2xl mb-1" style={{ color: '#E8F2ED' }}>Goals</h2>
        <p className="text-sm" style={{ color: '#9AB8A8' }}>Track your progress toward your wellness goals.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {goalCards.map(card => {
          const circumference = 2 * Math.PI * 40;
          const offset = circumference - (card.current / 100) * circumference;
          return (
            <div key={card.title} className="glass rounded-2xl p-6 card-hover"
              style={{ border: `1px solid ${card.color}18` }}>
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-24 h-24 flex-shrink-0">
                  <svg width={96} height={96} style={{ position: 'absolute', top: 0, left: 0 }}>
                    <circle cx={48} cy={48} r={40} fill="none" stroke={`${card.color}15`} strokeWidth={8} />
                    <circle cx={48} cy={48} r={40} fill="none" stroke={card.color} strokeWidth={8}
                      strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
                      className="progress-ring-circle" style={{ filter: `drop-shadow(0 0 6px ${card.color}50)` }} />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="text-xl">{card.emoji}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-semibold mb-1" style={{ color: '#E8F2ED' }}>{card.title}</h3>
                  <p className="text-xs mb-2" style={{ color: '#5A7A68' }}>Target: {card.target}</p>
                  <p className="font-display font-bold text-2xl" style={{ color: card.color }}>
                    {card.current}<span className="text-sm ml-1" style={{ color: '#5A7A68' }}>{card.unit}</span>
                  </p>
                </div>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${card.current}%`, background: card.color }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Milestones */}
      <div className="glass rounded-2xl p-6" style={{ border: '1px solid rgba(24,184,154,0.1)' }}>
        <h3 className="font-display font-semibold mb-4" style={{ color: '#E8F2ED' }}>Milestones</h3>
        <div className="space-y-3">
          {[
            { title: 'First Meal Logged', desc: 'Started your nutrition journey', done: true },
            { title: 'Hydration Goal Met', desc: 'Logged 2500ml in a day', done: (analytics?.hydration_score || 0) >= 80 },
            { title: 'Nutrition Score 80+', desc: 'Excellent nutrition balance', done: (analytics?.nutrition_score || 0) >= 80 },
            { title: 'AI Coach Consulted', desc: 'Used AI for nutrition advice', done: false },
          ].map(m => (
            <div key={m.title} className="flex items-center gap-4 p-3 rounded-xl"
              style={{
                background: m.done ? 'rgba(143,208,129,0.06)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${m.done ? 'rgba(143,208,129,0.15)' : 'rgba(255,255,255,0.05)'}`,
              }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0">
                {m.done ? '🏆' : '🎯'}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: m.done ? '#E8F2ED' : '#5A7A68' }}>{m.title}</p>
                <p className="text-xs" style={{ color: '#5A7A68' }}>{m.desc}</p>
              </div>
              {m.done && <CheckCircle size={16} style={{ color: '#8FD081', flexShrink: 0 }} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


