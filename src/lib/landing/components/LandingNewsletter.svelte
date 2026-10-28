<!--
  Newsletter signup of the landing footer. Posts JSON to /api/send-email and
  swaps the form for a thank-you line; without JS it's a plain form post to
  the same endpoint, which redirects back.
-->
<script lang="ts">
	import { newsletterEmailSchema } from "$lib/forms/newsletter";

	let email = $state("");
	let pending = $state(false);
	let done = $state(false);
	let error = $state<string | null>(null);
	let input = $state<HTMLInputElement>();

	async function onsubmit(event: SubmitEvent) {
		event.preventDefault();
		const parsed = newsletterEmailSchema.safeParse(email.trim());
		if (!parsed.success) {
			error = parsed.error.issues[0].message;
			input?.focus();
			return;
		}
		error = null;
		pending = true;
		let ok = false;
		try {
			const response = await fetch("/api/send-email", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: parsed.data }),
			});
			ok = response.ok;
		} catch {
			// network error: reported like a failed response
		}
		pending = false;
		if (ok) done = true;
		else
			error = "Das hat leider nicht geklappt. Bitte versuchen Sie es erneut.";
	}
</script>

<div class="f-nl">
	{#if done}
		<div class="f-ok" role="status">
			<i aria-hidden="true">
				<svg viewBox="0 0 12 10"
					><path
						d="M1 5l3.5 3.5L11 1"
						stroke="#1E322D"
						stroke-width="2"
						fill="none"
					/></svg
				>
			</i>
			Danke! Wir halten Sie auf dem Laufenden.
		</div>
	{:else}
		<form
			class={["f-form", error && "err"]}
			method="post"
			action="/api/send-email"
			novalidate
			{onsubmit}
		>
			<label class="sr-only" for="f-mail">E-Mail-Adresse</label>
			<input
				id="f-mail"
				name="email"
				type="email"
				autocomplete="email"
				placeholder="Wie lautet Ihre E-Mail?"
				aria-invalid={error ? true : undefined}
				aria-describedby={error ? "f-mail-err" : undefined}
				bind:value={email}
				bind:this={input}
				oninput={() => (error = null)}
			/>
			<button type="submit" disabled={pending}>Los geht’s</button>
		</form>
		{#if error}
			<p class="sr-only" id="f-mail-err" role="alert">{error}</p>
		{/if}
	{/if}
	<p class="f-hint">Bleiben Sie bei allen Themen auf dem aktuellsten Stand.</p>
</div>

<style>
	.f-nl {
		min-width: 0;
	}
	.f-form {
		display: flex;
		background: #fff;
		border-radius: 12px;
		padding: 6px;
		gap: 6px;
	}
	.f-form.err {
		box-shadow: 0 0 0 2px #e58f7a;
	}
	.f-form input {
		flex: 1;
		min-width: 0;
		border: 0;
		outline: 0;
		background: transparent;
		font-size: 16px;
		color: var(--ink);
		padding: 10px 12px;
	}
	.f-form input::placeholder {
		color: #8a9690;
	}
	.f-form button {
		border: 0;
		flex: none;
		border-radius: 9px;
		background: var(--accent);
		color: var(--ink);
		font-size: 16px;
		font-weight: 600;
		padding: 11px 20px;
		cursor: pointer;
		white-space: nowrap;
		transition: background 0.2s;
	}
	.f-form button:hover {
		background: #9fe0a3;
	}
	.f-form button:disabled {
		cursor: progress;
		opacity: 0.8;
	}
	.f-hint {
		font-size: 14px;
		color: rgba(255, 255, 255, 0.6);
		margin-top: 12px;
	}
	.f-ok {
		display: flex;
		align-items: center;
		gap: 10px;
		background: rgba(138, 214, 143, 0.14);
		border-radius: 12px;
		padding: 14px 16px;
		font-weight: 500;
	}
	.f-ok i {
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background: var(--accent);
		display: grid;
		place-items: center;
		flex: none;
	}
	.f-ok svg {
		width: 11px;
		height: 11px;
	}
</style>
