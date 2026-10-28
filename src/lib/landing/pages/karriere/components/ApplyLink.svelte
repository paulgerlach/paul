<!--
  A "bewerben" link: a plain anchor to the form that, with JS, also chooses
  the role in the form, scrolls there and focuses the name field. The parent
  styles it through `class`.
-->
<script lang="ts">
	import type { Snippet } from "svelte";
	import type { RoleId } from "$lib/forms/application";
	import { APPLY_ID, getApplication } from "../application.svelte";

	let {
		role,
		class: className = "",
		children,
	}: { role: RoleId; class?: string; children: Snippet } = $props();

	const application = getApplication();
</script>

<a
	class={className}
	href="#{APPLY_ID}"
	onclick={(event) => {
		event.preventDefault();
		application.apply(role);
	}}>{@render children()}</a
>
