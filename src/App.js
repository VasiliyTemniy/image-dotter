import { drawGridPreview, drawImage, makeColorGrid, mapColorGridToHex, readImage } from './utils/dottergrid';
import { ImageInit } from './components/ImageInit';
import { GridOutput } from './components/GridOutput';
import { Menu } from './components/Menu';
import { Notification } from './components/Notification';
import { useRef, useState } from 'react';
import './styles/grid-output.css';
import './styles/nav.css';
import './styles/button.css';
import './styles/input.css';
import './styles/notification.css';
import './styles/flex.css';
import './styles/container.css';
import './styles/main.css';
import './styles/color-picker.css';
import { pipetteHexText, pipetteRGBAText } from './utils/color';
import { useDebouncedCallback } from './hooks/useDebouncedCallback.js';
import { useGridConfig } from './hooks/useGridConfig.js';
import { useGeneratorConfig } from './hooks/useGeneratorConfig.js';
import { useAnimationConfig } from './hooks/useAnimationConfig.js';
import { useLayoutConfig } from './hooks/useLayoutConfig.js';
import { GeneratorTestComponent } from './components/GeneratorTestComponent.js';


/**
 * @typedef {import('./index.d.ts').GridParams} GridParams
 * @typedef {import('./index.d.ts').GeneratorParams} GeneratorParams
 * @typedef {import('./index.d.ts').AnimationParams} AnimationParams
 */

/**
 * TODO!!!
 * 1.DONE. Better input CSS
 * 2. Add generator - make seed-procedural-generation-based cell generator; optional color generator, optional size (horizontal span) generator
 * 3. Add animation control and options.
 * 4.DONE. Make grid settings in menu dropdownable, at least those additional settings, generator settings, animation settings
 * 5. Save as HTML + CSS instead of json. Leave json as an option. For json, though, change structure -
 *    some common options like radius and gaps should be handled separately from the grid
 *
 *
 * TO_POSSIBLY_NOT_DO:
 * 1. Rewrite grid handling from functions to gridHandler class. Could be more efficient, could be hemorroidal to handle it together with React
 */

