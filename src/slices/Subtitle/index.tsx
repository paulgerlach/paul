import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `Subtitle`.
 */
export type SubtitleProps = SliceComponentProps<Content.SubtitleSlice>;

/**
 * Component for "Subtitle" Slices.
 */
const Subtitle: FC<SubtitleProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}>
      {/* Placeholder component for subtitle (variation: {slice.variation}) Slices */}
      <h2 className="text-2xl max-megalarge:text-xl mx-auto max-medium:text-base max-w-5xl font-medium text-center">
        {slice.primary.subtitle}
      </h2>
    </section>
  );
};

export default Subtitle;
