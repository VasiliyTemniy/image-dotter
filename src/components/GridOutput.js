import { useState, useEffect, forwardRef, useImperativeHandle, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { switchClasses } from '../utils/html';

/**
 * @typedef {import('../index.d.ts').GridHtmlVisualParams} GridHtmlVisualParams
 * @typedef {import('../index.d.ts').DotterCell} DotterCell
 * @typedef {import('../index.d.ts').AnimationParams} AnimationParams
 */

const GridOutput = forwardRef((props, refs) => {
  const [grid, setGrid] = useState([]);
  const [gridHtmlParams, setGridHtmlParams] = useState({});
  const [animationParams, setAnimationParams] = useState({});
  const [forceRerender, setForceRerender] = useState(false);

  const { t } = useTranslation();

  const drawHtmlPreview = (gridHtmlParams, animationParams) => {
    setGridHtmlParams(gridHtmlParams);
    setAnimationParams(animationParams);
  };

  const setSize = (width, height) => {
    const background = backgroundRef.current;
    if (!background) return;
    background.style.width = `${width}px`;
    background.style.height = `${height}px`;
  };

  /** @type {React.MutableRefObject<HTMLDivElement>} */
  const containerRef = useRef(null);
  /** @type {React.MutableRefObject<HTMLDivElement>} */
  const backgroundRef = useRef(null);

  useImperativeHandle(refs, () => {
    return {
      drawHtmlPreview,
      setSize,
      backgroundRef,
      grid,
      setGrid,
      setForceRerender,
      playAnimation
    };
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.classList.add('shown');
    container.addEventListener('animationend', () => {
      container.classList.remove('animated');
    });
  }, []);

  const playAnimation = () => {
    const container = containerRef.current;
    if (!container || container.classList.contains('animated')) return;
    /** @type {AnimationParams} */
    const _animationParams = animationParams;
    switch (_animationParams.type) {
    case 'appear': {
      if (!container.classList.contains('hidden') && !container.classList.contains('shown')) {
        container.classList.add('shown');
      }
      container.classList.remove('slide');
      switchClasses(container, 'hidden', 'shown');
      container.style.animationDelay = '0ms';
      container.style.animationDuration = `${_animationParams.duration}ms`;
      container.style.animationTimingFunction = _animationParams.easing;
      container.classList.add('animated');
      break;
    }
    case 'slide': {
      container.classList.remove('hidden');
      container.classList.remove('shown');
      container.classList.add('slide');
      /** @type {HTMLDivElement | null} */
      const gridElement = container.querySelector('.grid');
      if (!gridElement) {
        return;
      }
      /** @type {NodeListOf<HTMLDivElement>} */
      const rows = gridElement.querySelectorAll('.row');
      if (!rows || rows.length === 0) {
        return;
      }
      const delayIter = Math.ceil((_animationParams.delay.max - _animationParams.delay.min) / rows.length);
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        row.style.animationDelay = `${_animationParams.delay.min + delayIter * i}ms`;
        row.style.animationDuration = `${_animationParams.duration}ms`;
        row.style.animationTimingFunction = _animationParams.easing;
        row.classList.add('animated');
        row.addEventListener('animationend', () => {
          row.classList.remove('animated');
          row.style.animationDelay = null;
          row.style.animationDuration = null;
          row.style.animationTimingFunction = null;
        });
      }
      break;
    }
    default:
      throw new Error('Unknown animation type: ' + _animationParams.type);
    }
  };

  const MemoizedGrid = useMemo(() =>
    <Grid grid={grid} gridHtmlParams={gridHtmlParams} containerRef={containerRef}/>
  , [grid, gridHtmlParams, containerRef, forceRerender]);

  return (
    <div className='container padding-1rem border-black-1px width-fit-content bg-main margin-1rem'>
      <div className='title'>
        {t('layout.htmlOutput.title')}
      </div>
      <div id="background" className="grid-output__background" ref={backgroundRef}>
        <div id="container" className="grid-output__container" ref={containerRef}>
          {MemoizedGrid}
        </div>
      </div>
    </div>
  );
});

/**
 * @param {{
 *  grid: DotterCell[][],
 *  gridHtmlParams: GridHtmlVisualParams,
 *  containerRef: React.MutableRefObject<HTMLDivElement>
 * }} props
 */
