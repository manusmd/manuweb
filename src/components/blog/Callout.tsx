import { ReactNode } from 'react';
import { Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface CalloutProps {
  type?: 'info' | 'warning' | 'success' | 'error';
  children: ReactNode;
}

export function Callout({ type = 'info', children }: CalloutProps) {
  const styles = {
    info: {
      container: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
      icon: 'text-blue-600 dark:text-blue-400',
      IconComponent: Info,
    },
    warning: {
      container: 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800',
      icon: 'text-yellow-600 dark:text-yellow-400',
      IconComponent: AlertTriangle,
    },
    success: {
      container: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800',
      icon: 'text-green-600 dark:text-green-400',
      IconComponent: CheckCircle,
    },
    error: {
      container: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800',
      icon: 'text-red-600 dark:text-red-400',
      IconComponent: XCircle,
    },
  };

  const style = styles[type];
  const { IconComponent } = style;

  return (
    <div className={`border rounded-lg p-4 my-6 ${style.container}`}>
      <div className="flex gap-3">
        <IconComponent className={`w-5 h-5 mt-0.5 flex-shrink-0 ${style.icon}`} />
        <div className="flex-1 text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
