<script lang="ts">
	import banner from "$lib/assets/landing/banner.jpg?enhanced";
	import { playOnView } from "../../attachments/playOnView";
	import { focusSignup, START_HREF } from "../../cta";
</script>

<!-- Photo, name and company are placeholders: see the go-live gate, plan 5.4. -->
<section class="banner-sec wrap" aria-label="Heidi in Zahlen">
	<div class="pbanner" data-placeholder {@attach playOnView()}>
		<enhanced:img
			src={banner}
			alt="Lachende Frau im schwarzen T-Shirt vor grauer Wand"
			sizes="(min-width: 1240px) 1160px, 100vw"
			loading="lazy"
		/>
		<div class="txt">
			<h2>
				<span>Persönlich betreut.</span>
				<span>Zuverlässig montiert.</span>
				<span>Pünktlich abgerechnet.</span>
			</h2>
			<a href={START_HREF} class="a-up" style="--d:.9s" onclick={focusSignup}>
				Demo ansehen
				<i aria-hidden="true">
					<svg viewBox="0 0 10 12"
						><path d="M1 1l8 5-8 5z" fill="#1E322D" /></svg
					>
				</i>
			</a>
		</div>
		<div class="cap">
			<b>Silvia Hoffmann</b><span>Hausverwaltung Hoffmann</span>
		</div>
	</div>
</section>

<style>
	.banner-sec {
		padding-block: 20px 96px;
	}
	.pbanner {
		position: relative;
		border-radius: 18px;
		overflow: hidden;
		min-height: 440px;
		display: flex;
		align-items: center;
		background: #4a4f52;
	}
	.pbanner :global(img) {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: 70% 30%;
		max-width: none;
	}
	.txt {
		position: relative;
		z-index: 2;
		color: #fff;
		text-shadow: 0 1px 12px rgba(0, 0, 0, 0.25);
		padding: 48px clamp(24px, 6vw, 96px);
	}
	h2 {
		font-size: clamp(32px, 4vw, 56px);
		line-height: 1.05;
		letter-spacing: -0.03em;
	}
	h2 span {
		display: block;
	}
	.txt a {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		margin-top: 22px;
		font-size: 18px;
	}
	.txt a i {
		width: 26px;
		height: 26px;
		border-radius: 50%;
		background: #fff;
		display: grid;
		place-items: center;
	}
	.txt a svg {
		width: 10px;
	}
	.cap {
		position: absolute;
		right: 24px;
		bottom: 22px;
		z-index: 2;
		color: #fff;
		text-align: right;
		font-size: 14px;
		line-height: 1.35;
		text-shadow: 0 1px 10px rgba(0, 0, 0, 0.35);
	}
	.cap b {
		display: block;
		font-weight: 600;
		font-size: 15px;
	}
	.cap span {
		opacity: 0.85;
	}

	@media (max-width: 700px) {
		.pbanner {
			min-height: 420px;
			align-items: flex-end;
		}
		.pbanner :global(img) {
			object-position: 72% 20%;
		}
		/* The text sits on the photo here; darken behind it for contrast. */
		.pbanner::after {
			content: "";
			position: absolute;
			inset: 40% 0 0;
			z-index: 1;
			background: linear-gradient(transparent, rgba(20, 28, 25, 0.7));
		}
		.cap {
			top: 18px;
			bottom: auto;
			right: 18px;
		}
	}
</style>
