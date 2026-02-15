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
		<div className="flex items-start justify-start gap-2 w-full p-1">
			<div className="flex items-center justify-start gap-2 flex-shrink-0">
				<span
					className="flex items-center justify-center w-[60px] h-[52px] max-md:w-12 max-md:h-12 max-lg:w-14 max-lg:h-14 rounded-sm"
					style={{ backgroundColor: leftBg }}
				>
					<Image
						width={28}
						height={28}
						sizes="100vw"
						loading="lazy"
						className="w-6 h-6 max-md:w-6 max-md:h-6 max-lg:w-6 max-lg:h-6"
						src={leftIcon}
						alt=""
					/>
				</span>
				<span
					className="flex items-center justify-center w-[60px] h-[52px] max-md:w-12 max-md:h-12 max-lg:w-14 max-lg:h-14 rounded-sm"
					style={{ backgroundColor: rightBg }}
				>
					<Image
						width={28}
						height={28}
						sizes="100vw"
						loading="lazy"
						className="w-6 h-6 max-md:w-6 max-md:h-6 max-lg:w-6 max-lg:h-6"
						src={rightIcon}
						alt=""
					/>
				</span>
			</div>
			<div className="flex-1 min-w-0">
				{/* <p className="text-sm max-md:text-xs text-black/50 font-medium leading-tight">{title}</p> */}
				<p className="text-sm max-lg:text-xs text-black/50 leading-tight overflow-hidden text-ellipsis line-clamp-3">
					{subtitle}
				</p>
			</div>
		</div>
	);
}
