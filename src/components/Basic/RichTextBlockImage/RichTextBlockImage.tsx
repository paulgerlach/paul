import { RTImageNode } from "@prismicio/client";
import Image from "next/image";

export default function RichTextBlockImage({ node }: { node: RTImageNode }) {
  if (!node.url) return null;

  const urlObj = new URL(node.url);
  const isGif = urlObj.pathname.toLowerCase().endsWith(".gif");
  return (
    <div className="flex flex-col items-start justify-center gap-2.5">
      <Image
        width={0}
        height={0}
        sizes="100vw"
        unoptimized={isGif}
        loading="lazy"
        src={node.url}
        alt={node.alt || ""}
        className="rounded-2xl object-cover shadow-lg max-w-full w-full max-h-[400px] h-auto"
      />
      {node.alt && (
        <span className="text-sm block mx-auto w-fit font-medium">
          {node.alt}
        </span>
      )}
    </div>
  );
}
