import {useEffect} from 'react';
import {getPitch} from '../function/getPitch';
import {CONFIG} from '../types/configTypes';

function useInitializeGetPitch(
  config: CONFIG,
  setPitch: (num: number | null) => void
) {
  useEffect(() => {
    //get pitch
    let cleanup: () => void;
    (async () => {
      cleanup = await getPitch(config, setPitch);
    })();

    return () => {
      cleanup && cleanup();
    };
  }, []);
}

export default useInitializeGetPitch;
