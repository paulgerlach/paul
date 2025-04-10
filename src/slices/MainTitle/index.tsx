import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `MainTitle`.
 */
export type MainTitleProps = SliceComponentProps<Content.MainTitleSlice>;

/**
 * Component for "MainTitle" Slices.
 */
const MainTitle: FC<MainTitleProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}>
      <h1 className="text-7xl max-megalarge:text-5xl mx-auto max-medium:text-3xl max-w-4xl font-medium text-center">
        {slice.primary.maintitle}
      </h1>
    </section>
  );
};

export default MainTitle;
