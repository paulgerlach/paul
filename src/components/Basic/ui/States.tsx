import Image from "next/image";

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center px-4 py-3 rounded-xl bg-red-50 text-red-700 flex items-center justify-center shadow w-full h-full">
        {message}
      </div>
    </div>
  );
}

export function EmptyState({ title, description, imageSrc, imageAlt }: { title: string; description: string; imageSrc: string; imageAlt: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center px-4 py-3 rounded-xl bg-black/10 text-[#6B7280] flex flex-col gap-2 items-center justify-center w-full h-full">
        {imageSrc && (
          <div className="w-5 h-5 mb-2">
            <Image src={imageSrc} alt={imageAlt} width={100} height={100} />
          </div>
        )}
        <div className="flex flex-col">
          {title && (
            <h2 className="text-lg font-medium max-small:text-sm max-medium:text-sm text-gray-800">{title}</h2>
          )}
          <span className="text-sm">{description}</span>
        </div>
      </div>
    </div>
  );
}

export function GlobalErrorBanner({ message }: { message: string }) {
  return (
    <div className="w-full">
      <div className="px-4 py-3 rounded-xl bg-red-50 text-red-700 flex items-center justify-center shadow w-full h-full">
        {message}
      </div>
    </div>
  );
}
