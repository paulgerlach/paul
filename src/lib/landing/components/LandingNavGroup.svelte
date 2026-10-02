<!--
  One nav dropdown of the landing header, with the same data as the site's
  NavGroup. Desktop: a panel that opens on hover and on keyboard focus.
  Mobile (inside the burger panel): an accordion.
-->
<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import NavHighlight from "$lib/components/Header/highlights/NavHighlight.svelte";
	import { menu } from "$lib/components/Header/menu.svelte";
	import type { PostSummary } from "$lib/server/blog";
	import type { NavGroupType } from "$lib/types";
	import Chevron from "./icons/Chevron.svelte";

	let {
		group,
		posts,
		variant,
	}: {
		group: NavGroupType;
		posts: PostSummary[];
		variant: "desktop" | "mobile";
	} = $props();

	const { title, route, groupTitle, groupLinks, highlight } = $derived(group);
	const panelId = $derived(`lp-nav-${route.replace(/\W/g, "")}`);

	let open = $state(false);
</script>

{#if variant === "desktop"}
	<li class="grp" data-nav-group>
		<a class="trigger" href={route}>
			{title}
			<Chevron />
		</a>
		<div class="panel">
			<div>
				<p class="ptitle">{groupTitle}</p>
				<ul class="links">
					{#each groupLinks as link (link.title)}
						<li>
							<a href={link.link ?? route}>
								<Image
									width={28}
									height={28}
									class="ic"
									src={link.icon}
									alt=""
								/>
								<span>{link.title}</span>
							</a>
						</li>
					{/each}
				</ul>
			</div>
			<NavHighlight key={highlight} {posts} />
		</div>
	</li>
{:else}
	<li class="m-grp">
		<button
			type="button"
			class="m-trigger"
			aria-expanded={open}
			aria-controls={panelId}
			onclick={() => (open = !open)}
		>
			{title}
			<Chevron width={12} class={open ? "rot" : ""} />
		</button>
		{#if open}
			<div class="m-panel" id={panelId}>
				<ul class="links">
					{#each groupLinks as link (link.title)}
						<li>
							<a href={link.link ?? route} onclick={() => menu.close()}>
								<Image
									width={20}
									height={20}
									class="ic ic-s"
									src={link.icon}
									alt=""
								/>
								<span>{link.title}</span>
							</a>
						</li>
					{/each}
				</ul>
				<a class="all" href={route} onclick={() => menu.close()}>
					Alle anzeigen →
				</a>
			</div>
		{/if}
	</li>
{/if}

<style>
	/* Desktop */
	.grp {
		position: relative;
		height: 64px;
		display: flex;
		align-items: center;
	}
	.trigger {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}
	.trigger :global(svg) {
		width: 10px;
		transition: transform 0.2s;
	}
	.grp:hover .trigger :global(svg),
	.grp:focus-within .trigger :global(svg) {
		transform: rotate(180deg);
	}
	.panel {
		position: absolute;
		top: 100%;
		left: -24px;
		width: 620px;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 40px;
		padding: 28px 32px;
		background: #fff;
		border: 1px solid var(--line);
		border-radius: 18px;
		box-shadow: 0 20px 60px -30px rgba(30, 50, 45, 0.35);
		opacity: 0;
		visibility: hidden;
		transform: translateY(6px);
		transition:
			opacity 0.2s,
			transform 0.2s,
			visibility 0.2s;
	}
	.grp:hover .panel,
	.grp:focus-within .panel {
		opacity: 1;
		visibility: visible;
		transform: none;
	}
	.ptitle {
		font-size: 18px;
		font-weight: 500;
		margin-bottom: 12px;
	}
	.links {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 2px;
	}
	.links a {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 8px 10px;
		border-radius: 8px;
		color: var(--muted);
		font-size: 15px;
		transition: background 0.2s;
	}
	.links a:hover,
	.links a:focus-visible {
		background: var(--stone);
		color: var(--ink);
	}
	.links span {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	.links :global(.ic) {
		width: 28px;
		height: 28px;
		flex: none;
		object-fit: contain;
	}

	/* Mobile */
	.m-grp {
		border-bottom: 1px solid var(--line);
	}
	.m-trigger {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 14px 0;
		border: 0;
		background: none;
		font-size: 17px;
		cursor: pointer;
	}
	.m-trigger :global(svg) {
		transition: transform 0.2s;
	}
	.m-trigger :global(svg.rot) {
		transform: rotate(180deg);
	}
	.m-panel {
		padding-bottom: 14px;
	}
	.m-panel .links a {
		font-size: 15px;
		padding: 8px 6px;
	}
	.links :global(.ic-s) {
		width: 20px;
		height: 20px;
	}
	.all {
		display: inline-block;
		margin-top: 6px;
		padding: 4px 6px;
		font-size: 14px;
		font-weight: 500;
		color: var(--ok);
	}
</style>
