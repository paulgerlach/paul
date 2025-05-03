import { chevron_admin, main_account } from "@/static/icons";
import Image from "next/image";

export default function AdminAccoundDropdown() {
  return (
    <button className="flex items-center gap-4 justify-between bg-transparent border-none cursor-pointer px-6 py-3">
      <div className="flex items-center justify-start whitespace-nowrap gap-2">
        <Image
          width={0}
          height={0}
          sizes="100vw"
          className="max-w-4 max-h-5"
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
        className="max-w-4 max-h-5"
        loading="lazy"
        style={{ width: "100%", height: "auto" }}
        alt="chevron_admin"
        src={chevron_admin}
      />
    </button>
  );
}
