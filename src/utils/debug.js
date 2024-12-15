/**
 * Returns some canvas context for debug
 * @param {id} [id] CSS id of canvas, defaults to 'output-canvas'
 * @returns {CanvasRenderingContext2D}
 */
export const getDebugContext = (id = 'output-canvas') => {
  /** @type {HTMLCanvasElement} */
  const canvas = document.getElementById(id);
  if (!canvas) {
    throw new Error(`Debug canvas ${id} not found`);
  }
  return canvas.getContext('2d', { willReadFrequently: true });
};