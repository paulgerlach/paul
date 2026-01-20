"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

// Map of animation names to their dynamic imports
const animationImports: Record<string, () => Promise<{ default: Record<string, unknown> }>> = {
	"Animation_1": () => import("@/animations/Animation_1.json"),
	"Animation_2": () => import("@/animations/Animation_2.json"),
	"Animation_3": () => import("@/animations/Animation_3.json"),
	"Animation_4": () => import("@/animations/Animation_4.json"),
	"Animation_5": () => import("@/animations/Animation_5.json"),
	"Animation_6": () => import("@/animations/Animation_6.json"),
	"Animation_7": () => import("@/animations/Animation_7.json"),
	"Animation_8": () => import("@/animations/Animation_8.json"),
	"Animation_9": () => import("@/animations/Animation_9.json"),
	"Animation_10": () => import("@/animations/Animation_10.json"),
	"Animation_11": () => import("@/animations/Animation_11.json"),
	"Animation_12": () => import("@/animations/Animation_12.json"),
	"Animation_13": () => import("@/animations/Animation_13.json"),
	"Animation_14": () => import("@/animations/Animation_14.json"),
};

interface LottieProps {
	animationName: string; // e.g., "Animation_1", "Animation_2"
	id: string;
	wrapperClassName?: string;
	eager?: boolean; // For above-the-fold animations
}

export function LazyLottie({
	animationName,
	wrapperClassName,
	eager = false,
	...props
}: LottieProps) {
	const [isVisible, setIsVisible] = useState(eager);
	const [animationData, setAnimationData] = useState<Record<string, unknown> | null>(null);
	const ref = useRef<HTMLDivElement>(null);

	// IntersectionObserver to detect when component enters viewport
	useEffect(() => {
		if (eager) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
					observer.disconnect();
				}
			},
			{ rootMargin: "200px" }
		);

		if (ref.current) observer.observe(ref.current);
		return () => observer.disconnect();
	}, [eager]);

	// Dynamically load animation data only when visible
	useEffect(() => {
		if (!isVisible || animationData) return;

		const loadAnimation = async () => {
			const importFn = animationImports[animationName];
			if (importFn) {
				const animModule = await importFn();
				setAnimationData(animModule.default);
			}
		};

		loadAnimation();
	}, [isVisible, animationName, animationData]);

	return (
		<div ref={ref} className={wrapperClassName}>
			{isVisible && animationData ? (
				<Lottie loop animationData={animationData} {...props} />
			) : null}
		</div>
	);
}
