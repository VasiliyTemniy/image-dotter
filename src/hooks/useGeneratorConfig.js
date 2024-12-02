import { useState } from 'react';

/**
 * @typedef {import('../index.d.ts').GeneratorConfigState} GeneratorConfigState
 * @typedef {import('../index.d.ts').GridParams} GridParams
 * @typedef {import('../index.d.ts').GeneratorParams} GeneratorParams
 */

/**
 * @type {GeneratorConfigState}
 */
const initialGeneratorConfig = {
  // seed: Math.ceil(Math.random() * 100000),
  seed: 98564,
  // useCellSpan: false,
  useCellSpan: true,
  cellSpan: {
    estimated: 2.35,
    min: 2,
    max: 3
  },
  useMainPalette: false,
  mainPalette: [],
  useSurroundingCells: false,
  surroundingCells: {
    color: '#325e9f80',
    colorVariation: 10,
    depth: {
      estimated: 2.35,
      min: 2,
      max: 3
    },
    span: {
      estimated: 2.35,
      min: 2,
      max: 3
    }
  }
};

/**
 *
 * @param {(message: string) => void} showNotification
 * @param {(changedGridParams: GridParams, changedGeneratorParams: GeneratorParams) => void} redrawGridPreview
 * @param {boolean} alwaysRedraw
 */
