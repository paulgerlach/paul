// "use server";

// import { CreateObjekteUnitFormValues } from "@/components/Admin/Forms/CreateObjekteUnitForm";
// import database from "@/db";
// import { locals } from "@/db/drizzle/schema";
// import { supabaseServer } from "@/utils/supabase/server";

// export async function createLocal(formData: CreateObjekteUnitFormValues) {
//   const supabase = await supabaseServer();

//   const {
//     data: { user },
//     error,
//   } = await supabase.auth.getUser();

//   if (!user || error) {
//     throw new Error("Nicht authentifiziert");
//   }

//   await database.insert(locals).values({
//     objekt_id: formData.objekt_id,
//     type: formData.type,
//     unit_type: formData.unit_type,
//     available: formData.available ?? true,
//     status: formData.status,
//     name: formData.name,
//     created_at: new Date().toISOString(),
//   });
// }
