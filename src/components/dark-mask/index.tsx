import { getStorageUserSettings } from '@/atoms/settings';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const duration = 1;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(1.05);
  }
`;

const Mask = styled.div<{ $isHiding: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(59, 59, 59, 1);
  z-index: 9999;
  animation: ${({ $isHiding }) => ($isHiding ? fadeOut : 'none')} ${duration}s
    ease forwards;
`;

/**
 * The theme the veil covered last, remembered across mounts. The console
 * layout remounts wholesale on keep-alive route transitions — the max-tabs
 * plugin swaps the entire layout between cached divs — and every such
 * remount replayed the boot veil: in the dark theme each trip into or out
 * of a keep-alive route (the playground image and speech pages) blinked a
 * fullscreen gray cover for the length of its fade. A mount that finds the
 * theme already applied has nothing to hide.
 */
let lastVeiledTheme: string | null = null;

const DarkModeMask = () => {
  const { theme: savedTheme } = getStorageUserSettings();
  // The veil must exist in the initial commit to cover the theme hand-off,
  // so it arms in state initialization and — when the theme did not change —
  // is disarmed in a layout effect, which runs before the browser paints the
  // new tree. A paint effect would let one veiled frame slip through.
  const [visible, setVisible] = useState(savedTheme === 'realDark');
  const [isHiding, setIsHiding] = useState(false);
  const maskRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<any>(null);

  const initTheme = () => {
    const html = document.querySelector('html');
    if (html) {
      html.setAttribute('data-theme', savedTheme);
    }
  };

  initTheme();

  useLayoutEffect(() => {
    const isThemeChange = lastVeiledTheme !== savedTheme;
    lastVeiledTheme = savedTheme;
    if (!isThemeChange) {
      setVisible(false);
      return;
    }
    if (savedTheme === 'realDark') {
      setVisible(true);
      requestAnimationFrame(() => {
        setIsHiding(true);
      });
    } else {
      setVisible(false);
      setIsHiding(true);
    }
  }, [savedTheme]);

  useEffect(() => {
    const el = maskRef.current;
    if (!el) return;

    const handleAnimationEnd = () => {
      clearTimeout(timerRef.current);
      setVisible(false);
    };

    el.addEventListener('animationend', handleAnimationEnd);

    if (isHiding) {
      timerRef.current = setTimeout(
        () => {
          setVisible(false);
        },
        duration * 1000 + 100
      );
    }
    return () => el.removeEventListener('animationend', handleAnimationEnd);
  }, [visible]);

  return visible ? <Mask ref={maskRef} $isHiding={isHiding}></Mask> : null;
};

export default DarkModeMask;
