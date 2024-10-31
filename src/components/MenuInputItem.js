import { MenuColorPickerItem } from './MenuColorPickerItem.js';

/**
 * @typedef {import('../index.d.ts').MenuItem} MenuItem
 */

/**
 * @param {{ item: MenuItem }} params
 */

const MenuInputItem = ({
  item
}) => {

  if (item.type === 'checkbox') {
    return MenuCheckboxItem({ item });
  }

  if (item.type === 'color') {
    return MenuColorPickerItem({ item });
  }

  let onChange = (e) => {
    item.updateValue(e.target.value);
  };

  if (item.type === 'number') {
    onChange = (e) => {
      item.updateValue(Number(e.target.value));
    };
  }

  return (
    <div className={`${item.type}-input`}>
      <label
        htmlFor={`${item.type}-${item.name}`}
        className={`${item.type}-input__label`}
        title={item.tooltip}
        style={item.labelStyle}
      >
        {item.label}
      </label>
      <input
        id={`${item.type}-${item.name}`}
        type={item.type}
        name={`${item.type}-${item.name}`}
        className={`${item.type}-input__field`}
        ref={item.ref}
        style={item.style}
        value={item.value}
        onChange={onChange}
        disabled={item.disabled}
      />
    </div>
  );
};

// const MenuColorItem = ({ item }) => {
//   return (
//     <div className={`${item.type}-input`}>
//       <input
//         id={`${item.type}-${item.name}`}
//         type={item.type}
//         name={`${item.type}-${item.name}`}
//         className={`${item.type}-input__field`}
//         ref={item.ref}
//         style={item.style}
//         value={item.value}
//         onChange={(e) => item.updateValue(e.target.value)}
//         disabled={item.disabled}
//       />
//       <label
//         htmlFor={`${item.type}-${item.name}`}
//         className={`${item.type}-input__label`}
//         title={item.tooltip}
//         style={item.labelStyle}
//       >
//         {item.label}
//       </label>
//     </div>
//   );
// };

const MenuCheckboxItem = ({ item }) => {
  return (
    <div className={`${item.type}-input`}>
      <input
        id={`${item.type}-${item.name}`}
        type={item.type}
        name={`${item.type}-${item.name}`}
        className={`${item.type}-input__field`}
        ref={item.ref}
        style={item.style}
        checked={item.value}
        onChange={(e) => item.updateValue(e.target.checked)}
        disabled={item.disabled}
      />
      <label
        htmlFor={`${item.type}-${item.name}`}
        className={`${item.type}-input__label`}
        title={item.tooltip}
        style={item.labelStyle}
      >
        {item.label}
      </label>
    </div>
  );
};

MenuInputItem.displayName = 'MenuInputItem';

export { MenuInputItem };