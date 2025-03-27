import {useEffect, RefObject} from 'react';

function useCanvasCurrentPitch(
  canvasRef: RefObject<HTMLCanvasElement>,
  pitch: number | null,
  pitchHistory: number[],
  setPitchHistory: React.Dispatch<React.SetStateAction<number[]>>,
  initialRange: number[],
  textColor: string
) {
  useEffect(() => {
    if (pitch !== null) {
      // console.log(pitch);
      if (pitch > 1) {
        setPitchHistory(prevHistory => {
          const updatedHistory = [pitch, ...prevHistory];
          if (updatedHistory.length > 50) {
            updatedHistory.pop();
          }
          return updatedHistory;
        });
      }
    }
  }, [pitch]);

  useEffect(() => {
    const canvas = canvasRef.current;
    let pitch = 0;
    if (pitchHistory.length > 0) {
      pitch = pitchHistory[0];
    }
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.font = '16px Arial';
        ctx.fillStyle = textColor;
        // canvas.width = 1400
        // canvas.height = 400
        const textX = canvas.width - 180; // 1300
        const textY = 20;
        let text = 'Current Pitch: 0.00 Hz';
        if (pitch === null) {
          text = 'Current Pitch: 0.00 Hz';
        } else if (pitch < 1) {
          text = 'Current Pitch: 0.00 Hz';
        } else {
          text = `Current Pitch: ${pitch.toFixed(2)} Hz`;
        }
        // (1295, -1) -> (91, 26)
        // console.log(ctx.measureText(text).width);
        // ctx.clearRect(textX - 5, textY - 21, ctx.measureText(text).width + 10, 26);
        ctx.clearRect(textX - 5, 0, canvas.width, 23);

        ctx.fillText(text, textX, textY);
      }
    }
  }, [pitchHistory, initialRange]);
}

export default useCanvasCurrentPitch;
