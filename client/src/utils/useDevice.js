import { useEffect, useState } from 'react';
import { TABLET_BREAKPOINT, DESKTOP_BREAKPOINT } from './constants';

const useDevice = () => {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const updateWidth = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener('resize', updateWidth);
    updateWidth();
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  return {
    isMobile: width < TABLET_BREAKPOINT,
    isTablet: width >= TABLET_BREAKPOINT && width < DESKTOP_BREAKPOINT,
    isDesktop: width >= DESKTOP_BREAKPOINT,
  };
};

export default useDevice;
