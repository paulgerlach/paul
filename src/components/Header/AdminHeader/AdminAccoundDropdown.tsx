import { chevron_admin, main_account } from "@/static/icons";
import Image from "next/image";

export default function AdminAccoundDropdown() {
  return (
    <button className="flex items-center gap-16 justify-between bg-transparent border-none cursor-pointer px-6 py-6 max-xl:py-4">
      <div className="flex items-center justify-start text-lg max-xl:text-sm whitespace-nowrap gap-2">
        <Image
          width={0}
          height={0}
          sizes="100vw"
          className="max-w-6 max-h-6 max-xl:max-w-4 max-xl:max-h-4"
          loading="lazy"
          style={{ width: "100%", height: "auto" }}
          alt="main_account"
          src={main_account}
        />
        Mein Konto
      </div>
      <Image
        width={0}
        height={0}
        sizes="100vw"
        className="max-w-4 max-h-5 max-xl:max-w-3 max-xl:max-h-4"
        loading="lazy"
        style={{ width: "100%", height: "auto" }}
        alt="chevron_admin"
        src={chevron_admin}
      />
    </button>
  );
}
