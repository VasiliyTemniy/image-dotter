/**
 * Checks if value is a positive integer
 * @param {unknown} value
 * @returns {boolean}
 */
export const isPositiveInteger = (value) => {
  return Number.isInteger(value) && value >= 0;
};

/**
 * Checks if value is a positive integer greater than 0
 * @param {unknown} value
 * @returns {boolean}
 */
export const isPositiveIntegerNonZero = (value) => {
  return Number.isInteger(value) && value > 0;
};

/**
 * Checks if value is a positive float
 * @param {unknown} value
 * @returns {boolean}
 */
export const isPositiveFloat = (value) => {
  return value !== null && value !== undefined && !isNaN(value) && value >= 0;
};

/**
 * Checks if value is a positive float greater than 0
 * @param {unknown} value
 * @returns {boolean}
 */
export const isPositiveFloatNonZero = (value) => {
  return !!value && !isNaN(value) && value > 0;
};

/**
 * Checks if value is a float between min and max
 * @param {unknown} value
 * @param {number} min
 * @param {number} max
 * @returns {boolean}
 */
export const isFloatBetween = (value, min, max) => {
  return value !== null && value !== undefined && !isNaN(value) && value >= min && value <= max;
};

/**
 * Checks if value is a positive integer
 *
 * If validation fails, callback is called if one was provided
 *
 * Returns true if value is a positive integer
 * @param {unknown} value
 * @param {Function | (() => {}) | null | undefined} [callback] - function to be called if validation fails
 * @param {any} [callbackParams] - parameters to be passed to callback
 * @returns {boolean}
 */
export const validatePositiveInteger = (value, callback, callbackParams) => {
  if (!isPositiveInteger(value)) {
    if (callback) {
      callback(callbackParams);
    }
    return false;
  }
  return true;
};

/**
 * Checks if value is a positive integer greater than 0
 *
 * If validation fails, callback is called if one was provided
 *
 * Returns true if value is a positive integer greater than 0
 * @param {unknown} value
 * @param {Function | (() => {}) | null | undefined} [callback] - function to be called if validation fails
 * @param {any} [callbackParams] - parameters to be passed to callback
 * @returns {boolean}
 */
export const validatePositiveIntegerNonZero = (value, callback, callbackParams) => {
  if (!isPositiveIntegerNonZero(value)) {
    if (callback) {
      callback(callbackParams);
    }
    return false;
  }
  return true;
};

/**
 * Checks if value is a float between min and max
 *
 * If validation fails, callback is called if one was provided
 *
 * Returns true if value is a float between min and max
 * @param {unknown} value
 * @param {number} min
 * @param {number} max
 * @param {Function | (() => {}) | null | undefined} [callback] - function to be called if validation fails
 * @param {any} [callbackParams] - parameters to be passed to callback
 * @returns {boolean}
 */
export const validateFloatBetween = (value, min, max, callback, callbackParams) => {
  if (!isFloatBetween(value, min, max)) {
    if (callback) {
      callback(callbackParams);
    }
    return false;
  }
  return true;
};

/**
 * Checks if value is an element of array
 *
 * If validation fails, callback is called if one was provided
 *
 * Returns true if value is an element of array
 *
 * Attention! Nulls and undefineds are accounted as invalid
 * @param {unknown} value
 * @param {Array} array
 * @param {Function | (() => {}) | null | undefined} [callback] - function to be called if validation fails
 * @param {any} [callbackParams] - parameters to be passed to callback
 * @returns {boolean}
 */
export const validateArrayElement = (value, array, callback, callbackParams) => {
  if (!value || !(array.includes(value))) {
    if (callback) {
      callback(callbackParams);
    }
    return false;
  }
  return true;
};