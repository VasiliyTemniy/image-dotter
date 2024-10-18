import { encodeImageFileAsURL } from './utils/dottergrid';
import ImageInit from './components/ImageInit';
import GridOutput from './components/GridOutput';
import Menu from './components/Menu';
import { useRef } from 'react';
import './styles/grid-output.css';
import './styles/nav.css';
import './styles/button.css';
import './styles/input.css';

const App = () => {

  const gridOutputRef = useRef();

  const handleFileSelection = (e) => {
    e.preventDefault();
    encodeImageFileAsURL();
  };

  return (
    <>
      <Menu handleFileSelection={handleFileSelection} gridOutputRef={gridOutputRef} />
      <ImageInit />
      <GridOutput ref={gridOutputRef} />
    </>
  );
};

export default App;
