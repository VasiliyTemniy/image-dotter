export interface DotterGridParams {
  rowsCount: number;
  columnsCount: number;
  horizontalGapPx: number;
  verticalGapPx: number;
  angle: number;
  strokeColor: string | null;
  strokeWidth: number | null;
}

/**
 * { x: number, y: number, length: number, color: string }
 */
export type DotterCell = [number, number, number, string];