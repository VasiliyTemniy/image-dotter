import { useEffect } from 'react';

const ImageInit = ({ inputCanvasRef, outputCanvasRef, updatePipetteColor }) => {

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
    <>
      <canvas
        id="input-canvas"
        width="500"
        height="500"
        ref={inputCanvasRef}
        style={topsideStyle}
      >
        Your browser does not support the HTML5 canvas tag.
      </canvas>
      <canvas
        id="output-canvas"
        width="500"
        height="500"
        ref={outputCanvasRef}
        style={topsideStyle}
      >
        Your browser does not support the HTML5 canvas tag.
      </canvas>
    </>
  );
};

export default ImageInit;
