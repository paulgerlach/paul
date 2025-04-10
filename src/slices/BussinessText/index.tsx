import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `BussinessText`.
 */
export type BussinessTextProps =
  SliceComponentProps<Content.BussinessTextSlice>;

/**
 * Component for "BussinessText" Slices.
 */
const BussinessText: FC<BussinessTextProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="text-center max-w-3xl mx-auto space-y-7 px-4">
      {slice.primary.bussinesstextitem?.map((text, index) => (
        <p
          key={index}
          className="text-lg max-megalarge:text-base max-medium:text-sm font-medium text-center">
          {text.bussinesstextitem}
        </p>
      ))}
    </section>
  );
};

export default BussinessText;
