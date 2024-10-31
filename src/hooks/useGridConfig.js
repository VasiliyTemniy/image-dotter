import { useState } from 'react';

/**
 * @typedef {import('../index.d.ts').GridConfigState} GridConfigState
 * @typedef {import('../index.d.ts').GridParams} GridParams
 * @typedef {import('../index.d.ts').GeneratorParams} GeneratorParams
 */

/**
 * @type {GridConfigState}
 */
const initialGridConfig = {
  rowsCount: 20,
  columnsCount: 100,
  radius: 10,
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

/**
 *
 * @param {(message: string) => void} showNotification
 * @param {HTMLCanvasElement} image
 * @param {number} canvasHeight
 * @param {number} canvasWidth
 * @param {(changedGridParams: GridParams, changedGeneratorParams: GeneratorParams) => void} redrawGridPreview
 * @param {boolean} alwaysRedraw
 */
export const useGridConfig = (
  showNotification,
  image,
  canvasHeight,
  canvasWidth,
  redrawGridPreview,
  alwaysRedraw
) => {

  // Main grid params
  const [rowsCount, setRowsCount] = useState(initialGridConfig.rowsCount);
  const [columnsCount, setColumnsCount] = useState(initialGridConfig.columnsCount);
  const [radius, setRadius] = useState(initialGridConfig.radius);
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
      setRowsCount(50);
      return;
    }
    let localRowsCount = count;
    let localColumnsCount = columnsCount;

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
    if (!image) {
      return;
    }
    if (alwaysRedraw) {
      redrawGridPreview({ rowsCount: localRowsCount, columnsCount: localColumnsCount }, {}, {});
    }
  };

  const updateColumnsCount = (count) => {
    if (!count || !Number.isInteger(count) || count < 1) {
      showNotification('Columns count must be a positive integer', 'error');
      setColumnsCount(50);
      return;
    }
    let localRowsCount = rowsCount;
    let localColumnsCount = count;

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
    if (!image) {
      return;
    }
    if (alwaysRedraw) {
      redrawGridPreview({ rowsCount: localRowsCount, columnsCount: localColumnsCount }, {}, {});
    }
  };

  const updateRadius = (value) => {
    let newRadius = value;
    if (!value || !Number.isInteger(value) || value < 0) {
      showNotification('Radius must be a positive integer', 'error');
      newRadius = initialGridConfig.radius;
    }
    setRadius(newRadius);
    if (!image) {
      return;
    }

    if (alwaysRedraw) {
      redrawGridPreview({ radius: newRadius }, {}, {});
    }
  };

  const updateHorizontalGapPx = (value) => {
    let newHorizontalGapPx = value;
    if (!value || !Number.isInteger(value) || value < 0) {
      showNotification('Horizontal gap must be a positive integer or 0', 'error');
      newHorizontalGapPx = initialGridConfig.horizontalGapPx;
    }
    setHorizontalGapPx(newHorizontalGapPx);
    if (!image) {
      return;
    }

    if (alwaysRedraw) {
      redrawGridPreview({ horizontalGapPx: newHorizontalGapPx }, {}, {});
    }
  };

  const updateVerticalGapPx = (value) => {
    let newVerticalGapPx = value;
    if (!value || !Number.isInteger(value) || value < 0) {
      showNotification('Vertical gap must be a positive integer or 0', 'error');
      newVerticalGapPx = initialGridConfig.verticalGapPx;
    }
    setVerticalGapPx(newVerticalGapPx);
    if (!image) {
      return;
    }

    if (alwaysRedraw) {
      redrawGridPreview({ verticalGapPx: newVerticalGapPx }, {}, {});
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

    if (!image) {
      return;
    }

    if (alwaysRedraw) {
      redrawGridPreview({ rowsCount: localRowsCount, columnsCount: localColumnsCount }, {}, {});
    }
  };

  // Additional grid params
  const updateAngle = (value) => {
    let newAngle = value;
    if (!value || !Number.isInteger(value) || value < 0 || value > 360) {
      showNotification('Angle must be a positive integer between 0 and 360', 'error');
      newAngle = initialGridConfig.angle;
    }
    setAngle(newAngle);
    if (!image) {
      return;
    }

    if (alwaysRedraw) {
      redrawGridPreview({ angle: newAngle }, {}, {});
    }
  };

  const updateUseStroke = (value) => {
    setUseStroke(value);
    if (!image) {
      return;
    }

    if (alwaysRedraw) {
      redrawGridPreview({ stroke: value ? stroke : null }, {}, {});
    }
  };

  const _updateStroke = (newStroke) => {
    setStroke(newStroke);
    if (!image) {
      return;
    }

    if (alwaysRedraw) {
      redrawGridPreview({ stroke: useStroke ? newStroke : null }, {}, {});
    }
  };

  const updateStrokeColor = (value) => {
    const newStroke = { ...stroke, color: value };
    _updateStroke(newStroke);
  };

  const updateStrokeWidth = (value) => {
    const newStroke = { ...stroke, width: value };
    if (!value || !Number.isInteger(value) || value < 1) {
      showNotification('Stroke width must be a positive integer', 'error');
      newStroke.width = initialGridConfig.stroke.width;
    }
    _updateStroke(newStroke);
  };

  const updateUseIgnoreColor = (value) => {
    setUseIgnoreColor(value);
    if (!image) {
      return;
    }

    if (alwaysRedraw) {
      redrawGridPreview({ ignoreColor: value ? ignoreColor : null }, {}, {});
    }
  };

  const _updateIgnoreColor = (newIgnoreColor) => {
    setIgnoreColor(newIgnoreColor);
    if (!image) {
      return;
    }

    if (alwaysRedraw) {
      redrawGridPreview({ ignoreColor: useIgnoreColor ? newIgnoreColor : null }, {}, {});
    }
  };

  const updateIgnoreColorColor = (value) => {
    const newIgnoreColor = { ...ignoreColor, color: value };
    _updateIgnoreColor(newIgnoreColor);
  };

  const updateIgnoreColorOpacityThreshold = (value) => {
    const newIgnoreColor = { ...ignoreColor, opacityThreshold: value };
    if (!value || !Number.isInteger(value) || value < 0 || value > 255) {
      showNotification('Ignore color opacity threshold must be a positive integer between 0 and 255', 'error');
      newIgnoreColor.opacityThreshold = initialGridConfig.ignoreColor.opacityThreshold;
    }
    _updateIgnoreColor(newIgnoreColor);
  };

  const updateIgnoreColorMaxDeviation = (value) => {
    const newIgnoreColor = { ...ignoreColor, maxDeviation: value };
    if (!value || !Number.isInteger(value) || value < 0 || value > 255) {
      showNotification('Ignore color max deviation must be a positive integer between 0 and 255', 'error');
      newIgnoreColor.maxDeviation = initialGridConfig.ignoreColor.maxDeviation;
    }
    _updateIgnoreColor(newIgnoreColor);
  };

  return {
    params: {
      rowsCount,
      columnsCount,
      radius,
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
      updateRadius,
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