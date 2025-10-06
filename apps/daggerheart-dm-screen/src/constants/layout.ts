export const GRID_SIZE = 32;
export const COLUMN_COUNT = 6;
export const COLUMN_GAP = GRID_SIZE;
export const COLUMN_WIDTH = GRID_SIZE * 7; // 224px
export const COLUMN_STEP = COLUMN_WIDTH + COLUMN_GAP;
export const MIN_WIDGET_WIDTH = COLUMN_WIDTH;
export const MIN_WIDGET_HEIGHT = GRID_SIZE * 4;

export function getColumnOffset(index: number): number {
  return index * COLUMN_STEP;
}

export function getSpanWidth(span: number): number {
  return COLUMN_WIDTH * span + COLUMN_GAP * Math.max(span - 1, 0);
}

export function clampColumnIndex(index: number, span: number): number {
  const maxIndex = Math.max(COLUMN_COUNT - span, 0);
  if (index < 0) {
    return 0;
  }
  if (index > maxIndex) {
    return maxIndex;
  }
  return index;
}

export function spanForWidth(width: number): number {
  const span = Math.max(1, Math.ceil((width + COLUMN_GAP) / COLUMN_STEP));
  return Math.min(span, COLUMN_COUNT);
}

export function normalizeColumnWidth(width: number): { span: number; width: number } {
  const span = spanForWidth(width);
  return { span, width: getSpanWidth(span) };
}

export function columnFromOffset(offset: number): number {
  if (offset <= 0) {
    return 0;
  }
  const column = Math.floor(offset / COLUMN_STEP);
  return Math.min(Math.max(column, 0), COLUMN_COUNT - 1);
}
