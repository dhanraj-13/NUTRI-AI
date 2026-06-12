import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const colors = {
  success: { border: 'rgba(143,208,129,0.3)', icon: '#8FD081', bg: 'rgba(143,208,129,0.08)' },
  error: { border: 'rgba(224,112,112,0.3)', icon: '#E07070', bg: 'rgba(224,112,112,0.08)' },
  warning: { border: 'rgba(232,168,56,0.3)', icon: '#E8A838', bg: 'rgba(232,168,56,0.08)' },
  info: { border: 'rgba(24,184,154,0.3)', icon: '#18B89A', bg: 'rgba(24,184,154,0.08)' },
};

export function ToastContainer() {
  const { state } = useApp();

  return (
    <div className="toast-container">
      {state.toasts.map(t => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  );
}

function ToastItem({ toast }: { toast: { id: string; type: 'success' | 'error' | 'warning' | 'info'; title: string; message?: string } }) {

  const Icon = icons[toast.type];
  const c = colors[toast.type];

  return (
    <div
      className="toast glass rounded-2xl p-4 flex items-start gap-3"
      style={{ borderColor: c.border, background: `rgba(15,23,18,0.95)` }}
    >
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: c.bg }}>
        <Icon size={16} style={{ color: c.icon }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold" style={{ color: '#E8F2ED' }}>{toast.title}</p>
        {toast.message && (
          <p className="text-xs mt-0.5" style={{ color: '#9AB8A8' }}>{toast.message}</p>
        )}
      </div>
    </div>
  );
}
