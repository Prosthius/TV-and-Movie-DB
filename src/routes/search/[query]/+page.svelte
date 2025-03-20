<script lang="ts">
	import { navigating } from '$app/stores';
	import type { PageData } from './$types';
	import SearchResult from './SearchResult.svelte';
	import LoadingIcon from '../../LoadingIcon.svelte';

	export let data: PageData;
</script>

<div class="body">
	{#if $navigating}
		<LoadingIcon />
	{:else}
	{#each data.searchResults.Search as title, i}
		<SearchResult {title} {i}/>
	{/each}
	{/if}
</div>

<style>
</style>
