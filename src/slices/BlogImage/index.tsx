import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import Image from "next/image";

/**
 * Props for `BlogImage`.
 */
export type BlogImageProps = SliceComponentProps<Content.BlogImageSlice>;

/**
 * Component for "BlogImage" Slices.
 */
const BlogImage: FC<BlogImageProps> = ({ slice }) => {
  console.log(slice);
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}>
      {/* Placeholder component for blog_image (variation: {slice.variation}) Slices */}
      <Image
        width={0}
        height={0}
        sizes="100vw"
        loading="lazy"
        className="w-full object-cover max-h-screen h-dvh max-medium:hidden"
        src={slice.primary.blogMainImage.url || ""}
        alt={slice.primary.blogMainImage.alt || "blogMainImage"}
      />
    </section>
  );
};

export default BlogImage;