export const useGeneratorConfig = (
  showNotification,
  redrawGridPreview,
  alwaysRedraw
) => {

  // Generator params
  const [seed, setSeed] = useState(initialGeneratorConfig.seed);
  const [useCellSpan, setUseCellSpan] = useState(initialGeneratorConfig.useCellSpan);
  const [cellSpan, setCellSpan] = useState(initialGeneratorConfig.cellSpan);
  const [useMainPalette, setUseMainPalette] = useState(initialGeneratorConfig.useMainPalette);
  const [mainPalette, setMainPalette] = useState(initialGeneratorConfig.mainPalette);
  const [useSurroundingCells, setUseSurroundingCells] = useState(initialGeneratorConfig.useSurroundingCells);
  const [surroundingCells, setSurroundingCells] = useState(initialGeneratorConfig.surroundingCells);

  // Generator params
  const updateSeed = (value) => {
    if (!value || !Number.isInteger(value) || value <= 0 || value >= 100000) {
      showNotification('Seed must be a positive integer between 1 and 99999', 'error');
      return;
    }
    setSeed(value);

    if (alwaysRedraw) {
      redrawGridPreview({}, { seed: value });
    }
  };

  const updateUseCellSpan = (value) => {
    setUseCellSpan(value);

    if (alwaysRedraw) {
      redrawGridPreview({}, { cellSpan: value ? cellSpan : null });
    }
  };

  const _updateCellSpan = (newCellSpan) => {
    setCellSpan(newCellSpan);

    if (alwaysRedraw) {
      redrawGridPreview({}, { cellSpan: useCellSpan ? newCellSpan : null });
    }
  };

  const updateCellSpanEstimated = (value) => {
    const newCellSpan = { ...cellSpan, estimated: value };
    if (
      !value ||
      isNaN(value) ||
      value < 1 ||
      value < cellSpan.min ||
      value > cellSpan.max
    ) {
      showNotification('Cell span estimated must be a positive float more than 1 and between min and max', 'error');
      newCellSpan.estimated = initialGeneratorConfig.cellSpan.estimated;
    }
    _updateCellSpan(newCellSpan);
  };

  const updateCellSpanMin = (value) => {
    const newCellSpan = { ...cellSpan, min: value };
    if (value > cellSpan.max) {
      showNotification('Cell span min must be less than cell span max', 'error');
      newCellSpan.min = cellSpan.max;
    }
    if (!value || !Number.isInteger(value) || value < 1) {
      showNotification('Cell span min must be a positive integer', 'error');
      newCellSpan.min = initialGeneratorConfig.cellSpan.min;
    }
    _updateCellSpan(newCellSpan);
  };

  const updateCellSpanMax = (value) => {
    const newCellSpan = { ...cellSpan, max: value };
    if (value < cellSpan.min) {
      showNotification('Cell span max must be greater than cell span min', 'error');
      newCellSpan.max = cellSpan.min;
    }
    if (!value || !Number.isInteger(value) || value < 1) {
      showNotification('Cell span max must be a positive integer', 'error');
      newCellSpan.max = initialGeneratorConfig.cellSpan.max;
    }
    _updateCellSpan(newCellSpan);
  };

  const updateUseMainPalette = (value) => {
    setUseMainPalette(value);

    if (alwaysRedraw) {
      redrawGridPreview({}, { mainPalette: value ? mainPalette : null });
    }
  };

  const updateMainPalette = (value, action, index) => {
    if (!value) {
      showNotification('Please select a color', 'error');
    }

    let newMainPalette = mainPalette;

    switch (action) {
    case 'add':
      newMainPalette = [...mainPalette, value];
      break;
    case 'replace':
      newMainPalette = mainPalette.map((color, i) => (i === index ? value : color));
      break;
    case 'remove':
      newMainPalette = mainPalette.filter((color, i) => i !== index);
      break;
    }

    setMainPalette(newMainPalette);

    if (alwaysRedraw && useMainPalette) {
      redrawGridPreview({}, { mainPalette: newMainPalette });
    }
  };

  const updateUseSurroundingCells = (value) => {
    setUseSurroundingCells(value);

    if (alwaysRedraw) {
      redrawGridPreview({}, { surroundingCells: value ? surroundingCells : null });
    }
  };

  const _updateSurroundingCells = (newSurroundingCells) => {
    setSurroundingCells(newSurroundingCells);

    if (alwaysRedraw) {
      redrawGridPreview({}, { surroundingCells: useSurroundingCells ? newSurroundingCells : null });
    }
  };

  const updateSurroundingCellsColor = (value) => {
    const newSurroundingCells = { ...surroundingCells, color: value };
    _updateSurroundingCells(newSurroundingCells);
  };

  const updateSurroundingCellsColorVariation = (value) => {
    const newSurroundingCells = { ...surroundingCells, colorVariation: value };
    if (!value || !Number.isInteger(value) || value < 0 || value > 255) {
      showNotification('Surrounding cells color variation must be a positive integer between 0 and 255', 'error');
      newSurroundingCells.colorVariation = initialGeneratorConfig.surroundingCells.colorVariation;
    }
    _updateSurroundingCells(newSurroundingCells);
  };

  const updateSurroundingCellsDepthEstimated = (value) => {
    const newSurroundingCells = { ...surroundingCells, depth: { ...surroundingCells.depth, estimated: value } };
    if (
      !value ||
      isNaN(value) ||
      value < 1 ||
      value < surroundingCells.depth.min ||
      value > surroundingCells.depth.max
    ) {
      showNotification('Surrounding cells depth estimated must be a positive float more than 1 and between min and max', 'error');
      newSurroundingCells.depth.estimated = initialGeneratorConfig.surroundingCells.depth.estimated;
    }
    _updateSurroundingCells(newSurroundingCells);
  };

  const updateSurroundingCellsMinDepth = (value) => {
    const newSurroundingCells = { ...surroundingCells, depth: { ...surroundingCells.depth, min: value } };
    if (value > surroundingCells.depth.max) {
      showNotification('Surrounding cells min depth must be less than surrounding cells max depth', 'error');
      newSurroundingCells.depth.min = surroundingCells.depth.max;
    }
    if (!value || !Number.isInteger(value) || value < 0) {
      showNotification('Surrounding cells min depth must be a positive integer', 'error');
      newSurroundingCells.depth.min = initialGeneratorConfig.surroundingCells.depth.min;
    }
    _updateSurroundingCells(newSurroundingCells);
  };

  const updateSurroundingCellsMaxDepth = (value) => {
    const newSurroundingCells = { ...surroundingCells, depth: { ...surroundingCells.depth, max: value } };
    if (value < surroundingCells.depth.min) {
      showNotification('Surrounding cells max depth must be greater than surrounding cells min depth', 'error');
      newSurroundingCells.depth.max = surroundingCells.depth.min;
    }
    if (!value || !Number.isInteger(value) || value < 0) {
      showNotification('Surrounding cells max depth must be a positive integer', 'error');
      newSurroundingCells.depth.max = initialGeneratorConfig.surroundingCells.depth.max;
    }
    _updateSurroundingCells(newSurroundingCells);
  };

  const updateSurroundingCellsSpanEstimated = (value) => {
    const newSurroundingCells = { ...surroundingCells, span: { ...surroundingCells.span, estimated: value } };
    if (
      !value ||
      isNaN(value) ||
      value < 1 ||
      value < surroundingCells.span.min ||
      value > surroundingCells.span.max
    ) {
      showNotification('Surrounding cells span estimated must be a positive float more than 1 and between min and max', 'error');
      newSurroundingCells.span.estimated = initialGeneratorConfig.surroundingCells.span.estimated;
    }
    _updateSurroundingCells(newSurroundingCells);
  };

  const updateSurroundingCellsMinSpan = (value) => {
    const newSurroundingCells = { ...surroundingCells, span: { ...surroundingCells.span, min: value } };
    if (value > surroundingCells.span.max) {
      showNotification('Surrounding cells min span must be less than surrounding cells max span', 'error');
      newSurroundingCells.span.min = surroundingCells.span.max;
    }
    if (!value || !Number.isInteger(value) || value < 0) {
      showNotification('Surrounding cells min span must be a positive integer', 'error');
      newSurroundingCells.span.min = initialGeneratorConfig.surroundingCells.span.min;
    }
    _updateSurroundingCells(newSurroundingCells);
  };

  const updateSurroundingCellsMaxSpan = (value) => {
    const newSurroundingCells = { ...surroundingCells, span: { ...surroundingCells.span, max: value } };
    if (value < surroundingCells.span.min) {
      showNotification('Surrounding cells max span must be greater than surrounding cells min span', 'error');
      newSurroundingCells.span.max = surroundingCells.span.min;
    }
    if (!value || !Number.isInteger(value) || value < 0) {
      showNotification('Surrounding cells max span must be a positive integer', 'error');
      newSurroundingCells.span.max = initialGeneratorConfig.surroundingCells.span.max;
    }
    _updateSurroundingCells(newSurroundingCells);
  };

  return {
    params: {
      seed,
      useCellSpan,
      cellSpan,
      useMainPalette,
      mainPalette,
      useSurroundingCells,
      surroundingCells,
    },
    controls: {
      updateSeed,
      updateUseCellSpan,
      updateCellSpan: {
        estimated: updateCellSpanEstimated,
        min: updateCellSpanMin,
        max: updateCellSpanMax
      },
      updateUseMainPalette,
      updateMainPalette,
      updateUseSurroundingCells,
      updateSurroundingCells: {
        color: updateSurroundingCellsColor,
        colorVariation: updateSurroundingCellsColorVariation,
        depth: {
          estimated: updateSurroundingCellsDepthEstimated,
          min: updateSurroundingCellsMinDepth,
          max: updateSurroundingCellsMaxDepth
        },
        span: {
          estimated: updateSurroundingCellsSpanEstimated,
          min: updateSurroundingCellsMinSpan,
          max: updateSurroundingCellsMaxSpan
        }
      },
    }
  };

};

/**
 * @typedef {ReturnType<typeof useGeneratorConfig>['controls']} GeneratorConfigControls
 */