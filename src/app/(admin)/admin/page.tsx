import { getUsers } from "@/api";
import { ROUTE_OBJEKTE, ROUTE_TOUR_DASHBOARD } from "@/routes/routes";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/utils/supabase/server";
import { Suspense } from "react";
import Loading from "./loading";
import AdminPageContent from "./AdminPageContent";
import { UserType } from "@/types";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tour_completed?: string }>;
}) {
	const params = await searchParams;
	const tourCompleted = params.tour_completed === "true";

	const supabase = await supabaseServer();
	const {
		data: { user: supabaseUser },
	} = await supabase.auth.getUser();
	let user:UserType|null = null;
	let users:UserType[] = [];
	console.log("Route to dashboard");
	// Skip tour check if user just completed tour
	if (!tourCompleted && supabaseUser) {
		const { data } = await supabase
			.from("users")
			.select("*")
			.eq("id", supabaseUser.id)
			.single();

		if (data && !data.has_seen_tour) {
			redirect(ROUTE_TOUR_DASHBOARD);
		} else {
			user = data as UserType;
		}
	}

	console.log('User in admin page============>', user)

	if (user?.permission === "super_admin")
		users = await getUsers(user?.agency_id ?? "", ["super_admin", "admin", "user"]);
	else
		users = await getUsers(user?.agency_id ?? "", ["user"]);

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
