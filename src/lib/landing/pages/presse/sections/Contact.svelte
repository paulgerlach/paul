<!--
  The two grey cards (.pr-sec.pt0 .pr-two): "Sag Hallo" with the press
  address and "Gespräch vereinbaren →" (the closing form), and the Media Kit.
-->
<script lang="ts">
	import ArrowLink from "$lib/landing/components/ArrowLink.svelte";
	import { contact, PRESS_EMAIL, PRESS_MAILTO } from "../content";
	import MediaKit from "./MediaKit.svelte";
</script>

<section class="sec" aria-label="Kontakt und Material">
	<div class="wrap two">
		<article class="card rv">
			<span class="tag">{contact.tag}</span>
			<h2>{contact.h2}</h2>
			<p>{contact.text}</p>
			<div class="foot">
				<div class="mailrow">
					<small>{contact.mailLabel}</small>
					<a class="mail" href={PRESS_MAILTO}>{PRESS_EMAIL}</a>
				</div>
				<ArrowLink href={contact.cta.href} label={contact.cta.text} ink />
			</div>
		</article>
		<MediaKit />
	</div>
</section>

<style>
	.sec {
		padding: 0 0 56px;
	}
	.two {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
	}
	/* .pr-card, shared with MediaKit */
	.two :global(.card) {
		background: #f2f4f3;
		border-radius: 22px;
		padding: 30px;
		display: flex;
		flex-direction: column;
		min-height: 360px;
	}
	.two :global(.card h2) {
		font-size: clamp(24px, 2.3vw, 32px);
		font-weight: 400;
		letter-spacing: -0.03em;
		line-height: 1.1;
		margin-top: 18px;
	}
	.two :global(.card > p) {
		color: var(--muted);
		font-size: 15.5px;
		line-height: 1.5;
		margin-top: 12px;
		max-width: 42ch;
	}
	/* .pr-tag */
	.two :global(.tag) {
		align-self: flex-start;
		display: inline-block;
		background: var(--accent);
		color: var(--ink);
		border-radius: 6px;
		padding: 4px 9px;
		font-size: 11.5px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
	.foot {
		margin-top: auto;
		padding-top: 24px;
	}
	.foot :global(.bk) {
		margin-top: 18px;
	}
	.mailrow {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 6px;
		margin-bottom: 20px;
	}
	.mailrow small {
		font-size: 12.5px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--muted);
	}
	.mail {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		font-size: 17px;
		font-weight: 500;
		color: var(--ink);
		border-bottom: 1px solid currentColor;
		padding-bottom: 2px;
	}

	@media (max-width: 900px) {
		.two {
			grid-template-columns: minmax(0, 1fr);
		}
		.two :global(.card) {
			min-height: 0;
		}
	}
	@media (max-width: 560px) {
		.two :global(.card) {
			padding: 22px;
		}
	}
</style>
