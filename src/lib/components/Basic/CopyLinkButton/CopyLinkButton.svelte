<script lang="ts">
	import { page } from "$app/state";
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import { link } from "$lib/assets/icons";

	let copied = $state(false);

	const handleCopy = async () => {
		const url = `${window.location.origin}${page.url.pathname}`;
		try {
			await navigator.clipboard.writeText(url);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		} catch (err) {
			console.error("Fehler beim Kopieren: ", err);
		}
	};
</script>

<button
	onclick={handleCopy}
	disabled={copied}
	type="button"
	class="blogImageCopyLink my-5 mr-2 flex w-fit min-w-28 cursor-pointer items-center justify-start gap-1.5 rounded-full bg-green/30 px-2 py-1 text-center text-xs font-medium text-dark_text transition-all duration-300 hover:bg-green/80 active:bg-green/90 disabled:cursor-not-allowed disabled:bg-green/50 max-medium:my-0 max-medium:mr-0 max-medium:ml-auto"
>
	<Image width={16} height={16} src={link} alt="link" />
	{copied ? "Kopiert!" : "Link kopieren"}
</button>
