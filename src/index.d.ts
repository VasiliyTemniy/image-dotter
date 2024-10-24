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
  /** 0 - 255; null means no color will be ignored */
  ignoreColorMaxDeviation: number | null;
}

/**
 * x and y are top-left corner coordinates of a cell
 * { x: number, y: number, span: number, color: string }
 */
export type DotterCell = [
  /** x coordinate */
  number,
  /** y coordinate */
  number,
  /** cell span - number of columns that cell occupies */
  number,
  /** cell color */
  string
];


export interface MenuItem {
  tag: 'input' | 'select' | 'div';
  type: 'text' | 'color' | 'number' | 'checkbox';
  name: string;
  value: string;
  label?: string;
  updateValue?: (args: any) => void;
  ref?: React.RefObject<HTMLInputElement> | React.RefObject<HTMLSelectElement> | React.RefObject<HTMLDivElement>;
  style?: any;
  disabled?: boolean;
  tooltip?: string;
  options?: {
    value: string;
    label: string;
  }[];
};