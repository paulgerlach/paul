<script lang="ts">
	import { testimonial } from "$lib/landing/data/testimonials";
	import Testimonials from "$lib/landing/sections/Testimonials.svelte";
	import { quotes } from "../content";
</script>

<!-- Copy and roles need sign-off: see the go-live gate, plan §4.4. -->
<Testimonials title={quotes.title} items={quotes.keys.map(testimonial)} />
