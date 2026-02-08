import { getAgencies, getAllUsers, getUsers } from "@/api";
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

	if (user?.permission === "super_admin") {
		users = await getAllUsers(["super_admin", "admin", "user"]);
	} else {
		if (!user?.agency_id)
			users = [];
		else {
			users = await getUsers(user?.agency_id, ["user", "admin"]);
		}
	}

  const agencies = await getAgencies();

	return (
		<Suspense fallback={<Loading />}>
			<AdminPageContent users={users} agencies={agencies} />
		</Suspense>
	);
}
