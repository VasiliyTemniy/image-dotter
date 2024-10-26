import { useState } from 'react';

const MenuColorPickerItem = ({ item }) => {

  const [tempColor, setTempColor] = useState(item.value);
  const [folded, setFolded] = useState(false);

  const foldSymbol = folded ? ' ▾' : ' ▴';

  const updateTempColor = (value) => {
    setTempColor(value);
    if (value.length === 9) {
      item.updateValue(value);
    }
  };

  if (folded) {
    return (
      <div
        className='container padding-1rem border-black-1px bg-lightgray color-picker foldable folded'
        style={{ width: '100%', marginBottom: '1.5rem' }}
      >
        <div className="title" onClick={() => setFolded(!folded)} style={item.labelStyle}>
          <span className='color-picker__sample' style={{ backgroundColor: item.value }}/>
          {item.label + foldSymbol}
        </div>
      </div>
    );
  }

  return (
    <div
      className='container padding-1rem border-black-1px width-fit-content bg-lightgray color-picker foldable'
      style={{ marginBottom: '1rem' }}
    >
      <div className="title" onClick={() => setFolded(!folded)} style={item.labelStyle}>
        <span className='color-picker__sample' style={{ backgroundColor: item.value }}/>
        {item.label + foldSymbol}
      </div>
      <div className="container flex align-center gap-1rem">
        <span className='color-input'>
          <input
            id={`color-${item.name}`}
            type='color'
            name={`color-${item.name}`}
            className='color-input__field'
            style={{ flexShrink: 0 }}
            value={item.value.substring(0, 7)}
            onChange={(e) => {
              const newColor = e.target.value + item.value.substring(7);
              item.updateValue(newColor);
              setTempColor(newColor);
            }}
            disabled={item.disabled}
          />
          <span className='color-element' style={{ backgroundColor: item.value }} />
        </span>
        <span className='text-input'>
          <input
            id={`text-${item.name}`}
            type='text'
            name={`text-${item.name}`}
            className='text-input__field'
            ref={item.ref}
            style={{ fontFamily: 'monospace', fontSize: '0.9rem', flexShrink: 1 }}
            value={tempColor.toUpperCase()}
            onChange={(e) => updateTempColor(e.target.value)}
            onBlur={() => tempColor.length < 9 ? setTempColor(item.value) : void 0}
            disabled={item.disabled}
          />
        </span>
      </div>
      <div className='container flex align-center gap-05rem color-alpha-input'>
        <span style={{ flexShrink: 0 }}>Alpha:</span>
        <input
          type='range'
          name={`color-alpha-${item.name}`}
          className='color-alpha-input__field'
          min="0"
          max="255"
          step="1"
          style={{ flexShrink: 1 }}
          value={parseInt(item.value.substring(7), 16)}
          onChange={(e) => {
            const newColor = item.value.substring(0, 7) + (Number(e.target.value) | (1 << 8)).toString(16).slice(1);
            item.updateValue(newColor);
            setTempColor(newColor);
          }}
          disabled={item.disabled}
        />
      </div>
    </div>
  );
};

MenuColorPickerItem.displayName = 'MenuColorPickerItem';

export { MenuColorPickerItem };