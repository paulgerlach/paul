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

  const { startDate, endDate, meterIds } = useChartStore();

  const handleShare = async () => {
    try {
      // Debug: Log current state
      console.log('Share Dialog Current State:', {
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        meterIds: meterIds,
        meterIdsLength: meterIds.length
      });

      // Create filters from current dashboard state
      // ALWAYS include current dates and meters to snapshot the exact dashboard state
      const filters: ShareFilters = {
        meterIds: meterIds.length > 0 ? meterIds : undefined,
        startDate: startDate?.toISOString().split("T")[0] || new Date().toISOString().split("T")[0],
        endDate: endDate?.toISOString().split("T")[0] || new Date().toISOString().split("T")[0],
      };

      console.log('Filters being sent:', filters);

      // Generate secure shareable URL (30 days expiry)
      const url = createShareableUrl(filters, 720); // 30 days
      const fullUrl = `${window.location.origin}${url}`;

      console.log('Generated URL:', fullUrl);

      setShareUrl(fullUrl);

      // Copy to clipboard
      await navigator.clipboard.writeText(fullUrl);
    } catch (error) {
      console.error("Failed to create share link:", error);
      alert("Failed to create share link. Please try again.");
    }
  };

  useEffect(() => {
    handleShare();
  }, [startDate, endDate, meterIds]); // Regenerate URL when state changes


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

  const handlePdfDownload = async () => {
    try {
      // Generate PDF of current dashboard state
      // For now, we'll create a simple text representation
      const dashboardData = {
        url: shareUrl,
        dateRange: `${startDate?.toLocaleDateString()} - ${endDate?.toLocaleDateString()}`,
        meters: meterIds.length > 0 ? meterIds.join(', ') : 'Alle Zähler',
        generatedAt: new Date().toLocaleString('de-DE')
      };

      const pdfContent = `
Dashboard Übersicht
===================

URL: ${dashboardData.url}
Zeitraum: ${dashboardData.dateRange}
Zähler: ${dashboardData.meters}
Erstellt am: ${dashboardData.generatedAt}
      `;

      // Create a simple text file for now (can be enhanced to actual PDF later)
      const blob = new Blob([pdfContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `Dashboard_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('Dashboard als Datei heruntergeladen');
    } catch (error) {
      console.error('Fehler beim PDF-Download:', error);
      alert('Fehler beim Herunterladen der PDF-Datei');
    }
  };

  const handleEmailShare = () => {
    try {
      const subject = encodeURIComponent('Dashboard Zugang - Verbrauchsdaten');
      const body = encodeURIComponent(`Hallo,

hier ist der Link zu Ihrem Dashboard mit den aktuellen Verbrauchsdaten:

${shareUrl}

Zeitraum: ${startDate?.toLocaleDateString()} - ${endDate?.toLocaleDateString()}
${meterIds.length > 0 ? `Zähler: ${meterIds.join(', ')}` : 'Alle Zähler verfügbar'}

Der Link ist 30 Tage gültig.

Mit freundlichen Grüßen`);

      const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;
      window.open(mailtoUrl, '_blank');
      
      console.log('E-Mail Client geöffnet');
    } catch (error) {
      console.error('Fehler beim E-Mail-Versand:', error);
      alert('Fehler beim Öffnen des E-Mail-Clients');
    }
  };

  const handleDocumentDownload = async () => {
    try {
      // Create a JSON file with dashboard configuration
      const dashboardConfig = {
        shareUrl,
        filters: {
          meterIds: meterIds.length > 0 ? meterIds : null,
          startDate: startDate?.toISOString().split('T')[0],
          endDate: endDate?.toISOString().split('T')[0],
        },
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
      };

      const blob = new Blob([JSON.stringify(dashboardConfig, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `dashboard-config_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('Dashboard-Konfiguration heruntergeladen');
    } catch (error) {
      console.error('Fehler beim Document-Download:', error);
      alert('Fehler beim Herunterladen des Dokuments');
    }
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
                <button 
                  onClick={handlePdfDownload}
                  className="cursor-pointer transition-opacity hover:opacity-80"
                  title="Als PDF herunterladen"
                >
                  <Image
                    width={0}
                    height={0}
                    sizes="100vw"
                    loading="lazy"
                    className="max-w-10 max-h-10 max-xl:max-w-6 max-xl:max-h-6"
                    src={pdf_icon}
                    alt={"pdf_icon"}
                  />
                </button>
                <button 
                  onClick={handleEmailShare}
                  className="cursor-pointer transition-opacity hover:opacity-80"
                  title="Per E-Mail teilen"
                >
                  <Image
                    width={0}
                    height={0}
                    sizes="100vw"
                    loading="lazy"
                    className="max-w-[35px] max-h-[35px] max-xl:max-w-6 max-xl:max-h-6"
                    src={gmail}
                    alt={"gmail_icon"}
                  />
                </button>
                <button 
                  onClick={handleDocumentDownload}
                  className="cursor-pointer transition-opacity hover:opacity-80"
                  title="Dokument herunterladen"
                >
                  <Image
                    width={0}
                    height={0}
                    sizes="100vw"
                    loading="lazy"
                    className="max-w-10 max-h-10 max-xl:max-w-6 max-xl:max-h-6"
                    src={doc_download}
                    alt={"doc_download"}
                  />
                </button>
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
                    onClick={() => {
                      methods.reset();
                      setCreateRule(false);
                    }}
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
