import { useState, useEffect } from 'react';

/**
 * Debounce hook
 * @param {any} value
 * @param {number} delay in ms
 * @returns debounced value
 */
export const useDebounce = (value, delay) => {

  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value]);

  return debouncedValue;
};