import { useEffect, useState } from 'react';

const ImageInit = ({ inputCanvasRef, outputCanvasRef, updatePipetteColor }) => {

  const [stretchCanvas, setStretchCanvas] = useState(true);
  const [screenOverflow, setScreenOverflow] = useState(false);

  const topsideStyle = {
    border: '1px solid #000000',
    display: 'inline-block'
  };

  const handleMouseMove = (e, canvasRef) => {
    if (!canvasRef.current) {
      return;
    }
    const context = canvasRef.current.getContext('2d', { willReadFrequently: true });
    const x = e.offsetX;
    const y = e.offsetY;
    const data = context.getImageData(x, y, 1, 1).data;
    updatePipetteColor(data);
  };

  const handleInputCanvasMouseMove = (e) => {
    handleMouseMove(e, inputCanvasRef);
  };

  const handleOutputCanvasMouseMove = (e) => {
    handleMouseMove(e, outputCanvasRef);
  };

  useEffect(() => {
    if (!inputCanvasRef.current || !outputCanvasRef.current) {
      return;
    }

    inputCanvasRef.current.removeEventListener('mousemove', handleInputCanvasMouseMove);
    outputCanvasRef.current.removeEventListener('mousemove', handleOutputCanvasMouseMove);

    inputCanvasRef.current.addEventListener('mousemove', handleInputCanvasMouseMove);
    outputCanvasRef.current.addEventListener('mousemove', handleOutputCanvasMouseMove);
  }, []);

  return (
    <div className='container flex column gap-1rem'>
      <div className='container flex column padding-1rem gap-1rem'>
        <div className="checkbox-input">
          <input
            id="stretch-canvas"
            type="checkbox"
            name="stretch-canvas"
            className="checkbox-input__field"
            checked={stretchCanvas}
            onChange={(e) => setStretchCanvas(e.target.checked)}
          />
          <label
            htmlFor="stretch-canvas"
            className="checkbox-input__label"
          >
            Stretch canvas width if image is less than screen width
          </label>
        </div>
        <div className="checkbox-input">
          <input
            id="screen-overflow"
            type="checkbox"
            name="screen-overflow"
            className="checkbox-input__field"
            checked={screenOverflow}
            onChange={(e) => setScreenOverflow(e.target.checked)}
          />
          <label
            htmlFor="screen-overflow"
            className="checkbox-input__label"
          >
            Add horizontal scrollbar if image is wider than screen width
          </label>
        </div>
      </div>
      <div className='container padding-1rem border-black-1px width-fit-content bg-white'>
        <div className='title'>
          Input image canvas
        </div>
        <canvas
          id="input-canvas"
          width="500"
          height="500"
          ref={inputCanvasRef}
          style={topsideStyle}
        >
          Your browser does not support the HTML5 canvas tag.
        </canvas>
      </div>
      <div className='container padding-1rem border-black-1px width-fit-content bg-white'>
        <div className='title'>
          Output grid preview canvas
        </div>
        <canvas
          id="output-canvas"
          width="500"
          height="500"
          ref={outputCanvasRef}
          style={topsideStyle}
        >
          Your browser does not support the HTML5 canvas tag.
        </canvas>
      </div>
    </div>
  );
};

export default ImageInit;
