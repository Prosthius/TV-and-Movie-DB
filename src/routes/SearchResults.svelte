<script lang="ts">
	import { searchResults, searchResultsError } from './stores';
	import { Icon } from '@smui/common';
	import { Input } from '@smui/textfield';
	import Paper from '@smui/paper';
	import LayoutGrid from '@smui/layout-grid/src/LayoutGrid.svelte';
	import Cell from '@smui/layout-grid/src/Cell.svelte';
	import Fab from '@smui/fab/src/Fab.svelte';
	import CircularProgress from '@smui/circular-progress';
</script>

{#if $searchResults.Search === undefined}
	<div>
        Error
        {JSON.stringify(searchResultsError)}
    </div>
{:else}
    {#each $searchResults.Search as movie}
        <div class="movie">
            <img src={movie.Poster} alt={movie.Title} />
            <h3>{movie.Title}</h3>
            <p>{movie.Year}</p>
        </div>
    {/each}
{/if}
