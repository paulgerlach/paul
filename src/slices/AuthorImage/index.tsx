import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import Image from "next/image";

/**
 * Props for `AuthorImage`.
 */
export type AuthorImageProps = SliceComponentProps<Content.AuthorImageSlice>;

/**
 * Component for "AuthorImage" Slices.
 */
const AuthorImage: FC<AuthorImageProps> = ({ slice }) => {
  return (
    <section
      className="flex items-center justify-center"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}>
      <Image
        width={0}
        height={0}
        sizes="100vw"
        loading="lazy"
        src={slice.primary.authorimage.url || ""}
        alt={slice.primary.authorimage.alt || ""}
        className="rounded-full object-cover max-w-16 max-h-16 w-full h-full size-16"
      />
    </section>
  );
};

export default AuthorImage;
