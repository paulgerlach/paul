import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps, SliceZone } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { notFound } from "next/navigation";
import { components } from "..";

/**
 * Props for `BlogAuthor`.
 */
export type BlogAuthorProps = SliceComponentProps<Content.BlogAuthorSlice>;

/**
 * Component for "BlogAuthor" Slices.
 */
const BlogAuthor: FC<BlogAuthorProps> = async ({ slice }) => {
  const client = createClient();
  const blogauthor = slice.primary.blogauthor;

  if (
    !blogauthor ||
    blogauthor.link_type !== "Document" ||
    typeof blogauthor.uid !== "string"
  ) {
    notFound();
  }

  try {
    const author = await client.getByUID("author", blogauthor.uid);
    return (
      <section
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        className="max-w-3xl mx-auto flex items-center justify-start gap-10">
        <SliceZone
          context={author}
          slices={author.data.slices}
          components={components}
        />
      </section>
    );
  } catch (error) {
    notFound();
  }
};

export default BlogAuthor;
