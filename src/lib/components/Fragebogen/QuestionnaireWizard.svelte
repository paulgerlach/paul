<!--
  The Fragebogen wizard: progress, steps, buttons and the info box. Shared by
  /fragebogen and /demo (where the booking page opens once it's sent); each
  page passes its source and what shows after sending.
-->
<script lang="ts">
	import { tick, untrack, type Snippet } from "svelte";
	import { chevron } from "$lib/assets/icons";
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import { track } from "$lib/analytics/events";
	import { PHONE, PHONE_HREF } from "$lib/company";
	import StepInfo from "$lib/components/Fragebogen/StepInfo.svelte";
	import StepWrapper from "$lib/components/Fragebogen/StepWrapper.svelte";
	import {
		setQuestionnaire,
		type QuestionnaireField,
		type QuestionnaireSource,
	} from "$lib/fragebogen/questionnaire.svelte";

	interface Props {
		source: QuestionnaireSource;
		/** Shown in place of the wizard once the inquiry is sent. */
		done: Snippet;
		/** Called once after the inquiry is sent. */
		onsent?: () => void;
	}

	let { source, done, onsent }: Props = $props();

	// The source is fixed per page; a new page visit gets a new instance.
	const q = setQuestionnaire(untrack(() => source));

	// GA: every step shown on /demo (also going back), as `demo_step`.
	$effect(() => {
		const step = q.step;
		untrack(() => {
			if (q.source !== "demo") return;
			track("demo_step", { step_number: step + 1, step_name: q.stepName });
		});
	});

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
		if (await q.submit()) {
			if (q.status === "done") onsent?.();
			return;
		}
		await tick();
		const invalid = FOCUS_ORDER.find((field) => q.errors[field]);
		if (invalid) document.getElementById(invalid)?.focus();
	}
</script>

{#if q.status === "done"}
	{@render done()}
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
			<!-- KI-37: Next showed nothing when sending failed -->
			{#if q.status === "error"}
				<p class="mt-4 text-sm text-red-500" role="alert">
					Das hat leider nicht geklappt. Bitte versuchen Sie es erneut oder
					rufen Sie uns an: <a class="underline" href={PHONE_HREF}>{PHONE}</a>
				</p>
			{/if}
		</form>
		<StepInfo activeStep={q.step} />
	</div>
{/if}
