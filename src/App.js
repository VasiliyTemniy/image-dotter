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

  const handleFileSelection = async (e) => {
    e.preventDefault();
    if (!e.target.files || !e.target.files[0]) {
      showNotification('No file selected', 'error');
      return;
    }

    const image = await readImage(e.target.files[0]);

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
      />
      <ImageInit
        inputCanvasRef={inputCanvasRef}
        outputCanvasRef={outputCanvasRef}
        updatePipetteColor={updatePipetteColor}
      />
      <GridOutput ref={gridOutputRef} />
    </>
  );
};

export default App;