const App = () => {

  const [menuOpen, setMenuOpen] = useState(true);

  // Other params
  const [backgroundColor, setBackgroundColor] = useState('#1c1e21ff');

  const [alwaysRedraw, setAlwaysRedraw] = useState(true);

  const [message, setMessage] = useState({ text : null, type : null, timeoutId : null, shown : false });

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

  const menuRef = useRef();

  const gridOutputRef = useRef();
  const inputCanvasRef = useRef();
  const outputCanvasRef = useRef();

  const pipetteRGBARef = useRef();
  const pipetteHexRef = useRef();

  const redrawGridPreview = useDebouncedCallback(
    /**
     * @param {Partial<GridParams>} changedGridParams
     * @param {Partial<GeneratorParams>} changedGeneratorParams
     */
    (changedGridParams, changedGeneratorParams, _image = image) => {
      if (!_image) {
        return;
      }
      drawGridPreview(
        inputCanvasRef,
        outputCanvasRef,
        {
          ...gridParams,
          stroke: gridParams.useStroke ? gridParams.stroke : null,
          ignoreColor: gridParams.useIgnoreColor ? gridParams.ignoreColor : null,
          ...changedGridParams
        },
        {
          ...generatorParams,
          cellSpan: generatorParams.useCellSpan ? generatorParams.cellSpan : null,
          mainPalette: generatorParams.useMainPalette ? generatorParams.mainPalette : null,
          surroundingCells: generatorParams.useSurroundingCells ? generatorParams.surroundingCells : null,
          ...changedGeneratorParams
        },
      );
    }, 300
  );

  const { params: gridParams, controls: gridControls, setters: gridSetters } = useGridConfig(
    showNotification,
    inputCanvasRef.current ? inputCanvasRef.current.height : 0,
    inputCanvasRef.current ? inputCanvasRef.current.width : 0,
    redrawGridPreview,
    alwaysRedraw
  );

  const { params: generatorParams, controls: generatorControls } = useGeneratorConfig(
    showNotification,
    redrawGridPreview,
    alwaysRedraw
  );

  const { params: animationParams, controls: animationControls } = useAnimationConfig(
    showNotification
  );

  const resizeCanvas = ({
    stretchCanvas = layoutParams.stretchCanvas,
    screenOverflow = layoutParams.screenOverflow,
    fitBothCanvasInOneRow = layoutParams.fitBothCanvasInOneRow,
    shiftMainByMenu = layoutParams.shiftMainByMenu,
  }, {
    localHeight = inputCanvasRef.current ? inputCanvasRef.current.height : 0,
    localWidth = inputCanvasRef.current ? inputCanvasRef.current.width : 0,
    localMenuOpen = menuOpen
  }) => {
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

    if (shiftMainByMenu && menuRef.current && localMenuOpen) {
      if (fitBothCanvasInOneRow) {
        availableScreenWidth -= Math.ceil(menuRef.current.offsetWidth / 2);
      } else {
        availableScreenWidth -= menuRef.current.offsetWidth;
      }
    }

    if (stretchCanvas && localWidth <= availableScreenWidth) {
      inputCanvasRef.current.width = availableScreenWidth;
      inputCanvasRef.current.height = Math.floor(localHeight * (availableScreenWidth / localWidth));
    } else if (!stretchCanvas && localWidth <= availableScreenWidth) {
      inputCanvasRef.current.width = localWidth;
      inputCanvasRef.current.height = localHeight;
    } else if (screenOverflow && localWidth > availableScreenWidth) {
      if (!inputCanvasRef.current.parentElement.classList.contains('overflow-x-scroll')) {
        inputCanvasRef.current.parentElement.classList.add('overflow-x-scroll');
      }
      inputCanvasRef.current.width = localWidth;
      inputCanvasRef.current.height = localHeight;
    } else if (!screenOverflow && localWidth > availableScreenWidth) {
      inputCanvasRef.current.width = availableScreenWidth;
      inputCanvasRef.current.height = Math.floor(localHeight * (availableScreenWidth / localWidth));
    } else {
      inputCanvasRef.current.width = localWidth;
      inputCanvasRef.current.height = localHeight;
    }

    outputCanvasRef.current.width = inputCanvasRef.current.width;
    outputCanvasRef.current.height = inputCanvasRef.current.height;

    let localRowsCount = gridParams.rowsCount;
    let localColumnsCount = gridParams.columnsCount;

    if (gridParams.aspectRatioMode === 'image') {
      localColumnsCount = Math.floor(gridParams.rowsCount * (inputCanvasRef.current.width / inputCanvasRef.current.height)) || 1;
      gridSetters.setColumnsCount(localColumnsCount);
    }

    return { localRowsCount, localColumnsCount };
  };

  const { params: layoutParams, controls: layoutControls } = useLayoutConfig(
    image,
    inputCanvasRef,
    resizeCanvas,
    redrawGridPreview,
  );

  const updateBackgroundColor = (hex) => {
    setBackgroundColor(hex);
    // TODO: DECIDE maybe update output canvas color too?
    const background = gridOutputRef.current.backgroundRef.current;
    background.style.backgroundColor = hex;
  };

  const updatePipetteColor = (rgba) => {
    if (!pipetteRGBARef.current || !pipetteHexRef.current) {
      return;
    }

    pipetteRGBARef.current.innerHTML = `<pre>RGBA: ${pipetteRGBAText(rgba)}</pre>`;
    pipetteHexRef.current.innerHTML = `<pre>Hex: ${pipetteHexText(rgba)}</pre>`;
  };

  const updateAlwaysRedraw = (value) => {
    setAlwaysRedraw(value);
  };

  const updateMenuOpen = (value) => {
    setMenuOpen(value);
    if (!image) {
      return;
    }

    resizeCanvas({}, { localMenuOpen: value });
    drawImage(image, inputCanvasRef);
    redrawGridPreview({}, {});
  };

  const handleFileSelection = async (e) => {
    e.preventDefault();
    if (!e.target.files || !e.target.files[0]) {
      showNotification('No file selected', 'error');
      return;
    }

    const image = await readImage(e.target.files[0]);

    setImage(image);

    const { localRowsCount, localColumnsCount } = resizeCanvas({}, {
      localWidth: image.width,
      localHeight: image.height
    });

    drawImage(image, inputCanvasRef);
    redrawGridPreview({ rowsCount: localRowsCount, columnsCount: localColumnsCount }, {}, image);
  };

  const handleRedrawGrid = (e) => {
    e.preventDefault();
    const canvasInput = inputCanvasRef.current;
    const contextInput = canvasInput.getContext('2d');
    const grid = mapColorGridToHex(makeColorGrid(contextInput, gridParams, generatorParams));
    // TODO!!! Handle changedAnimationParams and those partial grid params
    gridOutputRef.current.handleCreate(
      grid,
      // {
      //   radius,
      //   horizontalGapPx,
      //   verticalGapPx,
      //   angle,
      //   stroke: useStroke ? {
      //     color: strokeColor,
      //     width: strokeWidth,
      //   } : null,
      // },
      // {
      //   type: animationType,
      //   direction: animationDirection,
      //   duration: animationDuration,
      //   delay: animationType === 'slide' ? {
      //     min: animationDelayMin,
      //     max: animationDelayMax,
      //   } : null,
      //   easing: animationEasing,
      //   // ...changedAnimationParams
      // }
    );
  };

  const handleSaveClick = async (e) => {
    e.preventDefault();
    const handle = await window.showSaveFilePicker({
      suggestedName: 'grid.json',
      types: [{
        description: 'Output grid',
        accept: { 'application/json': ['.json'] },
      }],
    });

    const blob = new Blob([JSON.stringify(gridOutputRef.current.grid)], { type: 'application/json' });

    const writableStream = await handle.createWritable();
    await writableStream.write(blob);
    await writableStream.close();
  };

  // Set to true to test and debug the generator
  const generatorTest = false;

  return (
    <>
      <Notification message={message.text} type={message.type} shown={message.shown}/>
      <Menu
        menuOpen={menuOpen}
        updateMenuOpen={updateMenuOpen}
        menuRef={menuRef}
        handleFileSelection={handleFileSelection}
        handleRedrawGrid={handleRedrawGrid}
        handleSaveClick={handleSaveClick}
        handleRedrawGridPreview={redrawGridPreview}
        gridParams={gridParams}
        gridControls={gridControls}
        generatorParams={generatorParams}
        generatorControls={generatorControls}
        animationParams={animationParams}
        animationControls={animationControls}
        values={{
          backgroundColor,
          alwaysRedraw
        }}
        valueHandlers={{
          updateBackgroundColor,
          updateAlwaysRedraw
        }}
        refs={{
          pipetteRGBARef,
          pipetteHexRef
        }}
      />
      <ImageInit
        inputCanvasRef={inputCanvasRef}
        outputCanvasRef={outputCanvasRef}
        updatePipetteColor={updatePipetteColor}
        layoutParams={layoutParams}
        layoutControls={layoutControls}
      />
      {generatorTest && <GeneratorTestComponent/>}
      <GridOutput ref={gridOutputRef} />
    </>
  );
};

export { App };
