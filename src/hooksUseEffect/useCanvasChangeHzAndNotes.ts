import {useEffect, RefObject} from 'react';
import {
  drawBackground,
  generateNotesAndFrequencies,
} from '../function/canvasDefault';

function useCanvasChangeHzAndNotes(
  setShowNotes: (boo: boolean) => void,
  showNotes: boolean,
  showNotesPar: boolean,
  canvasRef: RefObject<HTMLCanvasElement>,
  initialRange: number[],
  setNotesLabel: (notes: string[]) => void,
  setFreqLabel: (freq: string[]) => void,
  canvasHeight: number,
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

  useEffect(() => {
    const {notes, frequencies} = generateNotesAndFrequencies(
      initialRange[0],
      initialRange[1]
    );
    setNotesLabel(notes);
    setFreqLabel(frequencies);
  }, [showNotesPar, initialRange]);
}

export default useCanvasChangeHzAndNotes;
