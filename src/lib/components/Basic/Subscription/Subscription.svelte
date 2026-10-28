<script lang="ts">
	import NewsletterForm from "$lib/components/Basic/NewsletterForm/NewsletterForm.svelte";

	let result = $state<boolean | null>(null);
</script>

<div class="py-14 max-small:px-4 max-small:py-8">
	<h2
		class="relative mx-auto mb-5 max-w-4xl text-center text-[30px] leading-9 text-dark_text max-small:mb-3 max-small:text-xl"
	>
		Zeit ist Geld. Sparen Sie beides.
	</h2>

	<NewsletterForm variant="section" onresult={(ok) => (result = ok)} />

	{#if result !== null}
		<p
			class={[
				"mt-2 text-center text-sm",
				result ? "text-green-600" : "text-red-600",
			]}
		>
			{result
				? "Danke! Ihre E-Mail wurde gesendet."
				: "Fehler! Bitte versuchen Sie es erneut."}
		</p>
	{/if}

	<p class="relative mx-auto mb-5 text-center text-sm leading-4 text-dark_text">
		Keine persönlichen Informationen werden gespeichert
	</p>
</div>
