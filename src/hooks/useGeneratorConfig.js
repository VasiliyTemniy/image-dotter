import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isFloatBetween, isPositiveInteger, isPositiveIntegerNonZero } from '../utils/validators.js';

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
  // useMainPalette: false,
  useMainPalette: true,
  mainPalette: [
    '#56B3B4FF',
    '#EA5E5EFF',
    '#F7BA3EFF',
    '#BF85BFFF'
  ],
  // useSurroundingCells: false,
  useSurroundingCells: true,
  surroundingCells: {
    color: '#325E9F3D',
    colorVariation: 4,
    alphaVariation: 4,
    height: {
      estimated: 1,
      min: 1,
      max: 2
    },
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
 * @param {(changedGridParams: GridParams, changedGeneratorParams: GeneratorParams) => void} recalcGrid
 * @param {boolean} alwaysRecalc
 */
export const useGeneratorConfig = (
  showNotification,
  recalcGrid,
  alwaysRecalc
) => {

  // Generator params
  const [seed, setSeed] = useState(initialGeneratorConfig.seed);
  const [useCellSpan, setUseCellSpan] = useState(initialGeneratorConfig.useCellSpan);
  const [cellSpan, setCellSpan] = useState(initialGeneratorConfig.cellSpan);
  const [useMainPalette, setUseMainPalette] = useState(initialGeneratorConfig.useMainPalette);
  const [mainPalette, setMainPalette] = useState(initialGeneratorConfig.mainPalette);
  const [useSurroundingCells, setUseSurroundingCells] = useState(initialGeneratorConfig.useSurroundingCells);
  const [surroundingCells, setSurroundingCells] = useState(initialGeneratorConfig.surroundingCells);

  const { t } = useTranslation();
  const tBaseErrors = 'notifications.generatorConfig.errors';

  // Generator params
  const updateSeed = (value) => {
    if (!isPositiveInteger(value) || value >= 100000) {
      showNotification(t(`${tBaseErrors}.invalidSeed`), 'error');
      return;
    }
    setSeed(value);

    if (alwaysRecalc) {
      recalcGrid({}, { seed: value });
    }
  };

  const updateUseCellSpan = (value) => {
    setUseCellSpan(value);

    if (alwaysRecalc) {
      recalcGrid({}, { cellSpan: value ? cellSpan : null });
    }
  };

  const _updateCellSpan = (newCellSpan) => {
    setCellSpan(newCellSpan);

    if (alwaysRecalc) {
      recalcGrid({}, { cellSpan: useCellSpan ? newCellSpan : null });
    }
  };

  const updateCellSpanEstimated = (value) => {
    const newCellSpan = { ...cellSpan, estimated: value };
    if (!isFloatBetween(value, Math.min(cellSpan.min, 1), cellSpan.max)) {
      showNotification(t(`${tBaseErrors}.invalidCellSpanEstimated`), 'error');
      newCellSpan.estimated = initialGeneratorConfig.cellSpan.estimated;
      if (newCellSpan.estimated < cellSpan.min) {
        newCellSpan.estimated = cellSpan.min;
      } else if (newCellSpan.estimated > cellSpan.max) {
        newCellSpan.estimated = cellSpan.max;
      }
    }
    _updateCellSpan(newCellSpan);
  };

  const updateCellSpanMin = (value) => {
    const newCellSpan = { ...cellSpan, min: value };
    if (value > cellSpan.max) {
      showNotification(t(`${tBaseErrors}.cellSpanMinLessMax`), 'error');
      newCellSpan.min = cellSpan.max;
    }
    if (!isPositiveIntegerNonZero(value)) {
      showNotification(t(`${tBaseErrors}.invalidCellSpanMin`), 'error');
      newCellSpan.min = initialGeneratorConfig.cellSpan.min;
    }
    _updateCellSpan(newCellSpan);
  };

  const updateCellSpanMax = (value) => {
    const newCellSpan = { ...cellSpan, max: value };
    if (value < cellSpan.min) {
      showNotification(t(`${tBaseErrors}.cellSpanMaxGreaterMin`), 'error');
      newCellSpan.max = cellSpan.min;
    }
    if (!isPositiveIntegerNonZero(value)) {
      showNotification(t(`${tBaseErrors}.invalidCellSpanMax`), 'error');
      newCellSpan.max = initialGeneratorConfig.cellSpan.max;
    }
    _updateCellSpan(newCellSpan);
  };

  const updateUseMainPalette = (value) => {
    setUseMainPalette(value);

    if (alwaysRecalc) {
      recalcGrid({}, { mainPalette: value ? mainPalette : null });
    }
  };

  const updateMainPalette = (value, action, index) => {
    if (!value) {
      showNotification(t(`${tBaseErrors}.noColorChosen`), 'error');
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
      if (mainPalette.length === 1) {
        showNotification(t(`${tBaseErrors}.oneColorLeft`), 'error');
        return;
      }
      newMainPalette = mainPalette.filter((color, i) => i !== index);
      break;
    }

    setMainPalette(newMainPalette);

    if (alwaysRecalc && useMainPalette) {
      recalcGrid({}, { mainPalette: newMainPalette });
    }
  };

  const updateUseSurroundingCells = (value) => {
    setUseSurroundingCells(value);

    if (alwaysRecalc) {
      recalcGrid({}, { surroundingCells: value ? surroundingCells : null });
    }
  };

  const _updateSurroundingCells = (newSurroundingCells) => {
    setSurroundingCells(newSurroundingCells);

    if (alwaysRecalc) {
      recalcGrid({}, { surroundingCells: useSurroundingCells ? newSurroundingCells : null });
    }
  };

  const updateSurroundingCellsColor = (value) => {
    const newSurroundingCells = { ...surroundingCells, color: value };
    _updateSurroundingCells(newSurroundingCells);
  };

  const updateSurroundingCellsColorVariation = (value) => {
    const newSurroundingCells = { ...surroundingCells, colorVariation: value };
    if (!isPositiveInteger(value) || value > 255) {
      showNotification(t(`${tBaseErrors}.invalidSurroundingCellsColorVariation`), 'error');
      newSurroundingCells.colorVariation = initialGeneratorConfig.surroundingCells.colorVariation;
    }
    _updateSurroundingCells(newSurroundingCells);
  };

  const updateSurroundingCellsAlphaVariation = (value) => {
    const newSurroundingCells = { ...surroundingCells, alphaVariation: value };
    if (!isPositiveInteger(value) || value > 255) {
      showNotification(t(`${tBaseErrors}.invalidSurroundingCellsAlphaVariation`), 'error');
      newSurroundingCells.alphaVariation = initialGeneratorConfig.surroundingCells.alphaVariation;
    }
    _updateSurroundingCells(newSurroundingCells);
  };

  const updateSurroundingCellsHeightEstimated = (value) => {
    const newSurroundingCells = { ...surroundingCells, height: { ...surroundingCells.height, estimated: value } };
    if (!isFloatBetween(value, Math.min(surroundingCells.height.min, 1), surroundingCells.height.max)) {
      showNotification(t(`${tBaseErrors}.invalidSurroundingCellsHeightEstimated`), 'error');
      newSurroundingCells.height.estimated = initialGeneratorConfig.surroundingCells.height.estimated;
      if (surroundingCells.height.estimated < surroundingCells.height.min) {
        newSurroundingCells.height.estimated = surroundingCells.height.min;
      } else if (surroundingCells.height.estimated > surroundingCells.height.max) {
        newSurroundingCells.height.estimated = surroundingCells.height.max;
      }
    }
    _updateSurroundingCells(newSurroundingCells);
  };

  const updateSurroundingCellsMinHeight = (value) => {
    const newSurroundingCells = { ...surroundingCells, height: { ...surroundingCells.height, min: value } };
    if (value > surroundingCells.height.max) {
      showNotification(t(`${tBaseErrors}.surroundingCellsHeightMinLessMax`), 'error');
      newSurroundingCells.height.min = surroundingCells.height.max;
    }
    if (!isPositiveInteger(value)) {
      showNotification(t(`${tBaseErrors}.invalidSurroundingCellsMinHeight`), 'error');
      newSurroundingCells.height.min = initialGeneratorConfig.surroundingCells.height.min;
    }
    _updateSurroundingCells(newSurroundingCells);
  };

  const updateSurroundingCellsMaxHeight = (value) => {
    const newSurroundingCells = { ...surroundingCells, height: { ...surroundingCells.height, max: value } };
    if (value < surroundingCells.height.min) {
      showNotification(t(`${tBaseErrors}.surroundingCellsHeightMaxGreaterMin`), 'error');
      newSurroundingCells.height.max = surroundingCells.height.min;
    }
    if (!isPositiveInteger(value)) {
      showNotification(t(`${tBaseErrors}.invalidSurroundingCellsMaxHeight`), 'error');
      newSurroundingCells.height.max = initialGeneratorConfig.surroundingCells.height.max;
    }
    _updateSurroundingCells(newSurroundingCells);
  };

  const updateSurroundingCellsDepthEstimated = (value) => {
    const newSurroundingCells = { ...surroundingCells, depth: { ...surroundingCells.depth, estimated: value } };
    if (!isFloatBetween(value, Math.min(surroundingCells.depth.min, 1), surroundingCells.depth.max)) {
      showNotification(t(`${tBaseErrors}.invalidSurroundingCellsDepthEstimated`), 'error');
      newSurroundingCells.depth.estimated = initialGeneratorConfig.surroundingCells.depth.estimated;
      if (surroundingCells.depth.estimated < surroundingCells.depth.min) {
        newSurroundingCells.depth.estimated = surroundingCells.depth.min;
      } else if (surroundingCells.depth.estimated > surroundingCells.depth.max) {
        newSurroundingCells.depth.estimated = surroundingCells.depth.max;
      }
    }
    _updateSurroundingCells(newSurroundingCells);
  };

  const updateSurroundingCellsMinDepth = (value) => {
    const newSurroundingCells = { ...surroundingCells, depth: { ...surroundingCells.depth, min: value } };
    if (value > surroundingCells.depth.max) {
      showNotification(t(`${tBaseErrors}.surroundingCellsDepthMinLessMax`), 'error');
      newSurroundingCells.depth.min = surroundingCells.depth.max;
    }
    if (!isPositiveInteger(value)) {
      showNotification(t(`${tBaseErrors}.invalidSurroundingCellsMinDepth`), 'error');
      newSurroundingCells.depth.min = initialGeneratorConfig.surroundingCells.depth.min;
    }
    _updateSurroundingCells(newSurroundingCells);
  };

  const updateSurroundingCellsMaxDepth = (value) => {
    const newSurroundingCells = { ...surroundingCells, depth: { ...surroundingCells.depth, max: value } };
    if (value < surroundingCells.depth.min) {
      showNotification(t(`${tBaseErrors}.surroundingCellsDepthMaxGreaterMin`), 'error');
      newSurroundingCells.depth.max = surroundingCells.depth.min;
    }
    if (!isPositiveInteger(value)) {
      showNotification(t(`${tBaseErrors}.invalidSurroundingCellsMaxDepth`), 'error');
      newSurroundingCells.depth.max = initialGeneratorConfig.surroundingCells.depth.max;
    }
    _updateSurroundingCells(newSurroundingCells);
  };

  const updateSurroundingCellsSpanEstimated = (value) => {
    const newSurroundingCells = { ...surroundingCells, span: { ...surroundingCells.span, estimated: value } };
    if (!isFloatBetween(value, Math.min(surroundingCells.span.min, 1), surroundingCells.span.max)) {
      showNotification(t(`${tBaseErrors}.invalidSurroundingCellsSpanEstimated`), 'error');
      newSurroundingCells.span.estimated = initialGeneratorConfig.surroundingCells.span.estimated;
      if (surroundingCells.span.estimated < surroundingCells.span.min) {
        newSurroundingCells.span.estimated = surroundingCells.span.min;
      } else if (surroundingCells.span.estimated > surroundingCells.span.max) {
        newSurroundingCells.span.estimated = surroundingCells.span.max;
      }
    }
    _updateSurroundingCells(newSurroundingCells);
  };

  const updateSurroundingCellsMinSpan = (value) => {
    const newSurroundingCells = { ...surroundingCells, span: { ...surroundingCells.span, min: value } };
    if (value > surroundingCells.span.max) {
      showNotification(t(`${tBaseErrors}.surroundingCellsSpanMinLessMax`), 'error');
      newSurroundingCells.span.min = surroundingCells.span.max;
    }
    if (!isPositiveInteger(value)) {
      showNotification(t(`${tBaseErrors}.invalidSurroundingCellsMinSpan`), 'error');
      newSurroundingCells.span.min = initialGeneratorConfig.surroundingCells.span.min;
    }
    _updateSurroundingCells(newSurroundingCells);
  };

  const updateSurroundingCellsMaxSpan = (value) => {
    const newSurroundingCells = { ...surroundingCells, span: { ...surroundingCells.span, max: value } };
    if (value < surroundingCells.span.min) {
      showNotification(t(`${tBaseErrors}.surroundingCellsSpanMaxGreaterMin`), 'error');
      newSurroundingCells.span.max = surroundingCells.span.min;
    }
    if (!isPositiveInteger(value)) {
      showNotification(t(`${tBaseErrors}.invalidSurroundingCellsMaxSpan`), 'error');
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
        alphaVariation: updateSurroundingCellsAlphaVariation,
        height: {
          estimated: updateSurroundingCellsHeightEstimated,
          min: updateSurroundingCellsMinHeight,
          max: updateSurroundingCellsMaxHeight
        },
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