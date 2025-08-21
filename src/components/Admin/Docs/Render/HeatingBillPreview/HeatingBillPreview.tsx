import HeatingBillPreviewOne from "@/components/Admin/Docs/Render/HeatingBillPreview/HeatingBillPreviewOne";
import HeatingBillPreviewTwo from "./HeatingBillPreviewTwo";
import HeatingBillPreviewThree from "./HeatingBillPreviewThree";
import HeatingBillPreviewFour from "./HeatingBillPreviewFour";
import HeatingBillPreviewFive from "./HeatingBillPreviewFive";
import HeatingBillPreviewSix from "./HeatingBillPreviewSix";

export default function HeatingBillPreview() {
  return (
    <div className="py-[60px] space-y-[60px] px-[100px] bg-white">
      <HeatingBillPreviewOne />
      <HeatingBillPreviewTwo />
      <HeatingBillPreviewThree />
      <HeatingBillPreviewFour />
      <HeatingBillPreviewFive />
      <HeatingBillPreviewSix />
    </div>
  );
}
