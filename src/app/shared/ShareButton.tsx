"use client";

import { Button } from "@/components/Basic/ui/Button";
import { useDialogStore } from "@/store/useDIalogStore";
import { useShareStore } from "@/store/useShareStore";
import Link from "next/link";
import { useEffect } from "react";

interface ShareButtonProps {
	className?: string;
}

export default function ShareButton({ className = "" }: ShareButtonProps) {
	const { openDialogByType, openDialog } = useDialogStore();
	const { shareUrl, generateShareUrl } = useShareStore();
	const isOpen = openDialogByType.share_dashboard;

	useEffect(() => {
		if (!shareUrl) {
			generateShareUrl();
		}
	}, [shareUrl, generateShareUrl]);

	const handleOpen = () => {
		generateShareUrl();
		openDialog("share_dashboard");
	};

	return (
		<div className="flex items-center w-fit pl-2.5 bg-white border-0 rounded-lg gap-x-4">
			{shareUrl && (
				<Link
					href={shareUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="text-sm max-w-40 to-black line-clamp-1 cursor-pointer hover:underline pl-2.5"
				>
					{shareUrl}
				</Link>
			)}
			<Button
				onClick={handleOpen}
				disabled={isOpen}
				className={`inline-flex items-center gap-2 rounded font-medium transition-all duration-300 share-button-responsive ${className}`}
			>
				Dashboard teilen
			</Button>
		</div>
	);
}
