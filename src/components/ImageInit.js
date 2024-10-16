const ImageInit = () => {

  const topsideStyle = {
    border: '1px solid #000000',
    display: 'inline-block'
  };

  return (
    <>
      <canvas
        id="myCanvas"
        width="500"
        height="500"
        style={topsideStyle}
      >
        Your browser does not support the HTML5 canvas tag.
      </canvas>
      <canvas
        id="outputCanvas"
        width="500"
        height="500"
        style={topsideStyle}
      >
        Your browser does not support the HTML5 canvas tag.
      </canvas>
    </>
  );
};

export default ImageInit;
