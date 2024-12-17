import { useState } from 'react';
import { initialGridConfig } from './useGridConfig.js';
import { useTranslation } from 'react-i18next';
import { isPositiveFloatNonZero, isPositiveInteger, isPositiveIntegerNonZero } from '../utils/validators.js';

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
  overrideSpanWidthFactor: 1,
  leftCorrectionPx: 0,
  topCorrectionPx: 0
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
  const [leftCorrectionPx, setLeftCorrectionPx] = useState(0);
  const [topCorrectionPx, setTopCorrectionPx] = useState(0);

  const { t } = useTranslation();
  const tBaseErrors = 'notifications.gridHtmlConfig.errors';

  const updateMonoCellSize = (value) => {
    let newMonoCellSize = value;
    if (!isPositiveIntegerNonZero(value)) {
      showNotification(t(`${tBaseErrors}.invalidMonoCellSize`), 'error');
      newMonoCellSize = initialGridHtmlPreviewConfig.monoCellSize;
    }
    setMonoCellSize(newMonoCellSize);

    if (alwaysRedrawHtml) {
      redrawGridHtmlPreview({ monoCellSize: newMonoCellSize }, {});
    }
  };

  const updateOverrideBorderRadius = (value) => {
    let newOverrideBorderRadius = value;
    if (!isPositiveInteger(value)) {
      showNotification(t(`${tBaseErrors}.invalidOverrideBorderRadius`), 'error');
      newOverrideBorderRadius = initialGridHtmlPreviewConfig.overrideBorderRadius;
    }
    setOverrideBorderRadius(newOverrideBorderRadius);

    if (alwaysRedrawHtml) {
      redrawGridHtmlPreview({ overrideBorderRadius: newOverrideBorderRadius }, {});
    }
  };

  const updateOverrideHorizontalGapPx = (value) => {
    let newOverrideHorizontalGapPx = value;
    if (!isPositiveInteger(value)) {
      showNotification(t(`${tBaseErrors}.invalidOverrideHorizontalGap`), 'error');
      newOverrideHorizontalGapPx = initialGridHtmlPreviewConfig.overrideHorizontalGapPx;
    }
    setOverrideHorizontalGapPx(newOverrideHorizontalGapPx);

    if (alwaysRedrawHtml) {
      redrawGridHtmlPreview({ overrideHorizontalGapPx: newOverrideHorizontalGapPx }, {});
    }
  };

  const updateOverrideVerticalGapPx = (value) => {
    let newOverrideVerticalGapPx = value;
    if (!isPositiveInteger(value)) {
      showNotification(t(`${tBaseErrors}.invalidOverrideVerticalGap`), 'error');
      newOverrideVerticalGapPx = initialGridHtmlPreviewConfig.overrideVerticalGapPx;
    }
    setOverrideVerticalGapPx(newOverrideVerticalGapPx);

    if (alwaysRedrawHtml) {
      redrawGridHtmlPreview({ overrideVerticalGapPx: newOverrideVerticalGapPx }, {});
    }
  };

  const updateOverrideSpanWidthFactor = (value) => {
    let newOverrideSpanWidthFactor = value;
    if (!isPositiveFloatNonZero(value)) {
      showNotification(t(`${tBaseErrors}.invalidOverrideSpanWidthFactor`), 'error');
      newOverrideSpanWidthFactor = initialGridHtmlPreviewConfig.overrideSpanWidthFactor;
    }
    setOverrideSpanWidthFactor(newOverrideSpanWidthFactor);

    if (alwaysRedrawHtml) {
      redrawGridHtmlPreview({ overrideSpanWidthFactor: newOverrideSpanWidthFactor }, {});
    }
  };

  const updateLeftCorrectionPx = (value) => {
    let newLeftCorrectionPx = value;
    if (!Number.isInteger(value)) {
      showNotification(t(`${tBaseErrors}.invalidLeftCorrection`), 'error');
      newLeftCorrectionPx = initialGridHtmlPreviewConfig.leftCorrectionPx;
    }
    setLeftCorrectionPx(newLeftCorrectionPx);

    if (alwaysRedrawHtml) {
      redrawGridHtmlPreview({ leftCorrectionPx: newLeftCorrectionPx }, {});
    }
  };

  const updateTopCorrectionPx = (value) => {
    let newTopCorrectionPx = value;
    if (!Number.isInteger(value)) {
      showNotification(t(`${tBaseErrors}.invalidTopCorrection`), 'error');
      newTopCorrectionPx = initialGridHtmlPreviewConfig.topCorrectionPx;
    }
    setTopCorrectionPx(newTopCorrectionPx);

    if (alwaysRedrawHtml) {
      redrawGridHtmlPreview({ topCorrectionPx: newTopCorrectionPx }, {});
    }
  };

  return {
    params: {
      monoCellSize,
      overrideBorderRadius,
      overrideHorizontalGapPx,
      overrideVerticalGapPx,
      overrideSpanWidthFactor,
      leftCorrectionPx,
      topCorrectionPx
    },
    controls: {
      updateMonoCellSize,
      updateOverrideBorderRadius,
      updateOverrideHorizontalGapPx,
      updateOverrideVerticalGapPx,
      updateOverrideSpanWidthFactor,
      updateLeftCorrectionPx,
      updateTopCorrectionPx
    }
  };

};

/**
 * @typedef {ReturnType<typeof useGridHtmlConfig>['controls']} GridHtmlConfigControls
 */