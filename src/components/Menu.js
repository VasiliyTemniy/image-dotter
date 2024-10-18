import { useEffect } from 'react';
import { makeColorGrid } from '../utils/dottergrid';

const Menu = ({ handleFileSelection, gridOutputRef }) => {

  useEffect(() => {
    document.getElementById('rows-input').value = 50;
    document.getElementById('columns-input').value = 50;
  }, []);

  const handleCreateClick = (e) => {
    e.preventDefault();
    const canvasInput = document.getElementById('input-canvas');
    const contextInput = canvasInput.getContext('2d');
    const rowsInput = document.getElementById('rows-input').value;
    const columnsInput = document.getElementById('columns-input').value;
    const grid = makeColorGrid(rowsInput, columnsInput, contextInput);
    gridOutputRef.current.handleCreate(grid);
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

  const backgroundChangeColor = (e) => {
    e.preventDefault();
    const background = document.getElementById('background');
    background.style.backgroundColor = e.target.value;
  };

  const dotsChangeColor = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <input type="checkbox" id="nav-toggle" hidden />
      <nav className="nav">
        <label htmlFor="nav-toggle" className="nav-toggle"></label>
        <h2 className="logo">
          DOTTER
        </h2>
        <ul>
          <li className="file-input">
            <label
              htmlFor="file-input"
              className="file-input__label"
              title="Select a file to operate with"
              accept=".bmp, .jpg, .jpeg, .png"
            >
                Select file
            </label>
            <input id="file-input" type="file" onChange={handleFileSelection} className="file-input__field"/>
          </li>
          <li className="color-info">
            <div id="color" >Hover mouse over canvas to get color</div>
            <div id="color-hex" >#00000000</div>
          </li>
          <li className="text-input text-input_floating">
            <label
              htmlFor="rows-input"
              className="text-input__label"
              title="Changes quantity of rows in output"
            >
              rows
            </label>
            <input id="rows-input" name="rows" className="text-input__field"/>
          </li>
          <li className="text-input text-input_floating">
            <label
              htmlFor="columns-input"
              className="text-input__label"
              title="Changes quantity of columns in output"
            >
              columns
            </label>
            <input id="columns-input" name="columns" className="text-input__field"/>
          </li>
          <li className="button-container">
            <button onClick={handleFileSelection}>Apply</button>
            <button onClick={handleCreateClick}>Create</button>
            <button onClick={handleSaveClick}>Save output</button>
          </li>
          <li className="color-input">
            <input
              id="outputBackgroundColor"
              type="color"
              name="outputBackgroundColor"
              value="#1c1e21"
              onChange={backgroundChangeColor}
            />
            <label
              htmlFor="outputBackgroundColor"
              className="color-input__label"
              title="Changes background color for react output preview"
            >
              Background
            </label>
          </li>
          <li className="color-input">
            <input
              id="surroundingDotsColor"
              type="color"
              name="surroundingDotsColor"
              value="#325e9f"
              onChange={dotsChangeColor}
            />
            <label
              htmlFor="surroundingDotsColor"
              className="color-input__label"
              title="Changes color of surrounding dots for react output"
            >
                Surrounding dots
            </label>
          </li>
        </ul>
      </nav>
    </>
  );

};

export default Menu;