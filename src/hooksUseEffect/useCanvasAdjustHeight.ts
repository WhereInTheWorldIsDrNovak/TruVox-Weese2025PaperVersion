import {useEffect, RefObject} from 'react';

function useCanvasAdjustHeight(
  canvasRef: RefObject<HTMLCanvasElement>,
  setCanvasHeight: (num: number) => void
) {
  useEffect(() => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setCanvasHeight(rect.height);
    }
  }, []);
}

export default useCanvasAdjustHeight;
