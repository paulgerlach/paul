import { PropsWithChildren } from "react";

export default function ContentWrapper({
  className,
  children,
}: PropsWithChildren<{ className: string }>) {
  return (
    <div
      className={`max-w-7xl mx-auto rounded-2xl px-3.5 overflow-y-auto border-y-[16px] border-[#EFEEEC] bg-[#EFEEEC] ${className}`}>
      {children}
    </div>
  );
}
