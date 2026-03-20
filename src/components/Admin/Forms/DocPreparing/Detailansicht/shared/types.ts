import { z } from "zod";

export const costItemSchema = z.object({
    invoice_date: z.coerce.date().nullable(),
    total_amount: z.coerce.number().min(1, "Pflichtfeld").nullable(),
    service_period: z.boolean().nullable(),
    for_all_tenants: z.boolean().nullable(),
    direct_local_id: z.array(z.string()).nullable(),
    purpose: z.string().min(1, "Pflichtfeld").nullable(),
    notes: z.string().nullable(),
});

export type CostItemFormValues = z.infer<typeof costItemSchema>;
