import Image from "next/image";
import { ai_api, ai_keys, ai_konto } from "@/static/icons";

const items = [
    {
        id: 1,
        name: "API-Schnittstelle",
        description: "Für bestehende Systeme",
        icon: ai_api,
    },
    {
        id: 2,
        name: "Kontoauszüge",
        description: "Daueraufträge einbinden",
        icon: ai_konto,
    },
    {
        id: 3,
        name: "Heizkostenabrechnung",
        description: "PDF werden unterstützt",
        icon: ai_keys,
    },
];

export function UploadInfoItems() {
    return (
        <div className="grid grid-cols-3 max-megalarge:grid-cols-2 max-small:grid-cols-1 max-small:gap-4 max-medium:gap-8 gap-16">
            {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                    <span className="min-w-[55px] min-h-[60px] rounded-[5px] bg-[#E7E8EA] flex items-center justify-center">
                        <Image
                            src={item.icon}
                            alt={item.name}
                            width={24}
                            height={24}
                        />
                    </span>
                    <div>
                        <h3 className="font-bold text-[#757575]">
                            {item.name}
                        </h3>
                        <p className="text-[#757575]">
                            {item.description}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}