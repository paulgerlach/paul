<script lang="ts">
	import NewsletterForm from "$lib/components/Basic/NewsletterForm/NewsletterForm.svelte";

	// Next only confirms success; a failed signup shows nothing here.
	let showConfirmation = $state(false);
</script>

<div class="max-medium:w-full">
	<NewsletterForm variant="footer" onresult={(ok) => (showConfirmation = ok)} />

	<p class="mt-4 text-sm leading-4 text-dark_text">
		Bleiben Sie bei allen Themen auf dem aktuellsten Stand
	</p>
</div>
{#if showConfirmation}
	<div
		aria-hidden="true"
		onclick={() => (showConfirmation = false)}
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
	>
		<div
			aria-hidden="true"
			onclick={(e) => e.stopPropagation()}
			class="absolute flex flex-col items-center justify-center gap-8 rounded-2xl bg-white px-20 py-12"
		>
			<div class="text-xl">Danke! Ihre E-Mail wurde gesendet.</div>
			<button
				onclick={() => (showConfirmation = false)}
				class="flex items-center justify-center rounded-halfbase bg-green px-16 py-2 whitespace-nowrap text-dark_text hover:opacity-80"
			>
				Ok
			</button>
		</div>
	</div>
{/if}
