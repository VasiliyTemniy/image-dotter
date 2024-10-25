export interface DotterGridParams {
  rowsCount: number;
  columnsCount: number;
  radius: number;
  horizontalGapPx: number;
  verticalGapPx: number;
  angle: number;
  stroke: {
    color: string;
    width: number;
  } | null;
  ignoreColor: {
    color: string;
    opacityThreshold: number;
    maxDeviation: number;
  } | null;
}

export interface GeneratorParams {
  seed: number;
  cellSpan: {
    estimated: number;
    min: number;
    max: number;
  } | null;
  palette: string[] | null;
  surroundingCells: {
    color: string;
    minDepth: number;
    maxDepth: number;
  } | null;
}

export interface AnimationParams {
  type: 'slide' | 'appear';
  direction: 'left-to-right' | 'right-to-left' | 'top-to-bottom' | 'bottom-to-top' | 'h-sides' | 'v-sides' | 'all' | null;
  duration: number;
  delay: {
    min: number;
    max: number;
  } | null;
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | null;
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