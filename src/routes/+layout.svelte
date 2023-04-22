<script lang="ts">
	import '../app.scss';
	import { PUBLIC_API_KEY as apiKey } from '$env/static/public';
    import { goto } from '$app/navigation';
	import type { OmdbSearchResults } from '$lib/interfaces/OmdbSearchResults/SearchResults';
	import type { OmdbError } from '$lib/interfaces/OmdbSearchResults/Error';
	import { searchResults, searchResultsError } from './stores';
	import { onMount } from 'svelte';
	import { Icon } from '@smui/common';
	import { Input } from '@smui/textfield';
	import Paper from '@smui/paper';
	import LayoutGrid from '@smui/layout-grid/src/LayoutGrid.svelte';
	import Cell from '@smui/layout-grid/src/Cell.svelte';
	import Fab from '@smui/fab/src/Fab.svelte';
	import IconButton from '@smui/icon-button';
	import TopAppBar, { Row, Section } from '@smui/top-app-bar';
	import Tooltip, { Wrapper } from '@smui/tooltip';

	let lightTheme: boolean;
	let searchTitleInput: string;
	let baseURL: string = `https://www.omdbapi.com/?apikey=${apiKey}&`;

	onMount(() => {
		lightTheme = window.matchMedia('(prefers-color-scheme: light)').matches;
	});

	function handleSearchEnterPress(event: CustomEvent | KeyboardEvent): void {
		event = event as KeyboardEvent;
		event.key === 'Enter' ? searchTitle(searchTitleInput) : null;
	}

	async function searchTitle(query: string): Promise<void> {
		searchTitleInput = '';
		try {
			let res: Response = await fetch(`${baseURL}s=${query}`);
			let json: OmdbSearchResults & OmdbError = await res.json();
			if (json.Response === 'False') {
				searchResultsError.set(json);
				console.log(json);
			} else {
				searchResults.set(json);
				console.log(json);
			}
		} catch (error) {
			console.log(error);
		}
        goto('/');
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
			<h4 class="title"><a href="./">MTVDB</a></h4>
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
			<Fab on:click={() => searchTitle(searchTitleInput)} color="primary" mini class="fab">
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
    }
</style>
