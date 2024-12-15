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
  let grid = [];
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
      let color = middleweightColor(data);
      if (!color) {
        continue;
      }
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
    if (gridrow.length > 0) {
      grid.push(gridrow);
    }
  }

  if (generatorParams.cellSpan !== null) {
    const possibleValues = [];
    for (let i = generatorParams.cellSpan.min; i <= generatorParams.cellSpan.max; i++) {
      possibleValues.push(i);
    }
    const spanGenerator = new Generator({
      seed: generatorParams.seed,
      possibleValues: possibleValues,
      estimated: generatorParams.cellSpan.estimated
    });
    const trueFalseGenerator = new Generator({
      seed: generatorParams.seed,
      possibleValues: [true, false]
    });
    grid = handleCellSpanGeneration(grid, spanGenerator, trueFalseGenerator);
  }

  if (generatorParams.mainPalette !== null) {
    const mainPaletteGenerator = new Generator({
      seed: generatorParams.seed,
      possibleValues: generatorParams.mainPalette
    });

    grid = handleColorGeneration(grid, mainPaletteGenerator);
  }

  if (generatorParams.surroundingCells !== null) {
    const possibleHeightValues = [];
    for (let i = generatorParams.surroundingCells.height.min; i <= generatorParams.surroundingCells.height.max; i++) {
      possibleHeightValues.push(i);
    }
    const surroundingCellsHeightGenerator = new Generator({
      seed: generatorParams.seed,
      possibleValues: possibleHeightValues,
      estimated: generatorParams.surroundingCells.height.estimated
    });
    const possibleDepthValues = [];
    for (let i = generatorParams.surroundingCells.depth.min; i <= generatorParams.surroundingCells.depth.max; i++) {
      possibleDepthValues.push(i);
    }
    const surroundingCellsDepthGenerator = new Generator({
      seed: generatorParams.seed,
      possibleValues: possibleDepthValues,
      estimated: generatorParams.surroundingCells.depth.estimated
    });
    const possibleSpanValues = [];
    for (let i = generatorParams.surroundingCells.span.min; i <= generatorParams.surroundingCells.span.max; i++) {
      possibleSpanValues.push(i);
    }
    const surroundingCellsSpanGenerator = new Generator({
      seed: generatorParams.seed,
      possibleValues: possibleSpanValues,
      estimated: generatorParams.surroundingCells.span.estimated
    });
    const possibleColorVariationValues = [];
    for (
      let i = -generatorParams.surroundingCells.colorVariation;
      i <= generatorParams.surroundingCells.colorVariation;
      i++
    ) {
      possibleColorVariationValues.push(i);
    }
    const surroundingCellsColorVariationGenerator = new Generator({
      seed: generatorParams.seed,
      possibleValues: possibleColorVariationValues,
      estimated: generatorParams.surroundingCells.colorVariation.estimated
    });
    grid = handleSurroundingCellsGeneration(
      grid,
      surroundingCellsHeightGenerator,
      surroundingCellsDepthGenerator,
      surroundingCellsSpanGenerator,
      surroundingCellsColorVariationGenerator,
      generatorParams.surroundingCells.color,
      columnsCount,
      rowsCount
    );
  }

  return grid;
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
    let monoSpanGridColumn = 0;
    while (monoSpanGridColumn < monoSpanGrid[row].length) {
      let span, valueIndex;
      ({ value: span, valueIndex } = generator
        .generateNextValue({ recalculateWeights: false, returnValueIndex: true })
      );

      // Calculate available span until next void or end
      let availableSpan = 1;
      let currentX = monoSpanGrid[row][monoSpanGridColumn][0];
      for (let i = monoSpanGridColumn + 1; i < monoSpanGrid[row].length; i++) {
        if (monoSpanGrid[row][i][0] !== currentX + (i - monoSpanGridColumn)) {
          break;
        }
        availableSpan++;
      }

      // Adjust span if it would exceed available space
      if (span > availableSpan) {
        span = availableSpan;
        ({ valueIndex } = generator
          .overridePrevValue({ value: span }, { recalculateWeights: false, returnValueIndex: true })
        );
      }

      generator.recalculateWeights(valueIndex);
      const colorSpanArray = [];
      for (let i = monoSpanGridColumn; i < monoSpanGridColumn + span; i++) {
        colorSpanArray.push(...monoSpanGrid[row][i][3]);
      }
      const newColor = middleweightColor(colorSpanArray);
      const gridrowColumn = monoSpanGrid[row][monoSpanGridColumn][0];
      gridrow.push([gridrowColumn, monoSpanGrid[row][monoSpanGridColumn][1], span, newColor]);
      monoSpanGridColumn += span;
    }
    if (gridrow.length > 0) {
      grid.push(gridrow);
    }
  }

  return grid;
};

