import {useEffect, RefObject} from 'react';
import {drawBackground} from '../function/canvasDefault';

function useCanvasChangeHzAndNotes(
  setShowNotes: (boo: boolean) => void,
  showNotes: boolean,
  showNotesPar: boolean,
  canvasRef: RefObject<HTMLCanvasElement>,
  initialRange: number[],
  dashedLineColor: string
) {
  useEffect(() => {
    setShowNotes(showNotesPar);
    const canvas = canvasRef.current;
    if (canvas && canvas.getContext) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width / 24, canvas.height);
        drawBackground(
          canvasRef,
          initialRange[1],
          initialRange[0],
          !showNotes,
          dashedLineColor
        );
      }
    }
  }, [showNotesPar]);
}

export default useCanvasChangeHzAndNotes;
