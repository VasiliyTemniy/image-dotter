import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const ImageInit = ({
  inputCanvasRef,
  outputCanvasRef,
  updatePipetteColor,
  layoutParams,
  layoutControls,
}) => {

  const { t } = useTranslation();

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
    <div className='container width-fit-content'>
      <div className='container flex column padding-1rem gap-1rem'>
        <div className="checkbox-input">
          <input
            id="stretch-canvas"
            type="checkbox"
            name="stretch-canvas"
            className="checkbox-input__field"
            checked={layoutParams.stretchCanvas}
            onChange={(e) => layoutControls.updateStretchCanvas(e.target.checked)}
          />
          <label
            htmlFor="stretch-canvas"
            className="checkbox-input__label"
          >
            {t('layout.options.stretchCanvas')}
          </label>
        </div>
        <div className="checkbox-input">
          <input
            id="screen-overflow"
            type="checkbox"
            name="screen-overflow"
            className="checkbox-input__field"
            checked={layoutParams.screenOverflow}
            onChange={(e) => layoutControls.updateScreenOverflow(e.target.checked)}
          />
          <label
            htmlFor="screen-overflow"
            className="checkbox-input__label"
          >
            {t('layout.options.screenOverflow')}
          </label>
        </div>
        <div className="checkbox-input">
          <input
            id="fit-canvas-in-one-row"
            type="checkbox"
            name="fit-canvas-in-one-row"
            className="checkbox-input__field"
            checked={layoutParams.fitBothCanvasInOneRow}
            onChange={(e) => layoutControls.updateFitBothCanvasInOneRow(e.target.checked)}
          />
          <label
            htmlFor="fit-canvas-in-one-row"
            className="checkbox-input__label"
          >
            {t('layout.options.fitBothCanvasInOneRow')}
          </label>
        </div>
        <div className="checkbox-input">
          <input
            id="shift-main-by-menu"
            type="checkbox"
            name="shift-main-by-menu"
            className="checkbox-input__field"
            checked={layoutParams.shiftMainByMenu}
            onChange={(e) => layoutControls.updateShiftMainByMenu(e.target.checked)}
          />
          <label
            htmlFor="shift-main-by-menu"
            className="checkbox-input__label"
          >
            {t('layout.options.shiftMainByMenu')}
          </label>
        </div>
      </div>
      <div className={`container ${layoutParams.fitBothCanvasInOneRow ? 'flex wrap' : 'flex column'}`}>
        <div className='container padding-1rem border-black-1px width-fit-content bg-main margin-1rem'>
          <div className='title'>
            {t('layout.inputCanvas.title')}
          </div>
          <canvas
            id="input-canvas"
            width="500"
            height="100"
            ref={inputCanvasRef}
          >
            {t('layout.canvasSupportAlt')}
          </canvas>
        </div>
        <div className='container padding-1rem border-black-1px width-fit-content bg-main margin-1rem'>
          <div className='title'>
            {t('layout.outputCanvas.title')}
          </div>
          <canvas
            id="output-canvas"
            width="500"
            height="100"
            ref={outputCanvasRef}
          >
            {t('layout.canvasSupportAlt')}
          </canvas>
        </div>
      </div>
    </div>
  );
};

ImageInit.displayName = 'ImageInit';

export { ImageInit };