/**
 * Handles surrounding cells generation
 * @param {DotterIntermediateCell[][]} baseGrid
 * @param {Generator} surroundingCellsHeightGenerator
 * @param {Generator} surroundingCellsDepthGenerator
 * @param {Generator} surroundingCellsSpanGenerator
 * @param {Generator} surroundingCellsColorVariationGenerator
 * @param {string} surroundingCellsBaseColor
 * @param {number} maxX
 * @param {number} maxY
 * @returns {DotterIntermediateCell[][]}
 */
const handleSurroundingCellsGeneration = (
  baseGrid,
  surroundingCellsHeightGenerator,
  surroundingCellsDepthGenerator,
  surroundingCellsSpanGenerator,
  surroundingCellsColorVariationGenerator,
  surroundingCellsBaseColor,
  maxX,
  maxY
) => {
  // Track occupied coordinates
  const occupiedSpaces = new Set();

  // Initialize occupied spaces from original grid
  for (const row of baseGrid) {
    for (const cell of row) {
      appendOccupiedSpaces(occupiedSpaces, cell);
    }
  }

  /** @type {DotterIntermediateCell[][]} */
  const grid = [];

  /** @type {DotterIntermediateCell[][]} */
  const baseVAppendedGrid = [];
  for (let i = 0; i < maxY + 1; i++) {
    baseVAppendedGrid.push([]);
  }
  /**
   * Map: key represents vertically appended cell,
   * value represents vertical depth
   * @type {Map<DotterIntermediateCell, number>}
   */
  const verticalAppendedCellsMap = new Map();

  // Directions: left, right
  const directions = [
    -1, 1
  ];

  for (let row = 0; row < baseGrid.length; row++) {
    const baseGridRow = baseGrid[row];
    for (let column = 0; column < baseGridRow.length; column++) {
      const baseCell = baseGridRow[column];
      const [baseCellX, baseCellY, baseCellSpan, _baseCellColor] = baseCell;

      // BaseCellY must exist here
      baseVAppendedGrid[baseCellY].push(baseCell);

      // Try each direction
      for (const dy of directions) {
        let heightValue, heightValueIndex;
        ({ value: heightValue, valueIndex: heightValueIndex } = surroundingCellsHeightGenerator
          .generateNextValue({ recalculateWeights: false, returnValueIndex: true })
        );

        if (heightValue === 0) {
          surroundingCellsHeightGenerator.recalculateWeights(heightValueIndex);
          continue;
        }

        /**
         * Corrected height value that will be used in the end
         * @type {number}
         */
        let resultHeight = heightValue;
        // For each step in this direction
        for (let step = 1; step <= heightValue; step++) {
          // Surrounding cells coordinates
          const newY = baseCellY + step * dy;

          // Roll for left side of this new surrounding cell. At this point, it's a preferred newX
          let newX = baseCellX
            - surroundingCellsSpanGenerator.generateNextValue()
            + surroundingCellsSpanGenerator.generateNextValue();

          let foundSpace = true;

          while (!isSpaceAvailable(newX, newY, maxX, maxY, occupiedSpaces)) {
            newX++;
            if (
              newX > maxX || // Out of bounds
              newX > baseCellX + (baseCellSpan * 2) / 3 // Too much to the right of the original cell, like 2/3 of the original cell
            ) {
              foundSpace = false;
              break;
            }
          }
          // If there is no space, break
          if (!foundSpace) {
            resultHeight = step - 1;
            break; // Stop in this direction if blocked
          }


          // Generate span
          const span = generateSurroundingCellSpan(
            surroundingCellsSpanGenerator,
            newX,
            newY,
            1, // In this case, dx is always 1 - right direction
            maxX,
            maxY,
            occupiedSpaces
          );

          // Generate color variation
          const newColor = generateSurroundingCellColor(surroundingCellsColorVariationGenerator, surroundingCellsBaseColor);

          const newCell = [newX, newY, span, newColor];

          // BaseCellY must exist here
          baseVAppendedGrid[newY].push(newCell);

          // Add to occupied spaces
          appendOccupiedSpaces(occupiedSpaces, newCell);

          // Add to vertical appended cells map
          verticalAppendedCellsMap.set(newCell, step); // Consider changing step -> step * dy... is it needed?
        }

        ({ valueIndex: heightValueIndex } = surroundingCellsHeightGenerator
          .overridePrevValue({ value: resultHeight }, { recalculateWeights: false, returnValueIndex: true })
        );
        surroundingCellsHeightGenerator.recalculateWeights(heightValueIndex);
      }
    }
  }

  // Sort the vertically appended base grid rows by x coordinate
  for (let row = 0; row < baseVAppendedGrid.length; row++) {
    baseVAppendedGrid[row].sort((a, b) => a[0] - b[0]);
  }

  for (let row = 0; row < baseVAppendedGrid.length; row++) {
    const baseGridRow = baseVAppendedGrid[row];
    if (baseGridRow.length === 0) {
      continue;
    }
    const gridRow = [];
    for (let column = 0; column < baseGridRow.length; column++) {
      const baseCell = baseGridRow[column];
      const [baseCellX, baseCellY, baseCellSpan, _baseCellColor] = baseCell;

      const cellSurroundResult = [baseCell];

      // Try each direction
      for (const dx of directions) {
        let depthValue, depthValueIndex;
        ({ value: depthValue, valueIndex: depthValueIndex } = surroundingCellsDepthGenerator
          .generateNextValue({ recalculateWeights: false, returnValueIndex: true })
        );

        // If this cell was vertically added to the original baseGrid, subtract its (height level from original) from depth
        if (verticalAppendedCellsMap.has(baseCell)) {
          depthValue -= verticalAppendedCellsMap.get(baseCell);
        }

        if (depthValue <= 0) {
          surroundingCellsDepthGenerator.recalculateWeights(depthValueIndex);
          continue;
        }

        // Surrounding cells coordinates
        const newY = baseCellY;
        // It is surrounding cell start for dx > 0 end surrounding cell end for dx < 0
        let newX = dx > 0
          ? baseCellX + baseCellSpan
          : baseCellX - 1;

        /**
         * Corrected depth value that will be used in the end
         * @type {number}
         */
        let resultDepth = depthValue;
        // For each step in this direction
        for (let step = 1; step <= depthValue; step++) {

          // Check if space is available
          if (!isSpaceAvailable(newX, newY, maxX, maxY, occupiedSpaces)) {
            resultDepth = step - 1;
            break; // Stop in this direction if blocked
          }

          // Generate span
          const span = generateSurroundingCellSpan(surroundingCellsSpanGenerator, newX, newY, dx, maxX, maxY, occupiedSpaces);

          // Generate color variation
          const newColor = generateSurroundingCellColor(surroundingCellsColorVariationGenerator, surroundingCellsBaseColor);

          // Add new cell in that direction
          // Span adjustement - if dx > 0 then newX is the cell start; else - new cell start is newX - (span - 1)
          const newXAdjustedWithSpan = dx < 0
            ? newX - (span - 1)
            : newX;

          const newSurroundingCell = [newXAdjustedWithSpan, newY, span, newColor];

          if (dx > 0) {
            cellSurroundResult.push(newSurroundingCell);
          } else {
            // If unshift here gets too much compute consuming, condider reversing the array for dx > 0 and
            // reversing it back after direction finish
            cellSurroundResult.unshift(newSurroundingCell);
          }
          appendOccupiedSpaces(occupiedSpaces, newSurroundingCell);

          // newX for the next surrounding cell. Adjusted here because it's the only place where
          // A. span is known and B. newX can be already overridden
          newX = newX + dx * span;
        }

        ({ valueIndex: depthValueIndex } = surroundingCellsDepthGenerator
          .overridePrevValue({ value: resultDepth }, { recalculateWeights: false, returnValueIndex: true })
        );
        surroundingCellsDepthGenerator.recalculateWeights(depthValueIndex);
      }
      gridRow.push(...cellSurroundResult);
    }

    grid.push(gridRow);
  }

  return grid;
};

