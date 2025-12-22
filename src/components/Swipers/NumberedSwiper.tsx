"use client";

import Image from "next/image";
import { Swiper, type SwiperClass, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Controller } from "swiper/modules";
import {
  numbered_counter1,
  numbered_counter2,
  numbered_counter3,
  numbered_counter4,
  right_arrow,
} from "@/static/icons";
import Link from "next/link";
import { ROUTE_BLOG } from "@/routes/routes";
import type { NymberedSwiperDataItemType } from "@/types";
import { useState, useEffect } from "react";

export const items: NymberedSwiperDataItemType[] = [
  {
    mainImage: numbered_counter1,
    slides: [
      {
        text: "Kaltwasser-Funkgerät",
        title: "Hochpräzise Messung",
        longText:
          "Dank moderner Ultraschalltechnologie misst der Kaltwasserzähler den Verbrauch mit höchster Genauigkeit - ab dem ersten Tropfen.",
      },
      {
        text: "Kaltwasser-Funkgerät",
        title: "Akustische Leckageerkennung",
        longText:
          "Integrierte Sensoren identifizieren selbst kleinste Leckagen frühzeitig und helfen, Wasserverschwendung sowie Schäden zu vermeiden.",
      },
      {
        text: "Kaltwasser-Funkgerät",
        title: "Automatische Funkübertragung",
        longText:
          "Verbrauchsdaten werden kabellos in Echtzeit übermittelt, wodurch eine manuelle Ablesung entfällt und volle Transparenz gewährleistet wird.",
      },
      {
        text: "Kaltwasser-Funkgerät",
        title: "Langlebig & wartungsarm",
        longText:
          "Der Zähler ist für eine lange Lebensdauer konzipiert und widersteht dank robuster Bauweise und Schutzklasse IP68 selbst anspruchsvollen Umgebungsbedingungen.",
      },
    ],
  },
  {
    mainImage: numbered_counter2,
    slides: [
      {
        text: "Warmwasser-Funkgerät",
        title: "Präzise Messung",
        longText:
          "Die moderne Ultraschalltechnologie gewährleistet eine exakte Erfassung des Warmwasserverbrauchs - selbst bei minimalem Durchfluss.",
      },
      {
        text: "Warmwasser-Funkgerät",
        title: "Drahtlose Datenübertragung",
        longText:
          "Der integrierte Funkmodus sendet Verbrauchsdaten automatisch, wodurch eine manuelle Ablesung entfällt und der Verwaltungsaufwand minimiert wird.",
      },
      {
        text: "Warmwasser-Funkgerät",
        title: "Hohe Temperaturbeständigkeit",
        longText:
          "peziell für den Einsatz in Warmwasserleitungen entwickelt, bietet der Zähler zuverlässige Leistung auch bei dauerhaft hohen Temperaturen.",
      },
      {
        text: "Warmwasser-Funkgerät",
        title: "Langlebig & wartungsfrei",
        longText:
          "Dank hochwertiger Materialien und robuster Bauweise ist der Warmwasser-Funkzähler besonders widerstandsfähig und nahezu wartungsfrei im Betrieb.",
      },
    ],
  },
  {
    mainImage: numbered_counter3,
    slides: [
      {
        text: "Heizungszähler-Funkgerät",
        title: "Präzise Verbrauchserfassung",
        longText:
          "Durch moderne Ultraschalltechnologie werden Heizungsverbräuche exakt und zuverlässig gemessen, unabhängig von Temperaturschwankungen.",
      },
      {
        text: "Heizungszähler-Funkgerät",
        title: "Integrierte Leckageerkennung",
        longText:
          "Der Heizungszähler erkennt akustisch mögliche Leckagen und hilft so, frühzeitig Schäden zu vermeiden und Heizkosten zu optimieren.",
      },
      {
        text: "Heizungszähler-Funkgerät",
        title: "Digitale Fernablesung",
        longText:
          "Die Verbrauchsdaten werden automatisch per Funk übermittelt, sodass eine manuelle Ablesung entfällt und eine kontinuierliche Überwachung möglich ist.",
      },
      {
        text: "Heizungszähler-Funkgerät",
        title: "Robust & langlebig",
        longText:
          "Dank hochwertiger Materialien und Schutzklasse IP68 ist der Heizungszähler äußerst widerstandsfähig gegen äußere Einflüsse und für eine lange Lebensdauer ausgelegt.",
      },
    ],
  },
  {
    mainImage: numbered_counter4,
    slides: [
      {
        text: "Funk-Rauchmelder",
        title: "Automatische Alarmweiterleitung",
        longText:
          "Dank der integrierten Funktechnologie kommuniziert der Rauchmelder mit anderen Geräten und kann Alarme direkt an zentrale Systeme oder mobile Endgeräte weiterleiten.",
      },
      {
        text: "Funk-Rauchmelder",
        title: "Frühzeitige Rauchdetektion",
        longText:
          "Die fotoelektrische Sensorik erkennt selbst kleinste Rauchpartikel schnell und zuverlässig, wodurch Brände frühzeitig bemerkt und Schäden minimiert werden können.",
      },
      {
        text: "Funk-Rauchmelder",
        title: "Lange Batterielaufzeit",
        longText:
          "Mit einer Lebensdauer von bis zu 10 Jahren arbeitet der Funk-Rauchmelder wartungsarm und sorgt für dauerhafte Sicherheit ohne häufigen Batteriewechsel.",
      },
      {
        text: "Funk-Rauchmelder",
        title: "Einfache Vernetzung mehrerer \n Geräte",
        longText:
          "Mehrere Funk-Rauchmelder lassen sich miteinander verbinden, sodass bei Gefahr alle vernetzten Geräte gleichzeitig Alarm auslösen und eine flächendeckende Warnung ermöglichen.",
      },
    ],
  },
];

