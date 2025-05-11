import { dots_button, trend_check, trend_down, trend_up } from "@/static/icons";
import { type ObjektType } from "@/types";
import Image from "next/image";

export default function ObjekteItem({ item }: { item: ObjektType }) {
  const renderTradeIcon = () => {
    switch (item.status) {
      case "full":
        return trend_check;
      case "higher":
        return trend_up;
      case "lower":
        return trend_down;
    }
  };
  const renderTradeColor = () => {
    switch (item.status) {
      case "full":
        return "#8AD68F";
      case "higher":
        return "#8AD68F";
      case "lower":
        return "#E08E3A";
    }
  };

  return (
    <div className="bg-white p-4 rounded-2xl flex items-center justify-between">
      <div className="flex items-center justify-start gap-8">
        <Image
          width={0}
          height={0}
          sizes="100vw"
          loading="lazy"
          className="max-w-[218px] max-h-[112px] rounded-2xl"
          src={item.image}
          alt={item.street}
        />
        <div>
          <p className="text-2xl text-dark_green">{item.street}</p>
          <p className="text-base text-dark_green/50">
            {item.privateLocals ? `${item.privateLocals} Wohneinheiten` : ""}
            {item.commercialLocals
              ? `, ${item.commercialLocals} Gewerbeeinheiten`
              : ""}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-end gap-7">
        <div className="rounded-xl min-h-[100px] min-w-[170px] flex flex-col justify-between bg-white drop-shadow-xl p-3">
          <p className="text-xs font-bold">Leerstandsquote</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">{item.percent}%</p>
              <p
                className="text-xs whitespace-nowrap"
                style={{ color: renderTradeColor() }}>
                {item.message}
              </p>
            </div>
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="max-w-7 max-h-5"
              src={renderTradeIcon()}
              alt="trade icon"
            />
          </div>
        </div>
        <button className="size-4 border-none bg-transparent cursor-pointer flex items-center justify-center">
          <Image
            width={0}
            height={0}
            sizes="100vw"
            loading="lazy"
            className="max-w-4 max-h-4"
            src={dots_button}
            alt="dots button"
          />
        </button>
      </div>
    </div>
  );
}
