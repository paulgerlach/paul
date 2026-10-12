<script lang="ts">
	import Testimonials from "$lib/landing/sections/Testimonials.svelte";
	import { testimonial } from "$lib/landing/data/testimonials";
	import { testimonials } from "../content";

	const items = testimonials.keys.map(testimonial);
</script>

<!-- Copy and roles need sign-off: see the go-live gate, plan §4.4. -->
<Testimonials id="stimmen" title={testimonials.title} {items} />