export default function NumberedSwiper() {
  const classNames: string[] = ["first", "second", "third", "fourth"];
  const [swipersMain, setSwipersMain] = useState<(SwiperClass | null)[]>([]);
  const [swipersSecond, setSwipersSecond] = useState<(SwiperClass | null)[]>(
    [],
  );

  const setSwiperMainAtIndex = (swiper: SwiperClass, index: number) => {
    setSwipersMain((prev) => {
      const newSwipers = [...prev];
      newSwipers[index] = swiper;
      return newSwipers;
    });
  };

  const setSwiperSecondAtIndex = (swiper: SwiperClass, index: number) => {
    setSwipersSecond((prev) => {
      const newSwipers = [...prev];
      newSwipers[index] = swiper;
      return newSwipers;
    });
  };

  useEffect(() => {
    swipersMain.forEach((mainSwiper, index) => {
      if (mainSwiper && swipersSecond[index]) {
        mainSwiper.controller.control = swipersSecond[index];
        swipersSecond[index]!.controller.control = mainSwiper;
      }
    });
  }, [swipersMain, swipersSecond]);

  return (
    <div className="p-[72px] max-large:p-6">
      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        navigation
        slidesPerView={1}
        className="swiper numbered-swiper !py-3.5 relative"
      >
        <div className="swiper-wrapper items-center">
          {items.map((item, index) => (
            <SwiperSlide
              key={index}
              className="swiper-slide rounded-base relative max-large:flex-col !flex items-center gap-9 justify-center"
            >
              <Image
                width={0}
                height={0}
                sizes="100vw"
                loading="lazy"
                className="absolute max-large:relative left-0 top-1/2 max-large:translate-y-0 -translate-y-1/2"
                src={item.mainImage}
                alt="numbered counter"
              />
              <Swiper
                modules={[Pagination, Controller]}
                spaceBetween={20}
                pagination={{
                  el: `.numbered-item-swiper-pagination-${classNames[index]}-first`,
                  clickable: true,
                  renderBullet: (index, className) =>
                    `<span class="${className}">${index + 1}</span>`,
                }}
                onSwiper={(swiper) => setSwiperMainAtIndex(swiper, index)}
                slidesPerView={1}
                controller={{ control: swipersSecond[index] || null }}
                direction="vertical"
                className={`swiper w-full !px-5 !pl-[440px] max-large:!pl-5 numbered-item-swiper--${classNames[index]}`}
              >
                <div className="swiper-wrapper">
                  {item.slides.map((slide) => (
                    <SwiperSlide
                      key={slide.title}
                      className="swiper-slide rounded-base !flex items-center justify-start gap-9 max-large:flex-col"
                    >
                      <div className="max-w-[594px] space-y-6">
                        <p className="font-bold text-base text-green">
                          {slide.text}
                        </p>
                        <h4 className="text-[45px] leading-[54px] max-medium:text-2xl text-dark_text">
                          {slide.title}
                        </h4>
                        <p>{slide.longText}</p>
                        <Link
                          className="group flex items-center text-link justify-start gap-1.5 cursor-pointer"
                          href={ROUTE_BLOG}
                        >
                          Mehr erfahren
                          <Image
                            width={0}
                            height={0}
                            sizes="100vw"
                            loading="lazy"
                            className="group-hover:translate-x-1 transition colored-to-blue -rotate-90"
                            src={right_arrow}
                            alt="right_arrow"
                          />
                        </Link>
                      </div>
                    </SwiperSlide>
                  ))}
                </div>
              </Swiper>
              <Swiper
                modules={[Pagination, Controller]}
                spaceBetween={20}
                slidesPerView={1}
                direction="vertical"
                controller={{ control: swipersMain[index] || null }}
                pagination={{
                  el: `.numbered-item-swiper-pagination-${classNames[index]}-second`,
                  clickable: true,
                  renderBullet: (index, className) =>
                    `<span class="${className}">${index + 1}</span>`,
                }}
                onSwiper={(swiper) => setSwiperSecondAtIndex(swiper, index)}
                className={`swiper w-0 numbered-item-swiper--${classNames[index]}`}
              >
                <div className="swiper-wrapper">
                  {item.slides.map((slide) => (
                    <SwiperSlide key={slide.title} className="swiper-slide" />
                  ))}
                </div>
              </Swiper>
              <div className="swiper-controllers max-medium:hidden">
                <div
                  className={`numbered-item-swiper-pagination-${classNames[index]}-first swiper-pagination`}
                ></div>
                <div
                  className={`numbered-item-swiper-pagination-${classNames[index]}-second swiper-pagination`}
                ></div>
              </div>
            </SwiperSlide>
          ))}
        </div>
      </Swiper>
    </div>
  );
}
