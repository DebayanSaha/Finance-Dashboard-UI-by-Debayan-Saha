import { useState, useEffect } from "react";

/**
 * Returns `true` for `duration` ms, then flips to `false`.
 * Each page mounts fresh so the skeleton always shows on navigation.
 */
const useLoading = (duration = 1200) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  return loading;
};

export default useLoading;