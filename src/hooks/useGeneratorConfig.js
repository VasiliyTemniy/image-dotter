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
  useCellSpan: false,
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
    minDepth: 2,
    maxDepth: 3
  }
};

/**
 *
 * @param {(message: string) => void} showNotification
 * @param {HTMLCanvasElement} image
 * @param {(changedGridParams: GridParams, changedGeneratorParams: GeneratorParams) => void} redrawGridPreview
 * @param {boolean} alwaysRedraw
 */
export const useGeneratorConfig = (
  showNotification,
  image,
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
    if (!image) {
      return;
    }

    if (alwaysRedraw) {
      redrawGridPreview({}, { seed: value }, {});
    }
  };

  const updateUseCellSpan = (value) => {
    setUseCellSpan(value);
    if (!image) {
      return;
    }

    if (alwaysRedraw) {
      redrawGridPreview({}, { cellSpan: value ? cellSpan : null }, {});
    }
  };

  const _updateCellSpan = (newCellSpan) => {
    setCellSpan(newCellSpan);
    if (!image) {
      return;
    }

    if (alwaysRedraw) {
      redrawGridPreview({}, { cellSpan: useCellSpan ? newCellSpan : null }, {});
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
    if (!image) {
      return;
    }

    if (alwaysRedraw) {
      redrawGridPreview({}, { mainPalette: value ? mainPalette : null }, {});
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
    if (!image) {
      return;
    }

    if (alwaysRedraw && useMainPalette) {
      redrawGridPreview({}, { mainPalette: newMainPalette }, {});
    }
  };

  const updateUseSurroundingCells = (value) => {
    setUseSurroundingCells(value);
    if (!image) {
      return;
    }

    if (alwaysRedraw) {
      redrawGridPreview({}, { surroundingCells: value ? surroundingCells : null }, {});
    }
  };

  const _updateSurroundingCells = (newSurroundingCells) => {
    setSurroundingCells(newSurroundingCells);
    if (!image) {
      return;
    }

    if (alwaysRedraw) {
      redrawGridPreview({}, { surroundingCells: useSurroundingCells ? newSurroundingCells : null }, {});
    }
  };

  const updateSurroundingCellsColor = (value) => {
    const newSurroundingCells = { ...surroundingCells, color: value };
    _updateSurroundingCells(newSurroundingCells);
  };

  const updateSurroundingCellsMinDepth = (value) => {
    const newSurroundingCells = { ...surroundingCells, minDepth: value };
    if (value > surroundingCells.maxDepth) {
      showNotification('Surrounding cells min depth must be less than surrounding cells max depth', 'error');
      newSurroundingCells.minDepth = surroundingCells.maxDepth;
    }
    if (!value || !Number.isInteger(value) || value < 0) {
      showNotification('Surrounding cells min depth must be a positive integer', 'error');
      newSurroundingCells.minDepth = initialGeneratorConfig.surroundingCells.minDepth;
    }
    _updateSurroundingCells(newSurroundingCells);
  };

  const updateSurroundingCellsMaxDepth = (value) => {
    const newSurroundingCells = { ...surroundingCells, maxDepth: value };
    if (value < surroundingCells.minDepth) {
      showNotification('Surrounding cells max depth must be greater than surrounding cells min depth', 'error');
      newSurroundingCells.maxDepth = surroundingCells.minDepth;
    }
    if (!value || !Number.isInteger(value) || value < 0) {
      showNotification('Surrounding cells max depth must be a positive integer', 'error');
      newSurroundingCells.maxDepth = initialGeneratorConfig.surroundingCells.maxDepth;
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
        minDepth: updateSurroundingCellsMinDepth,
        maxDepth: updateSurroundingCellsMaxDepth
      },
    }
  };

};

/**
 * @typedef {ReturnType<typeof useGeneratorConfig>['controls']} GeneratorConfigControls
 */