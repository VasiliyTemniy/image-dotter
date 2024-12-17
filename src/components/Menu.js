import { MenuInputItem } from './MenuInputItem.js';
import { MenuItemGroup } from './MenuItemGroup';
import { LightSvg } from '../assets/light.js';
import { DarkSvg } from '../assets/dark.js';
import { MenuSelectItem } from './MenuSelectItem.js';
import { useTranslation } from 'react-i18next';

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

  const { t } = useTranslation();

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
              label: t('menu.inputs.theme.label'),
              value: values.theme === 'light',
              updateValue: valueHandlers.toggleTheme,
              textLeft: t('menu.inputs.theme.options.light'),
              textRight: t('menu.inputs.theme.options.dark'),
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
              label: t('menu.inputs.language.label'),
              value: values.language,
              updateValue: valueHandlers.updateLanguage,
              options: [
                {
                  value: 'en',
                  label: t('menu.inputs.language.options.en'),
                },
                {
                  value: 'ru',
                  label: t('menu.inputs.language.options.ru'),
                },
              ],
              style: { width: '14rem', marginBottom: '0.5rem' },
            }}
          />
          <li className="file-input">
            <label
              htmlFor="file-input"
              className="file-input__label"
              title={t('menu.buttons.selectFile.tooltip')}
              accept=".bmp, .jpg, .jpeg, .png"
              style={{ width: '12rem', display: 'block', textAlign: 'center' }}
            >
              {t('menu.buttons.selectFile.label')}
            </label>
            <input
              id="file-input"
              type="file"
              onChange={handleFileSelection}
              className="file-input__field"
            />
          </li>
          <MenuItemGroup
            title={t('menu.groups.pipette.title')}
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
            title={t('menu.groups.gridParams.title')}
            tag='li'
            foldable={true}
            defaultFolded={true}
            style={{ width: '18rem' }}
            items={[
              {
                tag: 'input',
                name: 'rows',
                label: t('menu.groups.gridParams.rows.label'),
                type: 'number',
                value: gridParams.rowsCount,
                updateValue: gridControls.updateRowsCount
              },
              {
                tag: 'input',
                name: 'columns',
                label: t('menu.groups.gridParams.columns.label'),
                type: 'number',
                value: gridParams.columnsCount,
                updateValue: gridControls.updateColumnsCount
              },
              {
                tag: 'input',
                name: 'borderRadius',
                label: t('menu.groups.gridParams.borderRadius.label'),
                type: 'number',
                value: gridParams.borderRadius,
                updateValue: gridControls.updateBorderRadius
              },
              {
                tag: 'input',
                name: 'horizontal-gap-px',
                label: t('menu.groups.gridParams.horizontalGapPx.label'),
                type: 'number',
                value: gridParams.horizontalGapPx,
                updateValue: gridControls.updateHorizontalGapPx
              },
              {
                tag: 'input',
                name: 'vertical-gap-px',
                label: t('menu.groups.gridParams.verticalGapPx.label'),
                type: 'number',
                value: gridParams.verticalGapPx,
                updateValue: gridControls.updateVerticalGapPx
              },
              {
                tag: 'select',
                name: 'aspect-select',
                label: t('menu.groups.gridParams.aspectRatioMode.label'),
                type: 'select',
                value: gridParams.aspectRatioMode,
                updateValue: gridControls.updateAspectRatioMode,
                options: [
                  {
                    value: 'image',
                    label: t('menu.groups.gridParams.aspectRatioMode.options.imageRatio')
                  },
                  {
                    value: 'square',
                    label: t('menu.groups.gridParams.aspectRatioMode.options.squareRatio')
                  },
                  {
                    value: 'none',
                    label: t('menu.groups.gridParams.aspectRatioMode.options.none')
                  }
                ]
              }
            ]}
          />
          <MenuItemGroup
            title={t('menu.groups.additionalVisualParams.title')}
            tag='li'
            foldable={true}
            defaultFolded={true}
            style={{ width: '18rem' }}
            items={[
              {
                tag: 'input',
                name: 'angle',
                label: t('menu.groups.additionalVisualParams.angle.label'),
                type: 'number',
                value: gridParams.angle,
                updateValue: gridControls.updateAngle
              },
              {
                tag: 'input',
                name: 'use-stroke',
                label: t('menu.groups.additionalVisualParams.useStroke.label'),
                type: 'checkbox',
                value: gridParams.useStroke,
                updateValue: gridControls.updateUseStroke
              },
              {
                tag: 'input',
                name: 'stroke-color',
                label: t('menu.groups.additionalVisualParams.strokeColor.label'),
                type: 'color',
                hidden: !gridParams.useStroke,
                disabled: !gridParams.useStroke,
                value: gridParams.stroke.color,
                updateValue: gridControls.updateStroke.color
              },
              {
                tag: 'input',
                name: 'stroke-width',
                label: t('menu.groups.additionalVisualParams.strokeWidth.label'),
                type: 'number',
                hidden: !gridParams.useStroke,
                disabled: !gridParams.useStroke,
                value: gridParams.stroke.width,
                updateValue: gridControls.updateStroke.width
              },
              {
                tag: 'input',
                name: 'use-ignore-color',
                label: t('menu.groups.additionalVisualParams.useIgnoreColor.label'),
                type: 'checkbox',
                value: gridParams.useIgnoreColor,
                updateValue: gridControls.updateUseIgnoreColor
              },
              {
                tag: 'input',
                name: 'ignore-color',
                label: t('menu.groups.additionalVisualParams.ignoreColor.label'),
                type: 'color',
                hidden: !gridParams.useIgnoreColor,
                disabled: !gridParams.useIgnoreColor,
                value: gridParams.ignoreColor.color,
                updateValue: gridControls.updateIgnoreColor.color
              },
              {
                tag: 'input',
                name: 'ignore-color-opacity-threshold',
                label: t('menu.groups.additionalVisualParams.ignoreColorOpacityThreshold.label'),
                type: 'number',
                hidden: !gridParams.useIgnoreColor,
                disabled: !gridParams.useIgnoreColor,
                value: gridParams.ignoreColor.opacityThreshold,
                updateValue: gridControls.updateIgnoreColor.opacityThreshold
              },
              {
                tag: 'input',
                name: 'ignore-color-max-deviation',
                label: t('menu.groups.additionalVisualParams.ignoreColorMaxDeviation.label'),
                type: 'number',
                hidden: !gridParams.useIgnoreColor,
                disabled: !gridParams.useIgnoreColor,
                value: gridParams.ignoreColor.maxDeviation,
                updateValue: gridControls.updateIgnoreColor.maxDeviation
              }
            ]}
          />
          <MenuItemGroup
            title={t('menu.groups.generatorParams.title')}
            tag='li'
            foldable={true}
            defaultFolded={true}
            style={{ width: '18rem' }}
            items={[
              {
                tag: 'input',
                name: 'seed',
                label: t('menu.groups.generatorParams.seed.label'),
                type: 'number',
                value: generatorParams.seed,
                updateValue: generatorControls.updateSeed
              },
              {
                tag: 'input',
                name: 'use-cell-span',
                label: t('menu.groups.generatorParams.useCellSpan.label'),
                type: 'checkbox',
                value: generatorParams.useCellSpan,
                updateValue: generatorControls.updateUseCellSpan
              },
              {
                tag: 'input',
                name: 'cell-span',
                label: t('menu.groups.generatorParams.cellSpan.label'),
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
                label: t('menu.groups.generatorParams.useMainPalette.label'),
                type: 'checkbox',
                value: generatorParams.useMainPalette,
                updateValue: generatorControls.updateUseMainPalette
              },
              {
                tag: 'div',
                name: 'main-palette',
                label: t('menu.groups.generatorParams.mainPalette.label'),
                type: 'palette',
                hidden: !generatorParams.useMainPalette,
                disabled: !generatorParams.useMainPalette,
                value: generatorParams.mainPalette,
                updateValue: generatorControls.updateMainPalette
              },
              {
                tag: 'input',
                name: 'use-surrounding-cells',
                label: t('menu.groups.generatorParams.useSurroundingCells.label'),
                type: 'checkbox',
                value: generatorParams.useSurroundingCells,
                updateValue: generatorControls.updateUseSurroundingCells
              },
              {
                tag: 'input',
                name: 'surrounding-cells-color',
                label: t('menu.groups.generatorParams.surroundingCellsColor.label'),
                type: 'color',
                hidden: !generatorParams.useSurroundingCells,
                disabled: !generatorParams.useSurroundingCells,
                value: generatorParams.surroundingCells.color,
                updateValue: generatorControls.updateSurroundingCells.color
              },
              {
                tag: 'input',
                name: 'surrounding-cells-color-variation',
                label: t('menu.groups.generatorParams.surroundingCellsColorVariation.label'),
                type: 'number',
                hidden: !generatorParams.useSurroundingCells,
                disabled: !generatorParams.useSurroundingCells,
                value: generatorParams.surroundingCells.colorVariation,
                updateValue: generatorControls.updateSurroundingCells.colorVariation
              },
              {
                tag: 'input',
                name: 'surrounding-cells-alpha-variation',
                label: t('menu.groups.generatorParams.surroundingCellsAlphaVariation.label'),
                type: 'number',
                hidden: !generatorParams.useSurroundingCells,
                disabled: !generatorParams.useSurroundingCells,
                value: generatorParams.surroundingCells.alphaVariation,
                updateValue: generatorControls.updateSurroundingCells.alphaVariation
              },
              {
                tag: 'input',
                name: 'surrounding-cells-height',
                label: t('menu.groups.generatorParams.surroundingCellsHeight.label'),
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
                label: t('menu.groups.generatorParams.surroundingCellsSpan.label'),
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
                label: t('menu.groups.generatorParams.surroundingCellsDepth.label'),
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
            title={t('menu.groups.animationParams.title')}
            tag='li'
            foldable={true}
            defaultFolded={true}
            style={{ width: '18rem' }}
            items={[
              {
                tag: 'select',
                name: 'animation-type',
                label: t('menu.groups.animationParams.type.label'),
                type: 'select',
                value: animationParams.type,
                updateValue: animationControls.updateType,
                options: [
                  { value: 'slide', label: t('menu.groups.animationParams.type.options.slide') },
                  { value: 'appear', label: t('menu.groups.animationParams.type.options.appear') },
                ]
              },
              {
                tag: 'select',
                name: 'animation-direction',
                label: t('menu.groups.animationParams.direction.label'),
                type: 'select',
                disabled: animationParams.type === 'appear',
                value: animationParams.direction,
                updateValue: animationControls.updateDirection,
                options: [
                  { value: 'left-to-right', label: t('menu.groups.animationParams.direction.options.leftToRight'), disabled: true },
                  { value: 'right-to-left', label: t('menu.groups.animationParams.direction.options.rightToLeft'), disabled: true },
                  { value: 'top-to-bottom', label: t('menu.groups.animationParams.direction.options.topToBottom'), disabled: true },
                  { value: 'bottom-to-top', label: t('menu.groups.animationParams.direction.options.bottomToTop'), disabled: true },
                  { value: 'h-sides', label: t('menu.groups.animationParams.direction.options.hSides') },
                  { value: 'v-sides', label: t('menu.groups.animationParams.direction.options.vSides'), disabled: true },
                  { value: 'all', label: t('menu.groups.animationParams.direction.options.all'), disabled: true },
                ]
              },
              {
                tag: 'input',
                name: 'animation-duration',
                label: t('menu.groups.animationParams.duration.label'),
                type: 'number',
                value: animationParams.duration,
                updateValue: animationControls.updateDuration
              },
              {
                tag: 'input',
                name: 'animation-delay-min',
                label: t('menu.groups.animationParams.delayMin.label'),
                type: 'number',
                disabled: animationParams.type === 'appear',
                value: animationParams.delay.min,
                updateValue: animationControls.updateDelay.min
              },
              {
                tag: 'input',
                name: 'animation-delay-max',
                label: t('menu.groups.animationParams.delayMax.label'),
                type: 'number',
                disabled: animationParams.type === 'appear',
                value: animationParams.delay.max,
                updateValue: animationControls.updateDelay.max
              },
              {
                tag: 'select',
                name: 'animation-easing',
                label: t('menu.groups.animationParams.easing.label'),
                type: 'select',
                value: animationParams.easing,
                updateValue: animationControls.updateEasing,
                options: [
                  { value: 'linear', label: t('menu.groups.animationParams.easing.options.linear') },
                  { value: 'ease-in', label: t('menu.groups.animationParams.easing.options.easeIn') },
                  { value: 'ease-out', label: t('menu.groups.animationParams.easing.options.easeOut') },
                  { value: 'ease-in-out', label: t('menu.groups.animationParams.easing.options.easeInOut') },
                ]
              }
            ]}
          />
          <MenuItemGroup
            title={t('menu.groups.htmlGridParams.title')}
            tag='li'
            foldable={true}
            defaultFolded={true}
            style={{ width: '18rem' }}
            items={[
              {
                tag: 'input',
                name: 'mono-cell-size',
                label: t('menu.groups.htmlGridParams.monoCellSize.label'),
                type: 'number',
                value: gridHtmlParams.monoCellSize,
                updateValue: gridHtmlControls.updateMonoCellSize
              },
              {
                tag: 'input',
                name: 'override-border-radius',
                label: t('menu.groups.htmlGridParams.overrideBorderRadius.label'),
                type: 'number',
                value: gridHtmlParams.overrideBorderRadius,
                updateValue: gridHtmlControls.updateOverrideBorderRadius
              },
              {
                tag: 'input',
                name: 'override-horizontal-gap-px',
                label: t('menu.groups.htmlGridParams.overrideHorizontalGapPx.label'),
                type: 'number',
                value: gridHtmlParams.overrideHorizontalGapPx,
                updateValue: gridHtmlControls.updateOverrideHorizontalGapPx
              },
              {
                tag: 'input',
                name: 'override-vertical-gap-px',
                label: t('menu.groups.htmlGridParams.overrideVerticalGapPx.label'),
                type: 'number',
                value: gridHtmlParams.overrideVerticalGapPx,
                updateValue: gridHtmlControls.updateOverrideVerticalGapPx
              },
              {
                tag: 'input',
                name: 'override-span-width-factor',
                label: t('menu.groups.htmlGridParams.overrideSpanWidthFactor.label'),
                type: 'number',
                value: gridHtmlParams.overrideSpanWidthFactor,
                updateValue: gridHtmlControls.updateOverrideSpanWidthFactor
              },
              {
                tag: 'input',
                name: 'left-correction-px',
                label: t('menu.groups.htmlGridParams.leftCorrectionPx.label'),
                type: 'number',
                value: gridHtmlParams.leftCorrectionPx,
                updateValue: gridHtmlControls.updateLeftCorrectionPx
              },
              {
                tag: 'input',
                name: 'top-correction-px',
                label: t('menu.groups.htmlGridParams.topCorrectionPx.label'),
                type: 'number',
                value: gridHtmlParams.topCorrectionPx,
                updateValue: gridHtmlControls.updateTopCorrectionPx
              }
            ]}
          />
          <MenuItemGroup
            title={t('menu.groups.previewBackgroundParams.title')}
            tag='li'
            foldable={true}
            defaultFolded={true}
            style={{ width: '18rem' }}
            items={[
              {
                tag: 'input',
                name: 'background-colors-bound',
                label: t('menu.groups.previewBackgroundParams.backgroundColorsBound.label'),
                type: 'checkbox',
                value: values.backgroundColorsBound,
                updateValue: valueHandlers.updateBackgroundColorsBound
              },
              {
                tag: 'input',
                name: 'canvas-background-color',
                label: t('menu.groups.previewBackgroundParams.canvasBackgroundColor.label'),
                type: 'color',
                defaultFolded: true,
                value: values.canvasBackgroundColor,
                updateValue: valueHandlers.updateCanvasBackgroundColor
              },
              {
                tag: 'input',
                name: 'html-background-color',
                label: t('menu.groups.previewBackgroundParams.htmlBackgroundColor.label'),
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
              title={t('menu.inputs.alwaysRecalc.tooltip')}
            >
              {t('menu.inputs.alwaysRecalc.label')}
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
              title={t('menu.inputs.alwaysRedrawCanvas.tooltip')}
            >
              {t('menu.inputs.alwaysRedrawCanvas.label')}
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
              title={t('menu.inputs.alwaysRedrawHtml.tooltip')}
            >
              {t('menu.inputs.alwaysRedrawHtml.label')}
            </label>
          </li>
          <li className="button-container">
            <button className="button" onClick={handleRecalcGrid}>{t('menu.buttons.recalculateGrid.label')}</button>
            <button className="button" onClick={handleRedrawGridPreview}>{t('menu.buttons.redrawCanvasPreview.label')}</button>
            <button className="button" onClick={handleRedrawGridHtmlPreview}>{t('menu.buttons.redrawHtmlPreview.label')}</button>
            <button className="button" onClick={handlePlayAnimation}>{t('menu.buttons.playAnimation.label')}</button>
            <button className="button" onClick={handleSaveJSONClick}>{t('menu.buttons.saveJson.label')}</button>
            <button className="button" onClick={handleSaveHTMLClick}>{t('menu.buttons.saveHtml.label')}</button>
            <button className="button" onClick={handleSaveCSSClick}>{t('menu.buttons.saveCss.label')}</button>
          </li>
        </ul>
      </nav>
    </>
  );

};

Menu.displayName = 'Menu';

export { Menu };