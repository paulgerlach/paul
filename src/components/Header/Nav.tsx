"use client";

import {
  ROUTE_BLOG,
  ROUTE_FUNKTIONEN,
  ROUTE_GERAETE,
  ROUTE_HOME,
  ROUTE_PREISE,
} from "@/routes/routes";
import {
  arrow,
  blog_dropdown,
  blog_group_link,
  modal_bell,
  modal_building,
  modal_chart,
  modal_cooler,
  modal_counter,
  modal_gear,
  modal_grid,
  modal_heater,
  modal_list,
  modal_shower,
  modal_water,
  modal_wifi,
} from "@/static/icons";
import type { NavGroupLink, NavGroupType } from "@/types";
import NavGroup from "./NavGroup";
import Link from "next/link";
import Image from "next/image";
import NavFunktionenRightSide from "./NavFunktionenRightSide";
import { getAllBlogPosts } from "@/utils/getAllBlogPosts";
import { useQuery } from "@tanstack/react-query";
import { Content } from "@prismicio/client";

export default function Nav() {
  const { data: posts } = useQuery({
    queryKey: ["navBlogPosts"],
    queryFn: () => getAllBlogPosts(),
  });

  const lastPost = posts?.[0].data.slices;
  const lastSixPosts = posts?.slice(0, 6);
  const mainTitleSlice = lastPost?.find(
    (slice) => slice.slice_type === "main_title"
  ) as Content.MainTitleSlice;
  const lastPostTitle = mainTitleSlice?.primary.maintitle;
  const mainSubtitleSlice = lastPost?.find(
    (slice) => slice.slice_type === "subtitle"
  ) as Content.SubtitleSlice;
  const lastPostSubtitle = mainSubtitleSlice?.primary.subtitle;
  const lastPostImageSlice = lastPost?.find(
    (slice) => slice.slice_type === "blog_image"
  ) as Content.BlogImageSlice;
  const lastPostImage = lastPostImageSlice?.primary.blogMainImage;

  const blogGroup: NavGroupType | null =
    posts && posts.length > 0
      ? {
        route: ROUTE_BLOG,
        title: "Blog",
        groupTitle: "Unsere Blog Artikel",
        rightSide: (
          <Link className="group" href={`${ROUTE_BLOG}/${posts[0].uid}`}>
            <p className="mb-5 text-xl flex items-center justify-between text-dark_text">
              Blog Artikel Highlights
              <Image
                width={0}
                height={0}
                sizes="100vw"
                className="size-2.5 max-w-2.5 max-h-2.5"
                loading="lazy"
                style={{ width: "100%", height: "auto" }}
                alt="arrow"
                src={arrow}
              />
            </p>
            <div className="rounded-base mb-2.5 flex items-center justify-center">
              <Image
                width={0}
                height={0}
                sizes="100vw"
                loading="lazy"
                className="min-h-[150px] object-cover rounded-2xl"
                style={{ width: "100%", height: "auto" }}
                src={lastPostImage.url || ""}
                alt={lastPostImage.alt || "blog_image"}
              />
            </div>
            <p className="text-dark_text text-[15px] font-bold mb-3">
              {lastPostTitle}
            </p>
            <p className="text-xs text-dark_text">{lastPostSubtitle}</p>
          </Link>
        ),
        groupLinks:
          lastSixPosts
            ?.map((post) => {
              const mainTitleSlice = post.data.slices.find(
                (slice) => slice.slice_type === "main_title"
              ) as Content.MainTitleSlice | undefined;

              const title = mainTitleSlice?.primary?.maintitle || "";

              if (!title) return null;

              return {
                title,
                icon: blog_group_link,
                link: `${ROUTE_BLOG}/${post.uid}`,
              } as NavGroupLink;
            })
            .filter((link): link is NavGroupLink => link !== null) || [],
      }
      : null;

  const navGroups: NavGroupType[] = [
    {
      groupLinks: [
        {
          icon: modal_heater,
          title: "Heizungszähler",
        },
        {
          title: "Warmwasserzähler",
          icon: modal_water,
        },
        {
          title: "Kaltwasserzähler",
          icon: modal_shower,
        },
        {
          icon: modal_wifi,
          title: "Rauchmelder",
        },
        {
          title: "Feuerlöscher",
          icon: modal_cooler,
        },
        {
          icon: modal_heater,
          title: "Sonstiges",
        },
      ],
      route: ROUTE_GERAETE,
      title: "Geräte",
      groupTitle: "Unsere Produkte",
      rightSide: (
        <Link className="group" href={ROUTE_GERAETE}>
          <p className="mb-5 text-xl flex items-center justify-between text-dark_text">
            Produkthighlight
            <Image
              width={0}
              height={0}
              sizes="100vw"
              className="size-2.5 max-w-2.5 max-h-2.5"
              loading="lazy"
              style={{ width: "100%", height: "auto" }}
              alt="arrow"
              src={arrow}
            />
          </p>
          <div className="rounded-base mb-2.5 bg-[#D9D9D9]/50 flex items-center justify-center py-5 px-12">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              style={{ width: "100%", height: "auto" }}
              src={modal_counter}
              alt="counter mobile"
            />
          </div>
          <p className="text-dark_text text-[15px] font-bold mb-3">
            Neue Warmwasserzähler
          </p>
          <p className="text-xs text-dark_text">
            Neuste Funktechnik erlaubt das Ablesen des Warmwasserverbrauchs in
            Echtzeit
          </p>
        </Link>
      ),
    },
    {
      route: ROUTE_FUNKTIONEN,
      title: "Funktionen",
      groupTitle: "Funktionen",
      rightSide: <NavFunktionenRightSide />,
      groupLinks: [
        {
          title: "Betriebskosten",
          icon: modal_gear,
        },
        {
          title: "Heizkostenabrechnung",
          icon: modal_list,
        },
        {
          title: "Echtzeit Verbrauch",
          icon: modal_chart,
        },
        {
          title: "Dashboard",
          icon: modal_grid,
        },
        {
          title: "Immobilienmanagement",
          icon: modal_building,
        },
        {
          title: "Benachrichtigungen",
          icon: modal_bell,
        },
      ],
    },
    ...(blogGroup ? [blogGroup] : []),
  ];

  const handleBurgerMenu = () => {
    const burger = document.querySelector(".burger");
    if (!burger) return;

    const menu = burger.parentNode as HTMLDivElement | null;
    if (menu) {
      burger.classList.remove("active");
      menu.classList.remove("active");
      document.documentElement.classList.remove("_lock");
    }
  };

  return (
    <nav className="flex items-center justify-center gap-8 max-medium:gap-4 max-large:flex-col max-large:items-start max-large:justify-start">
      {navGroups.map((group) => (
        <NavGroup key={group.title} group={group} />
      ))}
      <Link
        onClick={() => handleBurgerMenu()}
        href={ROUTE_HOME}
        className="flex items-center text-base max-xl:text-sm text-dark_text justify-start gap-2 max-large:text-dark_text">
        Kunden
      </Link>

      <Link
        onClick={() => handleBurgerMenu()}
        href={ROUTE_PREISE}
        className="flex items-center text-base max-xl:text-sm text-dark_text justify-start gap-2 max-large:text-dark_text">
        Preise
      </Link>
    </nav>
  );
}
