import { breadcrum_arrow } from "@/static/icons";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";

export type BreadcrumbProps = {
  title: string;
  link: string;
  backTitle: string;
};

export default function Breadcrumb({
  backTitle,
  link,
  title,
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
      <h1 className="mb-4 text-lg">{title}</h1>
    </Fragment>
  );
}
