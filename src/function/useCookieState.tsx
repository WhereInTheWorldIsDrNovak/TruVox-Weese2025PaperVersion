import {useState, useEffect} from 'react';
import Cookies from 'js-cookie';

function useCookieState<T>(
  key: string,
  defaultValue: T = null as unknown as T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    const cookieValue = Cookies.get(key);
    return cookieValue ? JSON.parse(cookieValue) : defaultValue;
  });

  useEffect(() => {
    Cookies.set(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}

export default useCookieState;
