"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/Basic/ui/Popover";
import { objekte_placeholder } from "@/static/icons";
import type { ObjektType } from "@/types";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/Basic/ui/Form";
import FormImageUpload from "@/components/Admin/Forms/FormImageUpload";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { editAdminObjektImageUrl } from "@/actions/edit/admin/editAdminObjektImageUrl";
import { Button } from "@/components/Basic/ui/Button";

const adminEditObjekteImageDialogSchema = z.object({
  image_url: z.string().url().nullable(),
});

export type AdminEditObjekteImageDialogValues = z.infer<
  typeof adminEditObjekteImageDialogSchema
>;

const defaultValues: AdminEditObjekteImageDialogValues = {
  image_url: null,
};

export default function AdminEditObjekteImageButton({
  item,
}: {
  item: ObjektType;
}) {
  const methods = useForm<AdminEditObjekteImageDialogValues>({
    resolver: zodResolver(adminEditObjekteImageDialogSchema),
    defaultValues: {
      image_url: item.image_url,
    },
  });
  const router = useRouter();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="cursor-pointer">
          {!!item.image_url ? (
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="min-w-[218px] h-[112px] max-xl:w-[180px] max-xl:h-[96px] flex items-center justify-center rounded-2xl max-xl:rounded-xl"
              src={item.image_url}
              alt={item.street}
            />
          ) : (
            <div className="min-w-[218px] h-[112px] max-xl:w-[180px] max-xl:h-[96px] flex items-center justify-center rounded-2xl max-xl:rounded-xl bg-[#E0E0E0]">
              <Image
                width={0}
                height={0}
                sizes="100vw"
                loading="lazy"
                className="max-w-[30px] max-h-[30px] max-xl:max-w-[24px] max-xl:max-h-[24px]"
                src={objekte_placeholder}
                alt="objekte_placeholder"
              />
            </div>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="min-w-[218px] max-xl:w-[180px] bg-white border-green shadow p-2">
        <Form {...methods}>
          <form
            className="space-y-2"
            onSubmit={methods.handleSubmit(async (data) => {
              try {
                await editAdminObjektImageUrl(
                  item.id ?? "",
                  data.image_url ?? ""
                );
                toast.success("Ausgabe wurde hinzugefügt.");
                methods.reset(defaultValues);
                router.refresh();
              } catch {
                toast.error("Fehler beim Speichern.");
              }
            })}
          >
            <FormImageUpload<AdminEditObjekteImageDialogValues>
              control={methods.control}
              name="image_url"
              objektId={item.id ?? ""}
            />
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                className="px-3.5 py-2 text-sm border border-black/20 cursor-pointer rounded-md bg-white text-admin_dark_text font-medium shadow-xs transition-all duration-300 hover:opacity-80"
                onClick={() => {
                  methods.reset(defaultValues);
                }}
              >
                Abbrechen
              </button>
              <Button
                type="submit"
                className="!font-medium !px-3.5 !py-2 max-xl:!text-sm"
              >
                Speichern
              </Button>
            </div>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
