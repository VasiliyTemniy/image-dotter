/**
 * @typedef {import('../index.d.ts').MenuItem} MenuItem
 */

/**
 * @param {{ item: MenuItem }} params
 */
const MenuTextItem = ({
  item
}) => {
  return (
    <div
      id={`${item.type}-${item.name}`}
      name={`${item.type}-${item.name}`}
      className="menu-text-item"
      ref={item.ref}
      style={item.style}
      onClick={item.updateValue ? (e) => item.updateValue(e) : null} // not a e.target.value here - no target value in div
    >
      <pre>
        {item.value}
      </pre>
    </div>
  );
};

MenuTextItem.displayName = 'MenuTextItem';

export { MenuTextItem };