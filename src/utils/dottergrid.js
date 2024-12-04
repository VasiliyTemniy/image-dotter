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
  let grid = [];
  const columnWidth = Math.max(contextInput.canvas.width / columnsCount, 1);
  const rowHeight = Math.max(contextInput.canvas.height / rowsCount, 1);

  const icRed = ignoreColor ? hexToInt(ignoreColor.color.substring(1, 3)) : 0;
  const icGreen = ignoreColor ? hexToInt(ignoreColor.color.substring(3, 5)) : 0;
  const icBlue = ignoreColor ? hexToInt(ignoreColor.color.substring(5, 7)) : 0;

  /** @type {Generator | null} */
  let mainPaletteGenerator = null;
  if (generatorParams.mainPalette !== null) {
    mainPaletteGenerator = new Generator({
      seed: generatorParams.seed,
      possibleValues: generatorParams.mainPalette
    });
  }

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
      if (mainPaletteGenerator !== null) {
        const generatedColor = mainPaletteGenerator.generateNextValue();
        const gcRed = hexToInt(generatedColor.substring(1, 3));
        const gcGreen = hexToInt(generatedColor.substring(3, 5));
        const gcBlue = hexToInt(generatedColor.substring(5, 7));
        const gcOpacity = hexToInt(generatedColor.substring(7, 9));
        color = [gcRed, gcGreen, gcBlue, gcOpacity];
      }
      gridrow.push([column, row, 1, color]);
    }
    grid.push(gridrow);
    // // Create a filtered row with undefined and empty cells removed
    // const filteredRow = [];
    // for (const cell of gridrow) {
    //   if (cell) {
    //     filteredRow.push(cell);
    //   }
    // }
    // if (filteredRow.length > 0) {
    //   // Push filtered row to grid if it is not empty
    //   grid.push(filteredRow);
    // }
  }

  console.log('GRID AFTER COLOR GRID GENERATION', grid);

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
    grid = handleCellSpanGeneration(grid, spanGenerator);
  }

  console.log('GRID AFTER CELL SPAN GENERATION', grid);

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
      generatorParams.surroundingCells.color
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
    grid.push(gridrow);
    // // Create a filtered row with undefined and empty cells removed
    // const filteredRow = [];
    // for (const cell of gridrow) {
    //   if (cell) {
    //     filteredRow.push(cell);
    //   }
    // }
    // // Push filtered row to grid if it is not empty
    // if (filteredRow.length > 0) {
    //   grid.push(filteredRow);
    // }
  }

  return grid;
};

/**
 * Handles surrounding cells generation
 * @param {DotterIntermediateCell[][]} imageGrid
 * @param {Generator} surroundingCellsHeightGenerator
 * @param {Generator} surroundingCellsDepthGenerator
 * @param {Generator} surroundingCellsSpanGenerator
 * @param {Generator} surroundingCellsColorVariationGenerator
 * @param {string} surroundingCellsBaseColor
 * @returns {DotterIntermediateCell[][]}
 */
