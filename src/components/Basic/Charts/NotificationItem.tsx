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
        className="flex items-center justify-center w-8 h-8 md:w-7 md:h-7 lg:w-9 lg:h-9 rounded-sm"
        style={{ backgroundColor: leftBg }}
      >
        <Image
          width={0}
          height={0}
          sizes="100vw"
          loading="lazy"
          className="w-4 h-4 md:w-3.5 md:h-3.5 lg:w-5 lg:h-5"
          src={leftIcon}
          alt=""
        />
      </span>
      <span
        className="flex items-center justify-center w-8 h-8 md:w-7 md:h-7 lg:w-9 lg:h-9 rounded-sm"
        style={{ backgroundColor: rightBg }}
      >
        <Image
          width={0}
          height={0}
          sizes="100vw"
          loading="lazy"
          className="w-3.5 h-3.5 md:w-3 md:h-3 lg:w-4 lg:h-4"
          src={rightIcon}
          alt=""
        />
      </span>
      <div>
        <p className="text-sm md:text-xs lg:text-sm text-black/50">{title}</p>
        <p className="text-[10px] md:text-[10px] lg:text-xs text-black/50">{subtitle}</p>
      </div>
    </div>
  );
}
