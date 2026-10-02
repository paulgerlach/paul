<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import { chevron } from "$lib/assets/icons";
	import { slideToggle } from "$lib/attachments/slideToggle";
	import type { FAQItemType } from "$lib/types";

	type Props = {
		item: FAQItemType;
		index: number;
		isOpen: boolean;
		onClick: (index: number) => void;
	};

	let { item, index, isOpen, onClick }: Props = $props();
</script>

<div class={["faq-answer-item", isOpen && "active"]}>
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions (the inner button is focusable) -->
	<div class="faq-answer-header" onclick={() => onClick(index)}>
		<p class="faq-question">{item.question}</p>
		<button type="button" class="faq-icon">
			<Image
				width={0}
				height={0}
				sizes="100vw"
				class="rotate-90"
				src={chevron}
				alt="chevron"
			/>
		</button>
	</div>
	<div class="faq-answer-content" {@attach slideToggle(isOpen)}>
		<p>{item.answer}</p>
	</div>
</div>
