export interface WidgetPosition {
  x: number;
  y: number;
}

export interface WidgetSize {
  width: number;
  height: number;
}

export interface WidgetState {
  id: string;
  title: string;
  icon: string;
  accent: string;
  description?: string;
  position: WidgetPosition;
  size: WidgetSize;
  component: string;
  pinned?: boolean;
  zIndex: number;
}
