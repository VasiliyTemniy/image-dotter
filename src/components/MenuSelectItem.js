/**
 * @typedef {import('../index.d.ts').MenuItem} MenuItem
 */

/**
 * @param {{ item: MenuItem }} params
 */

const MenuSelectItem = ({
  item
}) => {
  if (!item.options) {
    throw new Error('options must be defined for select items');
  }

  return (
    <div className="select-input">
      <label
        htmlFor={`${item.type}-${item.name}`}
        className="select-input__label"
        title={item.tooltip}
      >
        {item.label}
      </label>
      <select
        id={`${item.type}-${item.name}`}
        name={`${item.type}-${item.name}`}
        className="select-input__field"
        ref={item.ref}
        style={item.style}
        value={item.value}
        onChange={(e) => item.updateValue(e.target.value)}
        disabled={item.disabled}
      >
        {item.options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
};

MenuSelectItem.displayName = 'MenuSelectItem';

export { MenuSelectItem };