import { earth } from "@/static/icons";
import Image from "next/image";
import { EmptyState } from "@/components/Basic/ui/States";

export default function EinsparungChart({ isEmpty, emptyTitle, emptyDescription }: { isEmpty?: boolean; emptyTitle?: string; emptyDescription?: string }) {
  return (
    <div className="rounded-2xl shadow p-4 bg-white px-5 h-full flex flex-col">
      <div className="flex pb-6 border-b border-b-dark_green/10 items-center justify-between mb-2">
        <h2 className="text-lg max-small:text-sm max-medium:text-sm font-medium text-gray-800">Einsparung</h2>
        <Image
          width={0}
          height={0}
          sizes="100vw"
          loading="lazy"
          className="max-w-6 max-h-6 max-small:max-w-5 max-small:max-h-5 max-medium:max-w-5 max-medium:max-h-5"
          src={earth}
          alt="earth"
        />
      </div>
      <div className="flex-1 flex items-center">
        {isEmpty ? (
          <EmptyState
            title={emptyTitle ?? "No data available."}
            description={emptyDescription ?? "No data available."}
            imageSrc={earth.src}
            imageAlt="Einsparung"
          />
        ) : (
          <p className="text-3xl md:text-4xl lg:text-5xl text-black/50">11,3t CO2</p>
        )}
      </div>
    </div>
  );
}
