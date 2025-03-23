"use client";

import { useEffect, useState } from "react";

export type MobileDifferenceProps = {
  mobileComponent: React.ReactNode;
  desktopComponent: React.ReactNode;
};

export default function MobileDifference({
  desktopComponent,
  mobileComponent,
}: MobileDifferenceProps) {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isMobile ? mobileComponent : desktopComponent;
}
