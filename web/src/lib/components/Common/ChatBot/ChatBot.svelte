<!--
  Chat launcher. Only the button is in the initial bundle; the panel, the AI SDK
  and the markdown renderer are imported on first open (KI-24). The chat state
  lives here, so closing the panel keeps the conversation.
-->
<script lang="ts">
	import { onDestroy } from "svelte";

	let {
		isExistingClient,
		userId,
	}: { isExistingClient: boolean; userId?: string } = $props();

	let showChatBot = $state(false);
	let widget = $state<{
		ChatPanel: typeof import("./lazy").ChatPanel;
		chat: import("./lazy").ChatState;
	}>();

	async function open() {
		if (!widget) {
			const { ChatPanel, ChatState } = await import("./lazy");
			widget = { ChatPanel, chat: new ChatState(isExistingClient, userId) };
		}
		showChatBot = true;
	}

	onDestroy(() => widget?.chat.destroy());
</script>

<div class="fixed right-8 bottom-8 z-[999]">
	{#if showChatBot && widget}
		<widget.ChatPanel
			chat={widget.chat}
			onclose={() => (showChatBot = false)}
		/>
	{:else}
		<button
			type="button"
			aria-label="Chat öffnen"
			onclick={open}
			class="block rounded-full"
		>
			<svg
				class="h-14 w-14 cursor-pointer rounded-full bg-dark_green p-3 text-white shadow-md transition ease-in-out hover:scale-105"
				width="28"
				height="28"
				viewBox="0 0 256 256"
				fill="#FFFFFF"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-4-1.08,7.85,7.85,0,0,0-2.53.42L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216ZM80,128a12,12,0,1,1,12,12A12,12,0,0,1,80,128Zm48,0a12,12,0,1,1,12,12A12,12,0,0,1,128,128Zm48,0a12,12,0,1,1,12,12A12,12,0,0,1,176,128Z"
				/>
			</svg>
		</button>
	{/if}
</div>
