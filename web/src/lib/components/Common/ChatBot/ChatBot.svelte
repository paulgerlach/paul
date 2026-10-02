<script lang="ts">
	// Stub until phase 8 ports components/Common/ChatBot
	let { isExistingClient }: { isExistingClient: boolean } = $props();
</script>

<div hidden data-existing-client={isExistingClient}></div>
