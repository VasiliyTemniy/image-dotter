import { useState } from 'react';

/**
 * @typedef {import('../index.d.ts').GridConfigState} GridConfigState
 * @typedef {import('../index.d.ts').GridParams} GridParams
 * @typedef {import('../index.d.ts').GeneratorParams} GeneratorParams
 */

/**
 * @type {GridConfigState}
 */
export const initialGridConfig = {
  rowsCount: 42,
  columnsCount: 100,
  borderRadius: 10,
  horizontalGapPx: 1,
  verticalGapPx: 1,
  angle: 0,
  aspectRatioMode: 'image',
  useStroke: false,
  stroke: {
    color: '#000000ff',
    width: 1
  },
  useIgnoreColor: true,
  ignoreColor: {
    color: '#ffffffff',
    opacityThreshold: 255,
    maxDeviation: 3
  },
};

const MAX_CELLS = 100000;

/**
 *
 * @param {(message: string) => void} showNotification
 * @param {number} canvasHeight
 * @param {number} canvasWidth
 * @param {(changedGridParams: GridParams, changedGeneratorParams: GeneratorParams) => void} recalcGrid
 * @param {boolean} alwaysRecalc
 */
export const useGridConfig = (
  showNotification,
  canvasHeight,
  canvasWidth,
  recalcGrid,
  alwaysRecalc
) => {

  // Main grid params
  const [rowsCount, setRowsCount] = useState(initialGridConfig.rowsCount);
  const [columnsCount, setColumnsCount] = useState(initialGridConfig.columnsCount);
  const [borderRadius, setRadius] = useState(initialGridConfig.borderRadius);
  const [horizontalGapPx, setHorizontalGapPx] = useState(initialGridConfig.horizontalGapPx);
  const [verticalGapPx, setVerticalGapPx] = useState(initialGridConfig.verticalGapPx);
  const [aspectRatioMode, setAspectRatioMode] = useState(initialGridConfig.aspectRatioMode);

  // Additional grid params
  const [angle, setAngle] = useState(initialGridConfig.angle);
  const [useStroke, setUseStroke] = useState(initialGridConfig.useStroke);
  const [stroke, setStroke] = useState(initialGridConfig.stroke);
  const [useIgnoreColor, setUseIgnoreColor] = useState(initialGridConfig.useIgnoreColor);
  const [ignoreColor, setIgnoreColor] = useState(initialGridConfig.ignoreColor);

  // Main grid params
  const updateRowsCount = (count) => {
    if (!count || !Number.isInteger(count) || count < 1) {
      showNotification('Rows count must be a positive integer', 'error');
      setRowsCount(initialGridConfig.rowsCount);
      return;
    }
    let localRowsCount = count;
    let localColumnsCount = columnsCount;
    if (localRowsCount * localColumnsCount > MAX_CELLS) {
      showNotification('Too many cells', 'error');
      localRowsCount = Math.floor(MAX_CELLS / localColumnsCount) || 1;
    }

    setRowsCount(localRowsCount);

    switch (aspectRatioMode) {
    case 'image':
      localColumnsCount = Math.floor(count * (canvasWidth / canvasHeight)) || 1;
      setColumnsCount(localColumnsCount);
      break;
    case 'square':
      localColumnsCount = count;
      setColumnsCount(localColumnsCount);
      break;
    case 'none':
      break;
    default:
      break;
    }

    if (alwaysRecalc) {
      recalcGrid({ rowsCount: localRowsCount, columnsCount: localColumnsCount }, {});
    }
  };

  const updateColumnsCount = (count) => {
    if (!count || !Number.isInteger(count) || count < 1) {
      showNotification('Columns count must be a positive integer', 'error');
      setColumnsCount(initialGridConfig.columnsCount);
      return;
    }
    let localRowsCount = rowsCount;
    let localColumnsCount = count;
    if (localRowsCount * localColumnsCount > MAX_CELLS) {
      showNotification('Too many cells', 'error');
      localColumnsCount = Math.floor(MAX_CELLS / localRowsCount) || 1;
    }

    setColumnsCount(localColumnsCount);

    switch (aspectRatioMode) {
    case 'image':
      localRowsCount = Math.floor(count * (canvasHeight / canvasWidth)) || 1;
      setRowsCount(localRowsCount);
      break;
    case 'square':
      localRowsCount = count;
      setRowsCount(localRowsCount);
      break;
    case 'none':
      break;
    default:
      break;
    }

    if (alwaysRecalc) {
      recalcGrid({ rowsCount: localRowsCount, columnsCount: localColumnsCount }, {});
    }
  };

  const updateBorderRadius = (value) => {
    let newBorderRadius = value;
    if (value === null || value === undefined || !Number.isInteger(value) || value < 0) {
      showNotification('Radius must be a positive integer', 'error');
      newBorderRadius = initialGridConfig.borderRadius;
    }
    setRadius(newBorderRadius);


    if (alwaysRecalc) {
      recalcGrid({ borderRadius: newBorderRadius }, {});
    }
  };

  const updateHorizontalGapPx = (value) => {
    let newHorizontalGapPx = value;
    if (value === null || value === undefined || !Number.isInteger(value) || value < 0) {
      showNotification('Horizontal gap must be a positive integer or 0', 'error');
      newHorizontalGapPx = initialGridConfig.horizontalGapPx;
    }
    setHorizontalGapPx(newHorizontalGapPx);


    if (alwaysRecalc) {
      recalcGrid({ horizontalGapPx: newHorizontalGapPx }, {});
    }
  };

  const updateVerticalGapPx = (value) => {
    let newVerticalGapPx = value;
    if (value === null || value === undefined || !Number.isInteger(value) || value < 0) {
      showNotification('Vertical gap must be a positive integer or 0', 'error');
      newVerticalGapPx = initialGridConfig.verticalGapPx;
    }
    setVerticalGapPx(newVerticalGapPx);


    if (alwaysRecalc) {
      recalcGrid({ verticalGapPx: newVerticalGapPx }, {});
    }
  };

  const updateAspectRatioMode = (value) => {
    setAspectRatioMode(value);

    let localRowsCount = rowsCount;
    let localColumnsCount = columnsCount;

    switch (value) {
    case 'image':
      localColumnsCount = Math.floor(rowsCount * (canvasWidth / canvasHeight)) || 1;
      setColumnsCount(localColumnsCount);
      break;
    case 'square':
      localColumnsCount = rowsCount;
      setColumnsCount(localColumnsCount);
      break;
    case 'none':
      break;
    default:
      break;
    }

    if (alwaysRecalc) {
      recalcGrid({ rowsCount: localRowsCount, columnsCount: localColumnsCount }, {});
    }
  };

  // Additional grid params
  const updateAngle = (value) => {
    let newAngle = value;
    if (value === null || value === undefined || !Number.isInteger(value) || value < 0 || value > 360) {
      showNotification('Angle must be a positive integer between 0 and 360', 'error');
      newAngle = initialGridConfig.angle;
    }
    setAngle(newAngle);

    if (alwaysRecalc) {
      recalcGrid({ angle: newAngle }, {});
    }
  };

  const updateUseStroke = (value) => {
    setUseStroke(value);

    if (alwaysRecalc) {
      recalcGrid({ stroke: value ? stroke : null }, {});
    }
  };

  const _updateStroke = (newStroke) => {
    setStroke(newStroke);

    if (alwaysRecalc) {
      recalcGrid({ stroke: useStroke ? newStroke : null }, {});
    }
  };

  const updateStrokeColor = (value) => {
    const newStroke = { ...stroke, color: value };
    _updateStroke(newStroke);
  };

  const updateStrokeWidth = (value) => {
    const newStroke = { ...stroke, width: value };
    if (value === null || value === undefined || !Number.isInteger(value) || value < 1) {
      showNotification('Stroke width must be a positive integer', 'error');
      newStroke.width = initialGridConfig.stroke.width;
    }
    _updateStroke(newStroke);
  };

  const updateUseIgnoreColor = (value) => {
    setUseIgnoreColor(value);

    if (alwaysRecalc) {
      recalcGrid({ ignoreColor: value ? ignoreColor : null }, {});
    }
  };

  const _updateIgnoreColor = (newIgnoreColor) => {
    setIgnoreColor(newIgnoreColor);

    if (alwaysRecalc) {
      recalcGrid({ ignoreColor: useIgnoreColor ? newIgnoreColor : null }, {});
    }
  };

  const updateIgnoreColorColor = (value) => {
    const newIgnoreColor = { ...ignoreColor, color: value };
    _updateIgnoreColor(newIgnoreColor);
  };

  const updateIgnoreColorOpacityThreshold = (value) => {
    const newIgnoreColor = { ...ignoreColor, opacityThreshold: value };
    if (value === null || value === undefined || !Number.isInteger(value) || value < 0 || value > 255) {
      showNotification('Ignore color opacity threshold must be a positive integer between 0 and 255', 'error');
      newIgnoreColor.opacityThreshold = initialGridConfig.ignoreColor.opacityThreshold;
    }
    _updateIgnoreColor(newIgnoreColor);
  };

  const updateIgnoreColorMaxDeviation = (value) => {
    const newIgnoreColor = { ...ignoreColor, maxDeviation: value };
    if (value === null || value === undefined || !Number.isInteger(value) || value < 0 || value > 255) {
      showNotification('Ignore color max deviation must be a positive integer between 0 and 255', 'error');
      newIgnoreColor.maxDeviation = initialGridConfig.ignoreColor.maxDeviation;
    }
    _updateIgnoreColor(newIgnoreColor);
  };

  return {
    params: {
      rowsCount,
      columnsCount,
      borderRadius,
      horizontalGapPx,
      verticalGapPx,
      aspectRatioMode,
      angle,
      useStroke,
      stroke,
      useIgnoreColor,
      ignoreColor,
    },
    controls: {
      updateRowsCount,
      updateColumnsCount,
      updateBorderRadius,
      updateHorizontalGapPx,
      updateVerticalGapPx,
      updateAspectRatioMode,
      updateAngle,
      updateUseStroke,
      updateStroke: {
        color: updateStrokeColor,
        width: updateStrokeWidth,
      },
      updateUseIgnoreColor,
      updateIgnoreColor: {
        color: updateIgnoreColorColor,
        opacityThreshold: updateIgnoreColorOpacityThreshold,
        maxDeviation: updateIgnoreColorMaxDeviation,
      },
    },
    setters: {
      setRowsCount,
      setColumnsCount,
    }
  };

};

/**
 * @typedef {ReturnType<typeof useGridConfig>['controls']} GridConfigControls
 */