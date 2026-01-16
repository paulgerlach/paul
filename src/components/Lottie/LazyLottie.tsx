"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface LottieProps<T extends Record<string, unknown>> {
	animationData: T;
	id: string;
	wrapperClassName?: string;
	eager?: boolean; // For above-the-fold animations
}

export function LazyLottie<T extends Record<string, unknown>>({
	animationData,
	wrapperClassName,
	eager = false,
	...props
}: LottieProps<T>) {
	const [isVisible, setIsVisible] = useState(eager);
	const ref = useRef<HTMLDivElement>(null);

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

	return (
		<div ref={ref} className={wrapperClassName}>
			{isVisible ? (
				<Suspense
					fallback={
						<div className="animate-pulse bg-gray-200/50 rounded-base w-full h-full min-h-[200px]" />
					}
				>
					<Lottie loop animationData={animationData} {...props} />
				</Suspense>
			) : (
				<div className="animate-pulse bg-gray-200/50 rounded-base w-full h-full min-h-[200px]" />
			)}
		</div>
	);
}
