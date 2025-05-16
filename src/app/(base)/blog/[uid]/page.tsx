import FAQSection from "@/components/Basic/FAQ/FAQSection";
import Kostenfrei from "@/components/Basic/Kostenfrei/Kostenfrei";

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { asImageSrc } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";
import RecomendedBlogs from "@/components/Blog/RecomendedPosts";

type Params = { uid: string };

export default async function BlogPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const uid = (await params).uid;
  const client = createClient();
  const page = await client.getByUID("blogpost", uid).catch(() => notFound());

  return (
    <main id="content relative">
      <div className="px-20 max-medium:px-10 max-small:px-5">
        <div className="max-w-6xl mx-auto pt-4 space-y-7 max-large:pt-16 max-medium:pt-10 max-small:pt-5 mb-[52px] pb-4">
          <SliceZone
            context={page}
            slices={page.data.slices}
            components={components}
          />
        </div>
        <RecomendedBlogs current={uid} />
      </div>
      <FAQSection />
      <Kostenfrei />
    </main>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { uid } = await params;
  const client = createClient();

  const page = await client.getByUID("blogpost", uid).catch(() => notFound());

  return {
    title: "Heidi Systems",
    description: page.data.meta_description,
    openGraph: {
      images: [{ url: asImageSrc(page.data.meta_image) ?? "" }],
    },
  };
}
