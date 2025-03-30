"use client";

import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image, { type StaticImageData } from "next/image";
import { play, vitolos, vonovia_person } from "@/static/icons";

export type PersonSwiperSlideDataType = {
  image: StaticImageData;
  text: string;
  name: string;
};

const personSwiperSlides: PersonSwiperSlideDataType[] = [
  {
    text: "Seit der Einführung von Heidi haben wir unseren internen Arbeitsaufwand deutlich reduziert. Die automatische Erfassung und digitale Verarbeitung der Verbrauchsdaten erleichtert die Abrechnung und spart wertvolle Zeit.",
    name: "Fabian Höhne, Vitolus",
    image: vonovia_person,
  },
  {
    text: "Seit der Einführung von Heidi haben wir unseren internen Arbeitsaufwand deutlich reduziert. Die automatische Erfassung und digitale Verarbeitung der Verbrauchsdaten erleichtert die Abrechnung und spart wertvolle Zeit.",
    name: "Fabian Höhne, Vitolus",
    image: vonovia_person,
  },
  {
    text: "Seit der Einführung von Heidi haben wir unseren internen Arbeitsaufwand deutlich reduziert. Die automatische Erfassung und digitale Verarbeitung der Verbrauchsdaten erleichtert die Abrechnung und spart wertvolle Zeit.",
    name: "Fabian Höhne, Vitolus",
    image: vonovia_person,
  },
  {
    text: "Seit der Einführung von Heidi haben wir unseren internen Arbeitsaufwand deutlich reduziert. Die automatische Erfassung und digitale Verarbeitung der Verbrauchsdaten erleichtert die Abrechnung und spart wertvolle Zeit.",
    name: "Fabian Höhne, Vitolus",
    image: vonovia_person,
  },
  {
    text: "Seit der Einführung von Heidi haben wir unseren internen Arbeitsaufwand deutlich reduziert. Die automatische Erfassung und digitale Verarbeitung der Verbrauchsdaten erleichtert die Abrechnung und spart wertvolle Zeit.",
    name: "Fabian Höhne, Vitolus",
    image: vonovia_person,
  },
];

export default function PersonSwiper() {
  return (
    <div className="swiper !px-[72px] max-megalarge:!px-16 max-large:!px-6 max-medium:!px-5 mt-20 max-medium:mt-10 brands-swiper">
      <Swiper
        pagination={{ type: "bullets", clickable: true }}
        loop={true}
        slidesPerView={1}
        modules={[Pagination]}
        className="swiper-wrapper">
        {personSwiperSlides.map((slide, index) => (
          <SwiperSlide
            key={index}
            className="swiper-slide max-medium:items-start max-medium:justify-start max-medium:!grid max-medium:grid-rows-2 max-medium:grid-cols-1 !flex items-stretch max-large:grid max-large:grid-cols-2 gap-[72px] max-large:gap-6 p-5 bg-dark_green rounded-base">
            <div className="p-5 max-medium:p-0 flex flex-col items-start justify-between">
              <Image
                width={0}
                height={0}
                sizes="100vw"
                loading="lazy"
                className="whiteImage w-fit max-medium:mb-16"
                src={vitolos}
                alt="vitolos"
              />
              <div className="flex-grow flex flex-col items-start justify-end space-y-10">
                <p className="text-white text-[27px] leading-[32.4px] max-medium:text-lg max-medium:leading-6">
                  „{slide.text}“
                </p>
                <p className="text-white/50 text-xl leading-6">{slide.name}</p>
              </div>
            </div>
            <div className="max-medium:h-full">
              <div className="size-[500px] max-medium:w-full max-medium:h-full max-large:size-fit relative">
                <Image
                  loading="lazy"
                  className="size-[500px] max-medium:w-full max-medium:h-full max-medium:object-cover max-large:size-fit"
                  src={slide.image}
                  alt="vonovia person"
                />
                <button
                  type="button"
                  className="size-12 absolute cursor-pointer rounded-full bg-green left-[33px] bottom-[26px] flex items-center justify-center">
                  <Image
                    width={0}
                    height={0}
                    sizes="100vw"
                    loading="lazy"
                    src={play}
                    alt="play"
                  />
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
