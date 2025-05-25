export interface NotificationAction {
  label: string;
  onClick: () => void;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  icon: string;
  type: 'temporary' | 'persistent';
  duration?: number;
  onClose?: () => void;
  actions?: NotificationAction[];
}

export interface StyleInfo {
  x: number;
  y: number;
  tagName: string;
  className: string;
  styles: { [key: string]: string };
}
