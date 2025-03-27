import {useEffect, RefObject} from 'react';
import {getPitch} from '../function/getPitch';
import {CONFIG} from '../types/configTypes';
import {drawBackground} from '../function/canvasDefault';

function useCanvasInitializeGetPitch(
  config: CONFIG,
  setPitch: (num: number | null) => void,
  updateCanvasHeight: () => void,
  setPlayingPause: () => void,
  canvasRef: RefObject<HTMLCanvasElement>,
  initialRange: number[],
  showNotes: boolean,
  dashedLineColor: string
) {
  useEffect(() => {
    setPlayingPause();
    updateCanvasHeight();
    drawBackground(
      canvasRef,
      initialRange[1],
      initialRange[0],
      showNotes,
      dashedLineColor
    );
    //get pitch
    let cleanup: () => void;
    window.addEventListener('resize', updateCanvasHeight);
    (async () => {
      cleanup = await getPitch(config, setPitch);
    })();

    return () => {
      cleanup && cleanup();
      window.removeEventListener('resize', updateCanvasHeight);
    };
  }, []);
}

export default useCanvasInitializeGetPitch;
