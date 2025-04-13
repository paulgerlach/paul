import Image from "next/image";
import { AllDocumentTypes } from "../../../prismicio-types";
import { Content } from "@prismicio/client";
import { formatDate } from "@/utils";
import Link from "next/link";

export default function BlogPost({ post }: { post: AllDocumentTypes }) {
  const postImageSlice = post.data.slices.find(
    (slice) => slice.slice_type === "blog_image"
  ) as Content.BlogImageSlice;
  const postTitleSlice = post.data.slices.find(
    (slice) => slice.slice_type === "main_title"
  ) as Content.MainTitleSlice;
  const postImageData = postImageSlice?.primary.blogMainImage;
  const postImageDate = postImageSlice?.primary.creationdate;
  const postTitle = postTitleSlice?.primary.maintitle;

  return (
    <article key={post.id} className="flex group relative flex-col gap-4">
      <Image
        width={0}
        height={0}
        sizes="100vw"
        loading="lazy"
        className="w-full object-cover max-h-[240px] rounded-2xl"
        src={postImageData?.url || ""}
        alt={postImageData?.alt || "blog_image"}
      />
      <h3 className="group-hover:underlide text-2xl max-large:text-lg max-medium:text-base font-medium">
        {postTitle}
      </h3>
      <span className="text-sm text-gray-500">
        {formatDate(String(postImageDate))}
      </span>
      <Link
        className="hidden group-hover:block absolute inset-0 z-10"
        href={`/blog/${post.uid}`}
      />
    </article>
  );
}
