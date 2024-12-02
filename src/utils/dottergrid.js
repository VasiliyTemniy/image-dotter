import { rgba2hex } from './color';
import { Generator } from './generator.js';

/**
 * @typedef {import('../index.d.ts').DotterCell} DotterCell
 * @typedef {import('../index.d.ts').DotterIntermediateCell} DotterIntermediateCell
 * @typedef {import('../index.d.ts').GridParams} GridParams
 * @typedef {import('../index.d.ts').GeneratorParams} GeneratorParams
 * @typedef {import('../index.d.ts').AnimationParams} AnimationParams
 * @typedef {import('./generator.js').Generator} Generator
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
 * @param {Image | null | undefined} image
 * @param {React.MutableRefObject<HTMLCanvasElement>} inputCanvasRef
 */
export const drawImage = (image, inputCanvasRef) => {
  if (!image) {
    console.log('Draw image called while there is no image');
    return;
  }
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
//  * @param {Generator | null} spanGenerator
//  * @param {Generator | null} mainPaletteGenerator
//  * @param {Generator | null} surroundingCellsDepthGenerator
//  * @param {Generator | null} surroundingCellsSpanGenerator
 */
export const drawGridPreview = (
  inputCanvasRef,
  outputCanvasRef,
  gridParams,
  generatorParams,
  // spanGenerator,
) => {

  const canvasInput = inputCanvasRef.current;
  const contextInput = canvasInput.getContext('2d', { willReadFrequently: true });

  const canvasOutput = outputCanvasRef.current;
  const contextOutput = canvasOutput.getContext('2d', { willReadFrequently: true });

  const grid = mapColorGridToHex(makeColorGrid(contextInput, gridParams, generatorParams));
  drawOutputByGrid(contextOutput, grid, gridParams);
};

/**
 * @param {DotterIntermediateCell[][]} grid
 * @returns {DotterCell[][]}
 */
export const mapColorGridToHex = (grid) =>
  grid.map(
    (row) => row.map(
      cell => [cell[0], cell[1], cell[2], rgba2hex(cell[3])]
    )
  );

/**
 * Make grid of colored cells from input image
 * @param {CanvasRenderingContext2D} contextInput
 * @param {GridParams} params
 * @param {GeneratorParams} generatorParams
//  * @param {Generator | null} generator
 * @returns {DotterIntermediateCell[][]}
 */
export const makeColorGrid = (
  contextInput,
  {
    rowsCount,
    columnsCount,
    ignoreColor
  },
  generatorParams
) => {
  /** @type {DotterIntermediateCell[][]} */
  const grid = [];
  const columnWidth = Math.max(contextInput.canvas.width / columnsCount, 1);
  const rowHeight = Math.max(contextInput.canvas.height / rowsCount, 1);

  const icRed = ignoreColor ? hexToInt(ignoreColor.color.substring(1, 3)) : 0;
  const icGreen = ignoreColor ? hexToInt(ignoreColor.color.substring(3, 5)) : 0;
  const icBlue = ignoreColor ? hexToInt(ignoreColor.color.substring(5, 7)) : 0;

  // First, we handle square cells - every cell span is exactly 1
  for (let row = 0; row < rowsCount; row++) {
    /** @type {DotterIntermediateCell[]} */
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
      gridrow.push([column, row, 1, color]);
    }
    grid.push(gridrow);
  }

  if (generatorParams.cellSpan === null) {
    return grid;
  } else {
    const possibleValues = [];
    for (let i = generatorParams.cellSpan.min; i <= generatorParams.cellSpan.max; i++) {
      possibleValues.push(i);
    }
    const generator = new Generator({
      seed: generatorParams.seed,
      possibleValues: possibleValues,
      estimated: generatorParams.cellSpan.estimated
    });
    return handleCellSpanGeneration(grid, generator);
  }
};

/**
 * Combines cells based on seed and other cell span generator params
 * @param {DotterIntermediateCell[][]} monoSpanGrid
 * @param {Generator} generator
 * @returns {DotterIntermediateCell[][]}
 */
const handleCellSpanGeneration = (
  monoSpanGrid,
  generator
) => {
  /** @type {DotterIntermediateCell[][]} */
  const grid = [];

  for (let row = 0; row < monoSpanGrid.length; row++) {
    const gridrow = [];
    let column = 0;
    while (column < monoSpanGrid[row].length) {
      const { value, valueIndex } = generator.generateNextValue({ recalculateWeights: false, returnValueIndex: true });
      let span = value;
      if (column + span > monoSpanGrid[row].length) {
        span = monoSpanGrid[row].length - column;
        generator.overridePrevValue({ valueIndex }, { recalculateWeights: false });
      }
      generator.recalculateWeights(valueIndex);
      const colorSpanArray = [];
      for (let i = column; i < column + span; i++) {
        // Push the spread array to fit the same structure as ImageData["data"]
        colorSpanArray.push(...monoSpanGrid[row][i][3]);
      }
      const newColor = middleweightColor(colorSpanArray);
      const gridrowColumn = monoSpanGrid[row][column][0];
      gridrow.push([gridrowColumn, row, span, newColor]);
      column += span;
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
  const columnWidth = Math.max(contextOutput.canvas.width / columnsCount, 1);
  const rowHeight = Math.max(contextOutput.canvas.height / rowsCount, 1);
  const effectiveRadius = Math.min(Math.floor(Math.min(columnWidth, rowHeight) / 2), radius);

  for (const row of grid) {
    for (const cell of row) {
      const xOut = (cell[0] * columnWidth) + Math.ceil(verticalGapPx / 2);
      const yOut = (cell[1] * rowHeight)   + Math.ceil(horizontalGapPx / 2);
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
 * @param {ImageData["data"]} data - Uint8ClampedArray, structurally same as Array<[number, number, number, number]>
 * @returns {[number, number, number, number]} middleweight color in rgba format
 */
export const middleweightColor = (data) => {
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
    context.roundRect(-length / 2, -thickness / 2, length, thickness, [radius]);
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

export const hexToInt = (hex) => {
  return parseInt(hex.replace('#', ''), 16);
};