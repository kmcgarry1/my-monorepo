import {
  COLUMN_COUNT,
  COLUMN_STEP,
  GRID_SIZE,
  MIN_WIDGET_HEIGHT,
  MIN_WIDGET_WIDTH,
  clampColumnIndex,
  getColumnOffset,
  getSpanWidth,
  normalizeColumnWidth
} from '../constants/layout';
import type { WidgetState } from '../types';

export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function snapToGrid(value: number) {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
}

export function createRect(widget: WidgetState): Rect {
  return {
    x: widget.position.x,
    y: widget.position.y,
    width: widget.size.width,
    height: widget.size.height
  };
}

function rectsOverlap(a: Rect, b: Rect) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

export function resolveRect(allWidgets: WidgetState[], widgetId: string, target: Rect): Rect {
  const others = allWidgets
    .filter((widget) => widget.id !== widgetId)
    .map((widget) => ({ ...createRect(widget) }));

  const { span, width: desiredWidth } = normalizeColumnWidth(Math.max(target.width, MIN_WIDGET_WIDTH));
  const desiredHeight = Math.max(snapToGrid(target.height), MIN_WIDGET_HEIGHT);
  const baseColumn = clampColumnIndex(Math.round(target.x / COLUMN_STEP), span);
  const columnLimit = Math.max(COLUMN_COUNT - span, 0);

  let column = baseColumn;
  let y = snapToGrid(Math.max(target.y, 0));
  let attempt = 0;
  const maxAttempts = Math.max(others.length * COLUMN_COUNT * 6, 600);

  while (attempt < maxAttempts) {
    const candidate: Rect = {
      x: getColumnOffset(column),
      y,
      width: desiredWidth,
      height: desiredHeight
    };

    const collider = others.find((rect) => rectsOverlap(candidate, rect));

    if (!collider) {
      return candidate;
    }

    if (column < columnLimit) {
      column += 1;
    } else {
      column = clampColumnIndex(baseColumn, span);
      const nextY = snapToGrid(Math.max(y, collider.y + collider.height + GRID_SIZE));
      y = nextY === y ? y + GRID_SIZE : nextY;
    }

    attempt += 1;
  }

  return {
    x: getColumnOffset(clampColumnIndex(column, span)),
    y,
    width: desiredWidth,
    height: desiredHeight
  };
}

export function calculateBoardSize(state: WidgetState[]): { width: number; height: number } {
  if (state.length === 0) {
    return {
      width: getSpanWidth(COLUMN_COUNT) + GRID_SIZE * 4,
      height: MIN_WIDGET_HEIGHT + GRID_SIZE * 8
    };
  }

  const { maxRight, maxBottom } = state.reduce(
    (acc, widget) => {
      const rect = createRect(widget);
      return {
        maxRight: Math.max(acc.maxRight, rect.x + rect.width),
        maxBottom: Math.max(acc.maxBottom, rect.y + rect.height)
      };
    },
    { maxRight: 0, maxBottom: 0 }
  );

  return {
    width: Math.max(maxRight + GRID_SIZE * 4, getSpanWidth(COLUMN_COUNT) + GRID_SIZE * 4),
    height: Math.max(maxBottom + GRID_SIZE * 4, MIN_WIDGET_HEIGHT + GRID_SIZE * 8)
  };
}

export function normalizeWidgetLayout(state: WidgetState[]): WidgetState[] {
  const next = state.map((widget) => ({
    ...widget,
    position: { ...widget.position },
    size: { ...widget.size }
  }));

  for (const widget of next) {
    const resolved = resolveRect(next, widget.id, {
      x: widget.position.x,
      y: widget.position.y,
      width: widget.size.width,
      height: widget.size.height
    });

    widget.position = { x: resolved.x, y: resolved.y };
    widget.size = { width: resolved.width, height: resolved.height };
  }

  return next;
}
