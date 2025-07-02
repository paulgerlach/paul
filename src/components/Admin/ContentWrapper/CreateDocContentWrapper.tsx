import { PropsWithChildren } from "react";

export default function CreateDocContentWrapper({
  children,
}: PropsWithChildren) {
  return (
    <div className={`max-w-[1200px] max-xl:max-w-5xl mx-auto overflow-y-auto grid grid-cols-3 grid-rows-1 gap-16 max-xl:gap-4`}>
      {children}
    </div>
  );
}
