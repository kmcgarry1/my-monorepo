export interface WidgetPosition {
  x: number;
  y: number;
}

export interface WidgetSize {
  width: number;
  height: number;
}

export type CustomWidgetTemplate = 'note' | 'checklist' | 'tracker' | 'stat-block';

type CustomWidgetBaseConfig<T extends CustomWidgetTemplate> = {
  type: T;
};

export interface CustomNoteConfig extends CustomWidgetBaseConfig<'note'> {
  body: string;
}

export interface CustomChecklistItem {
  text: string;
  complete?: boolean;
}

export interface CustomChecklistConfig extends CustomWidgetBaseConfig<'checklist'> {
  items: CustomChecklistItem[];
}

export interface CustomTrackerTrack {
  label: string;
  current: number;
  max: number;
}

export interface CustomTrackerConfig extends CustomWidgetBaseConfig<'tracker'> {
  tracks: CustomTrackerTrack[];
}

export interface CustomStatBlockEntry {
  label: string;
  value: string;
}

export interface CustomStatBlockConfig extends CustomWidgetBaseConfig<'stat-block'> {
  summary?: string;
  entries: CustomStatBlockEntry[];
}

export type CustomWidgetConfig =
  | CustomNoteConfig
  | CustomChecklistConfig
  | CustomTrackerConfig
  | CustomStatBlockConfig;

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
  config?: CustomWidgetConfig;
}

export interface CreateWidgetPayload {
  title: string;
  icon: string;
  accent: string;
  description?: string;
  component: string;
  size: WidgetSize;
  config?: CustomWidgetConfig;
}
