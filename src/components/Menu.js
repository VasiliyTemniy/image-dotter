import { MenuInputItem } from './MenuInputItem.js';
import { MenuItemGroup } from './MenuItemGroup';
import { LightSvg } from '../assets/light.js';
import { DarkSvg } from '../assets/dark.js';
import { MenuSelectItem } from './MenuSelectItem.js';

/**
 * @typedef {import('../index.d.ts').GridConfigState} GridConfigState
 * @typedef {import('../index.d.ts').GeneratorConfigState} GeneratorConfigState
 * @typedef {import('../index.d.ts').AnimationConfigState} AnimationConfigState
 * @typedef {import('../index.d.ts').GridParams} GridParams
 * @typedef {import('../index.d.ts').GeneratorParams} GeneratorParams
 * @typedef {import('../index.d.ts').AnimationParams} AnimationParams
 * @typedef {import('../hooks/useGridHtmlConfig.js').GridHtmlVisualParams} GridHtmlVisualParams
 * @typedef {import('../hooks/useGridConfig.js').GridConfigControls} GridConfigControls
 * @typedef {import('../hooks/useGeneratorConfig.js').GeneratorConfigControls} GeneratorConfigControls
 * @typedef {import('../hooks/useAnimationConfig.js').AnimationConfigControls} AnimationConfigControls
 * @typedef {import('../hooks/useGridHtmlConfig.js').GridHtmlConfigControls} GridHtmlConfigControls
 */

/**
 * @param {{
 *   menuOpen: boolean,
 *   updateMenuOpen: (value: boolean) => void,
 *   menuRef: React.RefObject<HTMLNavElement>,
 *   handleFileSelection: (e: React.ChangeEvent<HTMLInputElement>) => void,
 *   handleRecalcGrid: () => void,
 *   handleRedrawGridPreview: () => void,
 *   handleRedrawGridHtmlPreview: () => void,
 *   handlePlayAnimation: () => void,
 *   handleSaveJSONClick: () => void,
 *   handleSaveHTMLClick: () => void,
 *   handleSaveCSSClick: () => void,
 *   gridParams: GridConfigState,
 *   gridControls: GridConfigControls,
 *   generatorParams: GeneratorConfigState,
 *   generatorControls: GeneratorConfigControls,
 *   animationParams: AnimationConfigState,
 *   animationControls: AnimationConfigControls,
 *   gridHtmlParams: GridHtmlVisualParams,
 *   gridHtmlControls: GridHtmlConfigControls,
 *   values: any,
 *   valueHandlers: any,
 *  }} params
 */
