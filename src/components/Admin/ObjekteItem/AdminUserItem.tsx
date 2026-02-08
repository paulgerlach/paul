'use client'

import { ROUTE_ADMIN } from "@/routes/routes";
import { admin_objekte } from "@/static/icons";
import type { UserType } from "@/types";
import Image from "next/image";
import Link from "next/link";

export default function AdminUserItem({ item }: { item: UserType }) {
  if (!item.id) {
    throw new Error("Missing item.id");
  }

  return (
    <div className="bg-white p-5 max-xl:p-3 max-medium:p-3 rounded-2xl max-xl:rounded-xl max-medium:rounded-lg flex items-center justify-between">
      <Link
        href={`${ROUTE_ADMIN}/${item.id}/dashboard`}
        className="flex items-center w-full justify-start gap-8 max-xl:gap-4 max-medium:gap-3"
      >
        <div className="w-20 h-20 max-xl:w-16 max-xl:h-16 max-medium:w-12 max-medium:h-12 flex items-center justify-center rounded-2xl max-xl:rounded-xl max-medium:rounded-lg bg-[#E0E0E0] flex-shrink-0">
          <Image
            width={0}
            height={0}
            sizes="100vw"
            loading="lazy"
            className="max-w-[38px] max-h-[38px] max-xl:max-w-[24px] max-xl:max-h-[24px] max-medium:max-w-[20px] max-medium:max-h-[20px]"
            src={admin_objekte}
            alt="admin_objekte"
          />
        </div>
        <div className="flex flex-col items-between justify-start gap-2 max-xl:gap-1 min-h-full h-full min-w-0">
          <p className="text-3xl max-xl:text-xl max-medium:text-base text-dark_green truncate">
            {item.email}
          </p>
          <p className="text-xl max-xl:text-base max-medium:text-sm text-dark_green/50">
            {item.first_name} {item.last_name}
          </p>
        </div>
      </Link>
    </div>
  );
}
