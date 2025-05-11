import { type ObjektType } from "@/types";
import Image from "next/image";

export default function ObjekteItem({ item }: { item: ObjektType }) {
  return (
    <div className="bg-white p-4 rounded-2xl flex items-center justify-between">
      <div className="flex items-center justify-start gap-8">
        <Image
          width={0}
          height={0}
          sizes="100vw"
          loading="lazy"
          className="max-w-[218px] max-h-[112px] rounded-2xl"
          src={item.image}
          alt={item.street}
        />
        <div>
          <p className="text-2xl text-dark_green">{item.street}</p>
          <p className="text-base text-dark_green/50">
            {item.privateLocals ? `${item.privateLocals} Wohneinheiten` : ""}
            {item.commercialLocals
              ? `, ${item.commercialLocals} Gewerbeeinheiten`
              : ""}
          </p>
        </div>
      </div>
      <div></div>
    </div>
  );
}
