import {
  drawGridInCanvas,
  drawImage,
  makeColorGrid,
  mapColorGridToHex,
  readImage
} from './utils/dottergrid';
import { ImageInit } from './components/ImageInit';
import { GridOutput } from './components/GridOutput';
import { Menu } from './components/Menu';
import { Notification } from './components/Notification';
import { useEffect, useRef, useState } from 'react';
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
import { useGridHtmlConfig } from './hooks/useGridHtmlConfig.js';


/**
 * @typedef {import('./index.d.ts').GridParams} GridParams
 * @typedef {import('./index.d.ts').GridHtmlVisualParams} GridHtmlVisualParams
 * @typedef {import('./index.d.ts').GeneratorParams} GeneratorParams
 * @typedef {import('./index.d.ts').AnimationParams} AnimationParams
 * @typedef {import('./index.d.ts').DotterCell} DotterCell
 */

/**
 * TODO!!!
 * 1.DONE. Better input CSS
 * 2.DONE. Add generator - make seed-procedural-generation-based cell generator; optional color generator, optional size (horizontal span) generator
 * 3. Add animation control and options.
 * 4.DONE. Make grid settings in menu dropdownable, at least those additional settings, generator settings, animation settings
 * 5. Save as HTML + CSS instead of json. Leave json as an option. For json, though, change structure -
 *    some common options like borderRadius and gaps should be handled separately from the grid
 *
 *
 * Some thoughts for the future:
 * 1. Add mouse guided controlls over canvas previewed cells
 * 1.1. Add ability to hover over and select a cell
 * 1.2. Add ability to delete, edit, recombine, etc.
 * 1.3. Add ability to move cells around (swap with another cell, for example - swap colors...)
 * 2.DONE. Fix dottergrid.js -> handleCellSpanGeneration - Combine cells whose span is less than minimum span
 *
 * TO_POSSIBLY_NOT_DO:
 * 1. Rewrite grid handling from functions to gridHandler class. Could be more efficient, could be hemorroidal to handle it together with React
 */

