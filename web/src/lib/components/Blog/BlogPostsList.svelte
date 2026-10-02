<script lang="ts">
	import BlogPost from "./BlogPost.svelte";
	import type { PostSummary } from "$lib/server/blog";

	let { posts }: { posts: PostSummary[] } = $props();
</script>

<div
	class="grid grid-cols-3 gap-8 max-large:grid-cols-2 max-medium:grid-cols-1"
>
	{#each posts as post (post.uid)}
		<BlogPost {post} />
	{/each}
</div>
