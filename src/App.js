import { drawGridPreview, drawImage, makeColorGrid, readImage } from './utils/dottergrid';
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
import { getLocalStorageMap, setLocalStorageMap } from './utils/storage.js';


/**
 * @typedef {import('./index.d.ts').DotterGridParams} DotterGridParams
 */

/**
 * TODO!!!
 * 1.DONE. Better input CSS
 * 2. Add generator - make seed-procedural-generation-based cell generator; optional color generator, optional size (horizontal span) generator
 * 3. Add animation control and options.
 * 4.DONE. Make grid settings in menu dropdownable, at least those additional settings, generator settings, animation settings
 * 5. Save as HTML + CSS instead of json. Leave json as an option. For json, though, change structure -
 *    some common options like radius and gaps should be handled separately from the grid
 */

const App = () => {

  const layoutSettings = getLocalStorageMap('image-dotter-layout-settings', {
    stretchCanvas: true,
    screenOverflow: false,
    fitBothCanvasInOneRow: false,
    shiftMainByMenu: true
  });

  const [menuOpen, setMenuOpen] = useState(true);

  // Main grid params
  const [rowsCount, setRowsCount] = useState(20);
  const [columnsCount, setColumnsCount] = useState(100);
  const [radius, setRadius] = useState(10);
  const [horizontalGapPx, setHorizontalGapPx] = useState(1);
  const [verticalGapPx, setVerticalGapPx] = useState(1);
  const [aspectRatioMode, setAspectRatioMode] = useState('image');

  // Additional grid params
  const [angle, setAngle] = useState(0);
  const [useStroke, setUseStroke] = useState(false);
  const [strokeColor, setStrokeColor] = useState('#000000ff');
  const [strokeWidth, setStrokeWidth] = useState(1);
  const [useIgnoreColor, setUseIgnoreColor] = useState(false);
  const [ignoreColor, setIgnoreColor] = useState('#ffffffff');
  const [ignoreColorOpacityThreshold, setIgnoreColorOpacityThreshold] = useState(50);
  const [ignoreColorMaxDeviation, setIgnoreColorMaxDeviation] = useState(1);

  // Generator params
  const [seed, setSeed] = useState(Math.ceil(Math.random() * 100000));
  const [useCellSpan, setUseCellSpan] = useState(false);
  const [cellSpanEstimated, setCellSpanEstimated] = useState(1);
  const [cellSpanMin, setCellSpanMin] = useState(1);
  const [cellSpanMax, setCellSpanMax] = useState(1);
  const [usePalette, setUsePalette] = useState(false);
  const [palette, setPalette] = useState([]);
  const [useSurroundingCells, setUseSurroundingCells] = useState(false);
  const [surroundingCellsColor, setSurroundingCellsColor] = useState('#325e9f80');
  const [surroundingCellsMinDepth, setSurroundingCellsMinDepth] = useState(2);
  const [surroundingCellsMaxDepth, setSurroundingCellsMaxDepth] = useState(3);

  // Animation params
  const [animationType, setAnimationType] = useState('slide');
  const [animationDirection, setAnimationDirection] = useState('h-sides');
  const [animationDuration, setAnimationDuration] = useState(1000);
  const [animationDelayMin, setAnimationDelayMin] = useState(0);
  const [animationDelayMax, setAnimationDelayMax] = useState(0);
  const [animationEasing, setAnimationEasing] = useState('ease-out');

  // Other params
  const [backgroundColor, setBackgroundColor] = useState('#1c1e21ff');

  const [alwaysRedraw, setAlwaysRedraw] = useState(true);

  const [message, setMessage] = useState({ text : null, type : null, timeoutId : null, shown : false });

  // Layout settings
  const [stretchCanvas, setStretchCanvas] = useState(layoutSettings.stretchCanvas);
  const [screenOverflow, setScreenOverflow] = useState(layoutSettings.screenOverflow);
  const [fitBothCanvasInOneRow, setFitBothCanvasInOneRow] = useState(layoutSettings.fitBothCanvasInOneRow);
  const [shiftMainByMenu, setShiftMainByMenu] = useState(layoutSettings.shiftMainByMenu);

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

  // Main grid params
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
    if (!image) {
      return;
    }
    if (alwaysRedraw) {
      redrawGridPreview({ rowsCount: localRowsCount, columnsCount: localColumnsCount }, {}, {});
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
    if (!image) {
      return;
    }
    if (alwaysRedraw) {
      redrawGridPreview({ rowsCount: localRowsCount, columnsCount: localColumnsCount }, {}, {});
    }
  };

  const updateRadius = (value) => {
    if (!value || !Number.isInteger(Number(value)) || Number(value) < 0) {
      showNotification('Radius must be a positive integer', 'error');
      setRadius(10);
      return;
    }
    setRadius(value);
    if (!image) {
      return;
    }

    if (alwaysRedraw) {
      redrawGridPreview({ radius : value }, {}, {});
    }
  };

  const updateHorizontalGapPx = (value) => {
    if (!value || !Number.isInteger(Number(value)) || Number(value) < 0) {
      showNotification('Horizontal gap must be a positive integer or 0', 'error');
      setHorizontalGapPx(1);
      return;
    }
    setHorizontalGapPx(value);
    if (!image) {
      return;
    }

    if (alwaysRedraw) {
      redrawGridPreview({ horizontalGapPx : value }, {}, {});
    }
  };

  const updateVerticalGapPx = (value) => {
    if (!value || !Number.isInteger(Number(value)) || Number(value) < 0) {
      showNotification('Vertical gap must be a positive integer or 0', 'error');
      setVerticalGapPx(1);
      return;
    }
    setVerticalGapPx(value);
    if (!image) {
      return;
    }

    if (alwaysRedraw) {
      redrawGridPreview({ verticalGapPx : value }, {}, {});
    }
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

    if (!image) {
      return;
    }

    if (alwaysRedraw) {
      redrawGridPreview({ rowsCount: localRowsCount, columnsCount: localColumnsCount }, {}, {});
    }
  };

  // Additional grid params
  const updateAngle = (value) => {
    if (!value || !Number.isInteger(Number(value)) || Number(value) < 0 || Number(value) > 360) {
      showNotification('Angle must be a positive integer between 0 and 360', 'error');
      setAngle(0);
      return;
    }
    setAngle(value);
    if (!image) {
      return;
    }

    if (alwaysRedraw) {
      redrawGridPreview({ angle : value }, {}, {});
    }
  };

  const updateUseStroke = (value) => {
    setUseStroke(value);
    if (!image) {
      return;
    }

    if (alwaysRedraw) {
      redrawGridPreview({ strokeColor: value ? strokeColor : null, strokeWidth: value ? strokeWidth : null }, {}, {});
    }
  };

  const updateStrokeColor = (value) => {
    setStrokeColor(value);
    if (!image) {
      return;
    }

    if (alwaysRedraw && useStroke) {
      redrawGridPreview({ strokeColor: useStroke ? value: null }, {}, {});
    }
  };

  const updateStrokeWidth = (value) => {
    if (!value || !Number.isInteger(Number(value)) || Number(value) < 1) {
      showNotification('Stroke width must be a positive integer', 'error');
      setStrokeWidth(1);
      return;
    }
    setStrokeWidth(value);
    if (!image) {
      return;
    }

    if (alwaysRedraw && useStroke) {
      redrawGridPreview({ strokeWidth: useStroke ? value : null }, {}, {});
    }
  };

  const updateUseIgnoreColor = (value) => {
    setUseIgnoreColor(value);
    if (!image) {
      return;
    }

    if (alwaysRedraw) {
      redrawGridPreview({ ignoreColor: value ? ignoreColor : null }, {}, {});
    }
  };

  const updateIgnoreColor = (value) => {
    setIgnoreColor(value);
    if (!image) {
      return;
    }

    if (alwaysRedraw && useIgnoreColor) {
      redrawGridPreview({ ignoreColor: useIgnoreColor ? value : null }, {}, {});
    }
  };

  const updateIgnoreColorOpacityThreshold = (value) => {
    if (!value || !Number.isInteger(Number(value)) || Number(value) < 0 || Number(value) > 255) {
      showNotification('Ignore color opacity threshold must be a positive integer between 0 and 255', 'error');
      setIgnoreColorOpacityThreshold(100);
      return;
    }
    setIgnoreColorOpacityThreshold(value);
    if (!image) {
      return;
    }

    if (alwaysRedraw && useIgnoreColor) {
      redrawGridPreview({ ignoreColorOpacityThreshold: useIgnoreColor ? value : null }, {}, {});
    }
  };

  const updateIgnoreColorMaxDeviation = (value) => {
    if (!value || !Number.isInteger(Number(value)) || Number(value) < 0 || Number(value) > 255) {
      showNotification('Ignore color max deviation must be a positive integer between 0 and 255', 'error');
      setIgnoreColorMaxDeviation(100);
      return;
    }
    setIgnoreColorMaxDeviation(value);
    if (!image) {
      return;
    }

    if (alwaysRedraw && useIgnoreColor) {
      redrawGridPreview({ ignoreColorMaxDeviation: useIgnoreColor ? value : null }, {}, {});
    }
  };

  // Generator params
  const updateSeed = (value) => {
    if (!value || !Number.isInteger(Number(value)) || Number(value) <= 0 || Number(value) >= 100000) {
      showNotification('Seed must be a positive integer between 1 and 99999', 'error');
      setSeed(0);
      return;
    }
    setSeed(value);
    if (!image) {
      return;
    }

    if (alwaysRedraw) {
      redrawGridPreview({}, { seed: value }, {});
    }
  };

  const updateUseCellSpan = (value) => {
    setUseCellSpan(value);
    if (!image) {
      return;
    }

    if (alwaysRedraw) {
      redrawGridPreview({}, { useCellSpan: value }, {});
    }
  };

  const updateCellSpanEstimated = (value) => {
    if (!value || !Number.isInteger(Number(value)) || Number(value) < 1) {
      showNotification('Cell span estimated must be a positive integer', 'error');
      setCellSpanEstimated(1);
      return;
    }
    setCellSpanEstimated(value);
    if (!image) {
      return;
    }

    if (alwaysRedraw && useCellSpan) {
      redrawGridPreview({}, { cellSpanEstimated: value }, {});
    }
  };

  const updateCellSpanMin = (value) => {
    if (!value || !Number.isInteger(Number(value)) || Number(value) < 1) {
      showNotification('Cell span min must be a positive integer', 'error');
      setCellSpanMin(1);
      return;
    }
    setCellSpanMin(value);
    if (!image) {
      return;
    }

    if (alwaysRedraw && useCellSpan) {
      redrawGridPreview({}, { cellSpanMin: value }, {});
    }
  };

  const updateCellSpanMax = (value) => {
    if (!value || !Number.isInteger(Number(value)) || Number(value) < 1) {
      showNotification('Cell span max must be a positive integer', 'error');
      setCellSpanMax(1);
      return;
    }
    setCellSpanMax(value);
    if (!image) {
      return;
    }

    if (alwaysRedraw && useCellSpan) {
      redrawGridPreview({}, { cellSpanMax: value }, {});
    }
  };

  const updateUsePalette = (value) => {
    setUsePalette(value);
    if (!image) {
      return;
    }

    if (alwaysRedraw) {
      redrawGridPreview({}, { usePalette: value }, {});
    }
  };

  const updatePalette = (value, action, index) => {
    if (!value) {
      showNotification('Please select a color', 'error');
    }

    if (action === 'add') {
      setPalette([...palette, value]);
    } else if (action === 'remove') {
      setPalette(palette.filter((color, i) => i !== index));
    } else if (action === 'replace') {
      setPalette(palette.map((color, i) => (i === index ? value : color)));
    }
    if (!image) {
      return;
    }

    if (alwaysRedraw && usePalette) {
      const localPalette = action === 'add'
        ? [...palette, value]
        : palette.filter((color) => color !== value);
      redrawGridPreview({}, { palette: localPalette }, {});
    }
  };

  const updateUseSurroundingCells = (value) => {
    setUseSurroundingCells(value);
    if (!image) {
      return;
    }

    if (alwaysRedraw) {
      redrawGridPreview({}, { useSurroundingCells: value }, {});
    }
  };

  const updateSurroundingCellsColor = (value) => {
    setSurroundingCellsColor(value);
    if (!image) {
      return;
    }

    if (alwaysRedraw && useSurroundingCells) {
      redrawGridPreview({}, { surroundingCellsColor: value }, {});
    }
  };

  const updateSurroundingCellsMinDepth = (value) => {
    if (!value || !Number.isInteger(Number(value)) || Number(value) < 0) {
      showNotification('Surrounding cells min depth must be a positive integer', 'error');
      setSurroundingCellsMinDepth(0);
      return;
    }
    setSurroundingCellsMinDepth(value);
    if (!image) {
      return;
    }

    if (alwaysRedraw && useSurroundingCells) {
      redrawGridPreview({}, { surroundingCellsMinDepth: value }, {});
    }
  };

  const updateSurroundingCellsMaxDepth = (value) => {
    if (!value || !Number.isInteger(Number(value)) || Number(value) < 0) {
      showNotification('Surrounding cells max depth must be a positive integer', 'error');
      setSurroundingCellsMaxDepth(0);
      return;
    }
    setSurroundingCellsMaxDepth(value);
    if (!image) {
      return;
    }

    if (alwaysRedraw && useSurroundingCells) {
      redrawGridPreview({}, { surroundingCellsMaxDepth: value }, {});
    }
  };


  // Animation params

  const updateAnimationType = (value) => {
    if (!value || ['slide', 'appear'].includes(value) === false) {
      showNotification('Please select a valid animation type', 'error');
      setAnimationType('slide');
      return;
    }
    setAnimationType(value);
    // Maybe redraw the html grid output?
  };

  const updateAnimationDirection = (value) => {
    if (
      (!value && value !== null) ||
      ['left-to-right', 'right-to-left', 'top-to-bottom', 'bottom-to-top', 'h-sides', 'v-sides', 'all'].includes(value) === false
    ) {
      showNotification('Please select a valid animation direction', 'error');
      setAnimationDirection('left');
      return;
    }
    setAnimationDirection(value);
    // Maybe redraw the html grid output?
  };

  const updateAnimationDuration = (value) => {
    if (!value || !Number.isInteger(Number(value)) || Number(value) < 0) {
      showNotification('Animation duration must be a positive integer', 'error');
      setAnimationDuration(1000);
      return;
    }
    setAnimationDuration(value);
    // Maybe redraw the html grid output?
  };

  const updateAnimationDelayMin = (value) => {
    if (!value || !Number.isInteger(Number(value)) || Number(value) < 0) {
      showNotification('Animation delay min must be a positive integer', 'error');
      setAnimationDelayMin(0);
      return;
    }
    setAnimationDelayMin(value);
    // Maybe redraw the html grid output?
  };

  const updateAnimationDelayMax = (value) => {
    if (!value || !Number.isInteger(Number(value)) || Number(value) < 0) {
      showNotification('Animation delay max must be a positive integer', 'error');
      setAnimationDelayMax(0);
      return;
    }
    setAnimationDelayMax(value);
    // Maybe redraw the html grid output?
  };

  const updateAnimationEasing = (value) => {
    if (!value || ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out'].includes(value) === false) {
      showNotification('Please select a valid animation easing', 'error');
      setAnimationEasing('linear');
      return;
    }
    setAnimationEasing(value);
    // Maybe redraw the html grid output?
  };

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

    resizeCanvas({ localMenuOpen: value });
    drawImage(image, inputCanvasRef);
    redrawGridPreview({}, {}, {});
  };

  const updateStretchCanvas = (value) => {
    setStretchCanvas(value);
    setLocalStorageMap('image-dotter-layout-settings', {
      ...layoutSettings,
      stretchCanvas: value
    });
    if (!image) {
      return;
    }

    resizeCanvas({ localStretchCanvas: value });
    drawImage(image, inputCanvasRef);
    redrawGridPreview({}, {}, {});
  };

  const updateScreenOverflow = (value) => {
    setScreenOverflow(value);
    setLocalStorageMap('image-dotter-layout-settings', {
      ...layoutSettings,
      screenOverflow: value
    });
    if (!inputCanvasRef.current) {
      return;
    }
    if (value && !inputCanvasRef.current.parentElement.classList.contains('overflow-x-scroll')) {
      inputCanvasRef.current.parentElement.classList.add('overflow-x-scroll');
    } else if (!value && inputCanvasRef.current.parentElement.classList.contains('overflow-x-scroll')) {
      inputCanvasRef.current.parentElement.classList.remove('overflow-x-scroll');
    }
    if (!image) {
      return;
    }

    resizeCanvas({ localScreenOverflow: value });
    drawImage(image, inputCanvasRef);
    redrawGridPreview({}, {}, {});
  };

  const updateFitBothCanvasInOneRow = (value) => {
    setFitBothCanvasInOneRow(value);
    setLocalStorageMap('image-dotter-layout-settings', {
      ...layoutSettings,
      fitBothCanvasInOneRow: value
    });
    if (!image) {
      return;
    }

    resizeCanvas({ localFitBothCanvasInOneRow: value });
    drawImage(image, inputCanvasRef);
    redrawGridPreview({}, {}, {});
  };

  const updateShiftMainByMenu = (value) => {
    setShiftMainByMenu(value);
    setLocalStorageMap('image-dotter-layout-settings', {
      ...layoutSettings,
      shiftMainByMenu: value
    });
    if (!image) {
      return;
    }

    resizeCanvas({ localShiftMainByMenu: value });
    drawImage(image, inputCanvasRef);
    redrawGridPreview({}, {}, {});
  };

  const handleFileSelection = async (e) => {
    e.preventDefault();
    if (!e.target.files || !e.target.files[0]) {
      showNotification('No file selected', 'error');
      return;
    }

    const image = await readImage(e.target.files[0]);

    setImage(image);

    const { localRowsCount, localColumnsCount } = resizeCanvas({
      localWidth: image.width,
      localHeight: image.height
    });

    drawImage(image, inputCanvasRef);
    redrawGridPreview({ rowsCount: localRowsCount, columnsCount: localColumnsCount }, {}, {});
  };

  const resizeCanvas = ({
    localWidth = inputCanvasRef.current.width,
    localHeight = inputCanvasRef.current.height,
    localStretchCanvas = stretchCanvas,
    localScreenOverflow = screenOverflow,
    localFitBothCanvasInOneRow = fitBothCanvasInOneRow,
    localShiftMainByMenu = shiftMainByMenu,
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

    if (localFitBothCanvasInOneRow) {
      availableScreenWidth = Math.floor((availableScreenWidth - unavailableWidth) / 2);
    }

    if (localShiftMainByMenu && menuRef.current && localMenuOpen) {
      if (localFitBothCanvasInOneRow) {
        availableScreenWidth -= Math.ceil(menuRef.current.offsetWidth / 2);
      } else {
        availableScreenWidth -= menuRef.current.offsetWidth;
      }
    }

    if (localStretchCanvas && localWidth <= availableScreenWidth) {
      inputCanvasRef.current.width = availableScreenWidth;
      inputCanvasRef.current.height = Math.floor(localHeight * (availableScreenWidth / localWidth));
    } else if (!localStretchCanvas && localWidth <= availableScreenWidth) {
      inputCanvasRef.current.width = localWidth;
      inputCanvasRef.current.height = localHeight;
    } else if (localScreenOverflow && localWidth > availableScreenWidth) {
      if (!inputCanvasRef.current.parentElement.classList.contains('overflow-x-scroll')) {
        inputCanvasRef.current.parentElement.classList.add('overflow-x-scroll');
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
  const redrawGridPreview = useDebouncedCallback((changedGridParams, changedGeneratorParams, changedAnimationParams) => {
    // Early return if there is no image has no power placed here because the callback is debounced.
    // All returns if there is no image must be used before this function's calls.
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
        stroke: useStroke ? {
          color: strokeColor,
          width: strokeWidth,
        } : null,
        ignoreColor: useIgnoreColor ? {
          color: ignoreColor,
          opacityThreshold: ignoreColorOpacityThreshold,
          maxDeviation: ignoreColorMaxDeviation
        } : null,
        ...changedGridParams
      },
      {
        seed,
        cellSpan: useCellSpan ? {
          estimated: cellSpanEstimated,
          min: cellSpanMin,
          max: cellSpanMax,
        } : null,
        palette: usePalette ? palette : null,
        surroundingCells: useSurroundingCells ? {
          color: surroundingCellsColor,
          minDepth: surroundingCellsMinDepth,
          maxDepth: surroundingCellsMaxDepth,
        } : null,
        ...changedGeneratorParams
      },
      {
        type: animationType,
        direction: animationDirection,
        duration: animationDuration,
        delay: animationType === 'slide' ? {
          min: animationDelayMin,
          max: animationDelayMax,
        } : null,
        easing: animationEasing,
        ...changedAnimationParams
      }
    );
  }, 300);

  const handleRedrawGrid = (e) => {
    e.preventDefault();
    const canvasInput = inputCanvasRef.current;
    const contextInput = canvasInput.getContext('2d');
    const grid = makeColorGrid(contextInput, { rowsCount, columnsCount, ignoreColor, ignoreColorOpacityThreshold, ignoreColorMaxDeviation });
    // TODO!!! Handle changedAnimationParams and those partial grid params
    gridOutputRef.current.handleCreate(
      grid,
      {
        radius,
        horizontalGapPx,
        verticalGapPx,
        angle,
        stroke: useStroke ? {
          color: strokeColor,
          width: strokeWidth,
        } : null,
      },
      {
        type: animationType,
        direction: animationDirection,
        duration: animationDuration,
        delay: animationType === 'slide' ? {
          min: animationDelayMin,
          max: animationDelayMax,
        } : null,
        easing: animationEasing,
        // ...changedAnimationParams
      }
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
        values={{
          rowsCount,
          columnsCount,
          radius,
          horizontalGapPx,
          verticalGapPx,
          aspectRatioMode,
          angle,
          useStroke,
          strokeColor,
          strokeWidth,
          useIgnoreColor,
          ignoreColor,
          ignoreColorOpacityThreshold,
          ignoreColorMaxDeviation,
          seed,
          useCellSpan,
          cellSpanEstimated,
          cellSpanMin,
          cellSpanMax,
          usePalette,
          palette,
          useSurroundingCells,
          surroundingCellsColor,
          surroundingCellsMinDepth,
          surroundingCellsMaxDepth,
          animationType,
          animationDirection,
          animationDuration,
          animationDelayMin,
          animationDelayMax,
          animationEasing,
          backgroundColor,
          alwaysRedraw
        }}
        valueHandlers={{
          updateRowsCount,
          updateColumnsCount,
          updateRadius,
          updateHorizontalGapPx,
          updateVerticalGapPx,
          updateAspectRatioMode,
          updateAngle,
          updateUseStroke,
          updateStrokeColor,
          updateStrokeWidth,
          updateUseIgnoreColor,
          updateIgnoreColor,
          updateIgnoreColorOpacityThreshold,
          updateIgnoreColorMaxDeviation,
          updateSeed,
          updateUseCellSpan,
          updateCellSpanEstimated,
          updateCellSpanMin,
          updateCellSpanMax,
          updateUsePalette,
          updatePalette,
          updateUseSurroundingCells,
          updateSurroundingCellsColor,
          updateSurroundingCellsMinDepth,
          updateSurroundingCellsMaxDepth,
          updateAnimationType,
          updateAnimationDirection,
          updateAnimationDuration,
          updateAnimationDelayMin,
          updateAnimationDelayMax,
          updateAnimationEasing,
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
        stretchCanvas={stretchCanvas}
        updateStretchCanvas={updateStretchCanvas}
        screenOverflow={screenOverflow}
        updateScreenOverflow={updateScreenOverflow}
        fitBothCanvasInOneRow={fitBothCanvasInOneRow}
        updateFitBothCanvasInOneRow={updateFitBothCanvasInOneRow}
        shiftMainByMenu={shiftMainByMenu}
        updateShiftMainByMenu={updateShiftMainByMenu}
      />
      <GridOutput ref={gridOutputRef} />
    </>
  );
};

export { App };
