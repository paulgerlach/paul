<script lang="ts">
	import { checkmark_icon_big, counter, info } from "$lib/assets/icons";
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import QuestionnaireWizard from "$lib/components/Fragebogen/QuestionnaireWizard.svelte";
	import LazyLottie from "$lib/components/Lottie/LazyLottie.svelte";
</script>

<main id="content" class="px-5 pt-8 pb-24">
	<QuestionnaireWizard source="fragebogen">
		{#snippet done()}
			<div
				id="questionare-final"
				class="mx-auto flex max-w-6xl flex-col items-start justify-end px-10 max-small:px-5"
			>
				<Image
					width={0}
					height={0}
					sizes="100vw"
					class="mb-6 block size-[50px]"
					src={checkmark_icon_big}
					alt="checkmark"
				/>
				<h1 class="mb-4 text-[40px] text-dark_text max-small:text-2xl">
					Anfrage erfolgreich versendet
				</h1>
				<p
					class="mb-24 text-xl text-dark_text max-large:mb-16 max-medium:mb-8 max-small:text-base"
				>
					Wir werden uns in den nächsten 24h bei Ihnen mit einem <span
						class="max-small:hidden"><br /></span
					>für Sie zugeschnitten Angebot melden.
				</p>
				<div class="grid grid-cols-10 gap-8 max-medium:grid-cols-1">
					<div class="col-span-6 space-y-5 max-medium:col-span-1">
						<p
							class="rounded-base bg-dark_green/5 px-6 py-8 text-base text-dark_text"
						>
							Um eine reibungslose und effiziente Bearbeitung Ihrer Anfrage zu
							gewährleisten, benötigen wir Ihre persönlichen Daten. Diese
							ermöglichen es uns, bei eventuellen Rückfragen direkt mit Ihnen in
							Kontakt zu treten
						</p>
						<div class="grid grid-cols-2 gap-5 max-medium:grid-cols-1">
							<LazyLottie
								animationName="Animation_5"
								id="questionare-final-animation1"
								wrapperClassName="relative"
							/>
							<LazyLottie
								animationName="Animation_6"
								id="questionare-final-animation2"
								wrapperClassName="relative"
							/>
						</div>
					</div>
					<div
						class="col-span-4 rounded-t-base bg-dark_green/5 px-10 pt-9 max-medium:col-span-1 max-small:px-5"
					>
						<p
							class="mb-14 flex items-center justify-start gap-4 text-2xl font-bold text-dark_text"
						>
							<button>
								<Image
									width={0}
									height={0}
									sizes="100vw"
									src={info}
									alt="info"
								/>
							</button>
							Kostenfreie Installation
						</p>
						<Image
							width={0}
							height={0}
							sizes="100vw"
							class="mx-auto"
							src={counter}
							alt="counter"
						/>
					</div>
				</div>
			</div>
		{/snippet}
	</QuestionnaireWizard>
</main>
