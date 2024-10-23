import { makeColorGrid } from '../utils/dottergrid';

const Menu = ({
  handleFileSelection,
  gridOutputRef,
  inputCanvasRef,
  rowsCount,
  updateRowsCount,
  columnsCount,
  updateColumnsCount,
  radius,
  updateRadius,
  horizontalGapPx,
  updateHorizontalGapPx,
  verticalGapPx,
  updateVerticalGapPx,
  angle,
  updateAngle,
  useStroke,
  updateUseStroke,
  strokeColor,
  updateStrokeColor,
  strokeWidth,
  updateStrokeWidth,
  useIgnoreColor,
  updateUseIgnoreColor,
  ignoreColor,
  updateIgnoreColor,
  ignoreColorOpacityThreshold,
  updateIgnoreColorOpacityThreshold,
  ignoreColorMaxDeviation,
  updateIgnoreColorMaxDeviation,
  backgroundColor,
  updateBackgroundColor,
  surroundingDotsColor,
  updateSurroundingDotsColor,
  alwaysRedraw,
  updateAlwaysRedraw,
  pipetteRGBARef,
  pipetteHexRef,
  aspectRatioMode,
  updateAspectRatioMode,
  redrawGridPreview
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
          <li className="container bg-lightgray padding-1rem border-black-1px margin-v-1rem flex column gap-05rem" style={{ width: '14rem' }}>
            <div className='title'>Grid params</div>
            <div className="text-input text-input__floating">
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
            <div className="text-input text-input__floating">
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
            <div className="text-input text-input__floating">
              <label
                htmlFor="radius-input"
                className="text-input__label"
                title="Changes radius in output"
              >
                radius
              </label>
              <input
                id="radius-input"
                name="radius"
                className="text-input__field"
                value={radius}
                onChange={(e) => updateRadius(e.target.value)}
              />
            </div>
            <div className="text-input text-input__floating">
              <label
                htmlFor="horizontal-gap-px-input"
                className="text-input__label"
                title="Changes horizontal gap in output"
              >
                horizontal gap px
              </label>
              <input
                id="horizontal-gap-px-input"
                name="horizontal-gap-px"
                className="text-input__field"
                value={horizontalGapPx}
                onChange={(e) => updateHorizontalGapPx(e.target.value)}
              />
            </div>
            <div className="text-input text-input__floating">
              <label
                htmlFor="vertical-gap-px-input"
                className="text-input__label"
                title="Changes vertical gap in output"
              >
                vertical gap px
              </label>
              <input
                id="vertical-gap-px-input"
                name="vertical-gap-px"
                className="text-input__field"
                value={verticalGapPx}
                onChange={(e) => updateVerticalGapPx(e.target.value)}
              />
            </div>
            <div className="select-input select-input__floating">
              <label
                htmlFor="aspect-select"
                className="select-input__label"
                title="Changes aspect ratio of output"
              >
                aspect ratio mode
              </label>
              <select
                id="aspect-select"
                name="aspect-select"
                className="select-input__field"
                value={aspectRatioMode}
                onChange={(e) => updateAspectRatioMode(e.target.value)}
              >
                <option value="image">Fix by image ratio</option>
                <option value="square">Fix square ratio</option>
                <option value="none">Do not fix ratio</option>
              </select>
            </div>
          </li>
          <li className="container bg-lightgray padding-1rem border-black-1px margin-v-1rem flex column gap-05rem" style={{ width: '14rem' }}>
            <div className='title'>Additional visual params</div>
            <div className="text-input text-input__floating">
              <label
                htmlFor="angle-input"
                className="text-input__label"
                title="Changes angle of output"
              >
                angle (deg; 0 for horizontal)
              </label>
              <input
                id="angle-input"
                name="angle"
                className="text-input__field"
                value={angle}
                onChange={(e) => updateAngle(e.target.value)}
              />
            </div>
            <div className='checkbox-input checkbox-input__floating'>
              <input
                id="use-stroke"
                type="checkbox"
                name="use-stroke"
                className="checkbox-input__field"
                checked={useStroke}
                onChange={(e) => updateUseStroke(e.target.checked)}
              />
              <label
                htmlFor="use-stroke"
                className="checkbox-input__label"
                title="Use stroke or not"
              >
                Use stroke
              </label>
            </div>
            <div className="color-input color-input__floating">
              <input
                id="stroke-color"
                name="stroke-color"
                type="color"
                value={strokeColor}
                onChange={(e) => updateStrokeColor(e.target.value)}
                disabled={!useStroke}
              />
              <label
                htmlFor="stroke-color"
                className="color-input__label"
                title="Changes stroke color of output"
              >
                Stroke color
              </label>
            </div>
            <div className="text-input text-input__floating">
              <label
                htmlFor="stroke-width-input"
                className="text-input__label"
                title="Changes stroke width of output"
              >
                stroke width
              </label>
              <input
                id="stroke-width-input"
                name="stroke-width"
                className="text-input__field"
                value={strokeWidth}
                onChange={(e) => updateStrokeWidth(e.target.value)}
                disabled={!useStroke}
              />
            </div>
            <div className='checkbox-input checkbox-input__floating'>
              <input
                id="use-ignore-color"
                type="checkbox"
                name="use-ignore-color"
                className="checkbox-input__field"
                checked={useIgnoreColor}
                onChange={(e) => updateUseIgnoreColor(e.target.checked)}
              />
              <label
                htmlFor="use-ignore-color"
                className="checkbox-input__label"
                title="Use ignore color or not"
              >
                Use ignore color
              </label>
            </div>
            <div className="color-input color-input__floating">
              <input
                id="ignore-color"
                name="ignore-color"
                type="color"
                value={ignoreColor}
                onChange={(e) => updateIgnoreColor(e.target.value)}
                disabled={!useIgnoreColor}
              />
              <label
                htmlFor="ignore-color"
                className="color-input__label"
                title="Changes ignore color of output"
              >
                Ignore color
              </label>
            </div>
            <div className="text-input text-input__floating">
              <label
                htmlFor="ignore-color-opacity-threshold-input"
                className="text-input__label"
                title="Changes ignore color opacity threshold of output"
              >
                ignore opacity threshold (0-255)
              </label>
              <input
                id="ignore-color-opacity-threshold-input"
                name="ignore-color-opacity-threshold"
                className="text-input__field"
                value={ignoreColorOpacityThreshold}
                onChange={(e) => updateIgnoreColorOpacityThreshold(e.target.value)}
                disabled={!useIgnoreColor}
              />
            </div>
            <div className='text-input text-input__floating'>
              <label
                htmlFor="ignore-color-max-deviation"
                className="text-input__label"
                title="Changes ignore color max deviation of output"
              >
                ignore color max deviation
              </label>
              <input
                id="ignore-color-max-deviation"
                name="ignore-color-max-deviation"
                className="text-input__field"
                value={ignoreColorMaxDeviation}
                onChange={(e) => updateIgnoreColorMaxDeviation(e.target.value)}
                disabled={!useIgnoreColor}
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
            <button className="button" onClick={redrawGridPreview}>Redraw canvas preview</button>
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