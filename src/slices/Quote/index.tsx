import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `Quote`.
 */
export type QuoteProps = SliceComponentProps<Content.QuoteSlice>;

/**
 * Component for "Quote" Slices.
 */
const Quote: FC<QuoteProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="max-w-3xl mx-auto">
      <div className="mx-auto border-l-4 border-green px-4  py-3 max-w-5xl">
        <p className="text-lg max-medium:text-sm max-megalarge:text-base">
          {slice.primary.qoute}
        </p>
      </div>
    </section>
  );
};

export default Quote;
