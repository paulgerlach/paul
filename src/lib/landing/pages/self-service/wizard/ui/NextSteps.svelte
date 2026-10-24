<!-- "So geht es weiter" (`.ss-ns`): the four steps, `cur` the current one. -->
<script lang="ts">
	import Markup from "./Markup.svelte";
	import { NEXT_STEPS } from "../data";
	import { CHECK } from "../svg";

	let { cur }: { cur: number } = $props();
</script>

<div class="ss-ns">
	<p class="ss-ns-h">So geht es weiter</p>
	<ol>
		{#each NEXT_STEPS as [title, text], i (title)}
			<li class={[i < cur && "done", i === cur && "cur"]}>
				<span class="n"
					>{#if i < cur}<Markup html={CHECK} />{:else}{i + 1}{/if}</span
				><span><b>{title}</b>{text}</span>
			</li>
		{/each}
	</ol>
</div>
