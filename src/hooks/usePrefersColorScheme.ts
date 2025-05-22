import { useState, useEffect } from 'react';

type ColorScheme = 'light' | 'dark';

export function usePrefersColorScheme(): [
  ColorScheme,
  (scheme: ColorScheme) => void,
] {
  const getStoredScheme = (): ColorScheme | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('color-scheme') as ColorScheme | null;
  };

  const getSystemScheme = (): ColorScheme => {
    if (typeof window === 'undefined' || !window.matchMedia) return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  };

  const [scheme, setSchemeState] = useState<ColorScheme>(
    () => getStoredScheme() ?? getSystemScheme(),
  );

  const setScheme = (newScheme: ColorScheme) => {
    setSchemeState(newScheme);
    localStorage.setItem('color-scheme', newScheme);
  };

  useEffect(() => {
    if (!window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handler = (e: MediaQueryListEvent) => {
      if (!getStoredScheme()) {
        setSchemeState(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (scheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [scheme]);

  return [scheme, setScheme];
}