const handleSurroundingCellsGeneration = (
  imageGrid,
  surroundingCellsHeightGenerator,
  surroundingCellsDepthGenerator,
  surroundingCellsSpanGenerator,
  surroundingCellsColorVariationGenerator,
  surroundingCellsBaseColor
) => {
  /**
   * Basic idea:
   *
   * 0. Roll for the height - and add the value to amount of rows to traverse, use it for starting row and the end row
   *
   * 1. Traverse through rows and columns as before
   * 2. For each original cell, try to create a new cell on the left, on the right, above and below
   * 2.1. If there is another cell in the way - continue
   * 2.2. If there is no original cell and no already generated cell - roll surrounding cells depth generator
   * 2.3. After getting the depth, try creating a new cell in that direction, roll for the span and color variation
   * 2.4. Check span - if there is some already existing cell - make the span of the new cell equal to the distance to that existing cell
   * 2.5. If there is no existing cell - make the span of the new cell equal to the value generated by surrounding cells span generator
   * 2.6. After getting the span, roll for the color variation
   * 2.7. Create the cell
   * 2.8. Try continuing in the same direction until depth from 2.2. is reached
   *
   * 3. Return the result
   */

  /** @type {DotterIntermediateCell[][]} */
  const grid = [];

  const occupiedSpaces = new Set(); // Track occupied coordinates

  // Initialize occupied spaces from original grid
  for (const row of grid) {
    for (const cell of row) {
      for (let x = cell[0]; x < cell[0] + cell[2]; x++) {
        occupiedSpaces.add(`${x},${cell[1]}`);
      }
    }
  }

  const topHeight = surroundingCellsHeightGenerator.generateNextValue();
  const bottomHeight = surroundingCellsHeightGenerator.generateNextValue();

  for (let row = 0; row < topHeight; row++) {
    grid.push([]);
  }
  for (let row = 0; row < imageGrid.length; row++) {
    const filteredRow = [];
    const imageGridRow = imageGrid[row];
    for (let i = 0; i < imageGridRow.length; i++) {
      if (imageGridRow[i]) {
        filteredRow.push(imageGridRow[i]);
      }
    }
    if (filteredRow.length > 0) {
      grid.push(filteredRow);
    }
  }
  for (let row = 0; row < bottomHeight; row++) {
    grid.push([]);
  }

  console.log('IMAGE GRID RIGHT BEFORE SURROUNDING CELLS GENERATION', imageGrid);

  console.log('GRID RIGHT BEFORE SURROUNDING CELLS GENERATION', grid);

  // Directions: up, right, down, left
  const directions = [
    [0, -1],// up
    [1, 0], // right
    [0, 1], // down
    [-1, 0] // left
  ];

  for (let row = topHeight; row < grid.length - bottomHeight; row++) {
    const gridrow = grid[row];
    for (let column = 0; column < gridrow.length; column++) {
      const cell = gridrow[column];
      console.log(cell);
      const [baseX, baseY, _baseSpan, _baseColor] = cell;

      // Try each direction
      for (const [dx, dy] of directions) {
        let depthValue, depthValueIndex;
        ({ value: depthValue, valueIndex: depthValueIndex } = surroundingCellsDepthGenerator
          .generateNextValue({ recalculateWeights: false, returnValueIndex: true })
        );

        if (depthValue === 0) {
          surroundingCellsDepthGenerator.recalculateWeights(depthValueIndex);
          continue;
        }

        if (dy * depthValue + row < 0) {
          depthValue = Math.round(-row / dy);
        }

        if (dy * depthValue + row >= grid.length) {
          depthValue = grid.length - row - 1;
        }

        /**
         * Corrected depth value that will be used in the end
         * @type {number}
         */
        let resultDepth = depthValue;
        // For each step in this direction
        for (let step = 1; step <= depthValue; step++) {
          const newY = baseY + (dy * step);
          const newX = baseX + (dx * step);

          // Check if space is available
          if (!isSpaceAvailable(newX, newY, occupiedSpaces)) {
            resultDepth = step - 1;
            break; // Stop in this direction if blocked
          }

          // Generate span and adjust if needed
          let spanValue, spanValueIndex;
          ({ value: spanValue, valueIndex: spanValueIndex } = surroundingCellsSpanGenerator
            .generateNextValue({ recalculateWeights: false, returnValueIndex: true })
          );
          const span = adjustSpanForAvailableSpace(newX, newY, dx, spanValue, occupiedSpaces);
          ({ valueIndex: spanValueIndex } = surroundingCellsSpanGenerator
            .overridePrevValue({ value: span }, { recalculateWeights: false, returnValueIndex: true })
          );
          surroundingCellsSpanGenerator.recalculateWeights(spanValueIndex);

          // Generate color variation.
          // No need to recalculate weights manually, because there is no way colorVar cannot be correct
          const redColorVar = surroundingCellsColorVariationGenerator.generateNextValue();
          const greenColorVar = surroundingCellsColorVariationGenerator.generateNextValue();
          const blueColorVar = surroundingCellsColorVariationGenerator.generateNextValue();
          // Consider preventing opacity color variation
          const opacityColorVar = surroundingCellsColorVariationGenerator.generateNextValue();
          // New color is surroundingCellsBaseColor with variations without overflow
          const newColor = [
            Math.max(0, Math.min(hexToInt(surroundingCellsBaseColor.substring(1, 3)) + redColorVar, 255)),
            Math.max(0, Math.min(hexToInt(surroundingCellsBaseColor.substring(3, 5)) + greenColorVar, 255)),
            Math.max(0, Math.min(hexToInt(surroundingCellsBaseColor.substring(5, 7)) + blueColorVar, 255)),
            Math.max(0, Math.min(hexToInt(surroundingCellsBaseColor.substring(7, 9)) + opacityColorVar, 255))
          ];

          // Add new cell in that direction
          grid[newY][newX] = [newX, newY, span, newColor];
        }

        ({ valueIndex: depthValueIndex } = surroundingCellsDepthGenerator
          .overridePrevValue({ value: resultDepth }, { recalculateWeights: false, returnValueIndex: true })
        );
        surroundingCellsDepthGenerator.recalculateWeights(depthValueIndex);
      }
    }
  }

  return grid;
};

/**
 * Checks if space is available for a cell
 * @param {number} x
 * @param {number} y
 * @param {Set<string>} occupiedSpaces
 * @returns {boolean}
 */
const isSpaceAvailable = (x, y, occupiedSpaces) => {
  return !occupiedSpaces.has(`${x},${y}`);
};

/**
 * Adjusts span for available space
 * @param {number} x
 * @param {number} y
 * @param {number} dx
 * @param {number} span
 * @param {Set<string>} occupiedSpaces
 * @returns {number}
 */
const adjustSpanForAvailableSpace = (x, y, dx, span, occupiedSpaces) => {
  let adjustedSpan = span;
  for (let i = 1; i <= span; i++) {
    if (isSpaceAvailable(x + (dx * i), y, occupiedSpaces)) {
      adjustedSpan = i;
      break;
    }
  }
  return adjustedSpan;
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