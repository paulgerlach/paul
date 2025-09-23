import Image, { StaticImageData } from "next/image";

interface NotificationItemProps {
  leftIcon: StaticImageData;
  rightIcon: StaticImageData;
  leftBg: string;
  rightBg: string;
  title: string;
  subtitle: string;
}

export default function NotificationItem({
  leftIcon,
  rightIcon,
  leftBg,
  rightBg,
  title,
  subtitle,
}: NotificationItemProps) {
  return (
    <div className="flex items-start justify-start gap-2 w-full">
      <div className="flex items-center justify-start gap-2 flex-shrink-0">
        <span
          className="flex items-center justify-center w-[50px] h-[44px] max-md:w-8 max-md:h-8 max-lg:w-10 max-lg:h-10 rounded-sm"
          style={{ backgroundColor: leftBg }}
        >
          <Image
            width={24}
            height={24}
            sizes="100vw"
            loading="lazy"
            className="w-5 h-5 max-md:w-5 max-md:h-5 max-lg:w-5 max-lg:h-5"
            src={leftIcon}
            alt=""
          />
        </span>
        <span
          className="flex items-center justify-center w-[50px] h-[44px] max-md:w-8 max-md:h-8 max-lg:w-10 max-lg:h-10 rounded-sm"
          style={{ backgroundColor: rightBg }}
        >
          <Image
            width={24}
            height={24}
            sizes="100vw"
            loading="lazy"
            className="w-5 h-5 max-md:w-5 max-md:h-5 max-lg:w-5 max-lg:h-5"
            src={rightIcon}
            alt=""
          />
        </span>
      </div>
      <div className="flex-1 min-w-0">
        {/* <p className="text-sm max-md:text-xs text-black/50 font-medium leading-tight">{title}</p> */}
        <p className="text-xs max-lg:text-[10px] text-black/50 leading-tight mt-[-1px]">{subtitle}</p>
      </div>
    </div>
  );
}
