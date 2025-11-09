'use client';

import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResponsiveWrapperProps {
  mobile: React.ReactNode;
  desktop: React.ReactNode;
}

export function ResponsiveWrapper({ mobile, desktop }: ResponsiveWrapperProps) {
  const isMobile = useIsMobile();
  
  // Show nothing during hydration to prevent mismatch
  if (isMobile === undefined) {
    return null;
  }
  
  return (
    <>
      {isMobile ? mobile : desktop}
    </>
  );
}

