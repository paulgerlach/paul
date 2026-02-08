"use client";

import { chevron_admin, objekte_placeholder } from "@/static/icons";
import { type ObjektType } from "@/types";
import Image from "next/image";
import Link from "next/link";

export type ObjekteItemDocWithHistoryHeaderProps = {
	item: ObjektType;
	isOpen: boolean;
	onClickAccordion: () => void;
	link: string;
	commertialCount: number;
	hasDocuments: boolean;
	otherCount: number;
};

export default function ObjekteItemDocWithHistoryHeader({
	item,
	isOpen,
	onClickAccordion,
	link,
	commertialCount,
	hasDocuments,
	otherCount,
}: ObjekteItemDocWithHistoryHeaderProps) {
	return (
		<Link
			href={link}
			className={`w-full rounded-2xl max-medium:rounded-xl p-5 max-medium:p-3 bg-white cursor-pointer grid grid-cols-[1fr_auto] items-center justify-start gap-8 max-medium:gap-3`}
		>
			<div className="flex items-center max-medium:flex-col max-medium:items-start justify-start gap-8 max-xl:gap-4 max-medium:gap-3 flex-1">
				{!!item.image_url ? (
					<Image
						width={0}
						height={0}
						sizes="100vw"
						loading="lazy"
						className="w-[218px] h-[112px] max-xl:w-[180px] max-xl:h-[96px] max-medium:w-full max-medium:h-[120px] flex items-center justify-center rounded-2xl max-xl:rounded-xl object-cover flex-shrink-0"
						src={item.image_url}
						alt={item.street}
					/>
				) : (
					<div className="w-[218px] h-[112px] max-xl:w-[180px] max-xl:h-[96px] max-medium:w-full max-medium:h-[120px] flex items-center justify-center rounded-2xl max-xl:rounded-xl bg-[#E0E0E0] flex-shrink-0">
						<Image
							width={0}
							height={0}
							sizes="100vw"
							loading="lazy"
							className="max-w-[30px] max-h-[30px] max-xl:max-w-[24px] max-xl:max-h-[24px]"
							src={objekte_placeholder}
							alt="objekte_placeholder"
						/>
					</div>
				)}
				<div className="max-medium:w-full">
					<p className="text-2xl max-xl:text-xl max-medium:text-base text-dark_green">
						{item.street}
					</p>
					<p className="text-xl max-xl:text-base max-medium:text-sm text-dark_green/50">
						{otherCount > 0 ? `${otherCount} Wohneinheiten` : ""}
						{commertialCount > 0 ? ` ${commertialCount} Gewerbeeinheiten` : ""}
					</p>
				</div>
			</div>

			{hasDocuments && (
				<button className="h-full cursor-pointer block px-8" onClick={(e) => {
					e.preventDefault();
					onClickAccordion()
				}}>
					<Image
						width={0}
						height={0}
						sizes="100vw"
						loading="lazy"
						className={`max-w-2.5 max-h-4 transition-all duration-300 max-medium:self-start ${isOpen ? "rotate-0" : "-rotate-90"
							}`}
						src={chevron_admin}
						alt="chevron"
					/>
				</button>
			)}
		</Link>
	);
}
