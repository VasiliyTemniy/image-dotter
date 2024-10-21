import { rgba2hex } from './color';

/**
 * { color: string, length: number, angle: number, stroke: string, strokeWidth: number }
 * @typedef {[string, number, number, string, number]} Cell
 */

/**
 * @param {File} file
 * @returns {Promise<Image>}
 */
export const readImage = (file) => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const image = new Image();
        image.src = reader.result;
        image.onload = () => {
          resolve(image);
        };
      };
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * @param {Image} image
 * @param {React.MutableRefObject<HTMLCanvasElement>} inputCanvasRef
 */
export const drawImage = (image, inputCanvasRef) => {
  const canvasInput = inputCanvasRef.current;
  const contextInput = canvasInput.getContext('2d', { willReadFrequently: true });
  contextInput.drawImage(image, 0, 0, canvasInput.width, canvasInput.height);
};

/**
 * @param {React.MutableRefObject<HTMLCanvasElement>} inputCanvasRef
 * @param {React.MutableRefObject<HTMLCanvasElement>} outputCanvasRef
 * @param {number} rowsCount
 * @param {number} columnsCount
 */
export const drawGridPreview = (inputCanvasRef, outputCanvasRef, rowsCount, columnsCount) => {
  const canvasInput = inputCanvasRef.current;
  const contextInput = canvasInput.getContext('2d', { willReadFrequently: true });

  const canvasOutput = outputCanvasRef.current;
  const contextOutput = canvasOutput.getContext('2d', { willReadFrequently: true });

  const grid = makeColorGrid(rowsCount, columnsCount, contextInput);
  drawOutputByGrid(grid, rowsCount, columnsCount, canvasOutput.width, canvasOutput.height, contextOutput);
};

/**
 * @param {number} rowsNumber
 * @param {number} columnsNumber
 * @param {CanvasRenderingContext2D} contextInput
 * @returns {Cell[][]}
 */
export const makeColorGrid = (rowsNumber, columnsNumber, contextInput) => {
  /** @type {Cell[][]} */
  const grid = [];
  const columnWidth = Math.floor(contextInput.canvas.width / rowsNumber);
  const rowHeight = Math.floor(contextInput.canvas.height / columnsNumber);

  for (let row = 0; row < rowsNumber; row++) {
    /** @type {Cell[]} */
    const gridrow = [];
    for (let column = 0; column < columnsNumber; column++) {
      const x = columnWidth * column;
      const y = rowHeight * row;
      const data = contextInput.getImageData(x, y, columnWidth, rowHeight).data;
      const color = middleweightColor(data);
      gridrow.push([color, 0, 0, '', 0]);
    }
    grid.push(gridrow);
  }

  return grid;
};

/**
 * @param {Cell[][]} grid
 * @param {number} rowsCount
 * @param {number} columnsCount
 * @param {number} outputCanvasWidth
 * @param {number} outputCanvasHeight
 * @param {CanvasRenderingContext2D} contextOutput
 */
const drawOutputByGrid = (
  grid,
  rowsCount,
  columnsCount,
  outputCanvasWidth,
  outputCanvasHeight,
  contextOutput,
) => {
  contextOutput.clearRect(0, 0, contextOutput.canvas.width, contextOutput.canvas.height);
  const outputWidth = Math.floor(outputCanvasWidth / rowsCount);
  const outputHeight = Math.floor(outputCanvasHeight / columnsCount);
  for (let row = 0; row < rowsCount; row++) {
    for (let column = 0; column < columnsCount; column++) {
      const xOut = outputWidth * column + Math.floor(outputWidth / 2);
      const yOut = outputHeight * row + Math.floor(outputHeight / 2);
      const color = grid[row][column][0];
      const length = grid[row][column][3];
      const angle = grid[row][column][4];
      const stroke = grid[row][column][5];
      const strokeWidth = grid[row][column][6];
      drawRoundedLine(
        contextOutput,
        xOut,
        yOut,
        Math.floor(outputWidth / 2) - 5,
        length,
        angle + Math.PI / 2,
        color,
        stroke,
        strokeWidth,
      );
    }
  }
};

/**
 * Gets middleweight color of some image part by surrounding pixels
 * @param {ImageData["data"]} data
 * @returns {string}
 */
const middleweightColor = (data) => {
  let red = 0;
  let green = 0;
  let blue = 0;
  let alpha = 0;
  let pixelsCounter = 0;
  for (let i = 0; i < data.length; i += 4) {
    red = red + data[i];
    green = green + data[i + 1];
    blue = blue + data[i + 2];
    alpha = alpha + data[i + 3];
    pixelsCounter++;
  }
  red = Math.round(red / pixelsCounter);
  green = Math.round(green / pixelsCounter);
  blue = Math.round(blue / pixelsCounter);
  alpha = Math.round(alpha / pixelsCounter);
  return rgba2hex([red, green, blue, alpha]);
};

// /**
//  * @param {CanvasRenderingContext2D} context
//  * @param {number} x
//  * @param {number} y
//  * @param {number} radius
//  * @param {string} fill
//  * @param {string} stroke
//  * @param {number} strokeWidth
//  */
// export const drawCircle = (context, x, y, radius, fill, stroke, strokeWidth) => {
//   context.beginPath();
//   context.arc(x, y, radius, 0, 2 * Math.PI, false);
//   if (fill) {
//     context.fillStyle = fill;
//     context.fill();
//   }
//   if (stroke) {
//     context.rowWidth = strokeWidth;
//     context.strokeStyle = stroke;
//     context.stroke();
//   }
// };

/**
 * @param {CanvasRenderingContext2D} context
 * @param {number} x
 * @param {number} y
 * @param {number} radius
 * @param {number} length
 * @param {number} angle
 * @param {string} fill
 * @param {string} stroke
 * @param {number} strokeWidth
 */
const drawRoundedLine = (context, x, y, radius, length, angle, fill, stroke, strokeWidth) => {
  context.beginPath();
  context.arc(x, y, radius, angle, angle + Math.PI, false);
  context.arc(x + Math.sin(angle) * length, y + Math.cos(angle) * length, radius, angle + Math.PI, angle + 2 * Math.PI, false);
  context.closePath();
  if (fill) {
    context.fillStyle = fill;
    context.fill();
  }
  if (stroke) {
    context.rowWidth = strokeWidth;
    context.strokeStyle = stroke;
    context.stroke();
  }
};