import { PropsWithChildren } from "react";

export default function ContentWrapper({
  className,
  children,
}: PropsWithChildren<{ className: string }>) {
  return (
    <div
      className={`max-w-7xl mx-auto rounded-2xl px-3.5 py-4 bg-[#EFEEEC] ${className}`}>
      {children}
    </div>
  );
}
