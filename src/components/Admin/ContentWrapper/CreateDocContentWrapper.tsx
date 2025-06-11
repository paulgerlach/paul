import { PropsWithChildren } from "react";

export default function CreateDocContentWrapper({
  children,
}: PropsWithChildren) {
  return (
    <div className={`max-w-7xl mx-auto grid max-h-[90%] grid-cols-3 gap-16`}>
      {children}
    </div>
  );
}
