import { useState } from 'react';

/**
 * @typedef {import('../index.d.ts').AnimationConfigState} AnimationConfigState
 */

/**
 * @type {AnimationConfigState}
 */
const initialAnimationConfig = {
  type: 'slide',
  direction: 'h-sides',
  duration: 1000,
  delay: {
    min: 0,
    max: 0
  },
  easing: 'ease-out'
};

/**
 *
 * @param {(message: string) => void} showNotification
//  * @param {boolean} alwaysRedraw
 */
export const useAnimationConfig = (
  showNotification,
  // alwaysRedraw
) => {

  const [type, setType] = useState(initialAnimationConfig.type);
  const [direction, setDirection] = useState(initialAnimationConfig.direction);
  const [duration, setDuration] = useState(initialAnimationConfig.duration);
  const [delay, setDelay] = useState(initialAnimationConfig.delay);
  const [easing, setEasing] = useState(initialAnimationConfig.easing);

  // Animation params

  const updateType = (value) => {
    let newType = value;
    if (!value || !(['slide', 'appear'].includes(value))) {
      showNotification('Please select a valid animation type', 'error');
      newType = initialAnimationConfig.type;
    }
    setType(newType);
    // Maybe redraw the html grid output?
  };

  const updateDirection = (value) => {
    let newDirection = value;
    if (
      (!value && value !== null) ||
      ['left-to-right', 'right-to-left', 'top-to-bottom', 'bottom-to-top', 'h-sides', 'v-sides', 'all'].includes(value) === false
    ) {
      showNotification('Please select a valid animation direction', 'error');
      newDirection = initialAnimationConfig.direction;
    }
    setDirection(newDirection);
    // Maybe redraw the html grid output?
  };

  const updateDuration = (value) => {
    let newDuration = value;
    if (!value || !Number.isInteger(Number(value)) || Number(value) < 0) {
      showNotification(' duration must be a positive integer', 'error');
      newDuration = initialAnimationConfig.duration;
    }
    setDuration(newDuration);
    // Maybe redraw the html grid output?
  };

  const _updateDelay = (newDelay) => {
    setDelay(newDelay);
    // Maybe redraw the html grid output?
  };

  const updateDelayMin = (value) => {
    const newDelay = { ...delay, min: value };
    if (!value || !Number.isInteger(Number(value)) || Number(value) < 0) {
      showNotification(' delay min must be a positive integer', 'error');
      newDelay.min = initialAnimationConfig.delay.min;
    }
    _updateDelay(newDelay);
  };

  const updateDelayMax = (value) => {
    const newDelay = { ...delay, max: value };
    if (!value || !Number.isInteger(Number(value)) || Number(value) < 0) {
      showNotification(' delay max must be a positive integer', 'error');
      newDelay.max = initialAnimationConfig.delay.max;
    }
    _updateDelay(newDelay);
  };

  const updateEasing = (value) => {
    let newEasing = value;
    if (!value || ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out'].includes(value) === false) {
      showNotification('Please select a valid animation easing', 'error');
      newEasing = initialAnimationConfig.easing;
    }
    setEasing(newEasing);
    // Maybe redraw the html grid output?
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