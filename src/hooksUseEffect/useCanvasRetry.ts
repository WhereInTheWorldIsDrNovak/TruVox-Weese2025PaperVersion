import {useEffect} from 'react';

function useCanvasRetry(
  isRetry: boolean,
  divisor: number,
  setPlayingPause: () => void,
  resetStatesFull: () => void
) {
  useEffect(() => {
    setPlayingPause();
    resetStatesFull();
  }, [isRetry, divisor]);
}

export default useCanvasRetry;
