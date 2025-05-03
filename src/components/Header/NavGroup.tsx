import { right_arrow } from "@/static/icons";
import type { NavGroupType } from "@/types";
import Image from "next/image";
import Link from "next/link";

export type NavGroupProps = {
  group: NavGroupType;
};

export default function NavGroup({
  group: { title, route, groupTitle, groupLinks, rightSide },
}: NavGroupProps) {
  const handleBurgerMenu = () => {
    const burger = document.querySelector(".burger");
    if (!burger) return;

    const menu = burger.parentNode as HTMLDivElement | null;
    if (menu) {
      burger.classList.remove("active");
      menu.classList.remove("active");
      document.documentElement.classList.remove("_lock");
    }
  };

  return (
    <div className="group relative [.scrolled_&]:py-4 py-6 max-medium:py-1 duration-300">
      <Link
        href={route}
        onClick={() => handleBurgerMenu()}
        className="flex items-center text-sm text-white justify-start gap-2 max-large:text-dark_text">
        {title}
        <Image loading="lazy" src={right_arrow} alt="arrow" />
      </Link>
      <div className="absolute bg-white w-[620px] top-[100%] max-large:grid-cols-1 mx-5 pl-16 pr-8 py-9 rounded-base grid grid-cols-2 left-1/2 -translate-x-1/2 gap-20 -translate-y-[200%] group-hover:translate-y-0 max-large:hidden">
        <div>
          <p className="mb-5 text-xl text-dark_text">{groupTitle}</p>
          <ul className="space-y-4">
            {groupLinks.map((link) => (
              <li key={link.title} className="nav-link-wrapper">
                <Link
                  className="flex items-center justify-start gap-4 text-dark_text/50 text-[15px] py-2.5 px-3.5 rounded-base duration-300 hover:bg-link/20 cursor-pointer"
                  href={route}>
                  <Image
                    width={0}
                    height={0}
                    sizes="100vw"
                    loading="lazy"
                    style={{ width: "100%", height: "auto" }}
                    className="size-7 max-h-7 max-w-7"
                    src={link.icon}
                    alt="modal_icon"
                  />
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {rightSide}
      </div>
    </div>
  );
}
