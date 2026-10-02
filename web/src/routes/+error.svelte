<script lang="ts">
	import { page } from "$app/state";

	const button =
		"cursor-pointer rounded-halfbase border-none px-5 py-2.5 text-base text-white";
</script>

<div
	class="flex min-h-screen flex-col items-center justify-center bg-base-bg p-5 text-center text-admin_dark_text"
>
	{#if page.status === 404}
		<h1 class="mb-5 text-[3em]">Seite nicht gefunden</h1>
		<p class="mb-7.5 text-[1.2em]">
			Entschuldigung, die von Ihnen gesuchte Seite existiert nicht.
		</p>
		<a href="/" class="{button} bg-dark_green">Zur Startseite</a>
	{:else}
		<h1 class="mb-5 text-[3em]">Ein Fehler ist aufgetreten!</h1>
		<p class="mb-7.5 text-[1.2em]">
			Es tut uns leid, aber etwas ist schief gelaufen.
			<br />
			Bitte versuchen Sie es später noch einmal oder kehren Sie zur vorherigen Seite
			zurück.
		</p>
		<div class="flex gap-2.5">
			<button class="{button} bg-green" onclick={() => location.reload()}>
				Nochmal versuchen
			</button>
			<button class="{button} bg-dark_green" onclick={() => history.back()}>
				Zurück zur vorherigen Seite
			</button>
		</div>
	{/if}
</div>
