import { FC } from "react";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import RichTextBlockImage from "@/components/Basic/RichTextBlockImage/RichTextBlockImage";

/**
 * Props for `RichTextBlock`.
 */
export type RichTextBlockProps =
  SliceComponentProps<Content.RichTextBlockSlice>;

/**
 * Component for "RichTextBlock" Slices.
 */
const RichTextBlock: FC<RichTextBlockProps> = ({ slice }) => {
  return (
    <section
      className="max-w-3xl mx-auto space-y-7 richTextBlock"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}>
      <PrismicRichText
        components={{
          image: (props) => <RichTextBlockImage node={props.node} />,
        }}
        field={slice.primary.rishtextblock}
      />
    </section>
  );
};

export default RichTextBlock;