/**
 * Append occupied spaces set with a new cell data
 *
 * Attention! Mutates the provided set
 * @param {Set<string>} occupiedSpaces
 * @param {[number, number, number, string]} cell
 */
const appendOccupiedSpaces = (occupiedSpaces, cell) => {
  for (let x = cell[0]; x < cell[0] + cell[2]; x++) {
    occupiedSpaces.add(`${x},${cell[1]}`);
  }
};

/**
 * Generate span for surrounding cell with adjustion if needed based on occupied spaces
 *
 * Attention! Mutates generator internal state
 * @param {Generator} surroundingCellsSpanGenerator
 * @param {number} newX
 * @param {number} newY
 * @param {number} dx
 * @param {number} maxX
 * @param {number} maxY
 * @param {Set<string>} occupiedSpaces
 * @returns {number}
 */
const generateSurroundingCellSpan = (
  surroundingCellsSpanGenerator,
  newX,
  newY,
  dx,
  maxX,
  maxY,
  occupiedSpaces
) => {
  // Generate span and adjust if needed
  let spanValue, spanValueIndex;
  ({ value: spanValue, valueIndex: spanValueIndex } = surroundingCellsSpanGenerator
    .generateNextValue({ recalculateWeights: false, returnValueIndex: true })
  );
  const span = adjustSpanByOccupiedSpace(newX, newY, dx, maxX, maxY, spanValue, occupiedSpaces);
  ({ valueIndex: spanValueIndex } = surroundingCellsSpanGenerator
    .overridePrevValue({ value: span }, { recalculateWeights: false, returnValueIndex: true })
  );
  surroundingCellsSpanGenerator.recalculateWeights(spanValueIndex);

  return span;
};

