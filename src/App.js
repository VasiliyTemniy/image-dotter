import {
  drawGridInCanvas,
  drawImage,
  makeColorGrid,
  mapColorGridToHex,
  readImage
} from './utils/dottergrid';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Markdown from 'react-markdown';

import enGuideMd from './assets/en-guide.md';
import ruGuideMd from './assets/ru-guide.md';

import exampleImage from './assets/infinity.png';

import './styles/grid-output.css';
import './styles/menu.css';
import './styles/button.css';
import './styles/input.css';
import './styles/notification.css';
import './styles/flex.css';
import './styles/container.css';
import './styles/main.css';
import './styles/color-picker.css';
import './styles/switch.css';
import './styles/modal.css';
import './styles/scrollbar.css';
import './styles/markdown.css';

import { useDebouncedCallback } from './hooks/useDebouncedCallback.js';
import { useGridConfig } from './hooks/useGridConfig.js';
import { useGeneratorConfig } from './hooks/useGeneratorConfig.js';
import { useAnimationConfig } from './hooks/useAnimationConfig.js';
import { useLayoutConfig } from './hooks/useLayoutConfig.js';
import { useGridHtmlConfig } from './hooks/useGridHtmlConfig.js';

import { ImageInit } from './components/ImageInit.js';
import { GridOutput } from './components/GridOutput.js';
import { Menu } from './components/Menu.js';
import { Notification } from './components/Notification.js';
import { GeneratorTestComponent } from './components/GeneratorTestComponent.js';

