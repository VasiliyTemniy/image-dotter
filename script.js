const canvas = document.getElementById('myCanvas')
const context = canvas.getContext('2d', {willReadFrequently: true})
const outputColor = document.getElementById('color')

function encodeImageFileAsURL(element) {
    var file = element.files[0];
    var reader = new FileReader();
    reader.onloadend = function() {
        drawImage(reader.result)
    }
    reader.readAsDataURL(file);
  }

const drawImage = (src) => {
    const image = new Image();
    image.src = src
    image.onload = () => {
        const width = image.width;
        const height = image.height;
        canvas.width = width;
        canvas.height = height;
        context.drawImage(image, 0, 0, width, height);
    }
}

let x = 0;
let y = 0;

canvas.addEventListener('mousemove', (e) => {
    x = e.offsetX;
    y = e.offsetY;
    const data = context.getImageData(x, y, 1, 1).data;
    outputColor.textContent = `red ${data[0]} green ${data[1]} blue ${data[2]} alpha ${data[3]}`
});