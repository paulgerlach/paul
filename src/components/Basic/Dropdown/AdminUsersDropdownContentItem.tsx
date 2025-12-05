"use client";

import { green_check_single } from "@/static/icons";
import Image from "next/image";
import type { UnitType, UserType } from "@/types";
import Link from "next/link";
import { ROUTE_ADMIN, ROUTE_DASHBOARD } from "@/routes/routes";
import { useParams } from "next/navigation";

export default function AdminUsersDropdownContentItem({
  item,
  onSelect,
}: {
  item: UserType;
  onSelect?: () => void;
}) {
  const { user_id } = useParams();
  return (
    <Link
      href={`${ROUTE_ADMIN}/${item.id}${ROUTE_DASHBOARD}`}
      className="rounded-md localItem"
      onClick={onSelect}
    >
      <input
        type="checkbox"
        id={item.id}
        checked={user_id === item.id}
        name={item.id}
        className="sr-only peer"
      />
      <label
        htmlFor={item.id}
        className="text-sm text-dark_green max-xl:text-xs cursor-pointer p-2 flex items-center justify-between py-1 px-2 rounded-md transition-all border border-transparent duration-300
                 peer-checked:bg-green/10 peer-checked:border-green peer-checked:[&_.appartmentCheckmark]:block"
      >
        <div className="flex items-center justify-start gap-5 rounded-md">
          {item.first_name} {item.last_name}
        </div>
        <Image
          width={0}
          height={0}
          sizes="100vw"
          loading="lazy"
          className="max-w-6 hidden appartmentCheckmark max-h-6"
          src={green_check_single}
          alt="green_check_single"
        />
      </label>
    </Link>
  );
}
