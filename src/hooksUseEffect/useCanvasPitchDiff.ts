import {useEffect, useRef, RefObject} from 'react';
import {map} from '../function/canvasDefault';

// const canvasRef = useRef<HTMLCanvasElement>(null);
function useCanvasPitchDiff(
  canvasRef: RefObject<HTMLCanvasElement>,
  pitchDiff: number[],
  initialRange: number[],
  isDisplaying: boolean,
  textColor: string
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.font = '16px Arial';
        ctx.fillStyle = textColor;
        const textX = 5;
        const textY = 20;
        // const avgPitchDiff = pitchDiff.reduce((sum, current) => sum + current, 0) / pitchDiff.length;
        const avgPitchDiff = pitchDiff.reduce(
          (acc, current) => {
            if (!isNaN(current)) {
              acc.sum += current;
              acc.count++;
            }
            return acc;
          },
          {sum: 0, count: 0}
        );

        const averagePitchDiff =
          avgPitchDiff.count > 0 ? avgPitchDiff.sum / avgPitchDiff.count : 0;
        const text = `Average Pitch Diff: ${averagePitchDiff.toFixed(2)} Hz`;
        ctx.clearRect(0, 0, 235, 23);
        if (isDisplaying) {
          ctx.fillText(text, textX, textY);
        }
      }
    }
  }, [pitchDiff, initialRange]);
}

export default useCanvasPitchDiff;
