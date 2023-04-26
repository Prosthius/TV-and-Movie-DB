<script lang="ts">
	import { searchResults, error, selectedTitle } from './stores';
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

	function handleSelectTitleEnter(event: KeyboardEvent): void {
		const value: number = parseInt((event.target as HTMLInputElement).value);
		event.key === 'Enter' ? handleSelectTitle(value) : null;
	}
</script>

{#if $error.Status === true}
	<div>
		Error: {$error.Error}
	</div>
{:else if $searchResults.Loading === true}
	<div class="centred-horizontal" style="margin-top: 70px;">
		<CircularProgress style="height: 100px; width: 100px" indeterminate />
	</div>
{:else if $searchResults.Response === 'True'}
	{#each $searchResults.Search as movie, i}
		<div on:click={() => handleSelectTitle(i)} on:keydown={() => handleSelectTitleEnter}>
			<a href="./SelectedTitle"><h3>{movie.Title}</h3></a>
			<p>{movie.Year}</p>
			<img src={movie.Poster} alt="{movie.Title} poster" />
		</div>
	{/each}
{:else}
	<div>Search for a movie or show</div>
{/if}
