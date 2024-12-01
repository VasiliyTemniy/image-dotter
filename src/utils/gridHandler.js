import { rgba2hex } from './color.js';
import { hexToInt, middleweightColor } from './dottergrid.js';

/**
 * @typedef {import('../index.d.ts').DotterCell} DotterCell
 * @typedef {import('../index.d.ts').GridCreationParams} GridCreationParams
 * @typedef {import('../index.d.ts').GeneratorParams} GeneratorParams
 * @typedef {import('../index.d.ts').DotterIntermediateCell} DotterIntermediateCell
 * @typedef {import('./generator.js').Generator} Generator
 */

/** ATTENTION! UNUSED ATM! Could be used for rewriting from functions in './dottergrid.js' to classes */

export class GridHandler {

  // /**
  //  * Source image for grid
  //  * @type {Image | null}
  //  */
  // #image;
  /**
   * A pointer to the input canvas context that holds an Image
   * @type {CanvasRenderingContext2D | null}
   */
  #contextInput;
  /**
   * A pointer to personal generator for this gridHandler
   * @type {Generator | null}
   */
  #generator;
  /**
   * First iteration of grid division - the image is divided into monoSpanGrid\
   * Which means same as this.#grid, but all spans are 1\
   * Color is stored as RBGA for easier manipulations
   * @type {DotterIntermediateCell[][] | null}
   */
  #monoSpanGridRGBA;
  /**
   * Second iteration of grid division - the monoSpanGrid will be combined with seed-driven generator spans\
   * Color is stored as RBGA for easier manipulations
   * @type {DotterIntermediateCell[][] | null}
   */
  #gridRGBA;

  /**
   * First iteration of grid division - the image is divided into monoSpanGrid\
   * Which means same as this.#grid, but all spans are 1
   * @type {DotterCell[][] | null}
   */
  #monoSpanGrid;
  /**
   * Second iteration of grid division - the monoSpanGrid will be combined with seed-driven generator spans
   * @type {DotterCell[][] | null}
   */
  #grid;
  /**
   * I do not remember why I wanted this param here... This is why you better always write some docs
   * @type {number}
   */
  #size;

  /**
   * Divide the #image into this quantity of rows\
   * (actually, monoSpanGrid param, would be visually overriden if generator for span is used)
   * @type {number}
   */
  #rowsCount;
  /**
   * Divide the #image into this quantity of columns\
   * (actually, monoSpanGrid param, would be visually overriden if generator for span is used)
   * @type {number}
   */
  #columnsCount;
  /** @type {GridCreationParams['ignoreColor'] | null} */
  #ignoreColor;


  constructor() {
    this.#contextInput = null;
    this.#generator = null;
    this.resetCache();
  }

  /**
   * Reset grid
   * @returns {void}
   */
  resetGrid() {
    this.#gridRGBA = null;
    this.#grid = null;
  }

  /**
   * Reset monoSpanGrid
   * @returns {void}
   */
  resetMonoSpanGrid() {
    this.#monoSpanGridRGBA = null;
    this.#monoSpanGrid = null;
  }

  /**
   * Reset all the gridHandler cache
   * @returns {void}
   */
  resetCache() {
    this.resetMonoSpanGrid();
    this.resetGrid();
  }

  /**
   *
   * @param {GridCreationParams} gridCreationParams
   */
  setGridParams({
    rowsCount,
    columnsCount,
    ignoreColor
  }) {
    if (
      this.#rowsCount                     !== rowsCount ||
      this.#columnsCount                  !== columnsCount ||
      this.#ignoreColor?.color            !== ignoreColor?.color ||
      this.#ignoreColor?.opacityThreshold !== ignoreColor?.opacityThreshold ||
      this.#ignoreColor?.maxDeviation     !== ignoreColor?.maxDeviation
    ) {
      this.resetCache();
    }

    this.#rowsCount = rowsCount;
    this.#columnsCount = columnsCount;
    this.#ignoreColor = ignoreColor;
  }

  /**
   * Gives the monoSpanGrid
   * @param {'rgba' | 'hex'} colorMode
   * @returns {DotterCell[][]}
   */
  getMonoSpanGrid(colorMode = 'hex') {
    if (this.#monoSpanGridRGBA === null) {
      if (this.#contextInput === null) {
        // throw new Error('MonoSpanGrid was not set and Context was not set while getMonoSpanGrid method was called');
        return [];
      }
      this.#calcMonoSpanGrid();
    }
    if (colorMode === 'hex') {
      if (this.#monoSpanGrid === null) {
        this.#monoSpanGrid = this.mapColorGridToHex(this.#monoSpanGridRGBA);
      }
      return this.#monoSpanGrid;
    }
    return this.#monoSpanGridRGBA;
  }

