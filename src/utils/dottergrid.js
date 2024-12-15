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
      possibleValues: possibleColorVariationValues
    });
    const possibleAlphaVariationValues = [];
    for (
      let i = -generatorParams.surroundingCells.alphaVariation;
      i <= generatorParams.surroundingCells.alphaVariation;
      i++
    ) {
      possibleAlphaVariationValues.push(i);
    }
    const surroundingCellsAlphaVariationGenerator = new Generator({
      seed: generatorParams.seed,
      possibleValues: possibleAlphaVariationValues
    });
    grid = handleSurroundingCellsGeneration(
      grid,
      surroundingCellsHeightGenerator,
      surroundingCellsDepthGenerator,
      surroundingCellsSpanGenerator,
      surroundingCellsColorVariationGenerator,
      surroundingCellsAlphaVariationGenerator,
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
 * @param {Generator} spanGenerator
 * @param {Generator} trueFalseGenerator
 * @returns {DotterIntermediateCell[][]}
 */
const handleCellSpanGeneration = (
  monoSpanGrid,
  spanGenerator,
  trueFalseGenerator
) => {
  /** @type {DotterIntermediateCell[][]} */
  const grid = [];

  const generatorPossibleValues = spanGenerator.getPossibleValues();

  for (let row = 0; row < monoSpanGrid.length; row++) {
    const gridrow = [];
    let monoSpanGridColumn = 0;
    while (monoSpanGridColumn < monoSpanGrid[row].length) {
      let span, valueIndex;
      ({ value: span, valueIndex } = spanGenerator
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

      const adjustedSpan = adjustSpanByAvailableSpace(
        span,
        generatorPossibleValues,
        availableSpan,
        trueFalseGenerator
      );

      const isSpanAdjusted = span === adjustedSpan;
      span = adjustedSpan;

      if (isSpanAdjusted) {
        ({ valueIndex } = spanGenerator
          .overridePrevValue({ value: span }, { recalculateWeights: false, returnValueIndex: true })
        );
      }

      spanGenerator.recalculateWeights(valueIndex);
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
 * Adjusts span for available space
 * @param {number} generatedSpan
 * @param {number[]} possibleValues
 * @param {number} availableSpan
 * @param {Generator} trueFalseGenerator
 * @returns {number}
 */
const adjustSpanByAvailableSpace = (
  generatedSpan,
  possibleValues,
  availableSpan,
  trueFalseGenerator
) => {
  // Most early return - will be called if everything below have already failed
  // Adjust span if it would exceed available space
  if (generatedSpan > availableSpan) {
    return availableSpan;
  }

  // If the next minimal span would not exceed available space
  if (generatedSpan + possibleValues[0] <= availableSpan) {
    return generatedSpan;
  }

  let span = generatedSpan;
  /** @type {boolean} */
  const tryRecombineFirst = trueFalseGenerator.generateNextValue();

  if (tryRecombineFirst) {
    span = tryRecombineCells(
      generatedSpan,
      possibleValues,
      availableSpan,
      trueFalseGenerator,
      true // Deep call
    );
  } else { // try reduce first
    span = tryReduceSpan(
      generatedSpan,
      possibleValues,
      availableSpan,
      trueFalseGenerator,
      true // Deep call
    );
  }

  // If things above have made span too big somehow or just failed -
  // Adjust span if it would exceed available space
  if (span > availableSpan) {
    span = availableSpan;
  }

  return span;
};

/**
 * Try to recombine cells
 *
 * Assumes that checks for if (baseSpan + possibleValues[0] > availableSpan) are already positively done
 * @param {number} baseSpan
 * @param {number[]} possibleValues
 * @param {number} availableSpan
 * @param {Generator} trueFalseGenerator
 * @param {boolean} [deep] default: false
 * @returns {number}
 */
const tryRecombineCells = (
  baseSpan,
  possibleValues,
  availableSpan,
  trueFalseGenerator,
  deep = false
) => {
  let span = baseSpan;
  // Adjust span if the next minimal span would exceed available space
  // Assume that checks for if (baseSpan + possibleValues[0] > availableSpan) are already positively done
  span = availableSpan;
  // If after trying to recombine cells span is bigger than the biggest possible value
  if (span > possibleValues[possibleValues.length - 1]) {
    // If we are not in deep mode
    if (!deep) {
      // Then this function was called by try to reduce span - 100% failure
      return baseSpan;
    }
    // Span is more than the biggest possible value - 100% try to reduce span
    return tryReduceSpan(baseSpan, possibleValues, availableSpan, trueFalseGenerator);
  } else if (span === possibleValues[possibleValues.length - 1]) {
    // If we are not in deep mode
    if (!deep) {
      // Then this function was called by try to reduce span,
      // so return as is - this particular cell will be of the biggest possible value
      return span;
    }
    // If after trying to recombine cells the result is the biggest possible value
    // Then flip a coin - try reduce cell or return possibleValues[possibleValues.length - 1] as result
    const shouldTryReduce = trueFalseGenerator.generateNextValue();
    if (shouldTryReduce) {
      return tryReduceSpan(baseSpan, possibleValues, availableSpan, trueFalseGenerator);
    } else { // should not try reduce
      return span;
    }
  }

  // The only case that is left -
  // if (span < possibleValues[possibleValues.length - 1])
  // Just return as is - it's all good

  return span;
};

/**
 * Try to reduce this cells' span to give some space for the next one
 *
 * Assumes that checks for if (baseSpan + possibleValues[0] > availableSpan) are already positively done
 * @param {number} baseSpan
 * @param {number[]} possibleValues
 * @param {number} availableSpan
 * @param {Generator} trueFalseGenerator
 * @param {boolean} [deep] default: false
 * @returns {number}
 */
const tryReduceSpan = (
  baseSpan,
  possibleValues,
  availableSpan,
  trueFalseGenerator,
  deep = false
) => {
  let span = baseSpan;
  // Adjust span if the next minimal span would exceed available space
  // Assume that checks for if (baseSpan + possibleValues[0] > availableSpan) are already positively done
  // Try to leave the least possible space for the next cell
  span = availableSpan - possibleValues[0];
  if (span < possibleValues[0]) {
    // If we are not in deep mode
    if (!deep) {
      // Then this function was called by try to recombine - 100% failure
      return baseSpan;
    }
    // Span is less than least possible value - 100% try to recombine
    return tryRecombineCells(baseSpan, possibleValues, availableSpan, trueFalseGenerator);
  } else if (span === possibleValues[0]) {
    // If we are not in deep mode
    if (!deep) {
      // Then this function was called by try to recombine,
      // so return as is - two cells will be with the same span eq to possibleValues[0]
      return span;
    }
    // If after trying to reduce span by least possible value, it would be the smallest possible value
    // Then flip a coin - try recombine or return possibleValues[0] as result
    const shouldTryRecombine = trueFalseGenerator.generateNextValue();
    if (shouldTryRecombine) {
      return tryRecombineCells(baseSpan, possibleValues, availableSpan, trueFalseGenerator);
    } else { // should not try recombine
      return span;
    }
  }

  // if (span > possibleValues[0])
  // Flip a coin to see if we should try to reduce a bit more than by least possible value
  while (trueFalseGenerator.generateNextValue() && span !== possibleValues[0]) {
    span--;
  }

  return span;
};

/**
 * Handles surrounding cells generation
 * @param {DotterIntermediateCell[][]} baseGrid
 * @param {Generator} surroundingCellsHeightGenerator
 * @param {Generator} surroundingCellsDepthGenerator
 * @param {Generator} surroundingCellsSpanGenerator
 * @param {Generator} surroundingCellsColorVariationGenerator
 * @param {Generator} surroundingCellsAlphaVariationGenerator
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
  surroundingCellsAlphaVariationGenerator,
  surroundingCellsBaseColor,
  maxX,
  maxY
) => {
  /**
   * Tracks occupied coordinates
   * @type {Set<string>}
   */
  const occupiedSpaces = new Set();

  // Initialize occupied spaces from original grid
  for (const row of baseGrid) {
    for (const cell of row) {
      appendOccupiedSpaces(occupiedSpaces, cell);
    }
  }

  const { baseVAppendedGrid, vAppendedCellsMap } = handleVerticalSurroundingCellsGeneration(
    baseGrid,
    occupiedSpaces,
    surroundingCellsHeightGenerator,
    surroundingCellsSpanGenerator,
    surroundingCellsColorVariationGenerator,
    surroundingCellsAlphaVariationGenerator,
    surroundingCellsBaseColor,
    maxX,
    maxY
  );

  const { baseHAppendedGrid, hAppendedCellsMap } = handleHorizontalSurroundingCellsGeneration(
    baseVAppendedGrid,
    occupiedSpaces,
    vAppendedCellsMap,
    surroundingCellsDepthGenerator,
    surroundingCellsSpanGenerator,
    surroundingCellsColorVariationGenerator,
    surroundingCellsAlphaVariationGenerator,
    surroundingCellsBaseColor,
    maxX,
    maxY
  );

  // Then, fill in the gaps that could happen between baseGrid and all those surrounding cells because of skipped small span cells
  return fillGridGaps(
    baseHAppendedGrid,
    vAppendedCellsMap,
    hAppendedCellsMap,
    surroundingCellsSpanGenerator.getPossibleValues()[0]
  );
};

/**
 * Handles the vertical part of surrounding cells generation\
 * Best used before the horizontal part
 *
 * Attention! Mutates the provided occupied spaces set and all the generators internal state
 * @param {DotterIntermediateCell[][]} baseGrid
 * @param {Set<string>} occupiedSpaces
 * @param {Generator} surroundingCellsHeightGenerator
 * @param {Generator} surroundingCellsSpanGenerator
 * @param {Generator} surroundingCellsColorVariationGenerator
 * @param {Generator} surroundingCellsAlphaVariationGenerator
 * @param {string} surroundingCellsBaseColor
 * @param {number} maxX
 * @param {number} maxY
 * @returns {{ baseVAppendedGrid: DotterIntermediateCell[][], vAppendedCellsMap: Map<DotterIntermediateCell, number> }}
 */
const handleVerticalSurroundingCellsGeneration = (
  baseGrid,
  occupiedSpaces,
  surroundingCellsHeightGenerator,
  surroundingCellsSpanGenerator,
  surroundingCellsColorVariationGenerator,
  surroundingCellsAlphaVariationGenerator,
  surroundingCellsBaseColor,
  maxX,
  maxY,
) => {
  /** @type {DotterIntermediateCell[][]} */
  const grid = [];
  for (let i = 0; i < maxY + 1; i++) {
    grid.push([]);
  }
  /**
   * Map: key represents vertically appended cell,
   * value represents vertical depth
   * @type {Map<DotterIntermediateCell, number>}
   */
  const vAppendedCellsMap = new Map();

  /** up, down @type {[-1, 1]} */
  const directions = [-1, 1];

  const possibleSpanValues = surroundingCellsSpanGenerator.getPossibleValues();

  for (let row = 0; row < baseGrid.length; row++) {
    const baseGridRow = baseGrid[row];
    for (let column = 0; column < baseGridRow.length; column++) {
      const baseCell = baseGridRow[column];
      const [baseCellX, baseCellY, baseCellSpan, _baseCellColor] = baseCell;

      // BaseCellY must exist here
      grid[baseCellY].push(baseCell);

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
            occupiedSpaces,
            possibleSpanValues
          );

          // If some cell was generated with a span less than possible value
          if (span === 0) {
            resultHeight = step - 1;
            break;
          }

          // Generate color variation
          const newColor = generateSurroundingCellColor(
            surroundingCellsColorVariationGenerator,
            surroundingCellsAlphaVariationGenerator,
            surroundingCellsBaseColor
          );

          const newCell = [newX, newY, span, newColor];

          // BaseCellY must exist here
          grid[newY].push(newCell);

          // Add to occupied spaces
          appendOccupiedSpaces(occupiedSpaces, newCell);

          // Add to vertical appended cells map
          vAppendedCellsMap.set(newCell, step); // Consider changing step -> step * dy... is it needed?
        }

        ({ valueIndex: heightValueIndex } = surroundingCellsHeightGenerator
          .overridePrevValue({ value: resultHeight }, { recalculateWeights: false, returnValueIndex: true })
        );
        surroundingCellsHeightGenerator.recalculateWeights(heightValueIndex);
      }
    }
  }

  // Sort the vertically appended base grid rows by x coordinate
  for (let row = 0; row < grid.length; row++) {
    grid[row].sort((a, b) => a[0] - b[0]);
  }

  return { baseVAppendedGrid: grid, vAppendedCellsMap };
};

/**
 * Handles the horizontal part of surrounding cells generation\
 * Best used after the vertical part
 *
 * Attention! Mutates the provided occupied spaces set and all the generators internal state
 * @param {DotterIntermediateCell[][]} baseGrid
 * @param {Set<string>} occupiedSpaces
 * @param {Map<DotterIntermediateCell, number>} vAppendedCellsMap
 * @param {Generator} surroundingCellsDepthGenerator
 * @param {Generator} surroundingCellsSpanGenerator
 * @param {Generator} surroundingCellsColorVariationGenerator
 * @param {Generator} surroundingCellsAlphaVariationGenerator
 * @param {string} surroundingCellsBaseColor
 * @param {number} maxX
 * @param {number} maxY
 * @returns {DotterIntermediateCell[][]} baseHAppendedGrid
 */
const handleHorizontalSurroundingCellsGeneration = (
  baseGrid,
  occupiedSpaces,
  vAppendedCellsMap,
  surroundingCellsDepthGenerator,
  surroundingCellsSpanGenerator,
  surroundingCellsColorVariationGenerator,
  surroundingCellsAlphaVariationGenerator,
  surroundingCellsBaseColor,
  maxX,
  maxY,
) => {
  /** @type {DotterIntermediateCell[][]} */
  const grid = [];
  /**
   * Map: key represents horizontally appended cell,
   * value represents horizontal depth
   * @type {Map<DotterIntermediateCell, number>}
   */
  const hAppendedCellsMap = new Map();

  const possibleSpanValues = surroundingCellsSpanGenerator.getPossibleValues();
  /** left, right @type {[-1, 1]} */
  const directions = [-1, 1];

  for (let row = 0; row < baseGrid.length; row++) {
    const baseGridRow = baseGrid[row];
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
        if (vAppendedCellsMap.has(baseCell)) {
          depthValue -= vAppendedCellsMap.get(baseCell);
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
          const span = generateSurroundingCellSpan(
            surroundingCellsSpanGenerator,
            newX,
            newY,
            dx,
            maxX,
            maxY,
            occupiedSpaces,
            possibleSpanValues
          );

          // If some cell was generated with a span less than possible value
          if (span === 0) {
            resultDepth = step - 1;
            break;
          }

          // Generate color variation
          const newColor = generateSurroundingCellColor(
            surroundingCellsColorVariationGenerator,
            surroundingCellsAlphaVariationGenerator,
            surroundingCellsBaseColor
          );

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
          hAppendedCellsMap.set(newSurroundingCell, step);

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

  return { baseHAppendedGrid: grid, hAppendedCellsMap };
};

/**
 * Traverses through the base grid, fills gaps between base cells and appended surrounding cells
 *
 * @param {DotterIntermediateCell[][]} baseGrid
 * @param {Map<DotterIntermediateCell, number>} hAppendedCellsMap
 * @param {Map<DotterIntermediateCell, number>} vAppendedCellsMap
 * @param {number} minSpan
 * @returns {DotterIntermediateCell[][]}
 */
const fillGridGaps = (baseGrid, hAppendedCellsMap, vAppendedCellsMap, minSpan) => {
  /** @type {DotterIntermediateCell[][]} */
  const grid = [];
  /** @type {DotterIntermediateCell[][]} */
  const baseRFilledGrid = [];

  // First iter - fill all the gaps on the right side
  for (let i = 0; i < baseGrid.length; i++) {
    const gridRow = [];
    for (let j = 0; j < baseGrid[i].length; j++) {
      const cell = baseGrid[i][j];

      if (
        // If the cell is not 'surrounding' cell that was appended to the base grid
        (!hAppendedCellsMap.has(cell) && !vAppendedCellsMap.has(cell)) ||
        // Or if its the end of the row
        j === baseGrid[i].length - 1
      ) {
        gridRow.push(cell);
        continue;
      }

      const nextCell = baseGrid[i][j + 1];
      const [cellX, cellY, cellSpan, cellColor] = cell;

      const rightGap = nextCell[0] - (cellX + cellSpan);
      // If there is a gap between the current cell and the next one that is equal to minSpan or less
      if (rightGap <= minSpan) { // same as if (cellX + cellSpan + minSpan >= nextCell[0])
        // Then we fill the gap by increasing this cells' span by the gap
        gridRow.push([cellX, cellY, cellSpan + rightGap, cellColor]);
      } else {
        gridRow.push(cell);
      }
    }
    baseRFilledGrid.push(gridRow);
  }

  // Second iter - fill all the gaps on the left side
  for (let i = 0; i < baseRFilledGrid.length; i++) {
    const gridRow = [];
    for (let j = 0; j < baseRFilledGrid[i].length; j++) {
      /** Base cell is needed here to check if it's one of the appended cells */
      const baseCell = baseGrid[i][j];
      const cell = baseRFilledGrid[i][j];

      if (
        // If its the start of the row
        j === 0 ||
        // Or if the cell is not 'surrounding' cell that was appended to the base grid
        (!hAppendedCellsMap.has(baseCell) && !vAppendedCellsMap.has(baseCell))
      ) {
        // While we've checked by the base cell ref, we add the cell from already edited array
        gridRow.push(cell);
        continue;
      }

      const [cellX, cellY, cellSpan, cellColor] = cell;

      const prevCell = baseRFilledGrid[i][j - 1];
      // If the gap between the current cell and the previous one is equal to minSpan or less
      const leftGap = cellX - (prevCell[0] + prevCell[2]);
      if (leftGap <= minSpan) {
        // Then we fill the gap by increasing this cells' span and moving it to the left by the gap
        gridRow.push([cellX - leftGap, cellY, cellSpan + leftGap, cellColor]);
      } else {
        gridRow.push(cell);
      }
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
 * @param {number[]} possibleSpanValues
 * @returns {number}
 */
const generateSurroundingCellSpan = (
  surroundingCellsSpanGenerator,
  newX,
  newY,
  dx,
  maxX,
  maxY,
  occupiedSpaces,
  possibleSpanValues
) => {
  // Generate span and adjust if needed
  let spanValue, spanValueIndex;
  ({ value: spanValue, valueIndex: spanValueIndex } = surroundingCellsSpanGenerator
    .generateNextValue({ recalculateWeights: false, returnValueIndex: true })
  );
  const span = adjustSpanByOccupiedSpace(newX, newY, dx, maxX, maxY, spanValue, occupiedSpaces);
  if (span < possibleSpanValues[0]) {
    // Just return 0 to skip it, recombine after the main generation loop
    return 0;
  }
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
 * @param {Generator} surroundingCellsAlphaVariationGenerator
 * @param {string} surroundingCellsBaseColor
 * @returns {[number, number, number, number]} - rgba
 */
const generateSurroundingCellColor = (
  surroundingCellsColorVariationGenerator,
  surroundingCellsAlphaVariationGenerator,
  surroundingCellsBaseColor
) => {
  // No need to recalculate weights manually, because there is no way colorVar cannot be correct
  const redColorVar = surroundingCellsColorVariationGenerator.generateNextValue();
  const greenColorVar = surroundingCellsColorVariationGenerator.generateNextValue();
  const blueColorVar = surroundingCellsColorVariationGenerator.generateNextValue();
  // Consider preventing opacity color variation
  const opacityColorVar = surroundingCellsAlphaVariationGenerator.generateNextValue();
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