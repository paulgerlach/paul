"use client";

import { useDialogStore } from "@/store/useDIalogStore";
import DialogBase from "../ui/DialogBase";
import { useEffect, useState } from "react";
import { useShareStore } from "@/store/useShareStore";
import { Button } from "../ui/Button";
import { RoundedCheckbox } from "../ui/RoundedCheckbox";
import { doc_download, gmail, pdf_icon } from "@/static/icons";
import Image from "next/image";
import { Form } from "../ui/Form";
import FormInputField from "@/components/Admin/Forms/FormInputField";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormSelectField from "@/components/Admin/Forms/FormSelectField";

const formSchema = z.object({
  frequency: z.enum(["Monatlich", "Wöchentlich", "Täglich"], {
    required_error: "Bitte Frequenz auswählen",
  }),
  emailTitle: z.string().min(1, "Titel darf nicht leer sein"),
  message: z.string().min(1, "Nachricht darf nicht leer sein"),
});

type FormValues = z.infer<typeof formSchema>;

export default function ShareDashboardDialog() {
  const { openDialogByType } = useDialogStore();
  const isOpen = openDialogByType.share_dashboard;
  const [copied, setCopied] = useState<boolean>(false);
  const { shareUrl, generateShareUrl } = useShareStore();
  const [createRule, setCreateRule] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      generateShareUrl();
    }
  }, [isOpen, generateShareUrl]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (error) {
      console.error("Failed to copy:", error);
      alert("Failed to copy to clipboard");
    }
  };

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      frequency: "Monatlich",
      emailTitle: "",
      message: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    // send data to API etc.
  };

  if (isOpen)
    return (
      <DialogBase dialogName="share_dashboard" maxHeight={500}>
        <h3 className="text-xl font-bold text-dark_text">Dashbboard teilen</h3>

        {/* Description with better styling */}
        <div className="mb-6">
          <p className="text-sm text-dark_text/80 max-w-10/12 mb-4 leading-relaxed">
            Dashboard direkt an Mieter teilen und die Verbrauchsdaten
            übersichtlich zur Verfügung stellen.
          </p>

          {/* Enhanced URL input with copy functionality */}
          <div className="relative">
            <label
              htmlFor="shareable_url"
              className="text-[#757575] mb-1.5 text-sm"
            >
              Link mit Mietern teilen
            </label>
            <input
              type="text"
              id="shareable_url"
              name="shareable_url"
              value={shareUrl}
              readOnly
              className="w-full focus:outline-none p-6 pr-28 max-h-[70px] border border-black/20 rounded text-sm"
            />
            <Button
              onClick={copyToClipboard}
              className={`absolute max right-0 bottom-0 text-sm font-medium h-full max-h-[70px]`}
            >
              {copied ? (
                <span className="flex items-center gap-1">Kopiert!</span>
              ) : (
                <span className="flex items-center gap-1">Kopieren</span>
              )}
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-start space-y-2">
          {!createRule && (
            <div className="">
              <p className="text-[#757575] mb-1.5 text-sm">An Mieter teilen</p>
              <div className="grid items-center grid-cols-3 gap-4">
                <Image
                  width={0}
                  height={0}
                  sizes="100vw"
                  loading="lazy"
                  className="max-w-10 max-h-10 max-xl:max-w-6 max-xl:max-h-6"
                  src={pdf_icon}
                  alt={"pdf_icon"}
                />
                <Image
                  width={0}
                  height={0}
                  sizes="100vw"
                  loading="lazy"
                  className="max-w-[35px] max-h-[35px] max-xl:max-w-6 max-xl:max-h-6"
                  src={gmail}
                  alt={"gmail_icon"}
                />
                <Image
                  width={0}
                  height={0}
                  sizes="100vw"
                  loading="lazy"
                  className="max-w-10 max-h-10 max-xl:max-w-6 max-xl:max-h-6"
                  src={doc_download}
                  alt={"doc_download"}
                />
              </div>
            </div>
          )}
          <label
            htmlFor="create_rule"
            className="flex border-[#c4c4c4] transition-all duration-300 border w-fit rounded-full px-2.5 items-center gap-2 form-rounded-checkbox mt-4 py-2 cursor-pointer"
          >
            <RoundedCheckbox
              className="border border-[#c4c4c4]"
              name="create_rule"
              id="create_rule"
              onCheckedChange={(checked) => setCreateRule(!!checked)}
              checked={createRule}
            />
            Regel erstellen
          </label>
          {createRule && (
            <Form {...methods}>
              <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className="mt-4 flex flex-col space-y-4 w-full"
              >
                <FormSelectField<FormValues>
                  label="Frequenz"
                  name="frequency"
                  options={["Monatlich", "Wöchentlich", "Täglich"]}
                  placeholder="Frequenz auswählen"
                  control={methods.control}
                />

                {/* Email Titel */}

                <FormInputField<FormValues>
                  name="emailTitle"
                  control={methods.control}
                  label="Email Titel"
                  placeholder="Geben Sie den Email Titel ein"
                />

                {/* Nachricht */}
                <div>
                  <label className="block text-sm text-[#757575] mb-1">
                    Nachricht an Mieter
                  </label>
                  <textarea
                    rows={4}
                    {...methods.register("message")}
                    className="w-full border border-black/20 rounded p-2"
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={() => methods.reset()}
                    className="px-6 py-4 max-xl:px-3.5 max-xl:py-2 max-xl:text-sm cursor-pointer rounded-md bg-card_light border-none text-dark_green font-medium shadow-xs transition-all duration-300 hover:opacity-80"
                  >
                    Abbrechen
                  </button>
                  <Button type="submit" className="text-white">
                    Speichern
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </div>
      </DialogBase>
    );
}
