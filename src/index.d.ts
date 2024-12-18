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
  borderRadius: number;
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
  // borderRadius: number;
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

export interface GridHtmlVisualParams extends GridVisualParams {
  monoCellSize: number;
  overrideBorderRadius: number;
  overrideHorizontalGapPx: number;
  overrideVerticalGapPx: number;
  overrideSpanWidthFactor: number;
  leftCorrectionPx: number;
  topCorrectionPx: number;
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
    colorVariation: number;
    alphaVariation: number;
    height: {
      estimated: number;
      min: number;
      max: number;
    };
    depth: {
      estimated: number;
      min: number;
      max: number;
    };
    span: {
      estimated: number;
      min: number;
      max: number;
    };
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
  type: 'text' | 'color' | 'number' | 'checkbox' | 'switch';
  metaType: 'generator-group' | null;
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
  textLeft?: string;
  svgLeft?: React.FC<React.SVGProps<SVGSVGElement>>;
  textRight?: string;
  svgRight?: React.FC<React.SVGProps<SVGSVGElement>>;
};