<!--
  A Zählercheck's result for sales: every step as the visitor saw it, the
  questions with the answers, notes and files next to them, and the offer.
-->
<script lang="ts">
	let { data } = $props();
	const r = $derived(data.result);

	const when = (iso: string | null) =>
		iso
			? new Intl.DateTimeFormat("de-DE", {
					timeZone: "Europe/Berlin",
					dateStyle: "medium",
					timeStyle: "short",
				}).format(new Date(iso))
			: "";
	const kb = (n: number) =>
		n < 1024 * 1024
			? `${Math.max(1, Math.round(n / 1024))} KB`
			: `${(n / 1024 / 1024).toFixed(1).replace(".", ",")} MB`;
	const filesOf = (slot: string) => r.files.filter((f) => f.slot === slot);
</script>

<main class="min-h-screen bg-base-bg px-4 py-10 text-admin_dark_text">
	<div class="mx-auto max-w-4xl">
		<header class="mb-8">
			<p class="text-sm text-light-text">Self-Service · Zählercheck</p>
			<h1 class="mt-1 text-3xl font-semibold text-dark_green">
				Angebot {r.offerNumber}
			</h1>
			<p class="mt-3 flex flex-wrap gap-2 text-sm">
				<span class="rounded-halfbase bg-card_dark_bg px-2.5 py-1"
					>Erstellt {when(r.createdAt)}</span
				>
				{#if r.requestedAt}
					<span class="rounded-halfbase bg-green px-2.5 py-1 text-dark_green"
						>Per E-Mail angefordert {when(r.requestedAt)}</span
					>
				{:else}
					<span class="rounded-halfbase bg-card_light px-2.5 py-1"
						>Noch nicht angefordert</span
					>
				{/if}
			</p>
		</header>

		{#each r.sheet as section, si (si)}
			<section class="mb-5 rounded-base bg-white p-5 shadow-sm medium:p-6">
				<h2 class="mb-3 text-lg font-semibold text-dark_green">
					{section.title}
				</h2>
				<dl class="divide-y divide-border_base">
					{#each section.items as item, ii (ii)}
						<div
							class="grid gap-1 py-2.5 medium:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] medium:gap-4"
						>
							<dt class="text-sm text-light-text">{item.q}</dt>
							<dd class="min-w-0 break-words whitespace-pre-line">
								{#if item.files !== undefined}
									{@const list = filesOf(item.files)}
									{#if list.length}
										<ul class="flex flex-wrap gap-3">
											{#each list as f, fi (fi)}
												<li class="w-36">
													{#if f.url}
														<a
															href={f.url}
															target="_blank"
															rel="noopener noreferrer"
															class="block text-link hover:underline"
														>
															{#if f.type.startsWith("image/")}
																<img
																	src={f.url}
																	alt={f.name}
																	loading="lazy"
																	class="mb-1 aspect-square w-full rounded-halfbase bg-card_bg object-cover"
																/>
															{:else}
																<span
																	class="mb-1 flex aspect-square w-full items-center justify-center rounded-halfbase bg-card_bg text-sm font-semibold text-dark_green"
																	>{f.name
																		.split(".")
																		.pop()
																		?.toUpperCase()}</span
																>
															{/if}
															<span class="block truncate text-sm"
																>{f.name}</span
															>
														</a>
													{:else}
														<span
															class="mb-1 flex aspect-square w-full items-center justify-center rounded-halfbase bg-card_bg p-2 text-center text-xs text-light-text"
															>Nicht hochgeladen</span
														>
														<span class="block truncate text-sm">{f.name}</span>
													{/if}
													<span class="text-xs text-light-text"
														>{kb(f.size)}</span
													>
												</li>
											{/each}
										</ul>
									{:else}
										<span class="text-light-text">Keine Dateien</span>
									{/if}
								{:else if item.a}
									{item.a}
								{:else}
									<span class="text-light-text">–</span>
								{/if}
							</dd>
						</div>
					{/each}
				</dl>
			</section>
		{/each}
		<p class="mt-6 text-xs text-light-text">
			Die Dateilinks gelten eine Stunde. Laden Sie die Seite neu für neue Links.
		</p>
	</div>
</main>
