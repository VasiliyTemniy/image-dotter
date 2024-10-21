/**
 * RGBA represented as [0-255, 0-255, 0-255, 0-255] to hex
 * @param {[number, number, number, number]} rgba
 * @returns {string}
 */
export const rgba2hex = (rgba) => {
  return (
    '#' +
    (rgba[0] | (1 << 8)).toString(16).slice(1) +
    (rgba[1] | (1 << 8)).toString(16).slice(1) +
    (rgba[2] | (1 << 8)).toString(16).slice(1) +
    (rgba[3] | (1 << 8)).toString(16).slice(1)
  );
};

/**
 * @param {[number, number, number, number]} pipetteColor
 * @returns {string}
 */
export const pipetteRGBAText = (pipetteColor) => {
  if (!pipetteColor) {
    return '  0,   0,   0,   0';
  }
  const red = String(pipetteColor[0]).padStart(3, ' ');
  const green = String(pipetteColor[1]).padStart(3, ' ');
  const blue = String(pipetteColor[2]).padStart(3, ' ');
  const alpha = String(pipetteColor[3]).padStart(3, ' ');
  return `${red}, ${green}, ${blue}, ${alpha}`;
};

/**
 * @param {[number, number, number, number]} pipetteColor
 * @returns {string}
 */
export const pipetteHexText = (pipetteColor) => {
  if (!pipetteColor) {
    return '#00000000';
  }
  return rgba2hex(pipetteColor).toUpperCase();
};