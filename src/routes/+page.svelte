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
		event.key === 'Enter' ? handleSelectTitle(event.target.value) : null;
	}
</script>

{#if $searchResultsError.Status === true}
	<div>
		Error: {$searchResultsError.Error}
	</div>
{:else if $searchResults.Loading === true}
	<div class="centred-horizontal" style="margin-top: 70px;">
		<CircularProgress style="height: 100px; width: 100px" indeterminate />
	</div>
{:else}
	{#each $searchResults.Search as movie, i}
		<div on:click={() => handleSelectTitle(i)} on:keydown={() => handleSelectTitleEnter}>
			<a href="./SelectedTitle"><h3>{movie.Title}</h3></a>
			<p>{movie.Year}</p>
			<img src={movie.Poster} alt="{movie.Title} poster"/>
		</div>
	{/each}
{/if}
