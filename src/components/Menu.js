import { MenuItemGroup } from './MenuItemGroup';

/**
 * @typedef {import('../index.d.ts').GridConfigState} GridConfigState
 * @typedef {import('../index.d.ts').GeneratorConfigState} GeneratorConfigState
 * @typedef {import('../index.d.ts').AnimationConfigState} AnimationConfigState
 * @typedef {import('../index.d.ts').GridParams} GridParams
 * @typedef {import('../index.d.ts').GeneratorParams} GeneratorParams
 * @typedef {import('../index.d.ts').AnimationParams} AnimationParams
 * @typedef {import('../hooks/useGridConfig.js').GridConfigControls} GridConfigControls
 * @typedef {import('../hooks/useGeneratorConfig.js').GeneratorConfigControls} GeneratorConfigControls
 * @typedef {import('../hooks/useAnimationConfig.js').AnimationConfigControls} AnimationConfigControls
 */

/**
 * @param {{
 *   menuOpen: boolean,
 *   updateMenuOpen: (value: boolean) => void,
 *   menuRef: React.RefObject<HTMLNavElement>,
 *   handleFileSelection: (e: React.ChangeEvent<HTMLInputElement>) => void,
 *   handleRedrawGrid: () => void,
 *   handleSaveClick: () => void,
 *   handleRedrawGridPreview: (params: {
 *     gridParams: GridParams,
 *     generatorParams: GeneratorParams
 *   }) => void,
 *   gridParams: GridConfigState,
 *   gridControls: GridConfigControls,
 *   generatorParams: GeneratorConfigState,
 *   generatorControls: GeneratorConfigControls,
 *   animationParams: AnimationConfigState,
 *   animationControls: AnimationConfigControls,
 *   values: any,
 *   valueHandlers: any,
 *  }} params
 */
