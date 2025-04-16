import Subscription from "@/components/Basic/Subscription/Subscription";
import BlogFilters from "@/components/Blog/BlogFilters";
import BlogHero from "@/components/Hero/BlogHero";

export default async function BlogPage() {
  return (
    <main id="content">
      <BlogHero />
      <BlogFilters />
      <Subscription />
    </main>
  );
}
