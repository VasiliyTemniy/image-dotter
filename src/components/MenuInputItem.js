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

  if (item.type === 'switch') {
    return MenuSwitchItem({ item });
  }

  if (item.type === 'color') {
    return MenuColorPickerItem({ item });
  }

  if (item.metaType === 'generator-group') {
    return MenuInputGeneratorGroupItem({ item });
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

/**
 * @param {{ item: MenuItem }} params
 */
const MenuInputGeneratorGroupItem = ({ item }) => {
  return (
    <div className='input-group-tight-three'>
      <label
        className={`${item.type}-input__label`}
        title={item.tooltip}
        style={item.labelStyle}
      >
        {item.label}
      </label>
      <div className='input-group-tight-three__items'>
        <div className={`${item.type}-input`}>
          <label
            htmlFor={`${item.type}-${item.name}-estimated`}
            className={`${item.type}-input__label`}
          >
            Estimated
          </label>
          <input
            id={`${item.type}-${item.name}-estimated`}
            type={item.type}
            name={`${item.type}-${item.name}-estimated`}
            className={`${item.type}-input__field`}
            style={item.style}
            value={item.value.estimated}
            onChange={(e) => item.updateValue.estimated(Number(e.target.value))}
            disabled={item.disabled}
          />
        </div>
        <div className={`${item.type}-input`}>
          <label
            htmlFor={`${item.type}-${item.name}-min`}
            className={`${item.type}-input__label`}
          >
            Min
          </label>
          <input
            id={`${item.type}-${item.name}-min`}
            type={item.type}
            name={`${item.type}-${item.name}-min`}
            className={`${item.type}-input__field`}
            style={item.style}
            value={item.value.min}
            onChange={(e) => item.updateValue.min(Number(e.target.value))}
            disabled={item.disabled}
          />
        </div>
        <div className={`${item.type}-input`}>
          <label
            htmlFor={`${item.type}-${item.name}-max`}
            className={`${item.type}-input__label`}
          >
            Max
          </label>
          <input
            id={`${item.type}-${item.name}-max`}
            type={item.type}
            name={`${item.type}-${item.name}-max`}
            className={`${item.type}-input__field`}
            style={item.style}
            value={item.value.max}
            onChange={(e) => item.updateValue.max(Number(e.target.value))}
            disabled={item.disabled}
          />
        </div>
      </div>
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

/**
 * @param {{ item: MenuItem }} params
 */
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

/**
 * @param {{ item: MenuItem }} params
 */
const MenuSwitchItem = ({ item }) => {
  return (
    <div className={`${item.type}-input`}>
      <input
        id={`${item.type}-${item.name}`}
        type="checkbox"
        name={`${item.type}-${item.name}`}
        className={`${item.type}-input__field`}
        ref={item.ref}
        style={item.style}
        defaultChecked={item.value}
        disabled={item.disabled}
      />
      <label
        className={`${item.type}-input__label`}
        htmlFor={`${item.type}-${item.name}`}
        onClick={(e) => item.updateValue(e.target.checked)}
      >
        {
          item.svgLeft &&
          <item.svgLeft className={`${item.type}-input__label__left`} />
        }
        {
          item.svgRight &&
          <item.svgRight className={`${item.type}-input__label__right`} />
        }
        <span
          className={`${item.type}-input__label__inner`}
          data-textleft={!item.svgLeft ? item.textLeft : ''}
          data-textright={!item.svgRight ? item.textRight : ''}
        />
        <span className={`${item.type}-input__label__thumb`} />
      </label>
    </div>
  );
};

MenuInputItem.displayName = 'MenuInputItem';

export { MenuInputItem };