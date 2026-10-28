import { getDb } from "$lib/server/db";
import { leads } from "$lib/server/db/schema";

export const saveLeadDB = async (email: string, source?: string) => {
	try {
		await getDb().insert(leads).values({ email, source });
	} catch (error) {
		console.error(error);
		throw error;
	}
};
