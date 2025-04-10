"use client";

import { useRef } from "react";

export default function HeaderButton() {
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
			className="burger size-9 duration-300 hover:opacity-80 rounded-halfbase border border-border_base hidden max-large:flex items-center justify-center flex-col gap-1 z-10"
		>
			<span className="burger-line top-line"></span>
			<span className="burger-line mid-line"></span>
			<span className="burger-line bot-line"></span>
		</button>
	);
}
