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
    <div className="flex items-center justify-start gap-1.5">
      <span
        className="flex items-center justify-center w-[60px] h-[54px] max-md:w-8 max-md:h-8 max-lg:w-10 max-lg:h-10 rounded-sm"
        style={{ backgroundColor: leftBg }}
      >
        <Image
          width={0}
          height={0}
          sizes="100vw"
          loading="lazy"
          className="w-7 h-7 max-md:w-5 max-md:h-5 max-lg:w-6 max-lg:h-6"
          src={leftIcon}
          alt=""
        />
      </span>
      <span
        className="flex items-center justify-center w-[60px] h-[54px] max-md:w-8 max-md:h-8 max-lg:w-10 max-lg:h-10 rounded-sm"
        style={{ backgroundColor: rightBg }}
      >
        <Image
          width={0}
          height={0}
          sizes="100vw"
          loading="lazy"
          className="w-6 h-6 max-md:w-5 max-md:h-5 max-lg:w-4 max-lg:h-4"
          src={rightIcon}
          alt=""
        />
      </span>
      <div>
        <p className="text-sm max-md:text-xs text-black/50">{title}</p>
        <p className="text-xs max-lg:text-[10px] text-black/50">{subtitle}</p>
      </div>
    </div>
  );
}
