import {useEffect, useRef, RefObject} from 'react';
import {map} from '../function/canvasDefault';

// const canvasRef = useRef<HTMLCanvasElement>(null);
function useCanvasMouseText(
  canvasRef: RefObject<HTMLCanvasElement>,
  mouseHeight: number,
  initialRange: number[],
  textColor: string
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.font = '16px Arial';
        ctx.fillStyle = textColor;
        // canvas.width = 1400
        // canvas.height = 400
        const textX = canvas.width - 180; // 1300
        const textY = 20;
        const mappedHeight = map(
          mouseHeight,
          0,
          100,
          initialRange[1],
          initialRange[0]
        );
        const text = `Current Pitch: ${mappedHeight.toFixed(2)} Hz`;
        // (1295, -1) -> (91, 26)
        // console.log(ctx.measureText(text).width);
        // ctx.clearRect(textX - 5, textY - 21, ctx.measureText(text).width + 10, 26);
        ctx.clearRect(textX - 5, 0, canvas.width, 23);

        ctx.fillText(text, textX, textY);
      }
    }
  }, [mouseHeight, initialRange]);
}

export default useCanvasMouseText;
