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
        <ul className='container flex column gap-05rem' style={{ paddingTop: '1rem' }}>
          <li className="file-input">
            <label
              htmlFor="file-input"
              className="file-input__label"
              title="Select a file to operate with"
              accept=".bmp, .jpg, .jpeg, .png"
              style={{ width: '12rem', display: 'block', textAlign: 'center' }}
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
            style={{ width: '18rem', marginTop: '2rem' }}
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
            style={{ width: '18rem' }}
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
            style={{ width: '18rem' }}
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
                hidden: !values.useStroke,
                disabled: !values.useStroke,
                value: values.strokeColor,
                updateValue: valueHandlers.updateStrokeColor
              },
              {
                tag: 'input',
                name: 'stroke-width',
                label: 'Stroke width',
                type: 'number',
                hidden: !values.useStroke,
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
                hidden: !values.useIgnoreColor,
                disabled: !values.useIgnoreColor,
                value: values.ignoreColor,
                updateValue: valueHandlers.updateIgnoreColor
              },
              {
                tag: 'input',
                name: 'ignore-color-opacity-threshold',
                label: 'Ignore color opacity threshold (0-255)',
                type: 'number',
                hidden: !values.useIgnoreColor,
                disabled: !values.useIgnoreColor,
                value: values.ignoreColorOpacityThreshold,
                updateValue: valueHandlers.updateIgnoreColorOpacityThreshold
              },
              {
                tag: 'input',
                name: 'ignore-color-max-deviation',
                label: 'Ignore color max deviation',
                type: 'number',
                hidden: !values.useIgnoreColor,
                disabled: !values.useIgnoreColor,
                value: values.ignoreColorMaxDeviation,
                updateValue: valueHandlers.updateIgnoreColorMaxDeviation
              }
            ]}
          />
          <MenuItemGroup
            title="Generator params"
            tag='li'
            foldable={true}
            defaultFolded={true}
            style={{ width: '18rem' }}
            items={[
              {
                tag: 'input',
                name: 'seed',
                label: 'Seed',
                type: 'number',
                value: values.seed,
                updateValue: valueHandlers.updateSeed
              },
              {
                tag: 'input',
                name: 'use-cell-span',
                label: 'Use cell span',
                type: 'checkbox',
                value: values.useCellSpan,
                updateValue: valueHandlers.updateUseCellSpan
              },
              {
                tag: 'input',
                name: 'cell-span-estimated',
                label: 'Cell span estimated',
                type: 'number',
                hidden: !values.useCellSpan,
                disabled: !values.useCellSpan,
                value: values.cellSpanEstimated,
                updateValue: valueHandlers.updateCellSpanEstimated
              },
              {
                tag: 'input',
                name: 'cell-span-min',
                label: 'Cell span min',
                type: 'number',
                hidden: !values.useCellSpan,
                disabled: !values.useCellSpan,
                value: values.cellSpanMin,
                updateValue: valueHandlers.updateCellSpanMin
              },
              {
                tag: 'input',
                name: 'cell-span-max',
                label: 'Cell span max',
                type: 'number',
                hidden: !values.useCellSpan,
                disabled: !values.useCellSpan,
                value: values.cellSpanMax,
                updateValue: valueHandlers.updateCellSpanMax
              },
              {
                tag: 'input',
                name: 'use-palette',
                label: 'Use palette',
                type: 'checkbox',
                value: values.usePalette,
                updateValue: valueHandlers.updateUsePalette
              },
              {
                tag: 'div',
                name: 'palette',
                label: 'Palette',
                type: 'palette',
                hidden: !values.usePalette,
                disabled: !values.usePalette,
                value: values.palette,
                updateValue: valueHandlers.updatePalette
              },
              {
                tag: 'input',
                name: 'use-surrounding-cells',
                label: 'Use surrounding cells',
                type: 'checkbox',
                value: values.useSurroundingCells,
                updateValue: valueHandlers.updateUseSurroundingCells
              },
              {
                tag: 'input',
                name: 'surrounding-cells-color',
                label: 'Surrounding cells color',
                type: 'color',
                hidden: !values.useSurroundingCells,
                disabled: !values.useSurroundingCells,
                value: values.surroundingCellsColor,
                updateValue: valueHandlers.updateSurroundingCellsColor
              },
              {
                tag: 'input',
                name: 'surrounding-cells-min-depth',
                label: 'Surrounding cells min depth',
                type: 'number',
                hidden: !values.useSurroundingCells,
                disabled: !values.useSurroundingCells,
                value: values.surroundingCellsMinDepth,
                updateValue: valueHandlers.updateSurroundingCellsMinDepth
              },
              {
                tag: 'input',
                name: 'surrounding-cells-max-depth',
                label: 'Surrounding cells max depth',
                type: 'number',
                hidden: !values.useSurroundingCells,
                disabled: !values.useSurroundingCells,
                value: values.surroundingCellsMaxDepth,
                updateValue: valueHandlers.updateSurroundingCellsMaxDepth
              }
            ]}
          />
          <MenuItemGroup
            title="Animation params"
            tag='li'
            foldable={true}
            defaultFolded={true}
            style={{ width: '18rem' }}
            items={[
              {
                tag: 'select',
                name: 'animation-type',
                label: 'Animation type',
                type: 'select',
                value: values.animationType,
                updateValue: valueHandlers.updateAnimationType,
                options: [
                  { value: 'slide', label: 'Slide' },
                  { value: 'appear', label: 'Appear' },
                ]
              },
              {
                tag: 'select',
                name: 'animation-direction',
                label: 'Animation direction',
                type: 'select',
                disabled: values.animationType === 'appear',
                value: values.animationDirection,
                updateValue: valueHandlers.updateAnimationDirection,
                options: [
                  { value: 'left-to-right', label: 'Left to right' },
                  { value: 'right-to-left', label: 'Right to left' },
                  { value: 'top-to-bottom', label: 'Top to bottom' },
                  { value: 'bottom-to-top', label: 'Bottom to top' },
                  { value: 'h-sides', label: 'Horizontal sides' },
                  { value: 'v-sides', label: 'Vertical sides' },
                  { value: 'all', label: 'All' },
                ]
              },
              {
                tag: 'input',
                name: 'animation-duration',
                label: 'Animation duration',
                type: 'number',
                value: values.animationDuration,
                updateValue: valueHandlers.updateAnimationDuration
              },
              {
                tag: 'input',
                name: 'animation-delay-min',
                label: 'Animation delay min',
                type: 'number',
                disabled: values.animationType === 'appear',
                value: values.animationDelayMin,
                updateValue: valueHandlers.updateAnimationDelayMin
              },
              {
                tag: 'input',
                name: 'animation-delay-max',
                label: 'Animation delay max',
                type: 'number',
                disabled: values.animationType === 'appear',
                value: values.animationDelayMax,
                updateValue: valueHandlers.updateAnimationDelayMax
              },
              {
                tag: 'select',
                name: 'animation-easing',
                label: 'Animation easing',
                type: 'select',
                value: values.animationEasing,
                updateValue: valueHandlers.updateAnimationEasing,
                options: [
                  { value: 'linear', label: 'Linear' },
                  { value: 'ease-in', label: 'Ease in' },
                  { value: 'ease-out', label: 'Ease out' },
                  { value: 'ease-in-out', label: 'Ease in out' },
                ]
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
        </ul>
      </nav>
    </>
  );

};

Menu.displayName = 'Menu';

export { Menu };