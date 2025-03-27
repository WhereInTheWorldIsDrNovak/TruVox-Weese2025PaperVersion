import {useEffect} from 'react';

function useCanvasUpdatePitch(
  isPlaying: boolean,
  pitch: number | null,
  updateBallY: (num: number) => void
) {
  useEffect(() => {
    if (isPlaying) {
      if (pitch !== null) {
        updateBallY(pitch);
      }
    }
  }, [pitch]);
}

export default useCanvasUpdatePitch;
