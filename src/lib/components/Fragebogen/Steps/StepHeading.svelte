<!-- Title and question shared by every step. The question breaks before
     `questionEnd` on wider screens. -->
<script lang="ts">
	type Props = { title: string; question: string; questionEnd: string };

	let { title, question, questionEnd }: Props = $props();
</script>

<p class="mb-6 text-[40px] leading-tight text-dark_text max-small:text-2xl">
	{title}
</p>
<p class="mb-12 text-[20px] text-dark_text max-small:text-base">
	{question} <span class="max-small:hidden"><br /></span>{questionEnd}
</p>
