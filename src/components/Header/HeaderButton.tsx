"use client";

import { useRef } from "react";

export default function HeaderButton({ scrolled }: { scrolled: boolean }) {
	const burgerRef = useRef<HTMLButtonElement>(null);

	const handleBurgerMenu = () => {
		if (!burgerRef.current) return;

		const menu = burgerRef.current.parentNode as HTMLDivElement | null;
		if (menu) {
			burgerRef.current.classList.toggle("active");
			menu.classList.toggle("active");
			document.documentElement.classList.toggle("_lock");
		}
	};

	return (
		<button
			ref={burgerRef}
			onClick={handleBurgerMenu}
			className={`burger size-9 duration-300 hover:opacity-80 rounded-halfbase border hidden max-large:flex items-center justify-center flex-col gap-1 z-10 [.active_&]:hidden ${
				scrolled ? "border-dark_text bg-white/50" : "border-border_base"
			}`}
		>
			<span className={`burger-line top-line ${scrolled ? "!bg-dark_text" : ""}`}></span>
			<span className={`burger-line mid-line ${scrolled ? "!bg-dark_text" : ""}`}></span>
			<span className={`burger-line bot-line ${scrolled ? "!bg-dark_text" : ""}`}></span>
		</button>
	);
}
