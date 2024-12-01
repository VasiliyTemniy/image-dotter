import { seedValues } from './seedValues';

const NEW_VALUE_WEIGHT_DECREASE_SELF_FACTOR = 0.1;
const OTHER_VALUES_WEIGHT_INCREASE_SELF_FACTOR = 0.1;
const WEIGHT_INCREASE_DISTANCE_DIMINISHING_FACTOR = 0.1;
// const WEIGHT_ESTIMATED_CORRECTION_FACTOR = 10;


/**
 * Custom profane-level procedural generator class.
 * Takes constructor params - seed, an array of possible values and estimated (normal distribution) value
 * Must always return the same result for the same seed
 *
 * In image-dotter, it is used for cell span, surrounding cells and color data generation
 */
export class Generator {
  /**
   * @param {{
   *    seed: number,
   *    possibleValues: number[],
   *    estimated: number | null | undefined,
   *    estimatedFactor?: number,
   *    estimatedIndex: number | null | undefined
   * }} params
   */
  constructor ({ seed, possibleValues, estimated = null, estimatedFactor = null, estimatedIndex = null }) {
    this.seed = seed;
    this.possibleValues = possibleValues;
    this.estimated = estimated;
    this.estimatedIndex = estimatedIndex;
    this.estimatedFactor = estimatedFactor ? estimatedFactor : possibleValues.length**(possibleValues.length / 3.3);
    this.values = [];
    this.weights = this.initWeights();

    if (this.estimated !== null) {
      for (let i = 0; i < this.possibleValues.length - 1; i++) {
        if (this.possibleValues[i] > this.possibleValues[i + 1]) {
          throw new Error('Possible values must be sorted if estimated value is set');
        }
      }
    }

    if (this.estimatedIndex !== null) {
      if (this.estimatedIndex < 0 || this.estimatedIndex >= this.possibleValues.length) {
        throw new Error('Estimated index must be within bounds of possible values array');
      }
    }
  }

  /**
   * Calculates initial weights based on estimated value
   * @returns {number[]} new weights
   */
  initWeights () {
    let weights = [];
    if (this.estimated) {
      // Calculate weights
      for (let i = 0; i < this.possibleValues.length; i++) {
        const value = this.possibleValues[i];
        const newWeight = Math.exp(-Math.pow(value - this.estimated, 2) / 2);
        weights.push(newWeight);
      }
    } else {
      // All weights are equal if there is no estimated value
      const weight = 1 / this.possibleValues.length;
      weights = this.possibleValues.map(() => weight);
    }

    return weights;
  }

  /**
   * Handles already generated values, calculates weights based on them and estimated value
   * @param {number} newValueIndex
   * @returns {number[]} new weights
   */
  recalculateWeights (newValueIndex) {
    // Lower weight for this value; increase weight for all other values with diminishing with distance effect

    let shouldDownscaleWeights = false;

    for (let i = 0; i < this.possibleValues.length; i++) {
      if (i === newValueIndex) {
        this.weights[i] = this.weights[i] - this.weights[i] * NEW_VALUE_WEIGHT_DECREASE_SELF_FACTOR;
      } else {
        this.weights[i] = this.weights[i] + this.weights[i] * OTHER_VALUES_WEIGHT_INCREASE_SELF_FACTOR * Math.pow(1 - Math.abs(newValueIndex - i) / this.possibleValues.length, WEIGHT_INCREASE_DISTANCE_DIMINISHING_FACTOR);
        // somehow we have to add factor of distance till expected value
        if (this.estimated !== null) {
          this.weights[i] = this.weights[i] + this.weights[i] * Math.exp(-Math.pow(this.possibleValues[i] - this.estimated, 2) / this.estimatedFactor);
        }
        if (this.estimatedIndex !== null) {
          this.weights[i] = this.weights[i] + this.weights[i] * Math.exp(-Math.pow(i - this.estimatedIndex, 2) / this.estimatedFactor);
        }
      }
      if (this.weights[i] > 1000) {
        shouldDownscaleWeights = true;
      }
    }

    if (shouldDownscaleWeights) {
      for (let i = 0; i < this.possibleValues.length; i++) {
        this.weights[i] = this.weights[i] / 10000;
      }
    }
  }

  // No randomness, only use some formulas, constants and seed
  generateNextValue () {
    /** From 0 to sum of all weights */
    const weightsAsLine = [{ index: -1, weight: 0 }];
    for (let i = 0; i < this.weights.length; i++) {
      const nextWeight = this.weights[i];
      weightsAsLine.push({ index: i, weight: nextWeight + weightsAsLine[i].weight });
    }

    // Not a random! Predetermined via seed and current position from an array of pseudorandom numbers that are floats from 0 to 1
    const positionFactor = seedValues[(this.seed + this.values.length) % seedValues.length];

    // The weight of new value - a dot somewhere on the weightsAsLine line
    const newValueWeightPosition = positionFactor * weightsAsLine[weightsAsLine.length - 1].weight;
    let newValueIndex = -1;
    for (let i = 0; i < weightsAsLine.length; i++) {
      newValueIndex = weightsAsLine[i].index;
      if (newValueWeightPosition <= weightsAsLine[i].weight) {
        break;
      }
    }
    if (this.logGen) {
      console.log('newValueIndex', newValueIndex, 'positionFactor', positionFactor, 'newValueWeightPosition', newValueWeightPosition, 'weightsAsLine', weightsAsLine, 'weights', this.weights);
    }
    if (newValueIndex === -1) {
      throw new Error('Something went horribly wrong - check generateNextValue weight position');
    }

    const newValue = this.possibleValues[newValueIndex];
    this.values.push(newValue);
    this.recalculateWeights(newValueIndex);
    return newValue;
  }

  /**
   * Tests this generator, generates 1000 values and draws their distribution on a canvas
   * @param {React.MutableRefObject<HTMLCanvasElement>} testCanvasRef
   */
  test (testCanvasRef) {

    const testCanvas = testCanvasRef.current;

    const canvasWidth = 500;
    const canvasHeight = 500;

    testCanvas.width = canvasWidth;
    testCanvas.height = canvasHeight;

    const ctx = testCanvas.getContext('2d');
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    for (let i = 0; i < 10000; i++) {
      // if (i > 9900) this.logGen = true;
      this.generateNextValue();
    }

    let maxValueTimes = 0;
    let minValueTimes = 1000000;

    const distribution = this.values.reduce((acc, value) => {
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});

    for (const valueName in distribution) {
      const valueTimes = distribution[valueName];
      if (valueTimes >= maxValueTimes) {
        maxValueTimes = valueTimes;
      }

      if (valueTimes <= minValueTimes) {
        minValueTimes = valueTimes;
      }
    }

    const columnWidth = canvasWidth / this.possibleValues.length;

    for (let i = 0; i < this.possibleValues.length; i++) {
      // Lower part with value names
      ctx.fillStyle = 'rgb(0, 0, 0)';
      ctx.fillText(this.possibleValues[i], (i * columnWidth) + (columnWidth / 2) - 5, canvasHeight - 5, columnWidth);
    }

    for (let i = 0; i < this.possibleValues.length; i++) {
      const valueName = this.possibleValues[i];
      const valueTimes = distribution[valueName];
      const height = valueTimes / maxValueTimes * (canvasHeight - 30);
      ctx.fillRect((i * columnWidth) + 5, canvasHeight - 20 - height, columnWidth - 10, height);
    }

    console.log('DIST ', distribution);

  }
}