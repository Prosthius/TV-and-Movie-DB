<script lang="ts">
	import { onMount, onDestroy, getContext } from 'svelte';
	import { searchResults, error, selectedTitle } from '$lib/stores';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Icon } from '@smui/common';
	import { Input } from '@smui/textfield';
	import Paper from '@smui/paper';
	import LayoutGrid from '@smui/layout-grid/src/LayoutGrid.svelte';
	import Cell from '@smui/layout-grid/src/Cell.svelte';
	import Fab from '@smui/fab/src/Fab.svelte';
	import CircularProgress from '@smui/circular-progress';
	import InnerGrid from '@smui/layout-grid/src/InnerGrid.svelte';

	const searchTitle: (query: string) => Promise<void> = getContext('searchTitle');

	onMount(() => {
		$searchResults.Loading ? null : searchTitle($page.params.query);
	});

	function handleSelectTitleEnter(event: KeyboardEvent): void {
		const value: number = parseInt((event.target as HTMLInputElement).value);
		event.key === 'Enter' ? selectedTitle.set(value) : null;
	}

	function capitaliseFirstLetter(str: string): string {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}
</script>

<div class="body">
	{#if $error.Status}
		<div>
			{$error.Error}
		</div>
	{:else if $searchResults.Loading}
		<div class="loading centred-horizontal">
			<CircularProgress style="height: 100px; width: 100px" indeterminate />
		</div>
	{:else if $searchResults.Response === 'True'}
		{#each $searchResults.Search as title, i}
			<div class="container">
				<Paper color="secondary">
					<LayoutGrid>
						<Cell spanDevices={{ desktop: 3, tablet: 3, phone: 2 }}>
							<img src={title.Poster} alt="{title.Title} poster" />
						</Cell>
						<Cell spanDevices={{ desktop: 9, tablet: 5, phone: 2 }}>
							<a
								href={`/title/${title.imdbID}`}
								on:click={() => selectedTitle.set(i)}
								on:keydown={() => handleSelectTitleEnter}
							>
								<h4>{title.Title}</h4>
							</a>
							<p>{title.Year}</p>
							<p>{capitaliseFirstLetter(title.Type)}</p>
						</Cell>
					</LayoutGrid>
				</Paper>
			</div>
		{/each}
	{:else}
		<div class="loading centred-horizontal">
			<CircularProgress style="height: 100px; width: 100px" indeterminate />
		</div>
	{/if}
</div>

<style>
	.container {
		padding: 24px;
	}

	a h4 {
		max-width: fit-content;
		margin: 0;
		font-size: 2.5rem;
		text-decoration: underline;
	}

	a {
		text-decoration: none;
	}

	img {
		max-width: 150px;
	}

	p {
		opacity: 80%;
	}

	.body {
		max-width: 1000px;
		margin: 0 auto;
	}

	* :global(.smui-paper.smui-paper--color-secondary.smui-paper--raised.smui-paper--elevation-z1) {
		box-shadow: 0px 6px 6px -3px rgba(0, 0, 0, 0.2), 0px 10px 14px 1px rgba(0, 0, 0, 0.14),
			0px 4px 18px 3px rgba(0, 0, 0, 0.12);
	}
</style>
