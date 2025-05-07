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
        className="flex items-center justify-center w-[3vw] h-[3vw] rounded-sm"
        style={{ backgroundColor: leftBg }}>
        <Image
          width={0}
          height={0}
          sizes="100vw"
          loading="lazy"
          className="max-w-[1.5vw] max-h-[1.5vw]"
          src={leftIcon}
          alt=""
        />
      </span>
      <span
        className="flex items-center justify-center w-[3vw] h-[3vw] rounded-sm"
        style={{ backgroundColor: rightBg }}>
        <Image
          width={0}
          height={0}
          sizes="100vw"
          loading="lazy"
          className="max-w-[1.5vw] max-h-[1.5vw]"
          src={rightIcon}
          alt=""
        />
      </span>
      <div>
        <p className="text-[1vw] text-black/50">{title}</p>
        <p className="text-[0.5vw] text-black/50">{subtitle}</p>
      </div>
    </div>
  );
}
