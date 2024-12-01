export interface LayoutParams {
  stretchCanvas: boolean,
  screenOverflow: boolean,
  fitBothCanvasInOneRow: boolean,
  shiftMainByMenu: boolean
}

export interface LayoutConfigState extends LayoutParams {
}

export interface GridCreationParams {
  rowsCount: number;
  columnsCount: number;
  ignoreColor: {
    color: string;
    opacityThreshold: number;
    maxDeviation: number;
  } | null;
}

export interface GridVisualParams {
  radius: number;
  horizontalGapPx: number;
  verticalGapPx: number;
  angle: number;
  stroke: {
    color: string;
    width: number;
  } | null;
}

export interface GridParams extends GridCreationParams, GridVisualParams {
  // rowsCount: number;
  // columnsCount: number;
  // radius: number;
  // horizontalGapPx: number;
  // verticalGapPx: number;
  // angle: number;
  // stroke: {
  //   color: string;
  //   width: number;
  // } | null;
  // ignoreColor: {
  //   color: string;
  //   opacityThreshold: number;
  //   maxDeviation: number;
  // } | null;
}


export interface GridConfigState extends GridParams {
  aspectRatioMode: 'image' | 'square' | 'none';
  useStroke: boolean;
  useIgnoreColor: boolean;
  useMainPalette: boolean;
  useSurroundingCells: boolean;
}

export interface GeneratorParams {
  seed: number;
  cellSpan: {
    estimated: number;
    min: number;
    max: number;
  } | null;
  mainPalette: string[] | null;
  surroundingCells: {
    color: string;
    minDepth: number;
    maxDepth: number;
  } | null;
}

export interface GeneratorConfigState extends GeneratorParams {
  useCellSpan: boolean;
  useMainPalette: boolean;
  useSurroundingCells: boolean;
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

export interface AnimationConfigState extends AnimationParams {
}

/**
 * x and y are top-left corner coordinates of a cell
 * [ x: number, y: number, span: number, color: string ]
 */
export type DotterCell = [
  /** x grid coordinate (column) */
  number,
  /** y grid coordinate (row) */
  number,
  /** cell span - number of columns that cell occupies */
  number,
  /** cell color */
  string
];

type RGBAColor = [number, number, number, number];

/**
 * Intermediate cell data for easier manipulation\
 * Could be used to render dotted image to outputCanvas
 * [ x: number, y: number, span: number, color: RGBAColor ]
 */
export type DotterIntermediateCell = [
  /** x grid coordinate (column) */
  number,
  /** y grid coordinate (row) */
  number,
  /** cell span - number of columns that cell occupies */
  number,
  /** cell color in RGBA */
  RGBAColor
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
  labelStyle?: any;
  disabled?: boolean;
  hidden?: boolean;
  tooltip?: string;
  options?: {
    value: string;
    label: string;
  }[];
};