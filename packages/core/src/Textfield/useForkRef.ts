import React from 'react';

export function useForkRef<T>(
  refA: React.Ref<T> | null | undefined, 
  refB: React.Ref<T> | null | undefined
): React.Ref<T> {
  return React.useMemo(() => {
    if (refA == null && refB == null) {
      return null;
    }
    return (refValue: T) => {
      if (typeof refA === 'function') {
        refA(refValue);
      } else if (refA) {
        (refA as React.MutableRefObject<T | null>).current = refValue;
      }

      if (typeof refB === 'function') {
        refB(refValue);
      } else if (refB) {
        (refB as React.MutableRefObject<T | null>).current = refValue;
      }
    };
  }, [refA, refB]);
}
