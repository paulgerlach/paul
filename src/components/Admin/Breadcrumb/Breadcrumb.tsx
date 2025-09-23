import { breadcrum_arrow } from "@/static/icons";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";

export type BreadcrumbProps = {
  title: string;
  link: string;
  backTitle: string;
  subtitle?: string;
};

export default function Breadcrumb({
  backTitle,
  link,
  title,
  subtitle,
}: BreadcrumbProps) {
  return (
    <div>
      <Link
        className="flex items-center w-fit max-xl:text-sm text-black/50 justify-start gap-2"
        href={link}>
        <Image
          width={0}
          height={0}
          sizes="100vw"
          loading="lazy"
          className="max-w-7 max-h-7 max-xl:max-w-5 max-xl:max-h-5"
          src={breadcrum_arrow}
          alt="breadcrum_arrow"
        />
        {backTitle}
      </Link>
      <h1 className={`text-3xl max-xl:text-xl max-xl:mt-4 mt-9 ${!!subtitle && "mb-4"}`}>{title}</h1>
      {subtitle && (
        <p className="text-[#757575] text-sm max-w-5xl mb-4">{subtitle}</p>
      )}
    </div>
  );
}
