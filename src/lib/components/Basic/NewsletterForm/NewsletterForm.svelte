<!--
  Newsletter signup posting to /api/send-email. Shared by the footer and the
  `Subscription` section; each shows the result its own way through `onresult`.
  A form action isn't used because the footer is on every route.
-->
<script lang="ts" module>
	import { z } from "zod";

	const emailSchema = z.email(
		"Bitte geben Sie eine gültige E-Mail-Adresse ein.",
	);

	const styles = {
		footer: {
			id: "footer_contact_email",
			input: "bg-white",
			error: "",
		},
		section: {
			id: "contact_email",
			input: "max-medium:text-center",
			error: "text-center",
		},
	};
</script>

<script lang="ts">
	type Props = {
		variant: keyof typeof styles;
		onresult: (ok: boolean) => void;
	};

	let { variant, onresult }: Props = $props();

	const style = $derived(styles[variant]);

	let email = $state("");
	let pending = $state(false);
	// Like react-hook-form: no error until a submit, then it follows the input
	let submitAttempted = $state(false);
	const error = $derived.by(() => {
		if (!submitAttempted) return null;
		const result = emailSchema.safeParse(email);
		return result.success ? null : result.error.issues[0].message;
	});

	async function onsubmit(e: SubmitEvent) {
		e.preventDefault();
		submitAttempted = true;
		if (error) return;

		pending = true;
		let ok = false;
		try {
			const response = await fetch("/api/send-email", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			});
			ok = response.ok;
		} catch {
			// network error: reported like a failed response
		}
		pending = false;

		if (ok) {
			email = "";
			submitAttempted = false;
		}
		onresult(ok);
	}
</script>

<form {onsubmit} class="relative mx-auto mb-4 w-fit max-medium:w-full">
	<label class="sr-only" for={style.id}>Los gehts</label>
	<input
		name="email"
		bind:value={email}
		class={[
			"min-w-[500px] rounded-halfbase border border-border_base px-7 py-5 text-xl leading-6 text-dark_text placeholder:text-xl placeholder:leading-6 placeholder:text-dark_text/50 max-medium:w-full max-small:min-w-fit max-small:px-4 max-small:py-3 max-small:text-base max-small:placeholder:text-base",
			style.input,
		]}
		placeholder="Wie lautet Ihre email?"
		type="email"
		id={style.id}
	/>
	<button
		class="absolute top-1.5 right-1.5 flex items-center justify-center rounded-halfbase bg-green px-8 py-4 text-xl leading-6 whitespace-nowrap text-dark_text duration-300 hover:opacity-80 max-medium:relative max-medium:right-0 max-medium:w-full max-small:px-6 max-small:py-3 max-small:text-base"
		type="submit"
		disabled={pending}
	>
		{pending ? "Senden..." : "Los gehts"}
	</button>
</form>

{#if error}
	<p class={["mt-2 text-sm text-red-600", style.error]}>{error}</p>
{/if}
