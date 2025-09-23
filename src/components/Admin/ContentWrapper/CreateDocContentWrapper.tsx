import { PropsWithChildren } from "react";

export default function CreateDocContentWrapper({
  children,
}: PropsWithChildren) {
  return (
    <div className={`max-w-[1440px] max-2xl:max-w-[1200px] max-xl:max-w-5xl w-full mx-auto overflow-y-auto grid grid-cols-3 grid-rows-1 gap-8 max-xl:gap-4`}>
      {children}
    </div>
  );
}
