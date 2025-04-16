import BlogPost from "@/components/Blog/BlogPost";
import { AllDocumentTypes } from "../../../prismicio-types";

export default function BlogPostsList({
  posts,
}: {
  posts?: AllDocumentTypes[];
}) {
  return (
    <div className="grid grid-cols-3 max-large:grid-cols-2 max-medium:grid-cols-1 gap-8">
      {posts?.map((post: AllDocumentTypes) => (
        <BlogPost key={post.id} post={post} />
      ))}
    </div>
  );
}
