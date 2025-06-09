import { PropsWithChildren } from "react";

export default function CreateDocContentWrapper({
  className,
  children,
}: PropsWithChildren<{ className: string }>) {
  return (
    <div
      className={`max-w-7xl mx-auto overflow-y-auto grid grid-cols-3 gap-16 ${className}`}>
      {children}
    </div>
  );
}
