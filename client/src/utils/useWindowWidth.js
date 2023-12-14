import { useEffect, useState } from 'react';

const useWindowWidth = () => {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const updateWidth = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener('resize', updateWidth);
    updateWidth();
    return () => window.removeEventListener('resize', updateWidth);
  }, []);
  return width;
};

export default useWindowWidth;
