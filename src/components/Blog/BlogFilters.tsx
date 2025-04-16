"use client";

import { useEffect, useState } from "react";
import BlogPostsList from "./BlogPostsList";
import { getAllBlogPosts } from "@/utils/getAllBlogPosts";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../Basic/Spinner/Spinner";
import { AllDocumentTypes } from "../../../prismicio-types";

export default function BlogFilters() {
  const [activeTag, setActiveTag] = useState<string>("Alle");
  const [cachedPosts, setCachedPosts] = useState<
    AllDocumentTypes[] | undefined
  >([]);
  const [cachedTags, setCachedTags] = useState<string[]>(["Alle"]);
  const { data: posts } = useQuery({
    queryKey: ["blogPosts", activeTag],
    queryFn: () =>
      getAllBlogPosts({ tags: activeTag !== "Alle" ? [activeTag] : [] }),
  });

  useEffect(() => {
    if (posts) {
      setCachedPosts(posts);
      const allTags = Array.from(new Set(posts?.flatMap((post) => post.tags)));
      setCachedTags(["Alle", ...allTags]);
    }
  }, [posts]);

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto px-4 min-h-dvh py-16">
      <div className="flex items-center justify-start gap-8 mb-4 flex-wrap">
        {cachedTags?.map((tag) => (
          <button
            key={tag}
            className={`cursor-pointer flex items-center justify-center gap-1.5 text-center w-fit py-2 max-medium:py-3 px-5 text-sm text-dark_text rounded-halfbase my-5 transition-all duration-300 hover:bg-green/80 active:bg-green/90 disabled:bg-green/50 disabled:cursor-not-allowed ${
              activeTag === tag ? "bg-green" : "bg-green/30 text-gray-700"
            }`}
            onClick={() => setActiveTag(tag)}>
            {tag}
          </button>
        ))}
      </div>
      <BlogPostsList posts={cachedPosts} />
    </div>
  );
}
