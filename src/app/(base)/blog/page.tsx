import Subscription from "@/components/Basic/Subscription/Subscription";
import BlogHero from "@/components/Hero/BlogHero";
import { getAllBlogPosts } from "@/utils/getAllBlogPosts";
import { AllDocumentTypes } from "../../../../prismicio-types";
import BlogPost from "@/components/Blog/BlogPost";

export default async function BlogPage() {
  const posts = await getAllBlogPosts();

  return (
    <main id="content">
      <BlogHero />
      <div className="grid grid-cols-3 max-w-7xl mx-auto max-large:grid-cols-2 max-medium:grid-cols-1 gap-8 px-4 py-16">
        {posts.map((post: AllDocumentTypes) => (
          <BlogPost key={post.id} post={post} />
        ))}
      </div>
      <Subscription />
    </main>
  );
}
