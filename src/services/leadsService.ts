import database from "@/db";
import { leads } from "@/db/drizzle/schema";

export const saveLeadDB = async (email: string, source:string) => {
  try {
    database.insert(leads).values({
      email: email,
      source: source
    })
  } catch (error) {
    console.error(error)
    throw error;
  }
}