const App = () => {

  const [menuOpen, setMenuOpen] = useState(true);

  const [backgroundColorsBound, setBackgroundColorsBound] = useState(true);
  const [htmlBackgroundColor, setHtmlBackgroundColor] = useState('#1C1E21FF');
  const [canvasBackgroundColor, setCanvasBackgroundColor] = useState('#FFFFFFFF');

  const [alwaysRecalcGrid, setAlwaysRecalcGrid] = useState(true);
  const [alwaysRedrawCanvas, setAlwaysRedrawCanvas] = useState(true);
  const [alwaysRedrawHtml, setAlwaysRedrawHtml] = useState(true);

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

  /** @type {DotterCell[][] | null} */
  let grid = null;
  /** @type {React.Dispatch<React.SetStateAction<never[]>> | null} */
  let setGrid = null;
  if (gridOutputRef.current) {
    ({ grid, setGrid } = gridOutputRef.current);
  }

  const redrawGridPreview = useDebouncedCallback(
    /**
     * @param {Partial<GridParams>} changedGridParams
     */
    (changedGridParams, _image = image) => {
      if (!_image) {
        return;
      }
      const contextOutput = outputCanvasRef.current.getContext('2d', { willReadFrequently: true });
      drawGridInCanvas(
        contextOutput,
        grid,
        {
          ...gridParams,
          stroke: gridParams.useStroke ? gridParams.stroke : null,
          ignoreColor: gridParams.useIgnoreColor ? gridParams.ignoreColor : null,
          ...changedGridParams
        }
      );
    }, 300
  );

  const redrawGridHtmlPreview = useDebouncedCallback(
    /**
     * @param {Partial<GridHtmlVisualParams>} changedGridHtmlParams
     * @param {Partial<AnimationParams>} changedAnimationParams
     */
    (changedGridHtmlParams, changedAnimationParams, _image = image) => {
      if (!_image) {
        return;
      }
      drawGridHtmlPreview(
        {
          // Some renamings and mappings here...
          // Top to bottom: preferred param -> least preferred param
          ...gridHtmlParams,
          monoCellSize:
            changedGridHtmlParams.monoCellSize ??
            gridHtmlParams.monoCellSize,
          borderRadius:
            changedGridHtmlParams.overrideBorderRadius ??
            gridHtmlParams.overrideBorderRadius ??
            gridParams.borderRadius,
          horizontalGapPx:
            changedGridHtmlParams.overrideHorizontalGapPx ??
            gridHtmlParams.overrideHorizontalGapPx ??
            gridParams.horizontalGapPx,
          verticalGapPx:
            changedGridHtmlParams.overrideVerticalGapPx ??
            gridHtmlParams.overrideVerticalGapPx ??
            gridParams.verticalGapPx,
          angle: gridParams.angle,
          stroke: gridParams.useStroke ? gridParams.stroke : null,
          ...changedGridHtmlParams
        },
        {
          ...animationParams,
          delay: animationParams.type === 'slide' ? {
            min: animationParams.delay.min,
            max: animationParams.delay.max,
          } : null,
          ...changedAnimationParams
        }
      );
    }, 300
  );

  /**
   * Debounced recalculation of the grid
   */
  const recalcGrid = useDebouncedCallback(
    /**
     * @param {Partial<GridParams>} changedGridParams
     * @param {Partial<GeneratorParams>} changedGeneratorParams
     */
    (changedGridParams, changedGeneratorParams, _image = image) => {
      if (!_image) {
        return;
      }
      calcGrid(
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
        _image
      );
    }, 300
  );

  /**
   * Calculates the grid
   * @param {GridParams} changedGridParams
   * @param {GeneratorParams} changedGeneratorParams
   * @param {HTMLImageElement} _image
   */
  const calcGrid = (gridParams, generatorParams, _image = image) => {
    if (!_image || !inputCanvasRef.current || !outputCanvasRef.current) {
      return;
    }
    if (grid === null || setGrid === null) {
      return;
    }
    const contextInput = inputCanvasRef.current.getContext('2d', { willReadFrequently: true });
    const contextOutput = outputCanvasRef.current.getContext('2d', { willReadFrequently: true });
    const newGrid = mapColorGridToHex(makeColorGrid(
      contextInput, gridParams, generatorParams
    ));

    setGrid(newGrid);

    if (alwaysRedrawCanvas) {
      drawGridInCanvas(
        contextOutput,
        newGrid,
        gridParams
      );
    }

    if (alwaysRedrawHtml) {
      drawGridHtmlPreview(
        {
          // Some renamings and mappings here...
          // Top to bottom: preferred param -> least preferred param
          ...gridHtmlParams,
          monoCellSize:
            gridHtmlParams.monoCellSize,
          borderRadius:
            gridHtmlParams.overrideBorderRadius ??
            gridParams.borderRadius,
          horizontalGapPx:
            gridHtmlParams.overrideHorizontalGapPx ??
            gridParams.horizontalGapPx,
          verticalGapPx:
            gridHtmlParams.overrideVerticalGapPx ??
            gridParams.verticalGapPx,
          angle: gridParams.angle,
          stroke: gridParams.useStroke ? gridParams.stroke : null,
        },
        {
          ...animationParams,
          delay: animationParams.type === 'slide' ? {
            min: animationParams.delay.min,
            max: animationParams.delay.max,
          } : null,
        }
      );
    }
  };

  const { params: gridParams, controls: gridControls, setters: gridSetters } = useGridConfig(
    showNotification,
    inputCanvasRef.current ? inputCanvasRef.current.height : 0,
    inputCanvasRef.current ? inputCanvasRef.current.width : 0,
    recalcGrid,
    alwaysRecalcGrid
  );

  const { params: generatorParams, controls: generatorControls } = useGeneratorConfig(
    showNotification,
    recalcGrid,
    alwaysRecalcGrid
  );

  const { params: animationParams, controls: animationControls } = useAnimationConfig(
    showNotification,
    redrawGridHtmlPreview,
    alwaysRedrawHtml
  );

  const { params: gridHtmlParams, controls: gridHtmlControls } = useGridHtmlConfig(
    showNotification,
    redrawGridHtmlPreview,
    alwaysRedrawHtml
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

    // It is somewhat ok-ish now for fitBothCanvasInOneRow, handling the exact unavailable for this case space would take too much boilerplate
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
    let availableHtmlScreenWidth = windowWidth - unavailableWidth;

    if (fitBothCanvasInOneRow) {
      availableScreenWidth = Math.floor((availableScreenWidth - unavailableWidth) / 2);
    }

    if (shiftMainByMenu && menuRef.current && localMenuOpen) {
      if (fitBothCanvasInOneRow) {
        availableScreenWidth -= Math.ceil(menuRef.current.offsetWidth / 2);
      } else {
        availableScreenWidth -= menuRef.current.offsetWidth;
      }
      availableHtmlScreenWidth -= menuRef.current.offsetWidth;
    }

    let newCanvasWidth;
    let newCanvasHeight;
    let newHtmlContainerWidth;
    let newHtmlContainerHeight;

    if (stretchCanvas && localWidth <= availableScreenWidth) {
      newCanvasWidth = availableScreenWidth;
      newCanvasHeight = Math.floor(localHeight * (availableScreenWidth / localWidth));
      newHtmlContainerWidth = availableHtmlScreenWidth;
      newHtmlContainerHeight = Math.floor(localHeight * (availableHtmlScreenWidth / localWidth));
    } else if (!stretchCanvas && localWidth <= availableScreenWidth) {
      newCanvasWidth = localWidth;
      newCanvasHeight = localHeight;
      newHtmlContainerWidth = localWidth;
      newHtmlContainerHeight = localHeight;
    } else if (screenOverflow && localWidth > availableScreenWidth) {
      if (!inputCanvasRef.current.parentElement.classList.contains('overflow-x-scroll')) {
        inputCanvasRef.current.parentElement.classList.add('overflow-x-scroll');
      }
      newCanvasWidth = localWidth;
      newCanvasHeight = localHeight;
      newHtmlContainerWidth = localWidth;
      newHtmlContainerHeight = localHeight;
    } else if (!screenOverflow && localWidth > availableScreenWidth) {
      newCanvasWidth = availableScreenWidth;
      newCanvasHeight = Math.floor(localHeight * (availableScreenWidth / localWidth));
      newHtmlContainerWidth = availableHtmlScreenWidth;
      newHtmlContainerHeight = Math.floor(localHeight * (availableHtmlScreenWidth / localWidth));
    } else {
      newCanvasWidth = localWidth;
      newCanvasHeight = localHeight;
      newHtmlContainerWidth = localWidth;
      newHtmlContainerHeight = localHeight;
    }

    inputCanvasRef.current.width = newCanvasWidth;
    inputCanvasRef.current.height = newCanvasHeight;
    outputCanvasRef.current.width = newCanvasWidth;
    outputCanvasRef.current.height = newCanvasHeight;

    // Do the same with html grid
    gridOutputRef.current.setSize(newHtmlContainerWidth, newHtmlContainerHeight);

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
    redrawGridHtmlPreview
  );

  const updateBackgroundColorsBound = (value) => {
    setBackgroundColorsBound(value);
    // Question is - which one of two will be the preferred one?
  };

  const updateCanvasBackgroundColor = (hex, selfCall = false) => {
    setCanvasBackgroundColor(hex);
    const background = outputCanvasRef.current;
    background.style.backgroundColor = hex;
    if (backgroundColorsBound && !selfCall) {
      updateHtmlBackgroundColor(hex, true);
    }
  };

  const updateHtmlBackgroundColor = (hex, selfCall = false) => {
    setHtmlBackgroundColor(hex);
    const background = gridOutputRef.current.backgroundRef.current;
    background.style.backgroundColor = hex;
    if (backgroundColorsBound && !selfCall) {
      updateCanvasBackgroundColor(hex, true);
    }
  };

  const updatePipetteColor = (rgba) => {
    if (!pipetteRGBARef.current || !pipetteHexRef.current) {
      return;
    }

    pipetteRGBARef.current.innerHTML = `<pre>RGBA: ${pipetteRGBAText(rgba)}</pre>`;
    pipetteHexRef.current.innerHTML = `<pre>Hex: ${pipetteHexText(rgba)}</pre>`;
  };

  const updateAlwaysRecalcGrid = (value) => {
    setAlwaysRecalcGrid(value);
  };

  const updateAlwaysRedrawCanvas = (value) => {
    setAlwaysRedrawCanvas(value);
  };

  const updateAlwaysRedrawHtml = (value) => {
    setAlwaysRedrawHtml(value);
  };

  const updateMenuOpen = (value) => {
    setMenuOpen(value);
    if (!image) {
      return;
    }

    resizeCanvas({}, { localMenuOpen: value });
    drawImage(image, inputCanvasRef);
    redrawGridPreview({});
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
    recalcGrid({ rowsCount: localRowsCount, columnsCount: localColumnsCount }, {}, image);
  };

  const drawGridHtmlPreview = (
    gridHtmlParams,
    animationParams,
  ) => {
    gridOutputRef.current.drawHtmlPreview(
      gridHtmlParams,
      animationParams
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

  useEffect(() => {
    resizeCanvas({}, {});
  }, []);

  return (
    <>
      <Notification message={message.text} type={message.type} shown={message.shown}/>
      <Menu
        menuOpen={menuOpen}
        updateMenuOpen={updateMenuOpen}
        menuRef={menuRef}
        handleFileSelection={handleFileSelection}
        handleRecalcGrid={recalcGrid}
        handleRedrawGridHtmlPreview={redrawGridHtmlPreview}
        handleSaveClick={handleSaveClick}
        handleRedrawGridPreview={redrawGridPreview}
        gridParams={gridParams}
        gridControls={gridControls}
        generatorParams={generatorParams}
        generatorControls={generatorControls}
        animationParams={animationParams}
        animationControls={animationControls}
        gridHtmlParams={gridHtmlParams}
        gridHtmlControls={gridHtmlControls}
        values={{
          backgroundColorsBound,
          canvasBackgroundColor,
          htmlBackgroundColor,
          alwaysRecalcGrid,
          alwaysRedrawCanvas,
          alwaysRedrawHtml
        }}
        valueHandlers={{
          updateBackgroundColorsBound,
          updateCanvasBackgroundColor,
          updateHtmlBackgroundColor,
          updateAlwaysRecalcGrid,
          updateAlwaysRedrawCanvas,
          updateAlwaysRedrawHtml
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
