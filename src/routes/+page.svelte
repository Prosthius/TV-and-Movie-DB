<script lang="ts">
	import { searchResults, searchResultsError, selectedTitle } from './stores';
	import { Icon } from '@smui/common';
	import { Input } from '@smui/textfield';
	import Paper from '@smui/paper';
	import LayoutGrid from '@smui/layout-grid/src/LayoutGrid.svelte';
	import Cell from '@smui/layout-grid/src/Cell.svelte';
	import Fab from '@smui/fab/src/Fab.svelte';
	import CircularProgress from '@smui/circular-progress';

	function handleSelectTitle(i: number): void {
		selectedTitle.set(i);
	}

	function handleSelectTitleEnter(event: any): void {
		console.log(typeof event);
		console.log(event.target.value);
		event.key === 'Enter' ? handleSelectTitle(event.target.value) : null;
	}
</script>

{#if $searchResults.Search === undefined}
	<div>
		Error
		{JSON.stringify(searchResultsError)}
	</div>
{:else if $searchResults.Search[0].Poster === '0'}
	<div />
{:else}
	{#each $searchResults.Search as movie, i}
		<div on:click={() => handleSelectTitle(i)} on:keydown={() => handleSelectTitleEnter}>
			<a href="./SelectedTitle"><h3>{movie.Title}</h3></a>
			<p>{movie.Year}</p>
			<img src={movie.Poster} alt={movie.Title} />
		</div>
	{/each}
{/if}
