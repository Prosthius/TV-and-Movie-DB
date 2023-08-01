<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { searchResults, selectedTitle, hasRun, searchTitlePromise } from '$lib/stores';
	import { capitaliseFirstLetter } from '$lib/helper';
	import { page } from '$app/stores';
	import Paper from '@smui/paper';
	import LayoutGrid from '@smui/layout-grid/src/LayoutGrid.svelte';
	import Cell from '@smui/layout-grid/src/Cell.svelte';
	import CircularProgress from '@smui/circular-progress';
	import type { SearchResults } from '$lib/interfaces/SearchResults';
	import type { Error } from '$lib/interfaces/Error';

	let promise: Promise<void> = new Promise(() => {});
	let searchTitleInput: string;

	onMount(async (): Promise<void> => {
		if (!$hasRun) {
			try {
				promise = searchTitle($page.params.query);
				searchTitlePromise.set(promise);
				await promise;
				searchTitlePromise.set(promise);
			} catch (error: unknown) {
				console.log(error);
				searchTitlePromise.set(promise);
			}
		}
	});

	onDestroy((): void => {
		hasRun.set(false);
	});

	async function searchTitle(query: string): Promise<void> {
		try {
			searchResults.loadingTrue();
			hasRun.set(true);
			if (!query) throw new Error('No query');
			searchTitleInput = '';
			let res: Response = await fetch(`/api/search?query=${query}`);
			let json: SearchResults | Error = await res.json();
			if (json.Response === 'False') throw new Error((json as Error).Error);
			searchResults.setData(json as SearchResults);
			searchResults.loadingFalse();
		} catch (error: any) {
			searchResults.loadingFalse();
			console.log(error);
			throw error;
		}
	}

	function handleSelectTitleEnter(event: KeyboardEvent): void {
		const value: number = parseInt((event.target as HTMLInputElement).value);
		event.key === 'Enter' ? selectedTitle.set(value) : null;
	}
</script>

<div class="body">
	{#await $searchTitlePromise || promise}
		<div class="loading centred-horizontal">
			<CircularProgress style="height: 100px; width: 100px" indeterminate />
		</div>
	{:then}
		{#each $searchResults.Search as title, i}
			<div class="container">
				<Paper color="secondary">
					<LayoutGrid>
						<Cell spanDevices={{ desktop: 3, tablet: 3, phone: 4 }}>
							<img src={title.Poster} alt="{title.Title} poster" />
						</Cell>
						<Cell spanDevices={{ desktop: 9, tablet: 5, phone: 4 }}>
							<div class="title">
								<a
									href={`/title/${title.imdbID}`}
									on:click={() => selectedTitle.set(i)}
									on:keydown={() => handleSelectTitleEnter}
									>{title.Title}
								</a>
							</div>
							<div class="sub-text">
								{title.Year}
							</div>
							<div class="sub-text">
								{capitaliseFirstLetter(title.Type)}
							</div>
						</Cell>
					</LayoutGrid>
				</Paper>
			</div>
		{/each}
	{:catch error}
		<div class="container error centre">
			{error}
		</div>
	{/await}
</div>

<style>
	.title {
		font-size: 3rem;
		line-height: 1;
		margin: 0px 0px 10px 0px;
	}

	img {
		max-width: 150px;
	}

	.sub-text {
		opacity: 80%;
	}

	* :global(.smui-paper.smui-paper--color-secondary.smui-paper--raised.smui-paper--elevation-z1) {
		box-shadow: 0px 6px 6px -3px rgba(0, 0, 0, 0.2), 0px 10px 14px 1px rgba(0, 0, 0, 0.14),
			0px 4px 18px 3px rgba(0, 0, 0, 0.12);
	}
</style>
