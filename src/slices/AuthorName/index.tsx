import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `FirstName`.
 */
export type FirstNameProps = SliceComponentProps<Content.FirstNameSlice>;

/**
 * Component for "FirstName" Slices.
 */
const FirstName: FC<FirstNameProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}>
      <p className="font-medium text-xl">{slice.primary.authorname}</p>
    </section>
  );
};

export default FirstName;
