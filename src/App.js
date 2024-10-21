import { drawGridPreview, drawImage, readImage } from './utils/dottergrid';
import ImageInit from './components/ImageInit';
import GridOutput from './components/GridOutput';
import Menu from './components/Menu';
import Notification from './components/Notification';
import { useRef, useState } from 'react';
import './styles/grid-output.css';
import './styles/nav.css';
import './styles/button.css';
import './styles/input.css';
import './styles/notification.css';
import './styles/flex.css';
import './styles/container.css';
import './styles/main.css';
import { pipetteHexText, pipetteRGBAText } from './utils/color';


const App = () => {

  const [rowsCount, setRowsCount] = useState(20);
  const [columnsCount, setColumnsCount] = useState(100);
  const [backgroundColor, setBackgroundColor] = useState('#1c1e21');
  const [surroundingDotsColor, setSurroundingDotsColor] = useState('#325e9f');
  const [alwaysRedraw, setAlwaysRedraw] = useState(true);
  const [message, setMessage] = useState({ text : null, type : null, timeoutId : null, shown : false });
  const [stretchCanvas, setStretchCanvas] = useState(true);
  const [screenOverflow, setScreenOverflow] = useState(false);
  const [fitBothCanvasInOneRow, setFitBothCanvasInOneRow] = useState(false);
  const [aspectRatioMode, setAspectRatioMode] = useState('image');
  const [image, setImage] = useState(null);

  const showNotification = (text, type) => {
    if (message.timeoutId) {
      clearTimeout(message.timeoutId);
    }
    const timeoutId = setTimeout(() => {
      setMessage((prev) => ({ ...prev, shown : false }));
    }, 5000);
    setMessage({ text, type, timeoutId, shown : true });
  };

  const gridOutputRef = useRef();
  const inputCanvasRef = useRef();
  const outputCanvasRef = useRef();

  const pipetteRGBARef = useRef();
  const pipetteHexRef = useRef();

  const updateRowsCount = (count) => {
    if (!count || !Number.isInteger(Number(count)) || Number(count) < 1) {
      showNotification('Rows count must be a positive integer', 'error');
      setRowsCount(50);
      return;
    }
    let localRowsCount = count;
    let localColumnsCount = columnsCount;

    setRowsCount(localRowsCount);

    switch (aspectRatioMode) {
    case 'image':
      localColumnsCount = Math.floor(count * (inputCanvasRef.current.width / inputCanvasRef.current.height)) || 1;
      setColumnsCount(localColumnsCount);
      break;
    case 'square':
      localColumnsCount = count;
      setColumnsCount(localColumnsCount);
      break;
    case 'none':
      break;
    default:
      break;
    }
    if (alwaysRedraw) {
      drawGridPreview(inputCanvasRef, outputCanvasRef, localRowsCount, localColumnsCount);
    }
  };

  const updateColumnsCount = (count) => {
    if (!count || !Number.isInteger(Number(count)) || Number(count) < 1) {
      showNotification('Columns count must be a positive integer', 'error');
      setColumnsCount(50);
      return;
    }
    let localRowsCount = rowsCount;
    let localColumnsCount = count;

    setColumnsCount(localColumnsCount);

    switch (aspectRatioMode) {
    case 'image':
      localRowsCount = Math.floor(count * (inputCanvasRef.current.height / inputCanvasRef.current.width)) || 1;
      setRowsCount(localRowsCount);
      break;
    case 'square':
      localRowsCount = count;
      setRowsCount(localRowsCount);
      break;
    case 'none':
      break;
    default:
      break;
    }
    if (alwaysRedraw) {
      drawGridPreview(inputCanvasRef, outputCanvasRef, localRowsCount, localColumnsCount);
    }
  };

  const updateBackgroundColor = (hex) => {
    setBackgroundColor(hex);
  };

  const updateSurroundingDotsColor = (hex) => {
    setSurroundingDotsColor(hex);
  };

  const updatePipetteColor = (rgba) => {
    if (!pipetteRGBARef || !pipetteHexRef) {
      return;
    }

    pipetteRGBARef.current.innerHTML = `<pre>RGBA: ${pipetteRGBAText(rgba)}</pre>`;
    pipetteHexRef.current.innerHTML = `<pre>Hex: ${pipetteHexText(rgba)}</pre>`;
  };

  const updateAlwaysRedraw = (value) => {
    setAlwaysRedraw(value);
  };

  const updateStretchCanvas = (value) => {
    setStretchCanvas(value);
    if (!image) {
      return;
    }
    resizeCanvas(inputCanvasRef.current.width, inputCanvasRef.current.height, value, screenOverflow, fitBothCanvasInOneRow);
    drawImage(image, inputCanvasRef);
    drawGridPreview(inputCanvasRef, outputCanvasRef, rowsCount, columnsCount);
  };

  const updateScreenOverflow = (value) => {
    setScreenOverflow(value);
    if (!image) {
      return;
    }
    resizeCanvas(inputCanvasRef.current.width, inputCanvasRef.current.height, stretchCanvas, value, fitBothCanvasInOneRow);
    drawImage(image, inputCanvasRef);
    drawGridPreview(inputCanvasRef, outputCanvasRef, rowsCount, columnsCount);
  };

  const updateFitBothCanvasInOneRow = (value) => {
    setFitBothCanvasInOneRow(value);
    if (!image) {
      return;
    }
    resizeCanvas(inputCanvasRef.current.width, inputCanvasRef.current.height, stretchCanvas, screenOverflow, value);
    drawImage(image, inputCanvasRef);
    drawGridPreview(inputCanvasRef, outputCanvasRef, rowsCount, columnsCount);
  };

  const updateAspectRatioMode = (value) => {
    setAspectRatioMode(value);
    switch (value) {
    case 'image':
      setColumnsCount(Math.floor(rowsCount * (inputCanvasRef.current.width / inputCanvasRef.current.height)) || 1);
      break;
    case 'square':
      setColumnsCount(rowsCount);
      break;
    case 'none':
      break;
    default:
      break;
    }
  };

  const handleFileSelection = async (e) => {
    e.preventDefault();
    if (!e.target.files || !e.target.files[0]) {
      showNotification('No file selected', 'error');
      return;
    }

    const image = await readImage(e.target.files[0]);

    setImage(image);

    const { localRowsCount, localColumnsCount } = resizeCanvas(image.width, image.height, stretchCanvas, screenOverflow, fitBothCanvasInOneRow);

    drawImage(image, inputCanvasRef);
    drawGridPreview(inputCanvasRef, outputCanvasRef, localRowsCount, localColumnsCount);
  };

  const resizeCanvas = (localWidth, localHeight, localStretchCanvas, localScreenOverflow, localFitBothCanvasInOneRow) => {
    const windowWidth = window.innerWidth;

    let unavailableWidth = 18;

    const canvasStyle = window.getComputedStyle(inputCanvasRef.current);
    const canvasContainerStyle = window.getComputedStyle(inputCanvasRef.current.parentElement);

    unavailableWidth += Number(canvasStyle.borderLeftWidth.replace('px', ''));
    unavailableWidth += Number(canvasStyle.borderRightWidth.replace('px', ''));
    unavailableWidth += Number(canvasStyle.paddingLeft.replace('px', ''));
    unavailableWidth += Number(canvasStyle.paddingRight.replace('px', ''));
    unavailableWidth += Number(canvasStyle.marginLeft.replace('px', ''));
    unavailableWidth += Number(canvasStyle.marginRight.replace('px', ''));
    unavailableWidth += Number(canvasContainerStyle.borderLeftWidth.replace('px', ''));
    unavailableWidth += Number(canvasContainerStyle.borderRightWidth.replace('px', ''));
    unavailableWidth += Number(canvasContainerStyle.paddingLeft.replace('px', ''));
    unavailableWidth += Number(canvasContainerStyle.paddingRight.replace('px', ''));
    unavailableWidth += Number(canvasContainerStyle.marginLeft.replace('px', ''));
    unavailableWidth += Number(canvasContainerStyle.marginRight.replace('px', ''));

    let availableScreenWidth = windowWidth - unavailableWidth;

    if (localFitBothCanvasInOneRow) {
      availableScreenWidth = Math.floor((availableScreenWidth - unavailableWidth) / 2);
    }

    if (localStretchCanvas && localWidth <= availableScreenWidth) {
      inputCanvasRef.current.width = availableScreenWidth;
      inputCanvasRef.current.height = Math.floor(localHeight * (availableScreenWidth / localWidth));
    } else if (!localStretchCanvas && localWidth <= availableScreenWidth) {
      inputCanvasRef.current.width = localWidth;
      inputCanvasRef.current.height = localHeight;
    } else if (localScreenOverflow && localWidth > availableScreenWidth) {
      if (!inputCanvasRef.current.parent.classList.contains('overflow-x-scroll')) {
        inputCanvasRef.current.parent.classList.add('overflow-x-scroll');
      }
      inputCanvasRef.current.width = localWidth;
      inputCanvasRef.current.height = localHeight;
    } else if (!localScreenOverflow && localWidth > availableScreenWidth) {
      inputCanvasRef.current.width = availableScreenWidth;
      inputCanvasRef.current.height = Math.floor(localHeight * (availableScreenWidth / localWidth));
    } else {
      inputCanvasRef.current.width = localWidth;
      inputCanvasRef.current.height = localHeight;
    }

    outputCanvasRef.current.width = inputCanvasRef.current.width;
    outputCanvasRef.current.height = inputCanvasRef.current.height;

    let localRowsCount = rowsCount;
    let localColumnsCount = columnsCount;

    if (aspectRatioMode === 'image') {
      localColumnsCount = Math.floor(rowsCount * (inputCanvasRef.current.width / inputCanvasRef.current.height)) || 1;
      setColumnsCount(localColumnsCount);
    }

    return { localRowsCount, localColumnsCount };
  };

  const redrawGridPreview = () => {
    drawGridPreview(inputCanvasRef, outputCanvasRef, rowsCount, columnsCount);
  };

  return (
    <>
      <Notification message={message.text} type={message.type} shown={message.shown}/>
      <Menu
        handleFileSelection={handleFileSelection}
        gridOutputRef={gridOutputRef}
        inputCanvasRef={inputCanvasRef}
        rowsCount={rowsCount}
        updateRowsCount={updateRowsCount}
        columnsCount={columnsCount}
        updateColumnsCount={updateColumnsCount}
        backgroundColor={backgroundColor}
        updateBackgroundColor={updateBackgroundColor}
        surroundingDotsColor={surroundingDotsColor}
        updateSurroundingDotsColor={updateSurroundingDotsColor}
        alwaysRedraw={alwaysRedraw}
        updateAlwaysRedraw={updateAlwaysRedraw}
        pipetteRGBARef={pipetteRGBARef}
        pipetteHexRef={pipetteHexRef}
        aspectRatioMode={aspectRatioMode}
        updateAspectRatioMode={updateAspectRatioMode}
        redrawGridPreview={redrawGridPreview}
      />
      <ImageInit
        inputCanvasRef={inputCanvasRef}
        outputCanvasRef={outputCanvasRef}
        updatePipetteColor={updatePipetteColor}
        stretchCanvas={stretchCanvas}
        updateStretchCanvas={updateStretchCanvas}
        screenOverflow={screenOverflow}
        updateScreenOverflow={updateScreenOverflow}
        fitBothCanvasInOneRow={fitBothCanvasInOneRow}
        updateFitBothCanvasInOneRow={updateFitBothCanvasInOneRow}
      />
      <GridOutput ref={gridOutputRef} />
    </>
  );
};

export default App;
