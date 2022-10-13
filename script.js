/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const canvas = document.getElementById('myCanvas')
const context = canvas.getContext('2d', {willReadFrequently: true})
const outputColor = document.getElementById('color')
const outputColorHex = document.getElementById('colorHex')

const canvasOutput = document.getElementById('outputCanvas')        //all outputs - for tests only
const contextOutput = canvasOutput.getContext('2d')

encodeImageFileAsURL = (element) => {
  const file = element.files[0]
  const reader = new FileReader()
  reader.onloadend = () => {
    drawImage(reader.result)
  }
  reader.readAsDataURL(file)
}

const drawImage = (src) => {
  const image = new Image()
  image.src = src
  image.onload = () => {
    const width = image.width
    const height = image.height
    canvas.width = width
    canvas.height = height
    context.drawImage(image, 0, 0, width, height)
    contextOutput.rect(0, 0, 500, 500)
    contextOutput.fillStyle = '#8ef1ceff'
    contextOutput.fill()
    makeColorGrid(image, 50, 50)                // second and third parameters - adjustable
  }
}

const makeColorGrid = (image, linesNumber, rowsNumber) => {
  let grid = []
  const rowWidth = Math.floor(image.width / linesNumber)
  const lineHeight = Math.floor(image.height / rowsNumber)

  const outputWidth = Math.floor(500 / linesNumber)             //all outputs - for tests only
  const outputHeight = Math.floor(500 / rowsNumber)

  for (let line = 0; line < linesNumber; line++) {
    let gridLine = []
    for (let row = 0; row < rowsNumber ; row++) {
      const x = rowWidth * row
      const y = lineHeight * line
      const data = context.getImageData(x, y, rowWidth, lineHeight).data
      const color = midlleweightColor(data)
      gridLine.push(color)

      const xOut = outputWidth * row + Math.floor(outputWidth / 2)          //all outputs - for tests only
      const yOut = outputHeight * line + Math.floor(outputHeight / 2)
      drawCircle(contextOutput, xOut, yOut, Math.floor(outputWidth / 2) - 1, color)

    }
    grid.push(gridLine)
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
    green = green + data[i+1]
    blue = blue + data[i+2]
    alpha = alpha + data[i+3]
    pixelsCounter++
  }
  red = Math.round(red / pixelsCounter)
  green = Math.round(green / pixelsCounter)
  blue = Math.round(blue / pixelsCounter)
  alpha = Math.round(alpha / pixelsCounter)
  return rgba2hex(red, green, blue, alpha)
}

const rgba2hex = (red, green, blue, alpha) => {
  return '#' + 
    (red | 1 << 8).toString(16).slice(1) +
    (green | 1 << 8).toString(16).slice(1) +
    (blue | 1 << 8).toString(16).slice(1) +
    (alpha | 1 << 8).toString(16).slice(1)
}

const drawCircle = (context, x, y, radius, fill, stroke, strokeWidth) => {          //all outputs - for tests only
  context.beginPath()
  context.arc(x, y, radius, 0, 2 * Math.PI, false)
  if (fill) {
    context.fillStyle = fill
    context.fill()
  }
  if (stroke) {
    context.lineWidth = strokeWidth
    context.strokeStyle = stroke
    context.stroke()
  }
}

canvas.addEventListener('mousemove', (e) => {                       //all outputs - for tests only
  const x = e.offsetX
  const y = e.offsetY
  const data = context.getImageData(x, y, 1, 1).data
  outputColor.textContent = `red ${data[0]} green ${data[1]} blue ${data[2]} alpha ${data[3]}`
  outputColorHex.textContent = `${rgba2hex(data[0], data[1], data[2], data[3])}`
})