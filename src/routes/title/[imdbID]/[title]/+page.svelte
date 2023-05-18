<script lang="ts">
	import { onMount } from 'svelte';
	import { selectedTitleDetails, error } from '$lib/stores';
	import { page } from '$app/stores';
	import type { TitleDetailsData } from '$lib/interfaces/TitleDetails';
	import type { ErrorData } from '$lib/interfaces/Error';
	import CircularProgress from '@smui/circular-progress';

	let baseURL_OMDB: string = `https://omdb-search-id.mtvdb.callumhopkins.au`;
	let streamingAvailability: any;
	let promise: Promise<void>;

	onMount(async (): Promise<void> => {
		promise = new Promise(async (resolve, reject) => {
			await getAvailability($page.params.imdbID);
			resolve();
		});
		getInfo($page.params.imdbID);
	});

	async function getInfo(imdbID: string): Promise<void> {
		selectedTitleDetails.loadingTrue();
		try {
			let res: Response = await fetch(`${baseURL_OMDB}/?i=${imdbID}&plot=full`);
			let json: TitleDetailsData | ErrorData = await res.json();
			json.Response === 'False'
				? error.setData(json as ErrorData)
				: selectedTitleDetails.setData(json as TitleDetailsData);
		} catch (errorStr) {
			console.log(errorStr);
		}
	}

	async function getAvailability(imdbID: string): Promise<void> {
		// const url: string = `http://127.0.0.1:8787/?imdbID=${imdbID}`;
		const url: string = `https://streaming-availability.mtvdb.callumhopkins.au/?imdbID=${imdbID}`;
		try {
			const res: Response = await fetch(url);
			const json: any = await res.json();
			streamingAvailability = json;
			console.log(streamingAvailability);
		} catch (errorStr) {
			console.error(errorStr);
		}
	}
</script>

{#await promise}
<div>waiting...</div>
{:then}
<div>{streamingAvailability}</div>

<!-- {#if success}
	<div>{streamingAvailability[0].streamingInfo.au}</div>
{:else}
	<div>false</div>
{/if} -->
{/await}

{#if $error.Status}
	<div>
		Error: {$error.Error}
	</div>
{:else if $selectedTitleDetails.Loading === true}
	<div class="centred-horizontal" style="margin-top: 70px;">
		<CircularProgress style="height: 100px; width: 100px" indeterminate />
	</div>
{:else}
	<h1>{$selectedTitleDetails.Title}</h1>
	<img src={$selectedTitleDetails.Poster} alt={$selectedTitleDetails.Title} />
	<p>Year: {$selectedTitleDetails.Year}</p>
	<p>Rated: {$selectedTitleDetails.Rated}</p>
	<p>Released: {$selectedTitleDetails.Released}</p>
	<p>Runtime: {$selectedTitleDetails.Runtime}</p>
	<p>Genre: {$selectedTitleDetails.Genre}</p>
	<p>Director: {$selectedTitleDetails.Director}</p>
	<p>Writer: {$selectedTitleDetails.Writer}</p>
	<p>Actors: {$selectedTitleDetails.Actors}</p>
	<p>Plot: {$selectedTitleDetails.Plot}</p>
	<p>Language: {$selectedTitleDetails.Language}</p>
	<p>Country: {$selectedTitleDetails.Country}</p>
	<p>Awards: {$selectedTitleDetails.Awards}</p>
	<h4>Ratings</h4>
	<ul>
		{#each $selectedTitleDetails.Ratings as rating}
			<li>{rating.Source}: {rating.Value}</li>
		{/each}
	</ul>
	<p>Metascore: {$selectedTitleDetails.Metascore}</p>
	<p>IMDB Rating: {$selectedTitleDetails.imdbRating}</p>
	<p>IMDB Votes: {$selectedTitleDetails.imdbVotes}</p>
	<p>IMDB ID: {$selectedTitleDetails.imdbID}</p>
	<p>Type: {$selectedTitleDetails.Type}</p>
	{#if $selectedTitleDetails.totalSeasons !== undefined}
		<p>Total Seasons: {$selectedTitleDetails.totalSeasons}</p>
	{/if}
{/if}