const Menu = ({
  menuOpen,
  updateMenuOpen,
  menuRef,
  handleFileSelection,
  handleRedrawGrid,
  handleSaveClick,
  handleRedrawGridPreview,
  gridParams,
  gridControls,
  generatorParams,
  generatorControls,
  animationParams,
  animationControls,
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
                type: 'number',
                value: gridParams.rowsCount,
                updateValue: gridControls.updateRowsCount
              },
              {
                tag: 'input',
                name: 'columns',
                label: 'Columns',
                type: 'number',
                value: gridParams.columnsCount,
                updateValue: gridControls.updateColumnsCount
              },
              {
                tag: 'input',
                name: 'radius',
                label: 'Radius',
                type: 'number',
                value: gridParams.radius,
                updateValue: gridControls.updateRadius
              },
              {
                tag: 'input',
                name: 'horizontal-gap-px',
                label: 'Horizontal gap px',
                type: 'number',
                value: gridParams.horizontalGapPx,
                updateValue: gridControls.updateHorizontalGapPx
              },
              {
                tag: 'input',
                name: 'vertical-gap-px',
                label: 'Vertical gap px',
                type: 'number',
                value: gridParams.verticalGapPx,
                updateValue: gridControls.updateVerticalGapPx
              },
              {
                tag: 'select',
                name: 'aspect-select',
                label: 'Aspect ratio mode',
                type: 'select',
                value: gridParams.aspectRatioMode,
                updateValue: gridControls.updateAspectRatioMode,
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
                value: gridParams.angle,
                updateValue: gridControls.updateAngle
              },
              {
                tag: 'input',
                name: 'use-stroke',
                label: 'Use stroke',
                type: 'checkbox',
                value: gridParams.useStroke,
                updateValue: gridControls.updateUseStroke
              },
              {
                tag: 'input',
                name: 'stroke-color',
                label: 'Stroke color',
                type: 'color',
                hidden: !gridParams.useStroke,
                disabled: !gridParams.useStroke,
                value: gridParams.stroke.color,
                updateValue: gridControls.updateStroke.color
              },
              {
                tag: 'input',
                name: 'stroke-width',
                label: 'Stroke width',
                type: 'number',
                hidden: !gridParams.useStroke,
                disabled: !gridParams.useStroke,
                value: gridParams.stroke.width,
                updateValue: gridControls.updateStroke.width
              },
              {
                tag: 'input',
                name: 'use-ignore-color',
                label: 'Use ignore color',
                type: 'checkbox',
                value: gridParams.useIgnoreColor,
                updateValue: gridControls.updateUseIgnoreColor
              },
              {
                tag: 'input',
                name: 'ignore-color',
                label: 'Ignore color',
                type: 'color',
                hidden: !gridParams.useIgnoreColor,
                disabled: !gridParams.useIgnoreColor,
                value: gridParams.ignoreColor.color,
                updateValue: gridControls.updateIgnoreColor.color
              },
              {
                tag: 'input',
                name: 'ignore-color-opacity-threshold',
                label: 'Ignore color opacity threshold (0-255)',
                type: 'number',
                hidden: !gridParams.useIgnoreColor,
                disabled: !gridParams.useIgnoreColor,
                value: gridParams.ignoreColor.opacityThreshold,
                updateValue: gridControls.updateIgnoreColor.opacityThreshold
              },
              {
                tag: 'input',
                name: 'ignore-color-max-deviation',
                label: 'Ignore color max deviation',
                type: 'number',
                hidden: !gridParams.useIgnoreColor,
                disabled: !gridParams.useIgnoreColor,
                value: gridParams.ignoreColor.maxDeviation,
                updateValue: gridControls.updateIgnoreColor.maxDeviation
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
                value: generatorParams.seed,
                updateValue: generatorControls.updateSeed
              },
              {
                tag: 'input',
                name: 'use-cell-span',
                label: 'Use cell span',
                type: 'checkbox',
                value: generatorParams.useCellSpan,
                updateValue: generatorControls.updateUseCellSpan
              },
              {
                tag: 'input',
                name: 'cell-span-estimated',
                label: 'Cell span estimated',
                type: 'number',
                hidden: !generatorParams.useCellSpan,
                disabled: !generatorParams.useCellSpan,
                value: generatorParams.cellSpan.estimated,
                updateValue: generatorControls.updateCellSpan.estimated
              },
              {
                tag: 'input',
                name: 'cell-span-min',
                label: 'Cell span min',
                type: 'number',
                hidden: !generatorParams.useCellSpan,
                disabled: !generatorParams.useCellSpan,
                value: generatorParams.cellSpan.min,
                updateValue: generatorControls.updateCellSpan.min
              },
              {
                tag: 'input',
                name: 'cell-span-max',
                label: 'Cell span max',
                type: 'number',
                hidden: !generatorParams.useCellSpan,
                disabled: !generatorParams.useCellSpan,
                value: generatorParams.cellSpan.max,
                updateValue: generatorControls.updateCellSpan.max
              },
              {
                tag: 'input',
                name: 'use-main-palette',
                label: 'Use main palette',
                type: 'checkbox',
                value: generatorParams.useMainPalette,
                updateValue: generatorControls.updateUseMainPalette
              },
              {
                tag: 'div',
                name: 'main-palette',
                label: 'Main palette',
                type: 'palette',
                hidden: !generatorParams.useMainPalette,
                disabled: !generatorParams.useMainPalette,
                value: generatorParams.mainPalette,
                updateValue: generatorControls.updateMainPalette
              },
              {
                tag: 'input',
                name: 'use-surrounding-cells',
                label: 'Use surrounding cells',
                type: 'checkbox',
                value: generatorParams.useSurroundingCells,
                updateValue: generatorControls.updateUseSurroundingCells
              },
              {
                tag: 'input',
                name: 'surrounding-cells-color',
                label: 'Surrounding cells color',
                type: 'color',
                hidden: !generatorParams.useSurroundingCells,
                disabled: !generatorParams.useSurroundingCells,
                value: generatorParams.surroundingCells.color,
                updateValue: generatorControls.updateSurroundingCells.color
              },
              {
                tag: 'input',
                name: 'surrounding-cells-color-variation',
                label: 'Surrounding cells color variation',
                type: 'number',
                hidden: !generatorParams.useSurroundingCells,
                disabled: !generatorParams.useSurroundingCells,
                value: generatorParams.surroundingCells.colorVariation,
                updateValue: generatorControls.updateSurroundingCells.colorVariation
              },
              {
                tag: 'input',
                name: 'surrounding-cells-estimated-span',
                label: 'Surrounding cells estimated span',
                type: 'number',
                hidden: !generatorParams.useSurroundingCells,
                disabled: !generatorParams.useSurroundingCells,
                value: generatorParams.surroundingCells.span.estimated,
                updateValue: generatorControls.updateSurroundingCells.span.estimated
              },
              {
                tag: 'input',
                name: 'surrounding-cells-min-span',
                label: 'Surrounding cells min span',
                type: 'number',
                hidden: !generatorParams.useSurroundingCells,
                disabled: !generatorParams.useSurroundingCells,
                value: generatorParams.surroundingCells.span.min,
                updateValue: generatorControls.updateSurroundingCells.span.min
              },
              {
                tag: 'input',
                name: 'surrounding-cells-max-span',
                label: 'Surrounding cells max span',
                type: 'number',
                hidden: !generatorParams.useSurroundingCells,
                disabled: !generatorParams.useSurroundingCells,
                value: generatorParams.surroundingCells.span.max,
                updateValue: generatorControls.updateSurroundingCells.span.max
              },
              {
                tag: 'input',
                name: 'surrounding-cells-estimated-depth',
                label: 'Surrounding cells estimated depth',
                type: 'number',
                hidden: !generatorParams.useSurroundingCells,
                disabled: !generatorParams.useSurroundingCells,
                value: generatorParams.surroundingCells.depth.estimated,
                updateValue: generatorControls.updateSurroundingCells.depth.estimated
              },
              {
                tag: 'input',
                name: 'surrounding-cells-min-depth',
                label: 'Surrounding cells min depth',
                type: 'number',
                hidden: !generatorParams.useSurroundingCells,
                disabled: !generatorParams.useSurroundingCells,
                value: generatorParams.surroundingCells.depth.min,
                updateValue: generatorControls.updateSurroundingCells.depth.min
              },
              {
                tag: 'input',
                name: 'surrounding-cells-max-depth',
                label: 'Surrounding cells max depth',
                type: 'number',
                hidden: !generatorParams.useSurroundingCells,
                disabled: !generatorParams.useSurroundingCells,
                value: generatorParams.surroundingCells.depth.max,
                updateValue: generatorControls.updateSurroundingCells.depth.max
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
                value: animationParams.type,
                updateValue: animationControls.updateType,
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
                disabled: animationParams.type === 'appear',
                value: animationParams.direction,
                updateValue: animationControls.updateDirection,
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
                value: animationParams.duration,
                updateValue: animationControls.updateDuration
              },
              {
                tag: 'input',
                name: 'animation-delay-min',
                label: 'Animation delay min',
                type: 'number',
                disabled: animationParams.type === 'appear',
                value: animationParams.delay.min,
                updateValue: animationControls.updateDelay.min
              },
              {
                tag: 'input',
                name: 'animation-delay-max',
                label: 'Animation delay max',
                type: 'number',
                disabled: animationParams.type === 'appear',
                value: animationParams.delay.max,
                updateValue: animationControls.updateDelay.max
              },
              {
                tag: 'select',
                name: 'animation-easing',
                label: 'Animation easing',
                type: 'select',
                value: animationParams.easing,
                updateValue: animationControls.updateEasing,
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