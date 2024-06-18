import { useEffect } from 'react';

export default function useDebounceEffect(fn, waitTime, DependencyList) {
  useEffect(() => {
    const t = setTimeout(() => {
      fn.apply(undefined, DependencyList);
    }, waitTime);

    return () => {
      clearTimeout(t);
    };
  }, [DependencyList]);
}
