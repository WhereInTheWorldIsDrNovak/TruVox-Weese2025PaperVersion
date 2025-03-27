import {useEffect, RefObject} from 'react';
import {drawBackground} from '../function/canvasDefault';

function useCanvasRedrawBackground(
  canvasRef: RefObject<HTMLCanvasElement>,
  showNotes: boolean,
  initialRange: number[],
  dashedLineColor: string
) {
  useEffect(() => {
    drawBackground(
      canvasRef,
      initialRange[1],
      initialRange[0],
      showNotes,
      dashedLineColor
    ); // Make sure the background is redrawn on state change
  }, [showNotes]);
}

export default useCanvasRedrawBackground;
