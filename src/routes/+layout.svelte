<script lang="ts">
	import '../app.scss';
	import { onMount, onDestroy } from 'svelte';
	import { searchResults, hasRun } from '$lib/stores';
	import { Icon } from '@smui/common';
	import { Input } from '@smui/textfield';
	import Paper from '@smui/paper';
	import LayoutGrid from '@smui/layout-grid/src/LayoutGrid.svelte';
	import Cell from '@smui/layout-grid/src/Cell.svelte';
	import Fab from '@smui/fab/src/Fab.svelte';
	import IconButton from '@smui/icon-button';
	import TopAppBar, { Row, Section } from '@smui/top-app-bar';
	import Tooltip, { Wrapper } from '@smui/tooltip';

	let lightTheme: Boolean;
	let searchTitleInput: string;

	onMount((): void => {
		lightTheme = window.matchMedia('(prefers-color-scheme: light)').matches;
	});

	onDestroy((): void => {
		hasRun.set(false);
	});

	function handleSearchEnterPress(event: KeyboardEvent | CustomEvent): void {
		if ((event as KeyboardEvent).key === 'Enter')
			window.location.href = `/search/${searchTitleInput}`;
	}
</script>

<svelte:head>
	{#if lightTheme}
		<link rel="stylesheet" href="/smui.css" />
	{:else if !lightTheme}
		<link rel="stylesheet" href="/smui.css" />
		<link rel="stylesheet" href="/smui-dark.css" />
	{:else}
		<link rel="stylesheet" href="/smui.css" media="(prefers-color-scheme: light)" />
		<link rel="stylesheet" href="/smui-dark.css" media="screen and (prefers-color-scheme: dark)" />
	{/if}
</svelte:head>

<TopAppBar variant="static">
	<Row>
		<Section>
			<h4 class="title">
				<a
					href="/"
					on:click={() => {
						searchResults.reset();
						location.assign('/');
						setTimeout(() => location.reload(), 0);
					}}>MTVDB</a
				>
			</h4>
		</Section>
		<Section align="end" toolbar>
			<Wrapper>
				<IconButton
					toggle
					pressed={lightTheme}
					on:SMUIIconButtonToggle:change={() => (lightTheme = !lightTheme)}
				>
					{#if lightTheme}
						<Icon class="material-icons" on>dark_mode</Icon>
					{:else}
						<Icon class="material-icons">light_mode</Icon>
					{/if}
				</IconButton>
				<Tooltip xPos="start">{lightTheme ? 'Dark Mode' : 'Light Mode'}</Tooltip>
			</Wrapper>
		</Section>
	</Row>
</TopAppBar>

<div class="container">
	<LayoutGrid>
		<Cell span={12} class="centre">
			<Paper class="paper" elevation={6}>
				<Icon class="material-icons">search</Icon>
				<Input
					bind:value={searchTitleInput}
					on:keydown={handleSearchEnterPress}
					placeholder="Search for a Movie or Show"
					class="input"
				/>
			</Paper>
			<Fab
				href={`/search/${searchTitleInput}`}
				data-sveltekit-reload
				color="primary"
				mini
				class="fab"
			>
				<Icon class="material-icons">arrow_forward</Icon>
			</Fab>
		</Cell>
	</LayoutGrid>
</div>

<slot />

<style>
	.container {
		padding: 15px 0px;
	}
	* :global(.paper) {
		display: flex;
		align-items: center;
		flex-grow: 1;
		max-width: 600px;
		margin: 0 12px;
		padding: 0 12px;
		height: 48px;
	}
	* :global(.paper > *) {
		display: inline-block;
		margin: 0 7px;
	}
	* :global(input) {
		color: var(--mdc-theme-on-surface);
	}
	* :global(Input::placeholder) {
		color: var(--mdc-theme-on-surface);
		opacity: 0.6;
	}
	* :global(.fab) {
		flex-shrink: 0;
	}

	h4 {
		padding-left: 10px;
	}

	.title * {
		text-decoration: none;
		color: black;
	}
</style>
