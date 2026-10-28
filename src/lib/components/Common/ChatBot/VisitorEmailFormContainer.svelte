<script lang="ts">
	import { getChatContext } from "$lib/chat/context";

	const chat = getChatContext();
	const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	let email = $state("");
	let emailError = $state("");
	const isEmailValid = $derived(EMAIL_RE.test(email));

	async function onsubmit(e: SubmitEvent) {
		e.preventDefault();

		if (!email.trim()) {
			emailError = "Bitte geben Sie eine E-Mail-Adresse ein.";
			return;
		}
		if (!isEmailValid) {
			emailError = "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
			return;
		}

		const res = await fetch("/api/leads", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, source: "Heidi Website" }),
		}).catch(() => null);
		if (!res?.ok) {
			// Next threw here and showed nothing
			const body = await res?.json().catch(() => null);
			emailError = body?.error ?? "Serverfehler. Bitte erneut versuchen.";
			return;
		}

		const submitted = email;
		chat.startWithEmail(submitted);
		emailError = "";
		email = "";

		if (!chat.isExistingClient) {
			await chat.slack.send(
				`Hallo, ich bin ein Besucher (nicht registrierter Nutzer) und benötige Unterstützung. Meine E-Mail-Adresse für die Kontaktaufnahme: ${submitted}`,
			);
		}
	}
</script>

<div
	class="absolute bottom-0 left-0 flex w-full flex-col gap-4 rounded-2xl border border-slate-300 bg-white p-6 shadow-sm"
>
	<p class="text-sm font-medium text-slate-700">
		Geben Sie Ihre E-Mail ein, um den Chat zu starten
	</p>

	<form
		{onsubmit}
		class="sm:flex-row flex flex-col items-stretch gap-2"
		novalidate
	>
		<div class="flex-1">
			<input
				type="email"
				placeholder="ihre@email.de"
				required
				class={[
					"w-full rounded-xl border px-4 py-2.5 text-sm text-slate-800 transition placeholder:text-slate-400 focus:border-black focus:ring-2 focus:ring-black/20 focus:outline-none",
					emailError
						? "border-red-500 focus:border-red-500 focus:ring-red-200"
						: "border-slate-300",
				]}
				bind:value={email}
				oninput={() => (emailError = "")}
				aria-describedby={emailError ? "email-error" : undefined}
			/>
			{#if emailError}
				<p id="email-error" class="mt-1 text-sm text-red-600">{emailError}</p>
			{/if}
		</div>

		<button
			type="submit"
			disabled={!isEmailValid}
			class={[
				"rounded-xl bg-dark_green px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:scale-[1.02] hover:bg-dark_green/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
				isEmailValid ? "cursor-pointer" : "cursor-not-allowed",
			]}
		>
			Chat starten
		</button>
	</form>
</div>
