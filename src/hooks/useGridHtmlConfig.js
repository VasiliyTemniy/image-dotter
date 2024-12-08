import { useState } from 'react';
import { initialGridConfig } from './useGridConfig.js';

/**
 * @typedef {import('../index').GridHtmlVisualParams} GridHtmlVisualParams
 */

/**
 * @type {GridHtmlVisualParams}
 */
const initialGridHtmlPreviewConfig = {
  monoCellSize: 8,
  overrideBorderRadius: initialGridConfig.borderRadius,
  overrideHorizontalGapPx: initialGridConfig.horizontalGapPx,
  overrideVerticalGapPx: initialGridConfig.verticalGapPx,
  overrideSpanWidthFactor: 1
};

/**
 *
 * @param {(message: string) => void} showNotification
 * @param {(
*  changedHtmlGridParams: GridHtmlVisualParams,
*  changedAnimationParams: AnimationParams
* ) => void} redrawGridHtmlPreview
 * @param {boolean} alwaysRedrawHtml
 */
export const useGridHtmlConfig = (
  showNotification,
  redrawGridHtmlPreview,
  alwaysRedrawHtml
) => {

  const [monoCellSize, setMonoCellSize] = useState(initialGridHtmlPreviewConfig.monoCellSize);
  const [overrideBorderRadius, setOverrideBorderRadius] = useState(initialGridHtmlPreviewConfig.overrideBorderRadius);
  const [overrideHorizontalGapPx, setOverrideHorizontalGapPx] = useState(initialGridHtmlPreviewConfig.overrideHorizontalGapPx);
  const [overrideVerticalGapPx, setOverrideVerticalGapPx] = useState(initialGridHtmlPreviewConfig.overrideVerticalGapPx);
  const [overrideSpanWidthFactor, setOverrideSpanWidthFactor] = useState(initialGridHtmlPreviewConfig.overrideSpanWidthFactor);

  const updateMonoCellSize = (value) => {
    let newMonoCellSize = value;
    if (value === null || value === undefined || value < 1) {
      showNotification('Please select a valid mono cell size', 'error');
      newMonoCellSize = initialGridHtmlPreviewConfig.monoCellSize;
    }
    setMonoCellSize(newMonoCellSize);

    if (alwaysRedrawHtml) {
      redrawGridHtmlPreview({ monoCellSize: newMonoCellSize }, {});
    }
  };

  const updateOverrideBorderRadius = (value) => {
    let newOverrideBorderRadius = value;
    if (value === null || value === undefined || value < 0) {
      showNotification('Please select a valid override border radius', 'error');
      newOverrideBorderRadius = initialGridHtmlPreviewConfig.overrideBorderRadius;
    }
    setOverrideBorderRadius(newOverrideBorderRadius);

    if (alwaysRedrawHtml) {
      redrawGridHtmlPreview({ overrideBorderRadius: newOverrideBorderRadius }, {});
    }
  };

  const updateOverrideHorizontalGapPx = (value) => {
    let newOverrideHorizontalGapPx = value;
    if (value === null || value === undefined || value < 0) {
      showNotification('Please select a valid override horizontal gap', 'error');
      newOverrideHorizontalGapPx = initialGridHtmlPreviewConfig.overrideHorizontalGapPx;
    }
    setOverrideHorizontalGapPx(newOverrideHorizontalGapPx);

    if (alwaysRedrawHtml) {
      redrawGridHtmlPreview({ overrideHorizontalGapPx: newOverrideHorizontalGapPx }, {});
    }
  };

  const updateOverrideVerticalGapPx = (value) => {
    let newOverrideVerticalGapPx = value;
    if (value === null || value === undefined || value < 0) {
      showNotification('Please select a valid override vertical gap', 'error');
      newOverrideVerticalGapPx = initialGridHtmlPreviewConfig.overrideVerticalGapPx;
    }
    setOverrideVerticalGapPx(newOverrideVerticalGapPx);

    if (alwaysRedrawHtml) {
      redrawGridHtmlPreview({ overrideVerticalGapPx: newOverrideVerticalGapPx }, {});
    }
  };

  const updateOverrideSpanWidthFactor = (value) => {
    let newOverrideSpanWidthFactor = value;
    if (value === null || value === undefined || value < 0) {
      showNotification('Please select a valid override span width factor', 'error');
      newOverrideSpanWidthFactor = initialGridHtmlPreviewConfig.overrideSpanWidthFactor;
    }
    setOverrideSpanWidthFactor(newOverrideSpanWidthFactor);

    if (alwaysRedrawHtml) {
      redrawGridHtmlPreview({ overrideSpanWidthFactor: newOverrideSpanWidthFactor }, {});
    }
  };

  return {
    params: {
      monoCellSize,
      overrideBorderRadius,
      overrideHorizontalGapPx,
      overrideVerticalGapPx,
      overrideSpanWidthFactor
    },
    controls: {
      updateMonoCellSize,
      updateOverrideBorderRadius,
      updateOverrideHorizontalGapPx,
      updateOverrideVerticalGapPx,
      updateOverrideSpanWidthFactor
    }
  };

};

/**
 * @typedef {ReturnType<typeof useGridHtmlConfig>['controls']} GridHtmlConfigControls
 */