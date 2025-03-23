"use client";

import { ROUTE_DATENSCHUTZHINWEISE } from "@/routes/routes";
import {
  chart_slide_2,
  chart_slide_3,
  right_arrow,
  swiper_chart,
} from "@/static/icons";
import type { ChartSwiperType } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

export const slides: ChartSwiperType[] = [
  {
    image: (
      <Image
        width={0}
        height={0}
        sizes="100vw"
        loading="lazy"
        src={swiper_chart}
        alt="swiper_chart"
      />
    ),
    name: "Dashboard",
    title: "Ihr Verbrauch auf einen Blick",
    text: "Das Dashboard visualisiert Heizungs-, Warm- und Kaltwasserverbrauch und bietet eine klare, übersichtliche Darstellung.",
  },
  {
    image: (
      <div className="py-24 pl-[105px] max-large:pl-16 max-medium:pl-10 max-small:pl-5 max-large:py-16">
        <Image
          width={0}
          height={0}
          sizes="100vw"
          loading="lazy"
          src={chart_slide_2}
          alt="swiper_chart"
        />
      </div>
    ),
    name: "Analyse",
    title: "Datenbasierte Analyse",
    text: "Erhalten Sie präzise Einblicke in Ihren Energie- und Wasserverbrauch, erkennen Sie Trends frühzeitig und optimieren Sie Ihre Kosten nachhaltig.",
  },
  {
    image: (
      <div className="pt-24 max-large:pt-16">
        <Image
          width={0}
          height={0}
          sizes="100vw"
          loading="lazy"
          src={chart_slide_3}
          alt="swiper_chart"
        />
      </div>
    ),
    name: "Betriebskosten",
    title: "Effiziente Betriebskostenabrechnung",
    text: "Unsere intelligenten Funkzähler erfassen Heizungs-, Warm- und Kaltwasserverbräuche präzise und stellen die Daten direkt für eine rechtskonforme Abrechnung bereit.",
  },
];

export default function ChartSwiper() {
  return (
    <div className="!px-20 max-large:!px-16 max-medium:!px-10 max-small:!px-5 !my-16 max-small:!my-8">
      <Swiper
        slidesPerView={1}
        spaceBetween={0}
        mousewheel={true}
        modules={[Pagination]}
        breakpoints={{
          1024: {
            mousewheel: false,
          },
        }}
        pagination={{
          el: ".chart-swiper-pagination",
          clickable: true,
          renderBullet: function (index, className) {
            return `<span class="${className} custom-bullet">${slides[index].name}</span>`;
          },
        }}
        className="swiper chart-swiper relative">
        {slides.map((slide, index) => (
          <SwiperSlide
            key={index}
            data-slide-name={slide.name}
            className="swiper-slide rounded-base bg-[#EFEDEC] pl-[100px] max-large:pl-16 max-medium:pl-10 max-small:pl-5 !flex items-center justify-between max-medium:flex-col pt-10 max-medium:pt-5">
            <div className="max-w-xl">
              <h5 className="text-[45px] leading-[54px] mb-10 medium:text-2xl text-dark_text">
                {slide.title}
              </h5>
              <p className="text-lg text-dark_text mb-6">{slide.text}</p>
              <Link
                className="group flex text-link items-center justify-start gap-1.5 cursor-pointer"
                href={ROUTE_DATENSCHUTZHINWEISE}>
                Mehr erfahren
                <Image
                  width={0}
                  height={0}
                  sizes="100vw"
                  loading="lazy"
                  className="group-hover:translate-x-1 transition colored-to-black -rotate-90"
                  src={right_arrow}
                  alt="right_arrow"
                />
              </Link>
            </div>

            {slide.image}
          </SwiperSlide>
        ))}

        <div className="swiper-controllers max-medium:hidden">
          <div className="chart-swiper-pagination swiper-pagination"></div>
        </div>
      </Swiper>
    </div>
  );
}
