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

export const drawImage = (image, inputCanvasRef) => {
  // TODO handle something in regards of input image scaling
  // const width = image.width;
  // const height = image.height;
  // canvasInput.width = width;
  // canvasInput.height = height;
  // contextInput.drawImage(image, 0, 0, width, height);
  const canvasInput = inputCanvasRef.current;
  const contextInput = canvasInput.getContext('2d', { willReadFrequently: true });
  contextInput.drawImage(image, 0, 0, canvasInput.width, canvasInput.height);
};

export const drawGridPreview = (inputCanvasRef, outputCanvasRef, rowsCount, columnsCount) => {
  const canvasInput = inputCanvasRef.current;
  const contextInput = canvasInput.getContext('2d', { willReadFrequently: true });

  const canvasOutput = outputCanvasRef.current;
  const contextOutput = canvasOutput.getContext('2d', { willReadFrequently: true });

  const grid = makeColorGrid(rowsCount, columnsCount, contextInput);
  drawOutputByGrid(grid, rowsCount, columnsCount, 500, 500, contextOutput);
};

export const makeColorGrid = (rowsNumber, columnsNumber, contextInput) => {
  const grid = [];
  const columnWidth = Math.floor(contextInput.canvas.width / rowsNumber);
  const rowHeight = Math.floor(contextInput.canvas.height / columnsNumber);

  for (let row = 0; row < rowsNumber; row++) {
    const gridrow = [];
    for (let column = 0; column < columnsNumber; column++) {
      const x = columnWidth * column;
      const y = rowHeight * row;
      const data = contextInput.getImageData(x, y, columnWidth, rowHeight).data;
      const color = middleweightColor(data);
      gridrow.push({ color, row, column });
    }
    grid.push(gridrow);
  }

  return grid;
};

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
      drawCircle(contextOutput, xOut, yOut, Math.floor(outputWidth / 2) - 1, grid[row][column].color);
    }
  }
};

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

export const rgba2hex = (rgba) => {
  return (
    '#' +
    (rgba[0] | (1 << 8)).toString(16).slice(1) +
    (rgba[1] | (1 << 8)).toString(16).slice(1) +
    (rgba[2] | (1 << 8)).toString(16).slice(1) +
    (rgba[3] | (1 << 8)).toString(16).slice(1)
  );
};

const drawCircle = (context, x, y, radius, fill, stroke, strokeWidth) => {
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI, false);
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
