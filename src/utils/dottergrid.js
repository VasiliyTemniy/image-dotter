import { rgba2hex } from './color';

/**
 * @typedef {import('../index.d.ts').DotterCell} DotterCell
 *
 * @typedef {import('../index.d.ts').DotterGridParams} DotterGridParams
 * @typedef {import('../index.d.ts').GeneratorParams} GeneratorParams
 * @typedef {import('../index.d.ts').AnimationParams} AnimationParams
 */

/**
 * read image from file
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
 * Draw input image in canvas
 * @param {Image} image
 * @param {React.MutableRefObject<HTMLCanvasElement>} inputCanvasRef
 */
export const drawImage = (image, inputCanvasRef) => {
  const canvasInput = inputCanvasRef.current;
  const contextInput = canvasInput.getContext('2d', { willReadFrequently: true });
  contextInput.drawImage(image, 0, 0, canvasInput.width, canvasInput.height);
};

/**
 * Make color grid and draw grid preview in canvas
 * @param {React.MutableRefObject<HTMLCanvasElement>} inputCanvasRef
 * @param {React.MutableRefObject<HTMLCanvasElement>} outputCanvasRef
 * @param {DotterGridParams} gridParams
 * @param {GeneratorParams} generatorParams
 */
export const drawGridPreview = (
  inputCanvasRef,
  outputCanvasRef,
  gridParams,
  generatorParams,
) => {
  const canvasInput = inputCanvasRef.current;
  const contextInput = canvasInput.getContext('2d', { willReadFrequently: true });

  const canvasOutput = outputCanvasRef.current;
  const contextOutput = canvasOutput.getContext('2d', { willReadFrequently: true });

  const grid = makeColorGrid(contextInput, gridParams, generatorParams);
  drawOutputByGrid(contextOutput, grid, gridParams);
};

/**
 * Make grid of colored cells from input image
 * @param {CanvasRenderingContext2D} contextInput
 * @param {DotterGridParams} params
 * @param {GeneratorParams} generatorParams
 * @returns {DotterCell[][]}
 */
export const makeColorGrid = (
  contextInput,
  {
    rowsCount,
    columnsCount,
    ignoreColor
  },
  // TODO! Implement generator
  // {
  //   seed,
  //   cellSpan,
  //   palette,
  //   surroundingCells
  // }
) => {
  /** @type {DotterCell[][]} */
  const grid = [];
  const columnWidth = contextInput.canvas.width / columnsCount;
  const rowHeight = contextInput.canvas.height / rowsCount;

  const icRed = ignoreColor ? hexToInt(ignoreColor.color.substring(1, 3)) : 0;
  const icGreen = ignoreColor ? hexToInt(ignoreColor.color.substring(3, 5)) : 0;
  const icBlue = ignoreColor ? hexToInt(ignoreColor.color.substring(5, 7)) : 0;

  for (let row = 0; row < rowsCount; row++) {
    /** @type {DotterCell[]} */
    const gridrow = [];
    for (let column = 0; column < columnsCount; column++) {
      const x = columnWidth * column;
      const y = rowHeight * row;
      const data = contextInput.getImageData(x, y, columnWidth, rowHeight).data;
      const color = middleweightColor(data);
      if (
        ignoreColor &&
        Math.abs(icRed - color[0]) <= ignoreColor.maxDeviation &&
        Math.abs(icGreen - color[1]) <= ignoreColor.maxDeviation &&
        Math.abs(icBlue - color[2]) <= ignoreColor.maxDeviation &&
        color[3] <= ignoreColor.opacityThreshold
      ) {
        continue;
      }
      // span is 1 now; TODO fix it
      gridrow.push([x, y, 1, rgba2hex(color)]);
    }
    grid.push(gridrow);
  }

  return grid;
};

/**
 * Draws output to canvas
 * @param {CanvasRenderingContext2D} contextOutput
 * @param {DotterCell[][]} grid
 * @param {DotterGridParams} params
 */
const drawOutputByGrid = (
  contextOutput,
  grid,
  {
    rowsCount,
    columnsCount,
    radius,
    horizontalGapPx,
    verticalGapPx,
    angle,
    stroke
  }
) => {
  contextOutput.clearRect(0, 0, contextOutput.canvas.width, contextOutput.canvas.height);
  const columnWidth = contextOutput.canvas.width / columnsCount;
  const rowHeight = contextOutput.canvas.height / rowsCount;
  const effectiveRadius = Math.min(Math.floor(Math.min(columnWidth, rowHeight) / 2), radius);

  for (const row of grid) {
    for (const cell of row) {
      const xOut = cell[0] + Math.ceil(verticalGapPx / 2);
      const yOut = cell[1] + Math.ceil(horizontalGapPx / 2);
      const thickness = Math.floor(rowHeight - horizontalGapPx);
      const span = cell[2];
      const length = Math.floor((columnWidth * span) - verticalGapPx);
      const color = cell[3];
      drawRoundRect(
        contextOutput,
        xOut,
        yOut,
        thickness,
        length,
        effectiveRadius,
        angle,
        color,
        stroke
      );
    }
  }
};

/**
 * Gets middleweight color of some image part by surrounding pixels
 * @param {ImageData["data"]} data
 * @returns {[number, number, number, number]} middleweight color in rgba format
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
  return [red, green, blue, alpha];
};

/**
 * @param {CanvasRenderingContext2D} context
 * @param {number} x
 * @param {number} y
 * @param {number} thickness
 * @param {number} length
 * @param {number} radius
 * @param {number} angle
 * @param {string} fill
 * @param {{ color: string; width: number } | null} stroke
 */
const drawRoundRect = (context, x, y, thickness, length, radius, angle, fill, stroke) => {
  context.beginPath();
  // Might not seem obvious about 'thickness', 'length' being used instead of 'width' and 'height', but
  // we store only length in cell data, while thickness is actually more of a calculated value
  if (angle > 0) {
    context.save();
    context.translate(x + length / 2, y + thickness / 2);
    context.rotate((-angle * Math.PI) / 180);
    context.roundRect(-length / 2, - thickness / 2, length, thickness, [radius]);
    context.restore();
  } else {
    context.roundRect(x, y, length, thickness, [radius]);
  }

  if (fill) {
    context.fillStyle = fill;
    context.fill();
  }
  if (stroke) {
    context.lineWidth = stroke.width;
    context.strokeStyle = stroke.color;
    context.stroke();
  }
};

const hexToInt = (hex) => {
  return parseInt(hex.replace('#', ''), 16);
};