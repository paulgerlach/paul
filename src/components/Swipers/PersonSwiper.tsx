"use client";

import { Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image, { type StaticImageData } from "next/image";
import {
  personSlide1,
  personSlide2,
  personSlide3,
  personSlide4,
  personSlide5,
  personSlideIcon1,
  personSlideIcon2,
  personSlideIcon3,
  personSlideIcon4,
  personSlideIcon5,
  personSlidePerson1,
  personSlidePerson2,
  personSlidePerson3,
  personSlidePerson4,
  personSlidePerson5,
} from "@/static/icons";

export type PersonSwiperSlideDataType = {
  image: StaticImageData;
  text: string;
  icon: StaticImageData;
  personIcon: StaticImageData;
  personName: string;
  personRole: string;
};

const personSwiperSlides: PersonSwiperSlideDataType[] = [
  {
    text: "Die Ablesungen und Verbrauchserfassungen laufen reibungslos und pünktlich ab – sowohl für uns als Hausverwaltung als auch für unsere Mieter.",
    personName: "Felix Gerlach, CEO &",
    personRole: "Geschäftsführer, Pro Gera",
    image: personSlide1,
    icon: personSlideIcon1,
    personIcon: personSlidePerson1,
  },
  {
    text: "Dank Heidi ist es egal, ob ich in Düsseldorf, München oder Berlin bin – ich habe jederzeitdie volle Transparenz über die Verbräuche.",
    personName: "Erik Brandenburg, CEO &",
    personRole: "Geschäftsführer, Carter Benson Group",
    image: personSlide2,
    icon: personSlideIcon2,
    personIcon: personSlidePerson2,
  },
  {
    text: "Heidi hat uns bei der Sanierung einer Gewerbefläche durch die Installation einer zuverlässigen Verbrauchserfassung optimal unterstützt.",
    personName: "Klaus Gsuck, Immobilienmanager",
    personRole: "Vitec Real Estate Management",
    image: personSlide3,
    icon: personSlideIcon3,
    personIcon: personSlidePerson3,
  },
  {
    text: "Mit Heidi Systems erfassen wir den Verbrauch vollautomatisch – das spart Aufwand und schafft Transparenz für uns und unsere Bewohner.",
    personName: "Fabian Höhne, CEO &",
    personRole: "Geschäftsführer, Vitolus",
    image: personSlide4,
    icon: personSlideIcon4,
    personIcon: personSlidePerson4,
  },
  {
    text: "[...] Wir haben durch Heidi Systems Funkzähler einbauen lassen. Die Installation lief reibungslos – jetzt haben wir alle Verbrauchsdaten zentral im Blick und sparen Zeit sowie Energie.",
    personName: "Ralf Glasenhauer,",
    personRole: "Leiter der Gemeinde",
    image: personSlide5,
    icon: personSlideIcon5,
    personIcon: personSlidePerson5,
  },
];

export default function PersonSwiper() {
  return (
    <div className="swiper !px-[72px] max-megalarge:!px-16 max-large:!px-6 max-medium:!px-5 mt-20 max-medium:mt-10 brands-swiper">
      <Swiper
        pagination={{ type: "bullets", clickable: true }}
        loop={true}
        slidesPerView={1}
        navigation
        modules={[Pagination, Navigation]}
        className="swiper-wrapper"
      >
        {personSwiperSlides.map((slide, index) => (
          <SwiperSlide
            key={index}
            className="swiper-slide max-medium:items-start max-medium:justify-start max-medium:!grid max-medium:grid-rows-2 max-medium:grid-cols-1 !flex items-stretch max-large:grid max-large:grid-cols-2 gap-[72px] max-large:gap-6 p-5 bg-dark_green rounded-base"
          >
            <div className="p-5 max-medium:p-0 flex flex-col items-start justify-between">
              <Image
                width={120}
                height={60}
                sizes="120px"
                loading="lazy"
                className={`w-fit max-w-[120px] max-h-[60px] max-medium:mb-16`}
                src={slide.icon}
                alt="vitolos"
              />
              <div className="flex-grow flex flex-col items-start justify-end space-y-10">
                <p className="text-white text-[27px] leading-[32.4px] max-medium:text-lg max-medium:leading-6">
                  „{slide.text}“
                </p>
                <div className="flex items-center gap-7">
                  <Image
                    width={100}
                    height={60}
                    sizes="100px"
                    loading="lazy"
                    className="w-[100px] h-[60px] rounded-base"
                    src={slide.personIcon}
                    alt="vonovia person"
                  />
                  <div className="space-y-1">
                    <p className="text-white/50 text-xl leading-6">
                      {slide.personName}
                    </p>
                    <p className="text-white/50 text-xl leading-6">
                      {slide.personRole}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="max-medium:h-full">
              <div className="size-[500px] max-medium:w-full max-medium:h-full max-large:size-fit">
                <Image
                  width={500}
                  height={500}
                  sizes="(max-width: 768px) 100vw, 500px"
                  loading="lazy"
                  className="size-[500px] rounded-base max-medium:w-full max-medium:h-full max-medium:object-cover max-large:size-fit"
                  src={slide.image}
                  alt="vonovia person"
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
