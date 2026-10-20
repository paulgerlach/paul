<!-- The documentation (.ad-doc): the table of contents beside the draft note and the eleven articles. -->
<script lang="ts">
	import Icon from "../components/Icon.svelte";
	import { docs } from "../content";
	import Access from "./Access.svelte";
	import Auth from "./Auth.svelte";
	import BaseUrl from "./BaseUrl.svelte";
	import Consumption from "./Consumption.svelte";
	import Documents from "./Documents.svelte";
	import FileExchange from "./FileExchange.svelte";
	import Overview from "./Overview.svelte";
	import QuickStart from "./QuickStart.svelte";
	import Sidebar from "./Sidebar.svelte";
	import StatusCodes from "./StatusCodes.svelte";
	import UserChange from "./UserChange.svelte";
	import Versions from "./Versions.svelte";
</script>

<section class="doc" aria-label={docs.label}>
	<div class="wrap grid">
		<Sidebar />
		<div class="main">
			<div class="note rv">
				<Icon name="info" />
				<div><b>{docs.note.title}</b> {docs.note.text}</div>
			</div>
			<Overview />
			<QuickStart />
			<Auth />
			<BaseUrl />
			<Consumption />
			<UserChange />
			<Documents />
			<FileExchange />
			<StatusCodes />
			<Versions />
			<Access />
		</div>
	</div>
</section>

<style>
	.doc {
		padding: 72px 0 112px;
	}
	.grid {
		display: grid;
		grid-template-columns: 220px minmax(0, 1fr);
		gap: 64px;
		align-items: start;
	}
	.main {
		max-width: 820px;
		min-width: 0;
	}
	.note {
		display: flex;
		gap: 12px;
		align-items: flex-start;
		background: #f2f8f2;
		border: 1px solid #d6ecd7;
		border-radius: 14px;
		padding: 16px 18px;
		font-size: 15px;
		line-height: 1.55;
		color: var(--ink);
	}
	.note :global(svg) {
		width: 18px;
		height: 18px;
		flex: none;
		margin-top: 2px;
		color: #3e8e46;
	}
	@media (max-width: 1040px) {
		.grid {
			grid-template-columns: 1fr;
			gap: 0;
		}
	}
	@media (max-width: 640px) {
		.doc {
			padding: 48px 0 80px;
		}
	}
</style>
