"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface LottieProps<T extends Record<string, unknown>> {
	animationData: T;
	id: string;
	wrapperClassName?: string;
}

export function LazyLottie<T extends Record<string, unknown>>({
	animationData,
	wrapperClassName,
	...props
}: LottieProps<T>) {
	return (
		<Suspense fallback={"Loading..."}>
			<div className={wrapperClassName}>
				<Lottie loop animationData={animationData} {...props} />
			</div>
		</Suspense>
	);
}
