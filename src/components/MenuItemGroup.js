import { useState } from 'react';
import { MenuTextItem } from './MenuTextItem.js';
import { MenuInputItem } from './MenuInputItem.js';
import { MenuSelectItem } from './MenuSelectItem.js';

/**
 * @typedef {import('../index.d.ts').MenuItem} MenuItem
 */

/**
 * @param {{ items: MenuItem[], tag: 'div' | 'li', title: string, foldable: boolean, defaultFolded: boolean, style?: any }} params
 */

const MenuItemGroup = ({
  items,
  tag,
  title,
  foldable,
  defaultFolded,
  style
}) => {

  const [folded, setFolded] = useState(defaultFolded ? defaultFolded : false);

  const onClick = () => {
    if (!foldable) {
      return;
    }
    setFolded((prev) => !prev);
  };

  const foldSymbol = foldable
    ? folded ? ' ▾' : ' ▴'
    : '';

  return (
    tag === 'div'
      ? <div
        className={
          'container flex column gap-1rem bg-lightgray padding-1rem border-black-1px margin-v-1rem' +
          (foldable ? ' foldable' : '') +
          (folded ? ' folded' : '')
        }
        style={style}
      >
        <div className='title' onClick={onClick}>{title + foldSymbol}</div>
        {folded ? null : <MenuItemGroupContents items={items} />}
      </div>
      : <li
        className={
          'container flex column gap-1rem bg-lightgray padding-1rem border-black-1px margin-v-1rem' +
          (foldable ? ' foldable' : '') +
          (folded ? ' folded' : '')
        }
        style={style}
      >
        <div className='title' onClick={onClick}>{title + foldSymbol}</div>
        {folded ? null : <MenuItemGroupContents items={items} />}
      </li>
  );
};

const MenuItemGroupContents = ({
  items
}) => {

  if (items.length === 0) {
    return null;
  }

  const renderList = [];

  for (const item of items) {
    switch (item.tag) {
    case 'div':
      renderList.push(
        <MenuTextItem key={`${item.type}-${item.name}`} item={item}/>
      );
      break;
    case 'input':
      renderList.push(
        <MenuInputItem key={`${item.type}-${item.name}`} item={item} />
      );
      break;
    case 'select':
      renderList.push(
        <MenuSelectItem key={`${item.type}-${item.name}`} item={item} />
      );
      break;
    default:
      throw new Error('Unknown tag: ' + item.tag);
    }
  }

  return renderList;
};

MenuItemGroup.displayName = 'MenuItemGroup';

export { MenuItemGroup };