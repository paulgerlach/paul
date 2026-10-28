<!-- The card list shared by every pick-one step. Picking a card moves on. -->
<script lang="ts" generics="K extends ChoiceField">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import type { ImageAsset } from "$lib/components/Basic/Image/types";
	import {
		getQuestionnaire,
		type ChoiceField,
	} from "$lib/fragebogen/questionnaire.svelte";
	import type { QuestionnaireInput } from "$lib/fragebogen/schema";

	type Option = {
		id: string;
		value: NonNullable<QuestionnaireInput[K]>;
		icon: ImageAsset;
	};

	type Props = {
		field: K;
		options: readonly Option[];
		/** "large" is the 50px icon tile the Ja/Nein steps use. */
		iconSize?: "small" | "large";
	};

	let { field, options, iconSize = "small" }: Props = $props();

	const q = getQuestionnaire();
	const iconPx = $derived(iconSize === "large" ? 40 : 25);
</script>

<div class="space-y-3">
	{#each options as option (option.id)}
		<!-- On the label, not the radio's change event, so re-picking the selected
		     card still moves on, as in Next. -->
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
		<label
			onclick={() => q.choose(field, option.value)}
			for={option.id}
			class="block"
		>
			<input
				class="peer hidden"
				name={field}
				id={option.id}
				type="radio"
				checked={q.data[field] === option.value}
				value={option.value}
			/>
			<div
				class="flex h-[69px] w-[509px] cursor-pointer items-center justify-start gap-5 rounded-xl border border-dark_green/20 px-4 text-[18px] text-dark_text duration-300 peer-checked:border-green peer-checked:ring-4 peer-checked:ring-green/20 max-small:h-auto max-small:w-full max-small:gap-3 max-small:py-4 max-small:text-base"
			>
				<div
					class={[
						"flex items-center justify-center bg-gray-100",
						iconSize === "large" ? "size-[50px] rounded-xl" : "rounded-lg p-3",
					]}
				>
					<Image
						width={iconPx}
						height={iconPx}
						class={[
							"object-contain",
							iconSize === "large" ? "h-[40px] w-[40px]" : "h-[25px] w-[25px]",
						]}
						alt={option.value}
						src={option.icon}
					/>
				</div>
				{option.value}
			</div>
		</label>
	{/each}
</div>
