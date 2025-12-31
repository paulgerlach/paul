import { type HeatingBillPreviewData } from "./HeatingBillPreview";
import { ContractorType } from "@/types";
import { HeatingBillPreviewOneView } from "./HeatingBillPreviewOneView";

export default function HeatingBillPreviewOne({
  previewData,
  contractors,
}: {
  previewData: HeatingBillPreviewData;
  contractors: ContractorType[];
}) {
  return (
    <HeatingBillPreviewOneView
      previewData={previewData}
      contractors={contractors}
    />
  );
}
