<!--
  The shared quotes in the design's `.dm-tm` / `.tm2`: the H2 keeps the
  .dm-h2 18 px top margin (the landing heading reset takes it), and the two
  cards stay side by side down to 640 px (the shared row stacks at 1040).
-->
<script lang="ts">
	import { testimonial } from "$lib/landing/data/testimonials";
	import Testimonials from "$lib/landing/sections/Testimonials.svelte";
	import { quotes } from "../content";
</script>

<!-- Copy and roles need sign-off: see the go-live gate, plan §4.4. -->
<div class="quotes">
	<Testimonials title={quotes.title} items={quotes.keys.map(testimonial)} />
</div>

<style>
	.quotes :global(section.tm h2) {
		margin-top: 18px;
	}
	@media (max-width: 1040px) and (min-width: 641px) {
		.quotes :global(section.tm .tm-row) {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 640px) {
		.quotes :global(section.tm .tm-row) {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
