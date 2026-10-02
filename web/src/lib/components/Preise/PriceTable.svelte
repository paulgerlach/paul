<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import { checkmark_bold } from "$lib/assets/icons";
	import { ROUTE_FRAGEBOGEN, ROUTE_KONTAKT } from "$lib/routes";
	import { plans, sections, type PlanKey } from "./priceTable";

	let activeTab: PlanKey = $state("heidi");
	const activePlan = $derived(plans.find((p) => p.key === activeTab)!);
</script>

{#snippet check()}
	<Image
		width={0}
		height={0}
		sizes="100vw"
		class="mx-auto block"
		src={checkmark_bold}
		alt="checkmark bold"
	/>
{/snippet}

<div class="my-16 px-5 max-small:my-8">
	<h3
		class="mx-auto mb-20 max-w-3xl text-center text-[50px] leading-[60px] text-dark_text max-medium:text-[30px] max-medium:leading-9 max-small:mb-8"
	>
		Features Vergleichen
	</h3>

	<!-- Desktop Table - Hidden on mobile -->
	<div class="max-megalarge:overflow-x-scroll max-small:hidden">
		<table class="w-full">
			<thead>
				<tr class="divide-x divide-dark_green/20">
					<th class="p-5"></th>
					<th class="min-w-[308px] p-5">
						<p class="mb-2 text-center text-[25px] text-dark_text">Heidi</p>
						<p class="mb-7 text-center text-[15px] text-dark_text/20">
							2-50 Wohneinheiten
						</p>
						<a
							href={ROUTE_KONTAKT}
							class="mb-2 flex w-full items-center justify-center rounded-base border border-dark_green/20 py-4 text-lg text-dark_text transition hover:border-dark_green/10"
						>
							Beraten lassen
						</a>
						<a
							href={ROUTE_FRAGEBOGEN}
							class="mb-9 flex w-full items-center justify-center rounded-base border border-transparent bg-dark_green py-4 text-lg text-white transition hover:opacity-80"
						>
							Jetzt starten
						</a>
					</th>
					<th class="min-w-[308px] p-5">
						<p class="mb-2 text-center text-[25px] text-dark_text">
							Heidi<span
								class="ml-1.5 rounded-base bg-green px-2 py-0.5 text-lg text-dark_text"
								>Plus</span
							>
						</p>
						<p class="mb-7 text-center text-[15px] text-dark_text/20">
							50-200 Wohneinheiten
						</p>
						<a
							href={ROUTE_KONTAKT}
							class="mb-2 flex w-full items-center justify-center rounded-base border border-dark_green/20 py-4 text-lg text-dark_text transition hover:border-dark_green/10"
						>
							Angebot sichern
						</a>
						<a
							href={ROUTE_FRAGEBOGEN}
							class="mb-9 flex w-full items-center justify-center rounded-base border border-transparent bg-green py-4 text-lg text-white transition hover:opacity-80"
						>
							Kostenvoranschlag erhalten
						</a>
					</th>
					<th class="min-w-[308px] p-5">
						<p class="mb-2 text-center text-[25px] text-dark_text">
							Heidi<span
								class="ml-1.5 rounded-base bg-[#D9D9D9] px-2 py-0.5 text-lg text-dark_text"
								>Großkunde</span
							>
						</p>
						<p class="mb-7 text-center text-[15px] text-dark_text/20">
							+201 Wohneinheiten
						</p>
						<a
							href={ROUTE_KONTAKT}
							class="mb-2 flex w-full items-center justify-center rounded-base border border-dark_green/20 py-4 text-lg text-dark_text transition hover:border-dark_green/10"
						>
							Angebot sichern
						</a>
						<a
							href={ROUTE_FRAGEBOGEN}
							class="mb-9 flex w-full items-center justify-center rounded-base border border-transparent bg-green py-4 text-lg text-white transition hover:opacity-80"
						>
							Kostenvoranschlag erhalten
						</a>
					</th>
				</tr>
			</thead>
			<tbody>
				{#each sections as section (section.title)}
					<tr>
						<td
							class="border-y border-dark_green/20 bg-[#F4F3F2] px-7 py-3.5 text-lg font-bold text-dark_text"
							colspan={4}
						>
							{section.title}
						</td>
					</tr>
					{#each section.features as feature (feature.label)}
						<tr class="divide-x divide-dark_green/20">
							<td class="px-7 py-2.5 text-lg text-dark_text">{feature.label}</td
							>
							<td class="px-7 py-2.5"
								>{#if feature.heidi}{@render check()}{/if}</td
							>
							<td class="px-7 py-2.5"
								>{#if feature.plus}{@render check()}{/if}</td
							>
							<td class="px-7 py-2.5">
								{#if feature.grosskunde}{@render check()}{/if}
							</td>
						</tr>
					{/each}
				{/each}
			</tbody>
		</table>
	</div>

	<!-- Mobile Tab-based View -->
	<div class="hidden max-small:block">
		<!-- Tabs -->
		<div class="mb-6 flex gap-2 overflow-x-auto pb-2">
			{#each plans as plan (plan.key)}
				<button
					onclick={() => (activeTab = plan.key)}
					class={[
						"min-w-[100px] flex-1 rounded-xl px-3 py-3 text-center transition-all",
						activeTab === plan.key
							? "bg-green font-semibold text-dark_text"
							: "bg-gray-100 text-dark_text/60",
					]}
				>
					<p class="text-sm font-medium">{plan.tab}</p>
				</button>
			{/each}
		</div>

		<!-- Plan Header -->
		<div class="mb-6 border-b border-dark_green/10 pb-4 text-center">
			<p class="mb-1 text-xl font-bold text-dark_text">{activePlan.name}</p>
			<p class="text-sm text-dark_text/50">{activePlan.subtitle}</p>
		</div>

		<!-- Features List -->
		{#each sections as section (section.title)}
			<div class="mb-6">
				<div class="mb-2 rounded-lg bg-[#F4F3F2] px-4 py-2.5">
					<p class="text-sm font-bold text-dark_text">{section.title}</p>
				</div>
				<div class="px-2">
					{#each section.features as feature (feature.label)}
						{@const included = feature[activeTab]}
						<div
							class="flex items-start gap-3 border-b border-dark_green/10 py-2.5"
						>
							{#if included}
								<Image
									width={20}
									height={20}
									class="mt-0.5 flex-shrink-0"
									src={checkmark_bold}
									alt="included"
								/>
							{:else}
								<span
									class="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center text-dark_text/30"
									>✗</span
								>
							{/if}
							<span
								class={[
									"text-sm",
									included ? "text-dark_text" : "text-dark_text/40",
								]}>{feature.label}</span
							>
						</div>
					{/each}
				</div>
			</div>
		{/each}

		<!-- CTA Button -->
		<div class="mt-8 space-y-3">
			<a
				href={ROUTE_KONTAKT}
				class="flex w-full items-center justify-center rounded-xl border border-dark_green/20 py-3 text-base text-dark_text transition hover:border-dark_green/40"
			>
				Beraten lassen
			</a>
			<a
				href={ROUTE_FRAGEBOGEN}
				class={[
					"flex w-full items-center justify-center rounded-xl py-3 text-base text-white transition hover:opacity-80",
					activePlan.buttonBg,
				]}
			>
				Jetzt starten
			</a>
		</div>
	</div>
</div>
