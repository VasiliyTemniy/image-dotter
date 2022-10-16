/* eslint-disable no-unused-vars */
export const encodeImageFileAsURL = () => {
  const canvasInput = document.getElementById('myCanvas')
  const contextInput = canvasInput.getContext('2d', { willReadFrequently: true })
  const outputColor = document.getElementById('color')
  const outputColorHex = document.getElementById('colorHex')

  const canvasOutput = document.getElementById('outputCanvas')
  const contextOutput = canvasOutput.getContext('2d', { willReadFrequently: true })

  const rowsInput = document.getElementById('rowsInput').value
  const columnsInput = document.getElementById('columnsInput').value

  const file = document.getElementById('fileInput').files[0]

  canvasInput.addEventListener('mousemove', (e) => {
    const x = e.offsetX
    const y = e.offsetY
    const data = contextInput.getImageData(x, y, 1, 1).data
    outputColor.textContent = `red ${data[0]} green ${data[1]} blue ${data[2]} alpha ${data[3]}`
    outputColorHex.textContent = `${rgba2hex(data[0], data[1], data[2], data[3])}`
  })

  canvasOutput.addEventListener('mousemove', (e) => {
    const x = e.offsetX
    const y = e.offsetY
    const data = contextOutput.getImageData(x, y, 1, 1).data
    outputColor.textContent = `red ${data[0]} green ${data[1]} blue ${data[2]} alpha ${data[3]}`
    outputColorHex.textContent = `${rgba2hex(data[0], data[1], data[2], data[3])}`
  })

  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onloadend = () => {
    const image = new Image()
    image.src = reader.result
    image.onload = () => {
      drawImage(image, canvasInput, contextInput)
      const grid = makeColorGrid(rowsInput, columnsInput, contextInput)
      drawOutputByGrid(grid, rowsInput, columnsInput, 500, 500, contextOutput)
    }
  }
}

const drawImage = (image, canvasInput, contextInput) => {
  const width = image.width
  const height = image.height
  canvasInput.width = width
  canvasInput.height = height
  contextInput.drawImage(image, 0, 0, width, height)
}

export const makeColorGrid = (rowsNumber, columnsNumber, contextInput) => {
  const grid = []
  const columnWidth = Math.floor(contextInput.canvas.width / rowsNumber)
  const rowHeight = Math.floor(contextInput.canvas.height / columnsNumber)

  for (let row = 0; row < rowsNumber; row++) {
    const gridrow = []
    for (let column = 0; column < columnsNumber; column++) {
      const x = columnWidth * column
      const y = rowHeight * row
      const data = contextInput.getImageData(x, y, columnWidth, rowHeight).data
      const color = midlleweightColor(data)
      gridrow.push({ color, row, column })
    }
    grid.push(gridrow)
  }

  return grid
}

const drawOutputByGrid = (
  grid,
  rowsNumber,
  columnsNumber,
  outputCanvasWidth,
  outputCanvasHeight,
  contextOutput,
) => {
  contextOutput.clearRect(0, 0, contextOutput.canvas.width, contextOutput.canvas.height)

  const outputWidth = Math.floor(outputCanvasWidth / rowsNumber)
  const outputHeight = Math.floor(outputCanvasHeight / columnsNumber)

  for (let row = 0; row < rowsNumber; row++) {
    for (let column = 0; column < columnsNumber; column++) {
      const xOut = outputWidth * column + Math.floor(outputWidth / 2)
      const yOut = outputHeight * row + Math.floor(outputHeight / 2)
      drawCircle(contextOutput, xOut, yOut, Math.floor(outputWidth / 2) - 1, grid[row][column].color)
    }
  }
}

const midlleweightColor = (data) => {
  let red = 0
  let green = 0
  let blue = 0
  let alpha = 0
  let pixelsCounter = 0
  for (let i = 0; i < data.length; i += 4) {
    red = red + data[i]
    green = green + data[i + 1]
    blue = blue + data[i + 2]
    alpha = alpha + data[i + 3]
    pixelsCounter++
  }
  red = Math.round(red / pixelsCounter)
  green = Math.round(green / pixelsCounter)
  blue = Math.round(blue / pixelsCounter)
  alpha = Math.round(alpha / pixelsCounter)
  return rgba2hex(red, green, blue, alpha)
}

const rgba2hex = (red, green, blue, alpha) => {
  return (
    '#' +
    (red | (1 << 8)).toString(16).slice(1) +
    (green | (1 << 8)).toString(16).slice(1) +
    (blue | (1 << 8)).toString(16).slice(1) +
    (alpha | (1 << 8)).toString(16).slice(1)
  )
}

const drawCircle = (context, x, y, radius, fill, stroke, strokeWidth) => {
  context.beginPath()
  context.arc(x, y, radius, 0, 2 * Math.PI, false)
  if (fill) {
    context.fillStyle = fill
    context.fill()
  }
  if (stroke) {
    context.rowWidth = strokeWidth
    context.strokeStyle = stroke
    context.stroke()
  }
}