/**
 * Generate color for surrounding cell
 *
 * Attention! Mutates generator internal state
 * @param {Generator} surroundingCellsColorVariationGenerator
 * @param {string} surroundingCellsBaseColor
 * @returns {[number, number, number, number]} - rgba
 */
const generateSurroundingCellColor = (surroundingCellsColorVariationGenerator, surroundingCellsBaseColor) => {
  // No need to recalculate weights manually, because there is no way colorVar cannot be correct
  const redColorVar = surroundingCellsColorVariationGenerator.generateNextValue();
  const greenColorVar = surroundingCellsColorVariationGenerator.generateNextValue();
  const blueColorVar = surroundingCellsColorVariationGenerator.generateNextValue();
  // Consider preventing opacity color variation
  const opacityColorVar = surroundingCellsColorVariationGenerator.generateNextValue();
  // New color is surroundingCellsBaseColor with variations without overflow
  return [
    Math.max(0, Math.min(hexToInt(surroundingCellsBaseColor.substring(1, 3)) + redColorVar, 255)),
    Math.max(0, Math.min(hexToInt(surroundingCellsBaseColor.substring(3, 5)) + greenColorVar, 255)),
    Math.max(0, Math.min(hexToInt(surroundingCellsBaseColor.substring(5, 7)) + blueColorVar, 255)),
    Math.max(0, Math.min(hexToInt(surroundingCellsBaseColor.substring(7, 9)) + opacityColorVar, 255))
  ];
};

/**
 * Checks if space is available for a cell
 * @param {number} x
 * @param {number} y
 * @param {number} maxX
 * @param {number} maxY
 * @param {Set<string>} occupiedSpaces
 * @returns {boolean}
 */
