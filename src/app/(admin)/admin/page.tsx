import { getUsers } from "@/api";
import { ROUTE_OBJEKTE, ROUTE_TOUR_DASHBOARD } from "@/routes/routes";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/utils/supabase/server";
import { Suspense } from "react";
import Loading from "./loading";
import AdminPageContent from "./AdminPageContent";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tour_completed?: string }>;
}) {
	const params = await searchParams;
	const tourCompleted = params.tour_completed === "true";

	const supabase = await supabaseServer();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	console.log("Route to dashboard");
	// Skip tour check if user just completed tour
	if (!tourCompleted && user) {
		const { data } = await supabase
			.from("users")
			.select("has_seen_tour")
			.eq("id", user.id)
			.single();

		if (data && !data.has_seen_tour) {
			redirect(ROUTE_TOUR_DASHBOARD);
		}
	}

	const users = await getUsers();
	console.log("Fetched users for admin page:", users);

	// Sort alphabetically by email
	// users.sort((a, b) => {
	//   const emailA = a.email?.toLowerCase() || '';
	//   const emailB = b.email?.toLowerCase() || '';
	//   return emailA.localeCompare(emailB);
	// });

	return (
		<Suspense fallback={<Loading />}>
			<AdminPageContent users={users} />
		</Suspense>
	);
}
