<!-- Markup only. Phase 7 wires up the newsletter submission. -->
<div class="py-14 max-small:px-4 max-small:py-8">
	<h2
		class="relative mx-auto mb-5 max-w-4xl text-center text-[30px] leading-9 text-dark_text max-small:mb-3 max-small:text-xl"
	>
		Zeit ist Geld. Sparen Sie beides.
	</h2>

	<form
		class="relative mx-auto mb-4 w-fit max-medium:w-full"
		onsubmit={(e) => e.preventDefault()}
	>
		<label class="sr-only" for="contact_email">Los gehts</label>
		<input
			name="email"
			class="min-w-[500px] rounded-halfbase border border-border_base px-7 py-5 text-xl leading-6 text-dark_text placeholder:text-xl placeholder:leading-6 placeholder:text-dark_text/50 max-medium:w-full max-medium:text-center max-small:min-w-fit max-small:px-4 max-small:py-3 max-small:text-base max-small:placeholder:text-base"
			placeholder="Wie lautet Ihre email?"
			type="email"
			id="contact_email"
		/>
		<button
			class="absolute top-1.5 right-1.5 flex items-center justify-center rounded-halfbase bg-green px-8 py-4 text-xl leading-6 whitespace-nowrap text-dark_text duration-300 hover:opacity-80 max-medium:relative max-medium:right-0 max-medium:w-full max-small:px-6 max-small:py-3 max-small:text-base"
			type="submit"
			disabled
		>
			Los gehts
		</button>
	</form>

	<p class="relative mx-auto mb-5 text-center text-sm leading-4 text-dark_text">
		Keine persönlichen Informationen werden gespeichert
	</p>
</div>
