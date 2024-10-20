import { drawGridPreview, drawImage, readImage } from './utils/dottergrid';
import ImageInit from './components/ImageInit';
import GridOutput from './components/GridOutput';
import Menu from './components/Menu';
import { useRef, useState } from 'react';
import './styles/grid-output.css';
import './styles/nav.css';
import './styles/button.css';
import './styles/input.css';

const App = () => {

  const [rowsCount, setRowsCount] = useState(50);
  const [columnsCount, setColumnsCount] = useState(50);
  const [backgroundColor, setBackgroundColor] = useState('#1c1e21');
  const [surroundingDotsColor, setSurroundingDotsColor] = useState('#325e9f');
  const [pipetteColor, setPipetteColor] = useState([0, 0, 0, 0]);
  const [alwaysRedraw, setAlwaysRedraw] = useState(true);

  const gridOutputRef = useRef();
  const inputCanvasRef = useRef();
  const outputCanvasRef = useRef();

  const updateRowsCount = (count) => {
    if (!count || !Number.isInteger(Number(count)) || Number(count) < 1) {
      // TODO Show notification
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
      // TODO Show notification
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
    setPipetteColor(rgba);
  };

  const updateAlwaysRedraw = (value) => {
    setAlwaysRedraw(value);
  };

  const handleFileSelection = async (e) => {
    e.preventDefault();
    if (!e.target.files || !e.target.files[0]) {
      // TODO Show notification
      return;
    }

    const image = await readImage(e.target.files[0]);

    drawImage(image, inputCanvasRef);
    drawGridPreview(inputCanvasRef, outputCanvasRef, rowsCount, columnsCount);
  };

  return (
    <>
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
        pipetteColor={pipetteColor}
        alwaysRedraw={alwaysRedraw}
        updateAlwaysRedraw={updateAlwaysRedraw}
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
