import { useState } from 'react';

export const ColorPicker = ({ item }) => {

  const [tempColor, setTempColor] = useState(item.value);

  const updateTempColor = (value) => {
    setTempColor(value);
    if (value.length === 9) {
      item.updateValue(value);
    }
  };

  return (
    <div className='container padding-1rem border-black-1px margin-v-1rem width-fit-content bg-lightgray color-picker'>
      <div className="title">{item.label}</div>
      <div className="container flex align-center gap-05rem">
        <span className='color-input'>
          <input
            id={`color-${item.name}`}
            type='color'
            name={`color-${item.name}`}
            className='color-input__field'
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
            style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
            value={tempColor.toUpperCase()}
            onChange={(e) => updateTempColor(e.target.value)}
            onBlur={() => tempColor.length < 9 ? setTempColor(item.value) : void 0}
            disabled={item.disabled}
          />
        </span>
      </div>
      <div className='container flex align-center gap-05rem color-alpha-input'>
        <span>&nbsp;&nbsp;Alpha:</span>
        <input
          type='range'
          name={`color-alpha-${item.name}`}
          className='color-alpha-input__field'
          min="0"
          max="255"
          step="1"
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