<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import { max_chat_avatar } from "$lib/assets/icons";
</script>

<Image
	alt="chat avatar"
	src={max_chat_avatar}
	width={40}
	height={40}
	class="rounded-full"
/>
