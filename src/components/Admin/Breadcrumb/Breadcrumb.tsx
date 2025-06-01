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
    <Fragment>
      <Link
        className="flex items-center w-fit text-black/50 text-sm justify-start gap-2"
        href={link}>
        <Image
          width={0}
          height={0}
          sizes="100vw"
          loading="lazy"
          className="max-w-5 max-h-5"
          src={breadcrum_arrow}
          alt="breadcrum_arrow"
        />
        {backTitle}
      </Link>
      <h1 className={`text-lg ${!subtitle && "mb-4"}`}>{title}</h1>
      {subtitle && (
        <p className="text-[#757575] text-sm max-w-5xl mb-4">{subtitle}</p>
      )}
    </Fragment>
  );
}
