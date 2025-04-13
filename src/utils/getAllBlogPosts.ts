import { createClient } from "@/prismicio";

export async function getAllBlogPosts() {
  const client = createClient();

  const allPosts = await client.getAllByType("blogpost", {
    orderings: {
      field: "document.first_publication_date",
      direction: "desc",
    },
  });

  return allPosts;
}
