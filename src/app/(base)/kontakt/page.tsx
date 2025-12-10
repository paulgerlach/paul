import Kostenfrei from "@/components/Basic/Kostenfrei/Kostenfrei";
import Subscription from "@/components/Basic/Subscription/Subscription";
import ContactForm from "@/components/Kontakt/ContactForm";
import ChartSwiper from "@/components/Swipers/ChartSwiper";
import ReviewsSwiper from "@/components/Swipers/ReviewsSwiper";
import {
  fewocare,
  flyla,
  haus_hirst,
  ki_akademie,
  parkdepot,
  sameday,
  star,
  vitolos,
  wemolo,
} from "@/static/icons";
import Image from "next/image";

export default function KontaktPage() {
  return (
    <main id="content">
      <div className="grid grid-cols-2 max-medium:grid-cols-1 min-h-screen">
        <div className="bg-green/10 pt-4 pb-28 max-medium:py-16 max-small:pb-8 max-small:pt-20 flex flex-col items-center justify-center gap-11 max-small:gap-6 max-small:px-4">
          <p className="text-[35px] max-medium:text-2xl max-small:text-xl text-dark_text text-center">
            +1.000 Kunden vertrauen uns
          </p>
          <div className="flex items-center justify-around w-full max-small:flex-col max-small:gap-6">
            <div className="space-y-7">
              <div className="flex items-center justify-center gap-1">
                <Image
                  width={0}
                  height={0}
                  sizes="100vw"
                  loading="lazy"
                  className="golden-star"
                  src={star}
                  alt="star"
                />
                <Image
                  width={0}
                  height={0}
                  sizes="100vw"
                  loading="lazy"
                  className="golden-star"
                  src={star}
                  alt="star"
                />
                <Image
                  width={0}
                  height={0}
                  sizes="100vw"
                  loading="lazy"
                  className="golden-star"
                  src={star}
                  alt="star"
                />
                <Image
                  width={0}
                  height={0}
                  sizes="100vw"
                  loading="lazy"
                  className="golden-star"
                  src={star}
                  alt="star"
                />
                <Image
                  width={0}
                  height={0}
                  sizes="100vw"
                  loading="lazy"
                  className="golden-star"
                  src={star}
                  alt="star"
                />
              </div>
              <p className="text-dark_text text-lg max-small:text-base">5/5 Google Bewertungen</p>
            </div>
            <div className="space-y-7">
              <div className="flex items-center justify-center gap-1">
                <Image
                  width={0}
                  height={0}
                  sizes="100vw"
                  loading="lazy"
                  className="golden-star"
                  src={star}
                  alt="star"
                />
                <Image
                  width={0}
                  height={0}
                  sizes="100vw"
                  loading="lazy"
                  className="golden-star"
                  src={star}
                  alt="star"
                />
                <Image
                  width={0}
                  height={0}
                  sizes="100vw"
                  loading="lazy"
                  className="golden-star"
                  src={star}
                  alt="star"
                />
                <Image
                  width={0}
                  height={0}
                  sizes="100vw"
                  loading="lazy"
                  className="golden-star"
                  src={star}
                  alt="star"
                />
                <Image
                  width={0}
                  height={0}
                  sizes="100vw"
                  loading="lazy"
                  className="golden-star"
                  src={star}
                  alt="star"
                />
              </div>
              <p className="text-dark_text text-lg max-small:text-base">4.8 / 5 Trustpilot</p>
            </div>
          </div>
          <div className="grid max-w-md grid-cols-3 max-medium:grid-cols-2 gap-9 items-center">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="mx-auto opacity-20 h-10"
              src={fewocare}
              alt="accentro"
            />
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="mx-auto opacity-20 h-10"
              src={sameday}
              alt="vonovia"
            />
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="mx-auto opacity-20 h-10"
              src={flyla}
              alt="deutsche_wohnen"
            />
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="mx-auto opacity-20 h-7"
              src={vitolos}
              alt="deutsche_wohnen"
            />
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="mx-auto opacity-20 h-10"
              src={ki_akademie}
              alt="viessmann"
            />
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="mx-auto opacity-20 h-10"
              src={haus_hirst}
              alt="accentro"
            />
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="mx-auto col-span-2 opacity-20 h-8"
              src={parkdepot}
              alt="accentro"
            />
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="mx-auto opacity-20 h-8"
              src={wemolo}
              alt="vonovia"
            />
          </div>
        </div>
        <ContactForm />
      </div>
      <Kostenfrei />
      <ChartSwiper />
      <ReviewsSwiper />
      <Subscription />
    </main>
  );
}
