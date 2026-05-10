'use client';

import { useEffect } from 'react';

export function LocatorRuntime() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    void import('@locator/runtime').then(({ default: setupLocatorUI }) => {
      setupLocatorUI();
    });
  }, []);

  return null;
}
