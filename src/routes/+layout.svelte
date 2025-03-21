<script lang="ts">
	import '../app.scss';
	import { onMount } from 'svelte';
	import { Icon } from '@smui/common';
	import { Input } from '@smui/textfield';
	import Paper from '@smui/paper';
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import Fab from '@smui/fab';
	import IconButton from '@smui/icon-button';
	import TopAppBar, { Row, Section } from '@smui/top-app-bar';
	import Tooltip, { Wrapper } from '@smui/tooltip';
	import { goto } from '$app/navigation';
	import { searchTitleInput } from '$lib/stores';

	let lightTheme: boolean;

	onMount((): void => {
		lightTheme = window.matchMedia('(prefers-color-scheme: light)').matches;
	});

	function handleSearchEnterPress(event: KeyboardEvent | CustomEvent): void {
		if ((event as KeyboardEvent).key === 'Enter') goto(`/search/${$searchTitleInput}`);
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
						searchTitleInput.set('');
					}}
				>
					MTVDB
				</a>
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
					bind:value={$searchTitleInput}
					on:keydown={handleSearchEnterPress}
					placeholder="Search for a Movie or Show"
					class="input"
				/>
			</Paper>
			<Fab href={`/search/${$searchTitleInput}`} color="primary" mini class="fab">
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
