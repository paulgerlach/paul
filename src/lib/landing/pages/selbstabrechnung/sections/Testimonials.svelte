<script lang="ts">
	import { testimonial } from "$lib/landing/data/testimonials";
	import Testimonials from "$lib/landing/sections/Testimonials.svelte";
	import { testimonials } from "../content";
</script>

<!-- Copy and roles need sign-off: see the go-live gate, plan §4.4. -->
<Testimonials
	title={testimonials.title}
	items={testimonials.keys.map(testimonial)}
/>
