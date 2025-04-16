import { createClient } from "@/prismicio";
import * as prismic from "@prismicio/client";

export async function getAllBlogPosts({ tags }: { tags?: string[] } = {}) {
  const client = createClient();

  const allPosts = await client.getAllByType("blogpost", {
    orderings: {
      field: "document.first_publication_date",
      direction: "desc",
    },
    filters: tags ? [prismic.filter.any("document.tags", tags)] : [],
  });

  return allPosts;
}
