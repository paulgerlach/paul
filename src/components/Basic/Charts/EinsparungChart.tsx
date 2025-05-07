import { earth } from "@/static/icons";
import Image from "next/image";

export default function EinsparungChart() {
  return (
    <div className="rounded-2xl row-span-3 shadow p-4 bg-white px-5">
      <div className="flex pb-6 border-b border-b-dark_green/10 items-center justify-between mb-2">
        <h2 className="text-lg font-medium text-gray-800">Einsparung</h2>
        <Image
          width={0}
          height={0}
          sizes="100vw"
          loading="lazy"
          className="max-w-6 max-h-6"
          src={earth}
          alt="earth"
        />
      </div>
      <p className="text-[2.5vw] text-black/50">11,3t CO2</p>
    </div>
  );
}
