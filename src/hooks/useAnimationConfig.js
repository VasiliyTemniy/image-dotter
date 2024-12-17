import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isPositiveInteger, isPositiveIntegerNonZero } from '../utils/validators.js';

/**
 * @typedef {import('../index.d.ts').AnimationConfigState} AnimationConfigState
 * @typedef {import('../index.d.ts').AnimationParams} AnimationParams
 * @typedef {import('../index.d.ts').GridHtmlVisualParams} GridHtmlVisualParams
 */

/**
 * @type {AnimationConfigState}
 */
const initialAnimationConfig = {
  type: 'slide',
  direction: 'h-sides',
  duration: 2000,
  delay: {
    min: 100,
    max: 2000
  },
  easing: 'ease-in-out'
};

/**
 *
 * @param {(message: string) => void} showNotification
 * @param {(
 *  changedHtmlGridParams: GridHtmlVisualParams,
 *  changedAnimationParams: AnimationParams
 * ) => void} redrawGridHtmlPreview
 * @param {boolean} alwaysRedraw
 */
export const useAnimationConfig = (
  showNotification,
  redrawGridHtmlPreview,
  alwaysRedrawHtml
) => {

  const [type, setType] = useState(initialAnimationConfig.type);
  const [direction, setDirection] = useState(initialAnimationConfig.direction);
  const [duration, setDuration] = useState(initialAnimationConfig.duration);
  const [delay, setDelay] = useState(initialAnimationConfig.delay);
  const [easing, setEasing] = useState(initialAnimationConfig.easing);

  const { t } = useTranslation();
  const tBaseErrors = 'notifications.animationConfig.errors';

  // Animation params

  const updateType = (value) => {
    let newType = value;
    if (!value || !(['slide', 'appear'].includes(value))) {
      showNotification(t(`${tBaseErrors}.invalidType`), 'error');
      newType = initialAnimationConfig.type;
    }

    setType(newType);

    if (alwaysRedrawHtml) {
      redrawGridHtmlPreview({}, { type: newType });
    }
  };

  const updateDirection = (value) => {
    let newDirection = value;
    if (
      (!value && value !== null) ||
      ['left-to-right', 'right-to-left', 'top-to-bottom', 'bottom-to-top', 'h-sides', 'v-sides', 'all'].includes(value) === false
    ) {
      showNotification(t(`${tBaseErrors}.invalidDirection`), 'error');
      newDirection = initialAnimationConfig.direction;
    }
    setDirection(newDirection);

    if (alwaysRedrawHtml) {
      redrawGridHtmlPreview({}, { direction: newDirection });
    }
  };

  const updateDuration = (value) => {
    let newDuration = value;
    if (!isPositiveIntegerNonZero(value)) {
      showNotification(t(`${tBaseErrors}.invalidDuration`), 'error');
      newDuration = initialAnimationConfig.duration;
    }
    setDuration(newDuration);

    if (alwaysRedrawHtml) {
      redrawGridHtmlPreview({}, { duration: newDuration });
    }
  };

  const _updateDelay = (newDelay) => {
    setDelay(newDelay);

    if (alwaysRedrawHtml) {
      redrawGridHtmlPreview({}, { delay: newDelay });
    }
  };

  const updateDelayMin = (value) => {
    const newDelay = { ...delay, min: value };
    if (!isPositiveInteger(value)) {
      showNotification(t(`${tBaseErrors}.invalidDelayMin`), 'error');
      newDelay.min = initialAnimationConfig.delay.min;
    }
    _updateDelay(newDelay);
  };

  const updateDelayMax = (value) => {
    const newDelay = { ...delay, max: value };
    if (!isPositiveInteger(value)) {
      showNotification(t(`${tBaseErrors}.invalidDelayMax`), 'error');
      newDelay.max = initialAnimationConfig.delay.max;
    }
    _updateDelay(newDelay);
  };

  const updateEasing = (value) => {
    let newEasing = value;
    if (!value || ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out'].includes(value) === false) {
      showNotification(t(`${tBaseErrors}.invalidEasing`), 'error');
      newEasing = initialAnimationConfig.easing;
    }
    setEasing(newEasing);

    if (alwaysRedrawHtml) {
      redrawGridHtmlPreview({}, { easing: newEasing });
    }
  };

  return {
    params: {
      type,
      direction,
      duration,
      delay,
      easing
    },
    controls: {
      updateType,
      updateDirection,
      updateDuration,
      updateDelay: {
        min: updateDelayMin,
        max: updateDelayMax
      },
      updateEasing
    }
  };

};

/**
 * @typedef {ReturnType<typeof useAnimationConfig>['controls']} AnimationConfigControls
 */