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


/**
 * @typedef {import('./index.d.ts').DotterGridParams} DotterGridParams
 */

const App = () => {

  const [rowsCount, setRowsCount] = useState(20);
  const [columnsCount, setColumnsCount] = useState(100);
  const [radius, setRadius] = useState(10);
  const [horizontalGapPx, setHorizontalGapPx] = useState(1);
  const [verticalGapPx, setVerticalGapPx] = useState(1);
  const [angle, setAngle] = useState(0);
  const [useStroke, setUseStroke] = useState(false);
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(1);
  const [useIgnoreColor, setUseIgnoreColor] = useState(false);
  const [ignoreColor, setIgnoreColor] = useState('#ffffff');
  const [ignoreColorOpacityThreshold, setIgnoreColorOpacityThreshold] = useState(50);
  const [ignoreColorMaxDeviation, setIgnoreColorMaxDeviation] = useState(1);
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
      redrawGridPreview({ rowsCount: localRowsCount, columnsCount: localColumnsCount });
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
      redrawGridPreview({ rowsCount: localRowsCount, columnsCount: localColumnsCount });
    }
  };

  const updateRadius = (value) => {
    if (!value || !Number.isInteger(Number(value)) || Number(value) < 0) {
      showNotification('Radius must be a positive integer', 'error');
      setRadius(10);
      return;
    }
    setRadius(value);

    if (alwaysRedraw) {
      redrawGridPreview({ radius : value });
    }
  };

  const updateHorizontalGapPx = (value) => {
    if (!value || !Number.isInteger(Number(value)) || Number(value) < 0) {
      showNotification('Horizontal gap must be a positive integer or 0', 'error');
      setHorizontalGapPx(1);
      return;
    }
    setHorizontalGapPx(value);

    if (alwaysRedraw) {
      redrawGridPreview({ horizontalGapPx : value });
    }
  };

  const updateVerticalGapPx = (value) => {
    if (!value || !Number.isInteger(Number(value)) || Number(value) < 0) {
      showNotification('Vertical gap must be a positive integer or 0', 'error');
      setVerticalGapPx(1);
      return;
    }
    setVerticalGapPx(value);

    if (alwaysRedraw) {
      redrawGridPreview({ verticalGapPx : value });
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
    redrawGridPreview({});
  };

  const updateScreenOverflow = (value) => {
    setScreenOverflow(value);
    if (!image) {
      return;
    }
    resizeCanvas(inputCanvasRef.current.width, inputCanvasRef.current.height, stretchCanvas, value, fitBothCanvasInOneRow);
    drawImage(image, inputCanvasRef);
    redrawGridPreview({});
  };

  const updateFitBothCanvasInOneRow = (value) => {
    setFitBothCanvasInOneRow(value);
    if (!image) {
      return;
    }
    resizeCanvas(inputCanvasRef.current.width, inputCanvasRef.current.height, stretchCanvas, screenOverflow, value);
    drawImage(image, inputCanvasRef);
    redrawGridPreview({});
  };

  const updateAspectRatioMode = (value) => {
    setAspectRatioMode(value);

    let localRowsCount = rowsCount;
    let localColumnsCount = columnsCount;

    switch (value) {
    case 'image':
      localColumnsCount = Math.floor(rowsCount * (inputCanvasRef.current.width / inputCanvasRef.current.height)) || 1;
      setColumnsCount(localColumnsCount);
      break;
    case 'square':
      localColumnsCount = rowsCount;
      setColumnsCount(localColumnsCount);
      break;
    case 'none':
      break;
    default:
      break;
    }

    if (alwaysRedraw) {
      redrawGridPreview({ rowsCount: localRowsCount, columnsCount: localColumnsCount });
    }
  };

  const updateAngle = (value) => {
    if (!value || !Number.isInteger(Number(value)) || Number(value) < 0 || Number(value) > 360) {
      showNotification('Angle must be a positive integer between 0 and 360', 'error');
      setAngle(0);
      return;
    }
    setAngle(value);

    if (alwaysRedraw) {
      redrawGridPreview({ angle : value });
    }
  };

  const updateUseStroke = (value) => {
    setUseStroke(value);

    if (alwaysRedraw) {
      redrawGridPreview({ strokeColor: value ? strokeColor : null, strokeWidth: value ? strokeWidth : null });
    }
  };

  const updateStrokeColor = (value) => {
    setStrokeColor(value);

    if (alwaysRedraw && useStroke) {
      redrawGridPreview({ strokeColor: useStroke ? value: null });
    }
  };

  const updateStrokeWidth = (value) => {
    if (!value || !Number.isInteger(Number(value)) || Number(value) < 1) {
      showNotification('Stroke width must be a positive integer', 'error');
      setStrokeWidth(1);
      return;
    }
    setStrokeWidth(value);

    if (alwaysRedraw && useStroke) {
      redrawGridPreview({ strokeWidth: useStroke ? value : null });
    }
  };

  const updateUseIgnoreColor = (value) => {
    setUseIgnoreColor(value);

    if (alwaysRedraw) {
      redrawGridPreview({ ignoreColor: value ? ignoreColor : null });
    }
  };

  const updateIgnoreColor = (value) => {
    setIgnoreColor(value);

    if (alwaysRedraw && useIgnoreColor) {
      redrawGridPreview({ ignoreColor: useIgnoreColor ? value : null });
    }
  };

  const updateIgnoreColorOpacityThreshold = (value) => {
    if (!value || !Number.isInteger(Number(value)) || Number(value) < 0 || Number(value) > 255) {
      showNotification('Ignore color opacity threshold must be a positive integer between 0 and 255', 'error');
      setIgnoreColorOpacityThreshold(100);
      return;
    }
    setIgnoreColorOpacityThreshold(value);

    if (alwaysRedraw && useIgnoreColor) {
      redrawGridPreview({ ignoreColorOpacityThreshold: useIgnoreColor ? value : null });
    }
  };

  const updateIgnoreColorMaxDeviation = (value) => {
    if (!value || !Number.isInteger(Number(value)) || Number(value) < 0 || Number(value) > 255) {
      showNotification('Ignore color max deviation must be a positive integer between 0 and 255', 'error');
      setIgnoreColorMaxDeviation(100);
      return;
    }
    setIgnoreColorMaxDeviation(value);

    if (alwaysRedraw && useIgnoreColor) {
      redrawGridPreview({ ignoreColorMaxDeviation: useIgnoreColor ? value : null });
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
    redrawGridPreview({ rowsCount: localRowsCount, columnsCount: localColumnsCount });
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

  /**
   * @param {Partial<DotterGridParams>} changedParams
   */
  const redrawGridPreview = (changedParams) => {
    drawGridPreview(
      inputCanvasRef,
      outputCanvasRef,
      {
        rowsCount,
        columnsCount,
        radius,
        horizontalGapPx,
        verticalGapPx,
        angle,
        strokeColor: useStroke ? strokeColor : null,
        strokeWidth: useStroke ? strokeWidth : null,
        ignoreColor: useIgnoreColor ? ignoreColor : null,
        ignoreColorOpacityThreshold: useIgnoreColor ? ignoreColorOpacityThreshold : null,
        ignoreColorMaxDeviation: useIgnoreColor ? ignoreColorMaxDeviation : null,
        ...changedParams
      }
    );
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
        radius={radius}
        updateRadius={updateRadius}
        horizontalGapPx={horizontalGapPx}
        updateHorizontalGapPx={updateHorizontalGapPx}
        verticalGapPx={verticalGapPx}
        updateVerticalGapPx={updateVerticalGapPx}
        angle={angle}
        updateAngle={updateAngle}
        useStroke={useStroke}
        updateUseStroke={updateUseStroke}
        strokeColor={strokeColor}
        updateStrokeColor={updateStrokeColor}
        strokeWidth={strokeWidth}
        updateStrokeWidth={updateStrokeWidth}
        useIgnoreColor={useIgnoreColor}
        updateUseIgnoreColor={updateUseIgnoreColor}
        ignoreColor={ignoreColor}
        updateIgnoreColor={updateIgnoreColor}
        ignoreColorOpacityThreshold={ignoreColorOpacityThreshold}
        updateIgnoreColorOpacityThreshold={updateIgnoreColorOpacityThreshold}
        ignoreColorMaxDeviation={ignoreColorMaxDeviation}
        updateIgnoreColorMaxDeviation={updateIgnoreColorMaxDeviation}
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
