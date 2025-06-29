import { PropsWithChildren } from "react";

export default function CreateDocContentWrapper({
  children,
}: PropsWithChildren) {
  return (
    <div className={`max-w-[1200px] max-xl:max-w-5xl mx-auto grid grid-cols-3 grid-rows-1 gap-16 max-xl:gap-8`}>
      {children}
    </div>
  );
}
