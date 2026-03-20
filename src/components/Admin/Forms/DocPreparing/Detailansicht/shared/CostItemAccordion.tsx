"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/Basic/ui/Form";
import FormDateInput from "@/components/Admin/Forms/FormDateInput";
import FormMoneyInput from "@/components/Admin/Forms/FormMoneyInput";
import FormRoundedCheckbox from "@/components/Admin/Forms/FormRoundedCheckbox";
import FormLocalsMultiselect from "@/components/Admin/Forms/FormLocalsMultiselect";
import FormSelectField from "@/components/Admin/Forms/FormSelectField";
import FormTextareaField from "@/components/Admin/Forms/FormTextareaField";
import { useHeizkostenabrechnungStore } from "@/store/useHeizkostenabrechnungStore";
import { buildLocalName, isFuelCostType } from "@/utils";
import { format } from "date-fns";
import { ChevronDown, ChevronUp, MoreVertical } from "lucide-react";
import { costItemSchema, CostItemFormValues } from "./types";

interface CostItemAccordionProps {
    costItem: any;
    isOpen: boolean;
    onToggle: () => void;
    locals: any[];
    purposeOptions: any[];
}

export default function CostItemAccordion({ costItem, isOpen, onToggle, locals, purposeOptions }: CostItemAccordionProps) {
    const { groupType, index, item } = costItem;
    const { updateDocumentGroupValues } = useHeizkostenabrechnungStore();
    const isFuelCost = isFuelCostType(groupType);

    const methods = useForm<CostItemFormValues>({
        resolver: zodResolver(costItemSchema),
        defaultValues: {
            invoice_date: item.invoice_date ? new Date(item.invoice_date) : new Date(),
            total_amount: item.total_amount ? Number(item.total_amount) : 0,
            service_period: item.service_period ?? false,
            for_all_tenants: item.for_all_tenants ?? true,
            direct_local_id: item.direct_local_id ?? null,
            purpose: item.purpose ?? "",
            notes: item.notes ?? "",
        }
    });

    const servicePeriod = methods.watch("service_period");
    const forAllTenants = methods.watch("for_all_tenants");

    useEffect(() => {
        const subscription = methods.watch((value) => {
            const parsed = costItemSchema.safeParse(value);
            if (parsed.success) {
                const formatted = {
                    ...parsed.data,
                    invoice_date: parsed.data.invoice_date ? format(parsed.data.invoice_date, "yyyy-MM-dd") : null,
                    total_amount: parsed.data.total_amount != null ? String(parsed.data.total_amount) : null,
                };
                updateDocumentGroupValues(groupType, index, formatted);
            }
        });
        return () => subscription.unsubscribe();
    }, [methods, updateDocumentGroupValues, groupType, index]);

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white mb-4 shadow-sm">
            <button
                type="button"
                className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
                onClick={onToggle}
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <span className="font-semibold text-gray-800">
                        Kostenart erkannt: {groupType}
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="font-semibold">{item.total_amount ? Number(item.total_amount).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }) : "0,00 €"}</span>
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
            </button>

            {isOpen && (
                <div className="p-6 border-t border-gray-200 bg-white">
                    <Form {...methods}>
                        <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-2 gap-7">
                                <FormDateInput<CostItemFormValues>
                                    control={methods.control}
                                    label="Rechnungsdatum"
                                    name="invoice_date"
                                />
                                <FormMoneyInput<CostItemFormValues>
                                    control={methods.control}
                                    label="Gesamtbetrag *"
                                    name="total_amount"
                                />
                            </div>

                            <div className="gap-2 grid grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 items-center">
                                <p className="text-sm text-gray-600 pr-4">
                                    Leistungszeitraum entspricht dem Rechnungsdatum.
                                </p>
                                <div className="rounded-full h-fit w-fit p-0.5 bg-[#EAEAEA] flex items-center justify-center lg:ml-0 xl:ml-auto">
                                    <button
                                        type="button"
                                        onClick={() => methods.setValue("service_period", false)}
                                        className={`text-sm py-1 px-8 rounded-full ${servicePeriod === false ? "bg-white shadow-sm" : "bg-transparent"} transition-all duration-300`}
                                    >
                                        Nein
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => methods.setValue("service_period", true)}
                                        className={`text-sm py-1 px-8 rounded-full ${servicePeriod === true ? "bg-white shadow-sm" : "bg-transparent"} transition-all duration-300`}
                                    >
                                        Ja
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <p className="text-[#757575] text-sm">Zahlungsempfänger</p>
                                <div className="p-4 space-y-4 border border-gray-200 rounded-md">
                                    <FormRoundedCheckbox<CostItemFormValues>
                                        control={methods.control}
                                        name="for_all_tenants"
                                        label="Für Alle Mieter der Liegenschaft"
                                        className="!mt-0 h-fit"
                                    />
                                    {!forAllTenants && (
                                        <FormLocalsMultiselect<CostItemFormValues>
                                            options={
                                                locals
                                                    ?.filter((local: any) => local.id !== undefined)
                                                    .map((local: any) => ({
                                                        label: buildLocalName(local),
                                                        value: local.id as string,
                                                    })) || []
                                            }
                                            control={methods.control}
                                            name="direct_local_id"
                                            label="Mieter auswählen *"
                                        />
                                    )}
                                </div>
                            </div>

                            <FormSelectField<CostItemFormValues>
                                control={methods.control}
                                name="purpose"
                                label="Zweck auswählen *"
                                placeholder=""
                                options={purposeOptions}
                            />

                            <FormTextareaField<CostItemFormValues>
                                control={methods.control}
                                name="notes"
                                label={isFuelCost ? "Menge in kWh" : "Anmerkungen"}
                                placeholder=""
                                rows={4}
                            />
                        </form>
                    </Form>
                </div>
            )}
        </div>
    );
}
