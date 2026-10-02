<script lang="ts">
	import { tick } from "svelte";
	import {
		checkmark_icon_big,
		chevron,
		counter,
		info,
	} from "$lib/assets/icons";
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import StepInfo from "$lib/components/Fragebogen/StepInfo.svelte";
	import StepWrapper from "$lib/components/Fragebogen/StepWrapper.svelte";
	import LazyLottie from "$lib/components/Lottie/LazyLottie.svelte";
	import {
		setQuestionnaire,
		type QuestionnaireField,
	} from "$lib/fragebogen/questionnaire.svelte";

	const q = setQuestionnaire();

	/** Focus order for invalid fields, as react-hook-form did on submit. */
	const FOCUS_ORDER: QuestionnaireField[] = [
		"first_name",
		"last_name",
		"phone",
		"email",
		"form_confirm",
	];

	async function onsubmit(e: SubmitEvent) {
		e.preventDefault();
		// Enter in a single text field submits implicitly; only the last step sends
		if (!q.isSubmitStep || q.status === "submitting") return;
		if (await q.submit()) return;
		await tick();
		const invalid = FOCUS_ORDER.find((field) => q.errors[field]);
		if (invalid) document.getElementById(invalid)?.focus();
	}
</script>

<main id="content" class="px-5 pt-8 pb-24">
	{#if q.status === "done"}
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
							<Image width={0} height={0} sizes="100vw" src={info} alt="info" />
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
	{:else}
		<div
			data-filled-steps="0"
			class="steps-progress mx-auto mb-10 flex max-w-6xl items-center justify-start gap-1.5"
		>
			{#each { length: q.totalSteps }, step (step)}
				<span
					data-step-index={step}
					class={[
						"h-[1px] w-[50px] max-small:w-[30px]",
						step <= q.step ? "bg-green" : "bg-dark_green/10",
					]}
				></span>
			{/each}
			<span class="text-xs text-dark_text/20"> noch 4 min </span>
		</div>
		<div
			class="questionare-steps mx-auto flex max-w-6xl items-start justify-between max-large:flex-col max-large:gap-10 max-small:gap-4"
		>
			<form
				{onsubmit}
				id="questionare-form"
				class="steps-wrapper max-small:order-2"
			>
				{#if q.step > 0}
					<button
						class="group flex cursor-pointer items-center justify-start gap-3 text-[15px] font-bold text-dark_text/20"
						id="prev-step"
						onclick={() => q.prev()}
						type="button"
					>
						<Image
							width={0}
							height={0}
							sizes="100vw"
							alt="chevron"
							src={chevron}
							class="colored-to-black size-2.5 rotate-180 opacity-50 duration-300 group-hover:-translate-x-1/2"
						/>
						zurück
					</button>
				{/if}
				<StepWrapper />
				{#if q.stepError && (q.step === 0 || q.step === 1)}
					<p class="mb-4 text-sm text-red-500">
						Bitte wählen Sie eine Option aus, um fortzufahren.
					</p>
				{/if}
				<div class="flex items-center justify-start gap-5">
					{#if q.isSubmitStep}
						<button
							id="next-step"
							class="flex cursor-pointer items-center justify-center rounded-xl border border-transparent bg-green px-8 py-4 text-[15px] font-bold text-white duration-300 hover:opacity-80 disabled:opacity-50"
							type="submit"
							disabled={q.status === "submitting"}
						>
							{q.status === "submitting" ? "Wird gesendet..." : "Bestätigen"}
						</button>
					{:else}
						<button
							id="next-step"
							class="flex cursor-pointer items-center justify-center rounded-xl border border-transparent bg-green px-8 py-4 text-[15px] font-bold text-white duration-300 hover:opacity-80 disabled:opacity-50"
							type="button"
							onclick={() => q.confirm()}
						>
							Bestätigen
						</button>
					{/if}
					<!-- No skip on step 0 (required) or the last step -->
					{#if q.step !== 0 && !q.isSubmitStep}
						<button
							id="skip-step"
							class="flex cursor-pointer items-center justify-center bg-transparent px-4 py-4 text-[15px] font-bold text-green duration-300 hover:opacity-80 disabled:opacity-50"
							onclick={() => q.next()}
							type="button"
						>
							Überspringen
						</button>
					{/if}
				</div>
			</form>
			<StepInfo activeStep={q.step} />
		</div>
	{/if}
</main>
