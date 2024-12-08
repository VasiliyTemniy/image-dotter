import { drawImage } from '../utils/dottergrid';
import { getLocalStorageMap, setLocalStorageMap } from '../utils/storage';
import { useState } from 'react';

/**
 * @typedef {import('../index.d.ts').LayoutParams} LayoutParams
 */

/**
 * @type {LayoutParams}
 */
const layoutParams = getLocalStorageMap('image-dotter-layout-settings', {
  stretchCanvas: true,
  screenOverflow: false,
  fitBothCanvasInOneRow: false,
  shiftMainByMenu: true
});

/**
 *
 * @param {Image | null | undefined} image
 * @param {React.MutableRefObject<undefined | HTMLCanvasElement>} inputCanvasRef
 * @param {(changedParams: LayoutParams, changedOtherParams: {
 *   localWidth: number,
 *   localHeight: number,
 *   localMenuOpen: boolean
 * }) => { localRowsCount: number, localColumnsCount: number }} resizeCanvas
 * @param {(changedGridParams: GridParams, changedGeneratorParams: GeneratorParams) => void} redrawGridPreview
 */
export const useLayoutConfig = (
  image,
  inputCanvasRef,
  resizeCanvas,
  redrawGridPreview,
) => {

  const [stretchCanvas, setStretchCanvas] = useState(layoutParams.stretchCanvas);
  const [screenOverflow, setScreenOverflow] = useState(layoutParams.screenOverflow);
  const [fitBothCanvasInOneRow, setFitBothCanvasInOneRow] = useState(layoutParams.fitBothCanvasInOneRow);
  const [shiftMainByMenu, setShiftMainByMenu] = useState(layoutParams.shiftMainByMenu);

  const updateStretchCanvas = (value) => {
    setStretchCanvas(value);
    setLocalStorageMap('image-dotter-layout-settings', {
      ...layoutParams,
      stretchCanvas: value
    });

    resizeCanvas({ stretchCanvas: value }, {});
    drawImage(image, inputCanvasRef);
    redrawGridPreview({});
  };

  const updateScreenOverflow = (value) => {
    setScreenOverflow(value);
    setLocalStorageMap('image-dotter-layout-settings', {
      ...layoutParams,
      screenOverflow: value
    });
    if (!inputCanvasRef.current) {
      return;
    }
    if (value && !inputCanvasRef.current.parentElement.classList.contains('overflow-x-scroll')) {
      inputCanvasRef.current.parentElement.classList.add('overflow-x-scroll');
    } else if (!value && inputCanvasRef.current.parentElement.classList.contains('overflow-x-scroll')) {
      inputCanvasRef.current.parentElement.classList.remove('overflow-x-scroll');
    }

    resizeCanvas({ screenOverflow: value }, {});
    drawImage(image, inputCanvasRef);
    redrawGridPreview({});
  };

  const updateFitBothCanvasInOneRow = (value) => {
    setFitBothCanvasInOneRow(value);
    setLocalStorageMap('image-dotter-layout-settings', {
      ...layoutParams,
      fitBothCanvasInOneRow: value
    });

    resizeCanvas({ fitBothCanvasInOneRow: value }, {});
    drawImage(image, inputCanvasRef);
    redrawGridPreview({});
  };

  const updateShiftMainByMenu = (value) => {
    setShiftMainByMenu(value);
    setLocalStorageMap('image-dotter-layout-settings', {
      ...layoutParams,
      shiftMainByMenu: value
    });

    resizeCanvas({ shiftMainByMenu: value }, {});
    drawImage(image, inputCanvasRef);
    redrawGridPreview({});
  };

  return {
    params: {
      stretchCanvas,
      screenOverflow,
      fitBothCanvasInOneRow,
      shiftMainByMenu
    },
    controls: {
      updateStretchCanvas,
      updateScreenOverflow,
      updateFitBothCanvasInOneRow,
      updateShiftMainByMenu
    }
  };
};