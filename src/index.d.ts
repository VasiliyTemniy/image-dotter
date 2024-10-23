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
 * { color: string, radius: number, length: number, angle: number, stroke: string, strokeWidth: number }
 */
export type DotterCell = [string, number, number, number, string, number];