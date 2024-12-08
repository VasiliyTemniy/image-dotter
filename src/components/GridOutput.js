import { useState, useEffect, forwardRef, useImperativeHandle, useRef, memo } from 'react';

/**
 * @typedef {import('../index.d.ts').GridHtmlVisualParams} GridHtmlVisualParams
 * @typedef {import('../index.d.ts').DotterCell} DotterCell
 */

const GridOutput = forwardRef((props, refs) => {
  const [grid, setGrid] = useState([]);
  const [gridHtmlParams, setGridHtmlParams] = useState({});
  const [_animationParams, setAnimationParams] = useState({});

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

  const containerRef = useRef(null);
  const backgroundRef = useRef(null);

  useImperativeHandle(refs, () => {
    return {
      drawHtmlPreview,
      setSize,
      backgroundRef,
      grid,
      setGrid
    };
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.classList.add('shown');
    container.addEventListener('click', () => {
      if (container.classList.contains('shown')) {
        container.classList.remove('shown');
        container.classList.add('hide');
      } else
      if (container.classList.contains('hidden')) {
        container.classList.remove('hidden');
        container.classList.add('show');
      }
    });
    container.addEventListener('animationend', () => {
      if (container.classList.contains('show')) {
        container.classList.remove('show');
        container.classList.add('shown');
      }
      if (container.classList.contains('hide')) {
        container.classList.remove('hide');
        container.classList.add('hidden');
      }
    });
  }, []);

  return (
    <div className='container padding-1rem border-black-1px width-fit-content bg-white margin-1rem'>
      <div className='title'>
        HTML Output
      </div>
      <div id="background" className="grid-output__background" ref={backgroundRef}>
        <div id="container" className="grid-output__container" ref={containerRef}>
          <MemoizedGrid grid={grid} gridHtmlParams={gridHtmlParams}/>
        </div>
      </div>
    </div>
  );
});

const MemoizedGrid = memo(
  /**
   * @param {{ grid: DotterCell[][], gridHtmlParams: GridHtmlVisualParams }} props
   */
  ({ grid, gridHtmlParams }) => {

    // let baseX = Infinity;
    // let baseY = Infinity;

    // for (let i = 0; i < grid.length; i++) {
    //   for (let j = 0; j < grid[i].length; j++) {
    //     if (grid[i][j][0] < baseX) {
    //       baseX = grid[i][j][0];
    //     }
    //     if (grid[i][j][1] < baseY) {
    //       baseY = grid[i][j][1];
    //     }
    //   }
    // }

    // console.log('baseX', baseX, 'baseY', baseY);

    const rowStyle = {
      position: 'relative',
      marginTop: `${gridHtmlParams.horizontalGapPx}px`,
      height: `${gridHtmlParams.monoCellSize}px`,
    };

    const cellStyle = {
      position: 'absolute',
      height: '100%',
      borderRadius: `${gridHtmlParams.borderRadius}px`,
    };

    return (
      <>
        {grid.map((row, rowIndex) => (
          <div key={'grid-' + rowIndex} className="row" style={{ ...rowStyle }}>
            {row.map((cell, columnIndex) => (
              <div
                key={'r' + rowIndex + 'c' + columnIndex}
                className="cell"
                style={{
                  backgroundColor: cell[3],
                  ...cellStyle,
                  left: `${cell[0] * gridHtmlParams.monoCellSize * gridHtmlParams.overrideSpanWidthFactor + gridHtmlParams.verticalGapPx}px`,
                  // left: `${getCellRelativeX(cell, baseX, row, columnIndex) * gridHtmlParams.monoCellSize + gridHtmlParams.verticalGapPx}px`,
                  width: `${cell[2] * gridHtmlParams.monoCellSize * gridHtmlParams.overrideSpanWidthFactor - gridHtmlParams.verticalGapPx}px`
                }}
              ></div>
            ))}
          </div>
        ))}
      </>
    );
  });

MemoizedGrid.displayName = 'MemoizedGrid';

GridOutput.displayName = 'GridOutput';

export { GridOutput };
