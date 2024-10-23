export interface DotterGridParams {
  rowsCount: number;
  columnsCount: number;
  radius: number;
  horizontalGapPx: number;
  verticalGapPx: number;
  angle: number;
  /** null means no stroke will be drawn */
  strokeColor: string | null;
  /** null means no stroke will be drawn */
  strokeWidth: number | null;
  /** null means no color will be ignored */
  ignoreColor: string | null;
  /** 0.0 - 1.0; below this threshold the color will be ignored; null means no color will be ignored */
  ignoreColorOpacityThreshold: number | null;
}

/**
 * x and y are top-left corner coordinates of a cell
 * { x: number, y: number, length: number, color: string }
 */
export type DotterCell = [
  /** x coordinate */
  number,
  /** y coordinate */
  number,
  /** cell length */
  number,
  /** cell color */
  string
];