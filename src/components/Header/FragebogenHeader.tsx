"use client";

import Link from "next/link";
import Image from "next/image";
import { logo } from "@/static/icons";
import { ROUTE_HOME } from "@/routes/routes";
import { useEffect, useState, useRef } from "react";

export default function FragebogenHeader() {
	const [scrolled, setScrolled] = useState(false);
	const headerRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const handleScroll = () => {
			if (!headerRef.current) return;

			const totalHeight = headerRef.current.clientHeight + 250;
			setScrolled(window.scrollY >= totalHeight);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<header
			id="header"
			ref={headerRef}
			className={`sticky w-full top-0 duration-300 ${
				scrolled ? "scrolled" : ""
			}`}
		>
			<div className="flex items-center bg-white w-full px-10 max-medium:px-5 [.scrolled_&]:py-3 py-4 duration-300 ease-in-out justify-between">
				<Link
					href={ROUTE_HOME}
					className="flex items-center justify-start gap-3"
				>
					<Image
						width={0}
						height={0}
						sizes="100vw"
						loading="lazy"
						className="colored-to-black max-w-16 max-h-5"
						src={logo}
						alt="logo"
					/>
				</Link>
			</div>
		</header>
	);
}
