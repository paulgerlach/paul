import { FC, Fragment } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import Image from "next/image";
import { formatDate } from "@/utils";
import CopyLinkButton from "@/components/Basic/CopyLinkButton/CopyLinkButton";
import { AllDocumentTypes } from "../../../prismicio-types";

/**
 * Props for `BlogImage`.
 */
export type BlogImageProps = SliceComponentProps<
  Content.BlogImageSlice,
  AllDocumentTypes
>;

/**
 * Component for "BlogImage" Slices.
 */

const BlogImage: FC<BlogImageProps> = ({ slice, context }) => {
  return (
    <Fragment>
      <div className="flex items-center blogImage justify-between max-medium:grid max-medium:grid-cols-2 gap-2">
        <div className="flex items-center flex-wrap gap-1 blogImageTags">
          {context?.tags?.map((tag: string) => (
            <span
              key={tag}
              className="text-xs font-medium bg-green/30 rounded-full px-2 py-1 mr-2">
              {tag}
            </span>
          ))}
        </div>
        <span className="text-sm max-medium:text-base blogImageDate text-gray-500">
          {slice.primary.creationdate
            ? formatDate(slice.primary.creationdate)
            : ""}
        </span>
        <CopyLinkButton />
      </div>
      <section
        className="w-full object-cover max-h-[600px] rounded-2xl"
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}>
        <Image
          width={0}
          height={0}
          sizes="100vw"
          loading="lazy"
          className="w-full object-cover max-h-[600px] rounded-2xl"
          src={slice.primary.blogMainImage.url || ""}
          alt={slice.primary.blogMainImage.alt || "blogMainImage"}
        />
      </section>
    </Fragment>
  );
};

export default BlogImage;