import { gridCss } from './examples/gridCss.js';
import { getLocalStorageMap, setLocalStorageMap } from './utils/storage.js';
import { pipetteHexText, pipetteRGBAText } from './utils/color.js';
import { Modal } from './components/Modal.js';
import { swapImageUrls } from './utils/imgSwapper.js';


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
 * 3.DONE. Add animation control and options.
 * 4.DONE. Make grid settings in menu dropdownable, at least those additional settings, generator settings, animation settings
 * 5.DONE. Save as HTML + CSS instead of json. Leave json as an option. For json, though, change structure -
 *    some common options like borderRadius and gaps should be handled separately from the grid
 * 6.DONE. Add theming
 * 7.DONE. Add translation to Russian language with i18n
 * 8. Add manual in md format + md reader engine
 *
 *
 * Some thoughts for the future:
 * 1. Add mouse guided controlls over canvas previewed cells
 * 1.1. Add ability to hover over and select a cell
 * 1.2. Add ability to delete, edit, recombine, etc.
 * 1.3. Add ability to move cells around (swap with another cell, for example - swap colors...)
 * 2.DONE. Fix dottergrid.js -> handleCellSpanGeneration - Combine cells whose span is less than minimum span
 * 3. Implement all the animation params handling for slide; Add moar animation types
 * 4.DONE. Make it accept .png files (omg it doesn't...)
 *
 * TO_POSSIBLY_NOT_DO:
 * 1. Rewrite grid handling from functions to gridHandler class. Could be more efficient, could be hemorroidal to handle it together with React
 */

/**
 * @type {'light' | 'dark'}
 */
const storageTheme = getLocalStorageMap('image-dotter-theme', {
  theme: 'light'
}).theme;

const storageLanguage = getLocalStorageMap('image-dotter-language', {
  language: 'en'
}).language;

const App = () => {

  const [menuOpen, setMenuOpen] = useState(true);

  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [guideMarkdown, setGuideMarkdown] = useState(null);
  const [guideLanguage, setGuideLanguage] = useState(null);
  const [guideTheme, setGuideTheme] = useState(null);

  const [backgroundColorsBound, setBackgroundColorsBound] = useState(true);
  const [htmlBackgroundColor, setHtmlBackgroundColor] = useState('#1C1E21FF');
  const [canvasBackgroundColor, setCanvasBackgroundColor] = useState('#FFFFFFFF');

  const [alwaysRecalcGrid, setAlwaysRecalcGrid] = useState(true);
  const [alwaysRedrawCanvas, setAlwaysRedrawCanvas] = useState(true);
  const [alwaysRedrawHtml, setAlwaysRedrawHtml] = useState(true);

  const [message, setMessage] = useState({ text : null, type : null, timeoutId : null, shown : false });

  const [image, setImage] = useState(null);

  const [theme, setTheme] = useState(storageTheme);

  const [language, setLanguage] = useState(storageLanguage);

  const { t, i18n } = useTranslation();

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

  /**
   * @type {React.MutableRefObject<React.FC<> & {
   *   drawHtmlPreview: (gridHtmlParams: GridHtmlVisualParams, animationParams: AnimationParams) => void,
   *   setSize: (width: number, height: number) => void,
   *   backgroundRef: React.MutableRefObject<HTMLDivElement>,
   *   grid: DotterCell[][],
   *   setGrid: React.Dispatch<React.SetStateAction<DotterCell[][]>>,
   *   setForceRerender: React.Dispatch<React.SetStateAction<boolean>>,
   *   playAnimation: () => void
   * }>}
   */
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
        gridOutputRef.current.grid ?? [],
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
    const contextOutput = outputCanvasRef.current.getContext('2d', { willReadFrequently: true });
    const newGrid = mapColorGridToHex(makeColorGrid(
      _image, gridParams, generatorParams
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

    if (localHeight === 0 || localWidth === 0) {
      // Throw an error? Will return infinite localColumnsCount if continue without return / throw
      return;
    }

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

  const toggleTheme = (_value) => {
    const prevTheme = theme;
    const newTheme = prevTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setLocalStorageMap('image-dotter-theme', {
      theme: newTheme
    });

    document.body.classList.remove(prevTheme);
    document.body.classList.add(newTheme);
  };

  const updateLanguage = (value) => {
    if (language === value) {
      if (i18n.language === value) {
        return;
      } else { // i18n.language !== value
        i18n.changeLanguage(value);
      }
    }

    // language !== value
    setLanguage(value);
    setLocalStorageMap('image-dotter-language', {
      language: value
    });

    if (i18n.language === value) {
      return;
    }

    // i18n.language !== value
    i18n.changeLanguage(value);
  };

  const updateGuideModalOpen = (value) => {
    fetchGuideMarkdown();
    setGuideModalOpen(value);
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

  const playHtmlAnimation = () => {
    if (!gridOutputRef.current || !image) {
      return;
    }
    gridOutputRef.current.playAnimation();
  };

  const handleSaveJSONClick = async (e) => {
    e.preventDefault();
    const handle = await window.showSaveFilePicker({
      suggestedName: 'grid.json',
      types: [{
        description: 'Output grid as JSON',
        accept: { 'application/json': ['.json'] },
      }],
    });

    const content = {
      borderRadius: gridHtmlParams.overrideBorderRadius ?? gridParams.borderRadius,
      horizontalGapPx: gridHtmlParams.overrideHorizontalGapPx ?? gridParams.horizontalGapPx,
      verticalGapPx: gridHtmlParams.overrideVerticalGapPx ?? gridParams.verticalGapPx,
      angle: gridParams.angle,
      monoCellSize: gridParams.monoCellSize,
      overrideSpanWidthFactor: gridHtmlParams.overrideSpanWidthFactor ?? 1,
      leftCorrectionPx: gridHtmlParams.leftCorrectionPx ?? 0,
      topCorrectionPx: gridHtmlParams.topCorrectionPx ?? 0,
      grid: gridOutputRef.current.grid,
    };

    if (gridParams.useStroke) {
      content.stroke = gridParams.stroke;
    }

    const blob = new Blob([JSON.stringify(content)], { type: 'application/json' });

    const writableStream = await handle.createWritable();
    await writableStream.write(blob);
    await writableStream.close();
  };

  const handleSaveHTMLClick = async (e) => {
    e.preventDefault();
    const handle = await window.showSaveFilePicker({
      suggestedName: 'grid.html',
      types: [{
        description: 'Output grid HTML',
        accept: { 'text/html': ['.html'] },
      }],
    });

    const innerHTML = gridOutputRef.current.backgroundRef.current.innerHTML;

    const blob = new Blob([innerHTML], { type: 'application/json' });

    const writableStream = await handle.createWritable();
    await writableStream.write(blob);
    await writableStream.close();
  };

  const handleSaveCSSClick = async (e) => {
    e.preventDefault();
    const handle = await window.showSaveFilePicker({
      suggestedName: 'grid.css',
      types: [{
        description: 'Output grid CSS',
        accept: { 'text/css': ['.css'] },
      }],
    });

    // Sorry for this longpaste
    const content = gridCss;

    const blob = new Blob([content], { type: 'application/json' });

    const writableStream = await handle.createWritable();
    await writableStream.write(blob);
    await writableStream.close();
  };

  const fetchGuideMarkdown = () => {
    if (guideMarkdown !== null && guideLanguage === language && guideTheme === theme) {
      return;
    }

    const guideFile = language === 'en' ? enGuideMd : ruGuideMd;

    fetch(guideFile)
      .then((response) => response.text())
      .then((text) => {
        const textWithSwappedImages = swapImageUrls(text, language, theme);
        setGuideMarkdown(textWithSwappedImages);
        setGuideLanguage(language);
        setGuideTheme(theme);
      });
  };

  // Set to true to test and debug the generator
  const generatorTest = false;

  useEffect(() => {
    resizeCanvas({}, {});
    document.body.classList.remove('light');
    document.body.classList.remove('dark');
    document.body.classList.add(storageTheme);
    i18n.changeLanguage(language);

    // Get the grid handles from the GridOutput component
    if (gridOutputRef.current) {
      ({ grid, setGrid } = gridOutputRef.current);
    }

    fetch(exampleImage)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const image = new Image();
        image.src = url;
        image.onload = () => {
          setImage(image);
          const { localRowsCount, localColumnsCount } = resizeCanvas({}, {
            localWidth: image.width,
            localHeight: image.height
          });
          drawImage(image, inputCanvasRef);
          recalcGrid({ rowsCount: localRowsCount, columnsCount: localColumnsCount }, {}, image);
        };
      });
  }, []);

  return (
    <>
      <Modal
        title={t('main.guideTitle')}
        active={guideModalOpen}
        close={() => updateGuideModalOpen(false)}
        closeOnBgClick
        className="wide"
      >
        <Markdown className="markdown">{guideMarkdown}</Markdown>
      </Modal>
      <Notification message={message.text} type={message.type} shown={message.shown}/>
      <Menu
        menuOpen={menuOpen}
        updateMenuOpen={updateMenuOpen}
        menuRef={menuRef}
        handleFileSelection={handleFileSelection}
        handleRecalcGrid={recalcGrid}
        handleRedrawGridPreview={redrawGridPreview}
        handleRedrawGridHtmlPreview={redrawGridHtmlPreview}
        handlePlayAnimation={playHtmlAnimation}
        handleSaveJSONClick={handleSaveJSONClick}
        handleSaveHTMLClick={handleSaveHTMLClick}
        handleSaveCSSClick={handleSaveCSSClick}
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
          alwaysRedrawHtml,
          theme,
          language
        }}
        valueHandlers={{
          updateBackgroundColorsBound,
          updateCanvasBackgroundColor,
          updateHtmlBackgroundColor,
          updateAlwaysRecalcGrid,
          updateAlwaysRedrawCanvas,
          updateAlwaysRedrawHtml,
          toggleTheme,
          updateLanguage,
          updateGuideModalOpen
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
