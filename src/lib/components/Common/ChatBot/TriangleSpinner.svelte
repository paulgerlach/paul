<!-- Replaces react-loader-spinner's <Triangle> (same SVG and animation). -->
<script lang="ts">
	let { size, color = "#4fa94d" }: { size: number; color?: string } = $props();
</script>

<div class="flex" aria-label="triangle-loading">
	<svg
		width={size}
		height={size}
		viewBox="-3 -4 39 39"
		xmlns="http://www.w3.org/2000/svg"
	>
		<polygon
			fill="transparent"
			stroke={color}
			stroke-width="1"
			points="16,0 32,32 0,32"
		/>
	</svg>
</div>

<style>
	svg {
		transform-origin: 50% 65%;
	}
	polygon {
		stroke-dasharray: 17;
		animation: dash 2.5s cubic-bezier(0.35, 0.04, 0.63, 0.95) infinite;
	}
	@keyframes dash {
		to {
			stroke-dashoffset: 136;
		}
	}
</style>
