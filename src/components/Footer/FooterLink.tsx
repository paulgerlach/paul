import type { FooterLinkType } from "@/types";
import Link from "next/link";

export type FooterLinkProps = {
  link: FooterLinkType;
};

export default function FooterLink({ link }: FooterLinkProps) {
  return (
    <Link
      href={link.url}
      className="flex items-center justify-start gap-1.5 text-dark_text text-lg leading-[21px]">
      {link.text}
      {link.isNeu && (
        <span className="rounded-halfbase bg-green py-0.5 px-2 text-dark_text text-lg leading-[18px]">
          neu
        </span>
      )}
      {link.isBeliebt && (
        <span className="rounded-halfbase bg-green py-0.5 px-2 text-dark_text text-lg leading-[18px]">
          beliebt
        </span>
      )}
    </Link>
  );
}