const Menu = ({
  menuOpen,
  updateMenuOpen,
  menuRef,
  handleFileSelection,
  handleRecalcGrid,
  handleRedrawGridPreview,
  handleRedrawGridHtmlPreview,
  handlePlayAnimation,
  handleSaveJSONClick,
  handleSaveHTMLClick,
  handleSaveCSSClick,
  gridParams,
  gridControls,
  generatorParams,
  generatorControls,
  animationParams,
  animationControls,
  gridHtmlParams,
  gridHtmlControls,
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
          <MenuInputItem
            item={{
              tag: 'input',
              type: 'switch',
              name: 'theme',
              label: 'Theme',
              value: values.theme === 'light',
              updateValue: valueHandlers.toggleTheme,
              textLeft: 'LI',
              textRight: 'DK',
              svgLeft: LightSvg,
              svgRight: DarkSvg,
              style: { marginBottom: '0.5rem' },
            }}
          />
          <MenuSelectItem
            item={{
              tag: 'select',
              type: 'select',
              name: 'language',
              label: 'Language',
              value: values.language,
              updateValue: valueHandlers.updateLanguage,
              options: [
                {
                  value: 'en',
                  label: 'English',
                },
                {
                  value: 'ru',
                  label: 'Русский',
                },
              ],
              style: { width: '14rem', marginBottom: '0.5rem' },
            }}
          />
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
                name: 'borderRadius',
                label: 'Cell border radius',
                type: 'number',
                value: gridParams.borderRadius,
                updateValue: gridControls.updateBorderRadius
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
                name: 'cell-span',
                label: 'Cell span',
                type: 'number',
                metaType: 'generator-group',
                hidden: !generatorParams.useCellSpan,
                disabled: !generatorParams.useCellSpan,
                value: generatorParams.cellSpan,
                updateValue: generatorControls.updateCellSpan
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
                name: 'surrounding-cells-alpha-variation',
                label: 'Surrounding cells alpha variation',
                type: 'number',
                hidden: !generatorParams.useSurroundingCells,
                disabled: !generatorParams.useSurroundingCells,
                value: generatorParams.surroundingCells.alphaVariation,
                updateValue: generatorControls.updateSurroundingCells.alphaVariation
              },
              {
                tag: 'input',
                name: 'surrounding-cells-height',
                label: 'Surrounding cells height',
                type: 'number',
                metaType: 'generator-group',
                hidden: !generatorParams.useSurroundingCells,
                disabled: !generatorParams.useSurroundingCells,
                value: generatorParams.surroundingCells.height,
                updateValue: generatorControls.updateSurroundingCells.height
              },
              {
                tag: 'input',
                name: 'surrounding-cells-span',
                label: 'Surrounding cells span',
                type: 'number',
                metaType: 'generator-group',
                hidden: !generatorParams.useSurroundingCells,
                disabled: !generatorParams.useSurroundingCells,
                value: generatorParams.surroundingCells.span,
                updateValue: generatorControls.updateSurroundingCells.span
              },
              {
                tag: 'input',
                name: 'surrounding-cells-depth',
                label: 'Surrounding cells depth',
                type: 'number',
                metaType: 'generator-group',
                hidden: !generatorParams.useSurroundingCells,
                disabled: !generatorParams.useSurroundingCells,
                value: generatorParams.surroundingCells.depth,
                updateValue: generatorControls.updateSurroundingCells.depth
              },
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
                  { value: 'left-to-right', label: 'Left to right', disabled: true },
                  { value: 'right-to-left', label: 'Right to left', disabled: true },
                  { value: 'top-to-bottom', label: 'Top to bottom', disabled: true },
                  { value: 'bottom-to-top', label: 'Bottom to top', disabled: true },
                  { value: 'h-sides', label: 'Horizontal sides' },
                  { value: 'v-sides', label: 'Vertical sides', disabled: true },
                  { value: 'all', label: 'All', disabled: true },
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
          <MenuItemGroup
            title="Html grid params"
            tag='li'
            foldable={true}
            defaultFolded={true}
            style={{ width: '18rem' }}
            items={[
              {
                tag: 'input',
                name: 'mono-cell-size',
                label: 'Mono cell size',
                type: 'number',
                value: gridHtmlParams.monoCellSize,
                updateValue: gridHtmlControls.updateMonoCellSize
              },
              {
                tag: 'input',
                name: 'override-border-radius',
                label: 'Override border radius',
                type: 'number',
                value: gridHtmlParams.overrideBorderRadius,
                updateValue: gridHtmlControls.updateOverrideBorderRadius
              },
              {
                tag: 'input',
                name: 'override-horizontal-gap-px',
                label: 'Override horizontal gap px',
                type: 'number',
                value: gridHtmlParams.overrideHorizontalGapPx,
                updateValue: gridHtmlControls.updateOverrideHorizontalGapPx
              },
              {
                tag: 'input',
                name: 'override-vertical-gap-px',
                label: 'Override vertical gap px',
                type: 'number',
                value: gridHtmlParams.overrideVerticalGapPx,
                updateValue: gridHtmlControls.updateOverrideVerticalGapPx
              },
              {
                tag: 'input',
                name: 'override-span-width-factor',
                label: 'Override span width factor',
                type: 'number',
                value: gridHtmlParams.overrideSpanWidthFactor,
                updateValue: gridHtmlControls.updateOverrideSpanWidthFactor
              },
              {
                tag: 'input',
                name: 'left-correction-px',
                label: 'Left correction px',
                type: 'number',
                value: gridHtmlParams.leftCorrectionPx,
                updateValue: gridHtmlControls.updateLeftCorrectionPx
              },
              {
                tag: 'input',
                name: 'top-correction-px',
                label: 'Top correction px',
                type: 'number',
                value: gridHtmlParams.topCorrectionPx,
                updateValue: gridHtmlControls.updateTopCorrectionPx
              }
            ]}
          />
          <MenuItemGroup
            title="Preview background params"
            tag='li'
            foldable={true}
            defaultFolded={true}
            style={{ width: '18rem' }}
            items={[
              {
                tag: 'input',
                name: 'background-colors-bound',
                label: 'Background colors bound',
                type: 'checkbox',
                value: values.backgroundColorsBound,
                updateValue: valueHandlers.updateBackgroundColorsBound
              },
              {
                tag: 'input',
                name: 'canvas-background-color',
                label: ' Canvas background color',
                type: 'color',
                defaultFolded: true,
                value: values.canvasBackgroundColor,
                updateValue: valueHandlers.updateCanvasBackgroundColor
              },
              {
                tag: 'input',
                name: 'html-background-color',
                label: ' Html background color',
                type: 'color',
                defaultFolded: true,
                value: values.htmlBackgroundColor,
                updateValue: valueHandlers.updateHtmlBackgroundColor
              }
            ]}
          />
          <li>
            <input
              id="always-recalc"
              type="checkbox"
              name="always-recalc"
              className="checkbox-input__field"
              checked={values.alwaysRecalcGrid}
              onChange={(e) => valueHandlers.updateAlwaysRecalcGrid(e.target.checked)}
            />
            <label
              htmlFor="always-recalc"
              className="checkbox-input__label"
              title="Should recalculate grid on inputs change"
            >
              Always recalculate grid on params change
            </label>
          </li>
          <li>
            <input
              id="always-redraw-canvas"
              type="checkbox"
              name="always-redraw-canvas"
              className="checkbox-input__field"
              checked={values.alwaysRedrawCanvas}
              onChange={(e) => valueHandlers.updateAlwaysRedrawCanvas(e.target.checked)}
            />
            <label
              htmlFor="always-redraw-canvas"
              className="checkbox-input__label"
              title="Should redraw preview on inputs change"
            >
              Always redraw canvas preview after recalc
            </label>
          </li>
          <li>
            <input
              id="always-redraw-html"
              type="checkbox"
              name="always-redraw-html"
              className="checkbox-input__field"
              checked={values.alwaysRedrawHtml}
              onChange={(e) => valueHandlers.updateAlwaysRedrawHtml(e.target.checked)}
            />
            <label
              htmlFor="always-redraw-html"
              className="checkbox-input__label"
              title="Should redraw preview on inputs change"
            >
              Always redraw html preview after recalc
            </label>
          </li>
          <li className="button-container">
            <button className="button" onClick={handleRecalcGrid}>Recalculate grid</button>
            <button className="button" onClick={handleRedrawGridPreview}>Redraw canvas preview</button>
            <button className="button" onClick={handleRedrawGridHtmlPreview}>Redraw html preview</button>
            <button className="button" onClick={handlePlayAnimation}>Play animation</button>
            <button className="button" onClick={handleSaveJSONClick}>Save output as JSON</button>
            <button className="button" onClick={handleSaveHTMLClick}>Save output as HTML</button>
            <button className="button" onClick={handleSaveCSSClick}>Save CSS example</button>
          </li>
        </ul>
      </nav>
    </>
  );

};

Menu.displayName = 'Menu';

export { Menu };