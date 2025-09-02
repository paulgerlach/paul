import { PropsWithChildren } from "react";

export default function ContentWrapper({
  className,
  children,
}: PropsWithChildren<{ className: string }>) {
  return (
    <div
      className={`max-w-[1440px] max-2xl:max-w-[1200px] max-xl:max-w-5xl rounded-2xl px-4 border-y-[16px] border-[#EFEEEC] bg-[#EFEEEC] w-full overflow-y-auto grid grid-rows-1 mt-6 max-xl:mt-4 mx-auto`}>
      <div className={`${className} h-full`}>
        {children}
      </div>
    </div>
  );
}
