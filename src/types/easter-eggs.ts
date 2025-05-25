export interface Notification {
  id: string;
  title: string;
  message: string;
  icon: string;
  type: 'temporary' | 'persistent';
  duration?: number;
  onClose?: () => void;
}

export interface StyleInfo {
  x: number;
  y: number;
  tagName: string;
  className: string;
  styles: { [key: string]: string };
}