const Grid = ({ grid, gridHtmlParams, containerRef }) => {

  /** x coord not in px but in mono cells @type {number} */
  let minX = Infinity;
  /** x coord not in px but in mono cells @type {number} */
  let maxX = -Infinity;
  /** @type {number} */
  let maxRowLength = 0;

  for (let i = 0; i < grid.length; i++) {
    if (grid[i].length > maxRowLength) {
      maxRowLength = grid[i].length;
    }
    for (let j = 0; j < grid[i].length; j++) {
      const x = grid[i][j][0];
      const span = grid[i][j][2];
      if (x < minX) {
        minX = x;
      }
      if (x + span > maxX) {
        maxX = x + span;
      }
    }
  }

  // Somehow center the grid, make it always fit the screen?
  // Center X coord must be (maxX - minX) / 2
  const gridWidth =
      (maxX - minX) * gridHtmlParams.monoCellSize * gridHtmlParams.overrideSpanWidthFactor;
  // (maxRowLength - 1) * gridHtmlParams.verticalGapPx; // this is not accounted because the gaps are subtracted from each cell width
  const gridHeight =
      (grid.length) * gridHtmlParams.monoCellSize + // * gridHtmlParams.overrideSpanHeightFactor if there is one some day
      (grid.length - 1) * gridHtmlParams.horizontalGapPx;
    /** @type {number | null} */
  let availableXSpace = null;
  /** @type {number | null} */
  let availableYSpace = null;
  // Could use document selector here if container ref causes rerenders
  // const containerElement = document.getElementById('container');
  const containerElement = containerRef.current;
  /** @type {React.MutableRefObject<HTMLDivElement>} */
  const gridRef = useRef(null);
  if (containerElement && gridRef.current) {
    availableXSpace = containerElement.offsetWidth;
    // It kind of works the best by parent element, at least with the current CSS and layout
    if (containerElement.parentElement) {
      availableYSpace = containerElement.parentElement.offsetHeight;
    }
    // availableYSpace = containerElement.offsetHeight;
    // if (
    //   containerElement.parentElement &&
    //   containerElement.parentElement.offsetHeight > availableYSpace
    // ) {
    //   availableYSpace = containerElement.parentElement.offsetHeight;
    // }
  }

  const scaleX = availableXSpace / gridWidth;
  // On the first render, there is no available y space cause there is no elements yet
  // There is no other oppurtunity except to wait for the next render or use window height
  const scaleY = availableYSpace > 0
    ? availableYSpace / gridHeight
    : window.innerHeight / gridHeight;

  const scaleFactor = Math.min(1, scaleX, scaleY);

  if (gridRef.current) {
    gridRef.current.style.width = `${gridWidth * scaleFactor}px`;
    gridRef.current.style.height = `${gridHeight * scaleFactor}px`;
  }

  const rowStyle = {
    position: 'relative',
    marginTop: `${gridHtmlParams.horizontalGapPx * scaleFactor}px`,
    height: `${gridHtmlParams.monoCellSize * scaleFactor}px`,
  };

  const cellStyle = {
    position: 'absolute',
    height: '100%',
    borderRadius: `${gridHtmlParams.borderRadius * scaleFactor}px`,
  };

  return (
    <div className="grid" ref={gridRef} style={{ position: 'relative' }}>
      {grid.map((row, rowIndex) => (
        <div key={'grid-' + rowIndex} className="row" style={{ ...rowStyle }}>
          {row.map((cell, columnIndex) => (
            <div
              key={'r' + rowIndex + 'c' + columnIndex}
              className="cell"
              style={{
                backgroundColor: cell[3],
                ...cellStyle,
                left: `${(
                  (cell[0] - minX) *
                    gridHtmlParams.monoCellSize *
                    gridHtmlParams.overrideSpanWidthFactor
                ) * scaleFactor + gridHtmlParams.leftCorrectionPx}px`,
                width: `${(
                  cell[2] *
                    gridHtmlParams.monoCellSize *
                    gridHtmlParams.overrideSpanWidthFactor -
                    gridHtmlParams.verticalGapPx
                ) * scaleFactor}px`
              }}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
};

Grid.displayName = 'Grid';

GridOutput.displayName = 'GridOutput';

export { GridOutput };
