import Link from "next/link";
import { getAllBlogPosts } from "@/utils/getAllBlogPosts";
import { ROUTE_BLOG } from "@/routes/routes";
import BlogPostsList from "./BlogPostsList";

export default async function RecomendedBlogs({
  current,
}: {
  current: string;
}) {
  const posts = await getAllBlogPosts();
  const recomendedPosts = posts.filter((post) => post.uid !== current);
  if (recomendedPosts.length > 0)
    return (
      <div className="px-4 py-8">
        <div className="max-w-7xl flex items-center justify-between mx-auto">
          <h3 className="text-2xl max-large:text-lg max-medium:text-base font-medium mb-4">
            Aktuell
          </h3>
          <Link
            className="min-w-28 cursor-pointer flex items-center justify-start gap-1.5 text-center w-fit text-xs font-medium bg-green/30 rounded-full px-2 py-1 mr-2 text-dark_text my-5 transition-all duration-300 hover:bg-green/80 active:bg-green/90 disabled:bg-green/50 disabled:cursor-not-allowed"
            href={ROUTE_BLOG}>
            Alle Beiträge ansehen
          </Link>
        </div>
        <BlogPostsList posts={recomendedPosts.slice(0, 3)} />
      </div>
    );
}
