<!-- The design's moving data line: between the roles (.ad-flow, vertical below 640 px) or in the direction "Ihre Software → Heidi" (.ad-dir i). -->
<script lang="ts">
	let { kind }: { kind: "roles" | "dir" } = $props();
</script>

<span class={["flow", kind]} aria-hidden="true"><i></i></span>

<style>
	.flow {
		position: relative;
		display: block;
		height: 2px;
		background: var(--hair);
		overflow: hidden;
		border-radius: 2px;
	}
	.roles {
		margin: 0 10px;
	}
	.dir {
		width: 64px;
	}
	i {
		position: absolute;
		inset: 0;
		width: 40%;
		background: #8ad68f;
		border-radius: 2px;
		animation: flow 2.6s cubic-bezier(0.5, 0, 0.5, 1) infinite;
	}
	@keyframes flow {
		0% {
			transform: translateX(-110%);
		}
		100% {
			transform: translateX(260%);
		}
	}
	@keyframes flow-v {
		0% {
			transform: translateY(-110%);
		}
		100% {
			transform: translateY(260%);
		}
	}
	@media (max-width: 640px) {
		.roles {
			height: 28px;
			width: 2px;
			margin: 0 auto;
		}
		.roles i {
			width: 100%;
			height: 40%;
			animation-name: flow-v;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		i {
			animation: none;
		}
	}
</style>
