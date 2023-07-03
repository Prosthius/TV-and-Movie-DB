<script lang="ts">
	import { onMount } from 'svelte';
	import { selectedTitleDetails, error } from '$lib/stores';
	import { page } from '$app/stores';
	import type { TitleDetails } from '$lib/interfaces/TitleDetails';
	import type { Error, GenericError } from '$lib/interfaces/Error';
	import type { StreamingAvailability } from '$lib/interfaces/StreamingAvailability';
	import CircularProgress from '@smui/circular-progress';
	import Fab from '@smui/fab';
	import { goto } from '$app/navigation';

	let streamingAvailability: StreamingAvailability;
	let genericError: GenericError;
	let promise: Promise<void>;

	onMount(async (): Promise<void> => {
		promise = new Promise(async (resolve, reject) => {
			selectedTitleDetails.reset();
			await getAvailability($page.params.imdbID);
			resolve();
		});
		getInfo($page.params.imdbID);
	});

	async function getInfo(imdbID: string): Promise<void> {
		selectedTitleDetails.loadingTrue();
		error.errorFalse();
		try {
			let res: Response = await fetch(`/api/title?imdbID=${imdbID}&plot=full`);
			let json: TitleDetails | Error = await res.json();
			if (json.Response === 'True') {
				selectedTitleDetails.setData(json as TitleDetails);
			} else {
				error.setData(json as Error);
				error.errorTrue();
			}
		} catch (errorStr: unknown) {
			console.log(errorStr);
			error.set({ Error: errorStr, Response: 'False', Status: true } as Error);
		}
	}

	async function getAvailability(imdbID: string): Promise<void> {
		try {
			const res: Response = await fetch(`/api/streaming?imdbID=${imdbID}`);
			const json: StreamingAvailability | GenericError = await res.json();
			IsStreamingAvailability(json)
				? (streamingAvailability = json as StreamingAvailability)
				: (genericError = json as GenericError);
			console.log(streamingAvailability, genericError);
		} catch (errorStr: unknown) {
			console.error(errorStr);
			genericError = errorStr as GenericError;
		}
	}

	function IsStreamingAvailability(
		json: StreamingAvailability | GenericError
	): json is StreamingAvailability {
		return (json as StreamingAvailability).result !== undefined;
	}

	async function goToSeasons(imdbID: string, seasonNo: number): Promise<void> {
		goto(`/title/${encodeURIComponent(imdbID)}/season=${seasonNo}`);
	}
</script>

{#await promise}
	<div class="centred-horizontal" style="margin-top: 70px;">
		<CircularProgress style="height: 100px; width: 100px" indeterminate />
	</div>
{:then}
	{#if $error.Status || genericError}
		<div>
			{$error.Error || genericError}
		</div>
	{:else if $selectedTitleDetails.Loading === true}
		<div class="centred-horizontal" style="margin-top: 70px;">
			<CircularProgress style="height: 100px; width: 100px" indeterminate />
		</div>
	{:else}
		{#if $selectedTitleDetails.Type === 'series'}
			<Fab on:click={() => goToSeasons($page.params.imdbID, 1)} extended>Episode Guide</Fab>
		{/if}
		<h1>{$selectedTitleDetails.Title}</h1>
		<img src={$selectedTitleDetails.Poster} alt={$selectedTitleDetails.Title} />
		<h6>Streaming Services</h6>
		{#if streamingAvailability}
			{#each Object.keys(streamingAvailability.result.streamingInfo.au) as service}
				<div><ul>{service}:</ul></div>
				{#each streamingAvailability.result.streamingInfo.au[service] as streamingService}
					<div>{streamingService.type}</div>
				{/each}
			{/each}
		{:else}
			<div>Streaming service information unavailable</div>
		{/if}
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
		{#if $selectedTitleDetails.totalSeasons}
			<p>Total Seasons: {$selectedTitleDetails.totalSeasons}</p>
		{/if}
	{/if}
{/await}
