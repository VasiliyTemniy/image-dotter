import { useTranslation } from 'react-i18next';
import { MenuInputItem } from './MenuInputItem';

/**
 * @param {{
 *    palette: string[],
 *    updatePalette: (value, action, index) => void
 * }} params
 * @returns
 */
export const MenuPaletteItem = ({ palette, updatePalette }) => {

  const { t } = useTranslation();

  return (
    <div className='container flex column gap-05rem'>
      {palette.map((color, i) => (
        <div
          key={`palette-${i}`}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
          }}
        >
          <MenuInputItem
            item={{
              tag: 'input',
              name: `palette-${i}`,
              label: ` ${i + 1}: ${color.toUpperCase()}`,
              type: 'color',
              value: color,
              updateValue: (value) => updatePalette(value, 'replace', i),
              labelStyle: {
                fontFamily: 'monospace',
                top: '-0.7rem',
                padding: '2px 2px 3px 6px'
              }
            }}
          />
          <button
            className="button"
            onClick={() => updatePalette(color, 'remove', i)}
            style={{ padding: '0.25rem', top: '-0.8rem' }}
          >
            [X]
          </button>
        </div>
      ))}
      <button className="button" onClick={() => updatePalette('#ffffffff', 'add', null)}>
        {t('inputs.palette.buttons.add.label')}
      </button>
    </div>
  );
};