const isSpaceAvailable = (x, y, maxX, maxY, occupiedSpaces) => {
  if (x < 0 || y < 0 || x > maxX || y > maxY) {
    return false;
  }
  return !occupiedSpaces.has(`${x},${y}`);
};

/**
 * Adjusts span for available space
 *
 * Assumes that at least one space is available
 * @param {number} x
 * @param {number} y
 * @param {number} dx
 * @param {number} maxX
 * @param {number} maxY
 * @param {number} span
 * @param {Set<string>} occupiedSpaces
 * @returns {number}
 */
const adjustSpanByOccupiedSpace = (x, y, dx, maxX, maxY, span, occupiedSpaces) => {
  let adjustedSpan = span;
  for (let i = 1; i <= span; i++) {
    if (
      !isSpaceAvailable(x + (dx * i), y, maxX, maxY, occupiedSpaces) ||
      x + (dx * i) < 0 ||
      x + (dx * i) >= maxX
    ) {
      adjustedSpan = i;
      break;
    }
  }
  return adjustedSpan;
};

/**
 * Maps the grid, generates color for each grid cell based on mainPaletteGenerator
 * @param {DotterIntermediateCell[][]} baseGrid
 * @param {Generator} generator mainPaletteGenerator
 * @returns {DotterIntermediateCell[][]}
 */
const handleColorGeneration = (baseGrid, generator) => {
  const grid = [];
  for (let i = 0; i < baseGrid.length; i++) {
    const gridRow = [];
    for (let j = 0; j < baseGrid[i].length; j++) {
      const newColor = generateCellColor(generator);
      const cell = baseGrid[i][j];
      gridRow.push([cell[0], cell[1], cell[2], newColor]);
    }
    grid.push(gridRow);
  }
  return grid;
};

/**
 * Generates color based on main palette generator
 * @param {Generator} generator
 * @returns {[number, number, number, number]} - rgba
 */
const generateCellColor = (generator) => {
  const generatedColor = generator.generateNextValue();
  const gcRed = hexToInt(generatedColor.substring(1, 3));
  const gcGreen = hexToInt(generatedColor.substring(3, 5));
  const gcBlue = hexToInt(generatedColor.substring(5, 7));
  const gcOpacity = hexToInt(generatedColor.substring(7, 9));
  return [gcRed, gcGreen, gcBlue, gcOpacity];
};

/**
 * Draws output to canvas
 * @param {CanvasRenderingContext2D} contextOutput
 * @param {DotterCell[][]} grid
 * @param {GridParams} params
 */
export const drawGridInCanvas = (
  contextOutput,
  grid,
  {
    rowsCount,
    columnsCount,
    borderRadius,
    horizontalGapPx,
    verticalGapPx,
    angle,
    stroke
  }
) => {
  contextOutput.clearRect(0, 0, contextOutput.canvas.width, contextOutput.canvas.height);
  const columnWidth = Math.max(contextOutput.canvas.width / columnsCount, 1);
  const rowHeight = Math.max(contextOutput.canvas.height / rowsCount, 1);
  const effectiveRadius = Math.min(Math.floor(Math.min(columnWidth, rowHeight) / 2), borderRadius);

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
 * @param {number} borderRadius
 * @param {number} angle
 * @param {string} fill
 * @param {{ color: string; width: number } | null} stroke
 */
const drawRoundRect = (context, x, y, thickness, length, borderRadius, angle, fill, stroke) => {
  context.beginPath();
  // Might not seem obvious about 'thickness', 'length' being used instead of 'width' and 'height', but
  // we store only length in cell data, while thickness is actually more of a calculated value
  if (angle > 0) {
    context.save();
    context.translate(x + length / 2, y + thickness / 2);
    context.rotate((-angle * Math.PI) / 180);
    context.roundRect(-length / 2, -thickness / 2, length, thickness, [borderRadius]);
    context.restore();
  } else {
    context.roundRect(x, y, length, thickness, [borderRadius]);
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