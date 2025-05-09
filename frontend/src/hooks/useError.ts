import { useEffect, useRef, useState } from "react";

const useError = () => {
  const [error, setError] = useState<string | null>(null);
  const errorIdRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (errorIdRef.current) {
        clearTimeout(errorIdRef.current);
      }
    };
  }, []);

  const showError = (text: string) => {
    setError(text);

    if (errorIdRef.current) {
      clearTimeout(errorIdRef.current);
    }

    errorIdRef.current = setTimeout(() => {
      setError(null);
    }, 5000);
  };

  return { error, showError };
};

export default useError;
