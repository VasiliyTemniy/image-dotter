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
  overrideVerticalGapPx: initialGridConfig.verticalGapPx
};

/**
 *
 * @param {(message: string) => void} showNotification
 * @param {(
 *  changedGridParams: GridParams,
 *  changedGridHtmlParams: GridHtmlVisualParams,
 *  changedGeneratorParams: GeneratorParams
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

  const updateMonoCellSize = (value) => {
    let newMonoCellSize = value;
    if (!value || value < 1) {
      showNotification('Please select a valid mono cell size', 'error');
      newMonoCellSize = initialGridHtmlPreviewConfig.monoCellSize;
    }
    setMonoCellSize(newMonoCellSize);
    redrawGridHtmlPreview(null, { monoCellSize: newMonoCellSize }, null);
  };

  const updateOverrideBorderRadius = (value) => {
    let newOverrideBorderRadius = value;
    if (!value || value < 0) {
      showNotification('Please select a valid override border radius', 'error');
      newOverrideBorderRadius = initialGridHtmlPreviewConfig.overrideBorderRadius;
    }
    setOverrideBorderRadius(newOverrideBorderRadius);
    redrawGridHtmlPreview(null, null, { overrideBorderRadius: newOverrideBorderRadius });
  };

  const updateOverrideHorizontalGapPx = (value) => {
    let newOverrideHorizontalGapPx = value;
    if (!value || value < 0) {
      showNotification('Please select a valid override horizontal gap', 'error');
      newOverrideHorizontalGapPx = initialGridHtmlPreviewConfig.overrideHorizontalGapPx;
    }
    setOverrideHorizontalGapPx(newOverrideHorizontalGapPx);
    redrawGridHtmlPreview(null, null, { overrideHorizontalGapPx: newOverrideHorizontalGapPx });
  };

  const updateOverrideVerticalGapPx = (value) => {
    let newOverrideVerticalGapPx = value;
    if (!value || value < 0) {
      showNotification('Please select a valid override vertical gap', 'error');
      newOverrideVerticalGapPx = initialGridHtmlPreviewConfig.overrideVerticalGapPx;
    }
    setOverrideVerticalGapPx(newOverrideVerticalGapPx);
    redrawGridHtmlPreview(null, null, { overrideVerticalGapPx: newOverrideVerticalGapPx });
  };

  return {
    params: {
      monoCellSize,
      overrideBorderRadius,
      overrideHorizontalGapPx,
      overrideVerticalGapPx,
    },
    controls: {
      updateMonoCellSize,
      updateOverrideBorderRadius,
      updateOverrideHorizontalGapPx,
      updateOverrideVerticalGapPx
    }
  };

};

/**
 * @typedef {ReturnType<typeof useGridHtmlConfig>['controls']} GridHtmlConfigControls
 */