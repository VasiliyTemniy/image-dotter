import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import '../styles/grid-output.css';

const GridOutput = forwardRef((props, refs) => {
  const [grid, setGrid] = useState([]);

  const handleCreate = (grid) => {
    setGrid(grid);
  };

  useImperativeHandle(refs, () => {
    return {
      handleCreate,
      grid
    };
  });

  useEffect(() => {
    const container = document.querySelector('.container');
    container.classList.add('shown');
    container.addEventListener('click', () => {
      if (container.classList.contains('shown')) {
        container.classList.remove('shown');
        container.classList.add('hide');
        //console.log('here 1 ', container.classList)
      } else
      if (container.classList.contains('hidden')) {
        container.classList.remove('hidden');
        container.classList.add('show');
        //console.log('here 2 ', container.classList)
      }
    });
    container.addEventListener('animationend', () => {
      if (container.classList.contains('show')) {
        container.classList.remove('show');
        container.classList.add('shown');
        //console.log('here 3 ', container.classList)
      }
      if (container.classList.contains('hide')) {
        container.classList.remove('hide');
        container.classList.add('hidden');
        //console.log('here 4 ', container.classList)
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

  const outputGrid = grid.map((row, index) => (
    <div key={index} className="row" style={rowStyle}>
      {row.map((cell) => (
        <div
          key={'l' + String(cell.row) + 'r' + String(cell.column)}
          className="cell"
          style={{ backgroundColor: cell.color, ...cellStyle }}
        ></div>
      ))}
    </div>
  ));

  return (
    <>
      <div id="background" className="background-container" style={containerStyle}>
        <div id="container" className="container" style={containerStyle}>
          {outputGrid}
        </div>
      </div>
    </>
  );
});

GridOutput.displayName = 'GridOutput';

export default GridOutput;
