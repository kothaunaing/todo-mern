import { useEffect, useRef, useState } from "react";

const useClickOutside = () => {
  const [show, setShow] = useState(false);
  const showRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (showRef.current && !showRef.current.contains(event.target as Node)) {
        setShow(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const toggleShow = () => {
    setShow((prev) => !prev);
  };

  return { show, toggleShow, showRef };
};

export default useClickOutside;
