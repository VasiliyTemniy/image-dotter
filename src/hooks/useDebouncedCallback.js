import { useEffect, useRef } from 'react';

export function useDebouncedCallback(
  callback,
  delay
) {
  const argsRef = useRef();
  const timeout = useRef();

  function cleanup() {
    if(timeout.current) {
      clearTimeout(timeout.current);
    }
  }

  useEffect(() => cleanup, []);

  return function debouncedCallback(
    ...args
  ) {
    argsRef.current = args;

    cleanup();

    timeout.current = setTimeout(() => {
      if(argsRef.current) {
        callback(...argsRef.current);
      }
    }, delay);
  };
}