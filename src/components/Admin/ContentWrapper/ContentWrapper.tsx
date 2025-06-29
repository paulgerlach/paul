import { PropsWithChildren } from "react";

export default function ContentWrapper({
  className,
  children,
}: PropsWithChildren<{ className: string }>) {
  return (
    <div
      className={`max-w-[1200px] max-xl:max-w-5xl rounded-2xl px-4 border-y-[16px] border-[#EFEEEC] bg-[#EFEEEC] w-full overflow-y-auto grid grid-rows-1 mt-16 max-xl:mt-8 mx-auto`}>
      <div className={`${className}`}>
        {children}
      </div>
    </div>
  );
}
