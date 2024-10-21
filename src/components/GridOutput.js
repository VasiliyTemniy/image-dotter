import { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';

const GridOutput = forwardRef((props, refs) => {
  const [grid, setGrid] = useState([]);

  const handleCreate = (grid) => {
    setGrid(grid);
  };

  const containerRef = useRef(null);
  const backgroundRef = useRef(null);

  useImperativeHandle(refs, () => {
    return {
      handleCreate,
      backgroundRef,
      grid
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

  const containerStyle = {
    width: '100%',
    height: '500px',
    gap: '1px',
  };

  const rowStyle = {
    height: '8px',
    //height: '5%',
    gap: '1px',
  };

  const cellStyle = {
    width: '8px',
    //width: '5%',
    height: '100%',
    borderRadius: '1000px',
  };

  const outputGrid = grid.map((row, rowIndex) => (
    <div key={'grid-' + rowIndex} className="row" style={rowStyle}>
      {row.map((cell, columnIndex) => (
        <div
          key={'r' + rowIndex + 'c' + columnIndex}
          className="cell"
          style={{ backgroundColor: cell[0], ...cellStyle }}
        ></div>
      ))}
    </div>
  ));

  return (
    <>
      <div id="background" className="grid-output__background" ref={backgroundRef} style={containerStyle}>
        <div id="container" className="grid-output__container" ref={containerRef} style={containerStyle}>
          {outputGrid}
        </div>
      </div>
    </>
  );
});

GridOutput.displayName = 'GridOutput';

export default GridOutput;
