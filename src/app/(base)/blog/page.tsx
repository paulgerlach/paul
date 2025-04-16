import Subscription from "@/components/Basic/Subscription/Subscription";
import BlogFilters from "@/components/Blog/BlogFilters";
import BlogHero from "@/components/Hero/BlogHero";

export default async function BlogPage() {
  return (
    <main id="content">
      <BlogHero />
      <BlogFilters />
      <div className="bg-[#FAFAF9] flex items-center gap-32 justify-center py-8 pl-5 px-4">
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-center font-semibold max-w-6xl mx-auto leading-[1.1] text-7xl max-megalarge:text-6xl max-large:text-5xl max-medium:text-4xl max-small:text-3xl">
            Melde dich für unseren Newsletter für Werbetreibende an.
          </p>
          <p className="text-lg max-large:text-base text-center font-semibold">
            Du wirst als Erstes über Unternehmensneuigkeiten, Events und
            Insights informiert.
          </p>
        </div>
      </div>
      <Subscription />
    </main>
  );
}
