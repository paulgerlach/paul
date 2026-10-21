<!--
  "Der kürzeste Weg zu uns." (#kt-css .kt-ways): four cards, each with its
  links at the bottom. A link without `href` has no page yet and isn't shown.
-->
<script lang="ts">
	import Icon from "../components/Icon.svelte";
	import { ways } from "../content";
</script>

<section class="pg-sec" aria-labelledby="wg-h">
	<div class="wrap">
		<div class="head">
			<span class="pill rv"><Icon name="users" />{ways.pill}</span>
			<h2 class="h2 rv" id="wg-h">
				{ways.h2}<br /><span>{ways.h2Accent}</span>
			</h2>
		</div>
		<div class="ways">
			{#each ways.items as way (way.title)}
				<article class="way rv">
					<span class="wi"><Icon name={way.icon} /></span>
					<h3>{way.title}</h3>
					<p>{way.text}</p>
					<div class="links">
						{#each way.links as link (link.text)}
							{#if link.href}<a href={link.href}>{link.text}</a>{/if}
						{/each}
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.head {
		max-width: 760px;
	}
	.ways {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 16px;
		margin-top: 44px;
	}
	.way {
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 20px;
		padding: 24px 22px;
		display: flex;
		flex-direction: column;
		transition:
			border-color 0.25s,
			box-shadow 0.25s;
	}
	.way:hover {
		border-color: #cdebd0;
		box-shadow: 0 20px 40px -30px rgba(30, 50, 45, 0.45);
	}
	.wi {
		width: 42px;
		height: 42px;
		border-radius: 12px;
		background: var(--bg);
		display: grid;
		place-items: center;
	}
	.wi :global(svg) {
		width: 20px;
		height: 20px;
		color: var(--ink);
	}
	/* `.way h3`: beats the landing reset of heading margins. */
	.way h3 {
		font-size: 18px;
		font-weight: 600;
		letter-spacing: -0.01em;
		margin: 18px 0 8px;
	}
	.way p {
		font-size: 14.5px;
		color: var(--muted);
		line-height: 1.5;
		margin: 0;
	}
	.links {
		display: grid;
		gap: 6px;
		margin-top: auto;
		padding-top: 18px;
	}
	.links a {
		font-size: 14px;
		font-weight: 600;
		color: #2f7a3c;
		word-break: break-word;
	}
	.links a:hover {
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	@media (max-width: 1040px) {
		.ways {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 640px) {
		.ways {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
