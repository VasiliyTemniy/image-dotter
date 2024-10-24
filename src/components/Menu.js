import { MenuItemGroup } from './MenuItemGroup';

const Menu = ({
  menuOpen,
  updateMenuOpen,
  menuRef,
  handleFileSelection,
  handleRedrawGrid,
  handleSaveClick,
  handleRedrawGridPreview,
  values,
  valueHandlers,
  refs,
}) => {

  return (
    <>
      <input type="checkbox" id="nav-toggle" checked={menuOpen} onChange={(e) => updateMenuOpen(e.target.checked)} hidden />
      <nav className="nav" ref={menuRef}>
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
          <MenuItemGroup
            title="Color under cursor (pipette)"
            tag='li'
            foldable={true}
            defaultFolded={true}
            style={{ width: '14rem', marginTop: '2rem' }}
            items={[
              {
                tag: 'div',
                name: 'rgba',
                value: 'RGBA:   0,   0,   0,   0',
                ref: refs.pipetteRGBARef,
                style: { fontFamily: 'monospace' },
              },
              {
                tag: 'div',
                name: 'hex',
                value: 'Hex: #00000000',
                ref: refs.pipetteHexRef,
                style: { fontFamily: 'monospace' },
              }
            ]}
          />
          <MenuItemGroup
            title="Grid params"
            tag='li'
            foldable={true}
            defaultFolded={true}
            style={{ width: '14rem' }}
            items={[
              {
                tag: 'input',
                name: 'rows',
                label: 'Rows',
                type: 'text',
                value: values.rowsCount,
                updateValue: valueHandlers.updateRowsCount
              },
              {
                tag: 'input',
                name: 'columns',
                label: 'Columns',
                type: 'text',
                value: values.columnsCount,
                updateValue: valueHandlers.updateColumnsCount
              },
              {
                tag: 'input',
                name: 'radius',
                label: 'Radius',
                type: 'number',
                value: values.radius,
                updateValue: valueHandlers.updateRadius
              },
              {
                tag: 'input',
                name: 'horizontal-gap-px',
                label: 'Horizontal gap px',
                type: 'number',
                value: values.horizontalGapPx,
                updateValue: valueHandlers.updateHorizontalGapPx
              },
              {
                tag: 'input',
                name: 'vertical-gap-px',
                label: 'Vertical gap px',
                type: 'number',
                value: values.verticalGapPx,
                updateValue: valueHandlers.updateVerticalGapPx
              },
              {
                tag: 'select',
                name: 'aspect-select',
                label: 'Aspect ratio mode',
                type: 'select',
                value: values.aspectRatioMode,
                updateValue: valueHandlers.updateAspectRatioMode,
                options: [
                  {
                    value: 'image',
                    label: 'Fix by image ratio'
                  },
                  {
                    value: 'square',
                    label: 'Fix square ratio'
                  },
                  {
                    value: 'none',
                    label: 'Do not fix ratio'
                  }
                ]
              }
            ]}
          />
          <MenuItemGroup
            title="Additional visual params"
            tag='li'
            foldable={true}
            defaultFolded={true}
            style={{ width: '14rem' }}
            items={[
              {
                tag: 'input',
                name: 'angle',
                label: 'Angle',
                type: 'number',
                value: values.angle,
                updateValue: valueHandlers.updateAngle
              },
              {
                tag: 'input',
                name: 'use-stroke',
                label: 'Use stroke',
                type: 'checkbox',
                value: values.useStroke,
                updateValue: valueHandlers.updateUseStroke
              },
              {
                tag: 'input',
                name: 'stroke-color',
                label: 'Stroke color',
                type: 'color',
                disabled: !values.useStroke,
                value: values.strokeColor,
                updateValue: valueHandlers.updateStrokeColor
              },
              {
                tag: 'input',
                name: 'stroke-width',
                label: 'Stroke width',
                type: 'number',
                disabled: !values.useStroke,
                value: values.strokeWidth,
                updateValue: valueHandlers.updateStrokeWidth
              },
              {
                tag: 'input',
                name: 'use-ignore-color',
                label: 'Use ignore color',
                type: 'checkbox',
                value: values.useIgnoreColor,
                updateValue: valueHandlers.updateUseIgnoreColor
              },
              {
                tag: 'input',
                name: 'ignore-color',
                label: 'Ignore color',
                type: 'color',
                disabled: !values.useIgnoreColor,
                value: values.ignoreColor,
                updateValue: valueHandlers.updateIgnoreColor
              },
              {
                tag: 'input',
                name: 'ignore-color-opacity-threshold',
                label: 'Ignore color opacity threshold (0-255)',
                type: 'number',
                disabled: !values.useIgnoreColor,
                value: values.ignoreColorOpacityThreshold,
                updateValue: valueHandlers.updateIgnoreColorOpacityThreshold
              },
              {
                tag: 'input',
                name: 'ignore-color-max-deviation',
                label: 'Ignore color max deviation',
                type: 'number',
                value: values.ignoreColorMaxDeviation,
                updateValue: valueHandlers.updateIgnoreColorMaxDeviation
              }
            ]}
          />
          <li>
            <input
              id="always-redraw"
              type="checkbox"
              name="always-redraw"
              className="checkbox-input__field"
              checked={values.alwaysRedraw}
              onChange={(e) => valueHandlers.updateAlwaysRedraw(e.target.checked)}
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
            <button className="button" onClick={handleRedrawGridPreview}>Redraw canvas preview</button>
            <button className="button" onClick={handleRedrawGrid}>Redraw html preview</button>
            <button className="button" onClick={handleSaveClick}>Save output</button>
          </li>
          <li className="color-input">
            <input
              id="output-background-color"
              type="color"
              name="output-background-color"
              value={values.backgroundColor}
              onChange={(e) => valueHandlers.updateBackgroundColor(e.target.value)}
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
              value={values.surroundingDotsColor}
              onChange={(e) => valueHandlers.updateSurroundingDotsColor(e.target.value)}
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

Menu.displayName = 'Menu';

export { Menu };