  /**
   * Calculates monoSpanGrid, stores it to the class state
   * @returns {void}
   */
  #calcMonoSpanGrid() {
    /** @type {DotterIntermediateCell[][]} */
    const grid = [];
    /**
     * TODO - check if this is really correct - getting the width and height from canvas, not image
     * One thing to consider - this.#contextInput.getImageData below - it gets image data based on the same canvas params. So, maybe it is still kinda correct?
     */
    const columnWidth = Math.max(this.#contextInput.canvas.width / this.#columnsCount, 1);
    const rowHeight = Math.max(this.#contextInput.canvas.height / this.#rowsCount, 1);

    const icRed = this.#ignoreColor ? hexToInt(this.#ignoreColor.color.substring(1, 3)) : 0;
    const icGreen = this.#ignoreColor ? hexToInt(this.#ignoreColor.color.substring(3, 5)) : 0;
    const icBlue = this.#ignoreColor ? hexToInt(this.#ignoreColor.color.substring(5, 7)) : 0;

    // First, we handle square cells - every cell span is exactly 1
    for (let row = 0; row < this.#rowsCount; row++) {
    /** @type {DotterIntermediateCell[]} */
      const gridrow = [];
      for (let column = 0; column < this.#columnsCount; column++) {
        const x = columnWidth * column;
        const y = rowHeight * row;
        const data = this.#contextInput.getImageData(x, y, columnWidth, rowHeight).data;
        const color = middleweightColor(data);
        if (
          this.#ignoreColor &&
        Math.abs(icRed - color[0]) <= this.#ignoreColor.maxDeviation &&
        Math.abs(icGreen - color[1]) <= this.#ignoreColor.maxDeviation &&
        Math.abs(icBlue - color[2]) <= this.#ignoreColor.maxDeviation &&
        color[3] <= this.#ignoreColor.opacityThreshold
        ) {
          continue;
        }
        gridrow.push([column, row, 1, color]);
      }
      grid.push(gridrow);
    }

    this.#monoSpanGridRGBA = grid;
  }

  /**
   * Gives the grid
   * @param {'rgba' | 'hex'} colorMode
   * @returns {DotterCell[][]}
   */
  getGrid(colorMode = 'hex') {
    if (this.#gridRGBA === null) {
      if (this.#contextInput === null) {
        // throw new Error('Grid was not set and Context was not set while getGrid method was called');
        return [];
      }
      this.#calcGrid();
    }
    if (colorMode === 'hex') {
      if (this.#grid === null) {
        this.#grid = this.mapColorGridToHex(this.#gridRGBA);
      }
      return this.#grid;
    }
    return this.#gridRGBA;
  }

  /**
   * Calculates grid, stores it to the class state
   * @returns {void}
   */
  #calcGrid() {
    if (this.#monoSpanGridRGBA === null) {
      this.#calcMonoSpanGrid();
    }

    // TODO! DO!
    return this.getMonoSpanGrid();
  }

  // /**
  //  * @param {Image} image
  //  * @returns {void}
  //  */
  // setImage(image) {
  //   this.#image = image;
  //   this.resetCache();
  // }

  /**
   * @param {CanvasRenderingContext2D} contextInput
   * @returns {void}
   */
  setContextInput(contextInput) {
    this.#contextInput = contextInput;
    this.resetCache();
  }

  /**
   * Set generator
   * @param {Generator} generator
   * @returns {void}
   */
  setGenerator(generator) {
    // No need to reset all the cache, monoSpanGrid is not affected
    this.resetGrid();
    this.#generator = generator;
  }

  /**
   * Set generator params specifically for the #generator that is stored in this class state
   */
  setGeneratorParams(generatorParams) {
    if (!this.#generator) {
      throw new Error('Generator was not set while setGeneratorParams method was called');
    }
    this.resetGrid();
    this.#generator.setParams(generatorParams);
  }

  /**
   * @param {DotterIntermediateCell[][]} grid
   * @returns {DotterCell[][]}
   */
  mapColorGridToHex = (grid) =>
    grid.map(
      (row) => row.map(
        cell => [cell[0], cell[1], cell[2], rgba2hex(cell[3])]
      )
    );
}