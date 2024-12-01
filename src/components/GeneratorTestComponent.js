import { useEffect, useRef } from 'react';
import { Generator } from '../utils/generator';

export const GeneratorTestComponent = () => {

  const generatorTestCanvasRef = useRef(null);

  // const possibleValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  // const possibleValues = [1, 2, 3];
  const possibleValues = ['#AABBFF50', '#BBFFAA50', '#FFAAFF50', '#FFBBAA50'];



  const generator = new Generator({
    seed: 98564,
    possibleValues,
    // estimated: 2.35,
    estimatedIndex: 1,
    testCanvasRef: generatorTestCanvasRef
  });

  useEffect(() => {
    generator.test(generatorTestCanvasRef);
  });

  return (
    <canvas
      ref={generatorTestCanvasRef}
      id='generator-test-canvas'
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 50000,
        border: '1px solid red',
      }}
    />
  );
};