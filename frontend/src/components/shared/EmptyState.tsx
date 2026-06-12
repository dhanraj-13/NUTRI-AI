import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
        style={{ background: 'rgba(24,184,154,0.08)', border: '1px solid rgba(24,184,154,0.15)' }}
      >
        <Icon size={32} style={{ color: '#18B89A', opacity: 0.7 }} />
      </div>
      <h3 className="font-display text-xl font-semibold mb-2" style={{ color: '#E8F2ED' }}>
        {title}
      </h3>
      <p className="text-sm max-w-xs" style={{ color: '#9AB8A8' }}>
        {description}
      </p>
      {action && (
        <button onClick={action.onClick} className="btn-primary mt-6">
          {action.label}
        </button>
      )}
    </div>
  );
}
