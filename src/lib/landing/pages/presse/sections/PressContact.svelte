<!-- The dark press contact card (.pr-pc) with the building photo; "E-Mail senden →" opens a mail to the press address. -->
<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import photo from "$lib/assets/landing/vorgehen/building-wide.webp?enhanced";
	import ArrowLink from "$lib/landing/components/ArrowLink.svelte";
	import { pressContact } from "../content";
</script>

<section class="sec" aria-labelledby="pr-ch">
	<div class="wrap">
		<div class="pc rv">
			<div>
				<span class="tag">{pressContact.tag}</span>
				<h2 id="pr-ch">{pressContact.h2}</h2>
				<p>
					{pressContact.address[0]}<br />{pressContact.address[1]}
				</p>
				<!-- The design's accent button; its hover (dark on dark) isn't ported (plan README). -->
				<ArrowLink href={pressContact.cta.href} label={pressContact.cta.text} />
			</div>
			<figure>
				<Image
					src={photo}
					alt=""
					width={1400}
					height={764}
					sizes="(max-width: 900px) 100vw, 480px"
				/>
			</figure>
		</div>
	</div>
</section>

<style>
	.sec {
		padding: 56px 0;
	}
	.pc {
		display: grid;
		grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
		gap: clamp(24px, 5vw, 72px);
		align-items: center;
		background: var(--ink);
		color: #fff;
		border-radius: 26px;
		padding: clamp(24px, 4vw, 48px);
	}
	/* .pr-tag.d */
	.tag {
		display: inline-block;
		background: rgba(138, 214, 143, 0.18);
		color: var(--accent);
		border-radius: 6px;
		padding: 4px 9px;
		font-size: 11.5px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
	.pc h2 {
		font-size: clamp(28px, 3vw, 42px);
		font-weight: 400;
		letter-spacing: -0.035em;
		line-height: 1.08;
		margin-top: 18px;
	}
	.pc p {
		color: rgba(255, 255, 255, 0.7);
		font-size: 16px;
		line-height: 1.55;
		margin: 18px 0 26px;
	}
	.pc :global(.bk) {
		margin-top: 18px;
	}
	figure {
		margin: 0;
		border-radius: 18px;
		overflow: hidden;
		aspect-ratio: 4/3;
	}
	figure :global(img) {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 1.2s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.pc:hover figure :global(img) {
		transform: scale(1.03);
	}
	@media (max-width: 900px) {
		.pc {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
