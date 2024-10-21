import { makeColorGrid } from '../utils/dottergrid';

const Menu = ({
  handleFileSelection,
  gridOutputRef,
  inputCanvasRef,
  rowsCount,
  updateRowsCount,
  columnsCount,
  updateColumnsCount,
  backgroundColor,
  updateBackgroundColor,
  surroundingDotsColor,
  updateSurroundingDotsColor,
  alwaysRedraw,
  updateAlwaysRedraw,
  pipetteRGBARef,
  pipetteHexRef
}) => {

  const handleCreateClick = (e) => {
    e.preventDefault();
    const canvasInput = inputCanvasRef.current;
    const contextInput = canvasInput.getContext('2d');
    const grid = makeColorGrid(rowsCount, columnsCount, contextInput);
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
    updateBackgroundColor(e.target.value);
    const background = gridOutputRef.current.backgroundRef.current;
    background.style.backgroundColor = e.target.value;
  };

  const dotsChangeColor = (e) => {
    updateSurroundingDotsColor(e.target.value);
  };

  return (
    <>
      <input type="checkbox" id="nav-toggle" defaultChecked hidden />
      <nav className="nav">
        <label htmlFor="nav-toggle" className="nav-toggle"></label>
        <h2 className="logo">
          <span>I</span><span style={{ color: '#ff0000' }}>Dotter</span>
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
            <input
              id="file-input"
              type="file"
              onChange={handleFileSelection}
              className="file-input__field"
            />
          </li>
          <li className="container flex column gap-1rem bg-lightgray padding-1rem border-black-1px margin-v-1rem" style={{ width: '14rem', marginTop: '2rem' }}>
            <div className='title'>Color under cursor (pipette):</div>
            <div id="color-rgba" style={{ fontFamily: 'monospace' }} ref={pipetteRGBARef}>
              <pre>
                RGBA:   0,   0,   0,   0
              </pre>
            </div>
            <div id="color-hex" style={{ fontFamily: 'monospace' }} ref={pipetteHexRef}>
              <pre>
                Hex: #00000000
              </pre>
            </div>
          </li>
          <li className="container bg-lightgray padding-1rem border-black-1px margin-v-1rem" style={{ width: '14rem' }}>
            <div className='title'>Grid params</div>
            <div className="text-input text-input_floating">
              <label
                htmlFor="rows-input"
                className="text-input__label"
                title="Changes quantity of rows in output"
              >
              rows
              </label>
              <input
                id="rows-input"
                name="rows"
                className="text-input__field"
                value={rowsCount}
                onChange={(e) => updateRowsCount(e.target.value)}
              />
            </div>
            <div className="text-input text-input_floating">
              <label
                htmlFor="columns-input"
                className="text-input__label"
                title="Changes quantity of columns in output"
              >
              columns
              </label>
              <input
                id="columns-input"
                name="columns"
                className="text-input__field"
                value={columnsCount}
                onChange={(e) => updateColumnsCount(e.target.value)}
              />
            </div>
          </li>
          <li>
            <input
              id="always-redraw"
              type="checkbox"
              name="always-redraw"
              className="checkbox-input__field"
              checked={alwaysRedraw}
              onChange={(e) => updateAlwaysRedraw(e.target.checked)}
            />
            <label
              htmlFor="always-redraw"
              className="checkbox-input__label"
              title="Should redraw preview on inputs change"
            >
              Always redraw preview on params change
            </label>
          </li>
          <li className="button-container">
            <button className="button" onClick={handleFileSelection}>Redraw canvas preview</button>
            <button className="button" onClick={handleCreateClick}>Redraw html preview</button>
            <button className="button" onClick={handleSaveClick}>Save output</button>
          </li>
          <li className="color-input">
            <input
              id="output-background-color"
              type="color"
              name="output-background-color"
              value={backgroundColor}
              onChange={backgroundChangeColor}
            />
            <label
              htmlFor="output-background-color"
              className="color-input__label"
              title="Changes background color for react output preview"
            >
              Background
            </label>
          </li>
          <li className="color-input">
            <input
              id="surrounding-dots-color"
              type="color"
              name="surrounding-dots-color"
              value={surroundingDotsColor}
              onChange={dotsChangeColor}
            />
            <label
              htmlFor="surrounding-dots-color"
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