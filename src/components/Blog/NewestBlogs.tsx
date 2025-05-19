import Image from "next/image";
import { Content } from "@prismicio/client";
import { formatDate } from "@/utils";
import Link from "next/link";
import { getAllBlogPosts } from "@/utils/getAllBlogPosts";

export default async function NewestBlogs() {
  const posts = await getAllBlogPosts();
  return (
    <div className="px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-2xl max-large:text-lg max-medium:text-base font-medium mb-4">
          Neueste
        </h3>
      </div>
      <div className="-mx-4">
        <div className="overflow-x-scroll flex gap-8 max-small:gap-4 snap-x snap-mandatory scrollbar-hide">
          {posts.slice(0, 3).map((post) => {
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
              <Link
                href={`/blog/${post.uid}`}
                key={post.id}
                className={`flex flex-row-reverse max-large:grid max-large:grid-rows-[60%_40%] bg-[#FAFAF9] min-w-[80%] max-w-7xl min-h-[400px] max-large:max-h-[400px] max-large:min-h-[200px] max-medium:min-h-[150px] overflow-hidden w-fit items-center rounded-4xl group relative scroll-item`}>
                <div className="overflow-hidden h-full">
                  <Image
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full h-full object-cover -my-1 block rounded-r-2xl max-large:rounded-r-none max-large:rounded-t-2xl max-large:rouned-b-none"
                    src={postImageData?.url || ""}
                    alt={postImageData?.alt || "blog_image"}
                  />
                </div>
                <div className="flex flex-col py-10 h-full px-8 max-large:py-5 max-large:px-4 justify-between">
                  <h3 className="group-hover:underline text-3xl max-large:text-lg max-medium:text-base font-medium">
                    {postTitle}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {formatDate(String(postImageDate))}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
