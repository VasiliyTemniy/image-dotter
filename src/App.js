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

  const [rowsCount, setRowsCount] = useState(50);
  const [columnsCount, setColumnsCount] = useState(50);
  const [backgroundColor, setBackgroundColor] = useState('#1c1e21');
  const [surroundingDotsColor, setSurroundingDotsColor] = useState('#325e9f');
  const [alwaysRedraw, setAlwaysRedraw] = useState(true);
  const [message, setMessage] = useState({ text : null, type : null, timeoutId : null, shown : false });
  const [stretchCanvas, setStretchCanvas] = useState(true);
  const [screenOverflow, setScreenOverflow] = useState(false);
  const [fitBothCanvasInOneRow, setFitBothCanvasInOneRow] = useState(false);
  const [aspectRatioMode, setAspectRatioMode] = useState('image');

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
    setRowsCount(count);
    if (alwaysRedraw) {
      drawGridPreview(inputCanvasRef, outputCanvasRef, count, columnsCount);
    }
  };

  const updateColumnsCount = (count) => {
    if (!count || !Number.isInteger(Number(count)) || Number(count) < 1) {
      showNotification('Columns count must be a positive integer', 'error');
      setColumnsCount(50);
      return;
    }
    setColumnsCount(count);
    if (alwaysRedraw) {
      drawGridPreview(inputCanvasRef, outputCanvasRef, rowsCount, count);
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
  };

  const updateScreenOverflow = (value) => {
    setScreenOverflow(value);
  };

  const updateFitBothCanvasInOneRow = (value) => {
    setFitBothCanvasInOneRow(value);
  };

  const updateAspectRatioMode = (value) => {
    setAspectRatioMode(value);
  };

  const handleFileSelection = async (e) => {
    e.preventDefault();
    if (!e.target.files || !e.target.files[0]) {
      showNotification('No file selected', 'error');
      return;
    }

    const image = await readImage(e.target.files[0]);

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

    if (fitBothCanvasInOneRow) {
      availableScreenWidth = Math.floor((availableScreenWidth - unavailableWidth) / 2);
    }

    if (stretchCanvas && image.width <= availableScreenWidth) {
      inputCanvasRef.current.width = availableScreenWidth;
      inputCanvasRef.current.height = Math.floor(image.height * (availableScreenWidth / image.width));
    } else if (!stretchCanvas && image.width <= availableScreenWidth) {
      inputCanvasRef.current.width = image.width;
      inputCanvasRef.current.height = image.height;
    } else if (screenOverflow && image.width > availableScreenWidth) {
      inputCanvasRef.current.parent.classList.add('overflow-x-scroll');
      inputCanvasRef.current.width = image.width;
      inputCanvasRef.current.height = image.height;
    } else if (!screenOverflow && image.width > availableScreenWidth) {
      inputCanvasRef.current.width = availableScreenWidth;
      inputCanvasRef.current.height = Math.floor(image.height * (availableScreenWidth / image.width));
    } else {
      inputCanvasRef.current.width = image.width;
      inputCanvasRef.current.height = image.height;
    }

    outputCanvasRef.current.width = inputCanvasRef.current.width;
    outputCanvasRef.current.height = inputCanvasRef.current.height;

    drawImage(image, inputCanvasRef);
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
