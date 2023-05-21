<script lang="ts">
	import { onMount } from 'svelte';
	import { selectedTitleDetails, error } from '$lib/stores';
	import { page } from '$app/stores';
	import type { TitleDetailsData } from '$lib/interfaces/TitleDetails';
	import type { ErrorData } from '$lib/interfaces/Error';
	import type {
		StreamingAvailability,
		StreamingAvailabilityError
	} from '$lib/interfaces/StreamingAvailability';
	import CircularProgress from '@smui/circular-progress';

	let baseURL_OMDB: string = `https://omdb-search-id.mtvdb.callumhopkins.au`;
	let streamingAvailability: StreamingAvailability;
	let streamingAvailabilityError: StreamingAvailabilityError;
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
			json.Response === 'True'
				? selectedTitleDetails.setData(json as TitleDetailsData)
				: error.setData(json as ErrorData)
		} catch (errorStr) {
			console.log(errorStr);
		}
	}

	async function getAvailability(imdbID: string): Promise<void> {
		const url: string = `https://streaming-availability.mtvdb.callumhopkins.au/?imdbID=${imdbID}`;
		try {
			const res: Response = await fetch(url);
			const json: StreamingAvailability | StreamingAvailabilityError = await res.json();
			IsStreamingAvailability(json)
				? (streamingAvailability = json as StreamingAvailability)
				: (streamingAvailabilityError = json as StreamingAvailabilityError);
			console.log(streamingAvailability, streamingAvailabilityError);
		} catch (errorStr) {
			console.error(errorStr);
		}
	}

	function IsStreamingAvailability(
		json: StreamingAvailability | StreamingAvailabilityError
	): json is StreamingAvailability {
		return (json as StreamingAvailability).result !== undefined;
	}
</script>

{#await promise}
	<div class="centred-horizontal" style="margin-top: 70px;">
		<CircularProgress style="height: 100px; width: 100px" indeterminate />
	</div>
{:then}
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
		{#if $selectedTitleDetails.totalSeasons === ' '}
			<p>Total Seasons: {$selectedTitleDetails.totalSeasons}</p>
		{/if}
	{/if}
{/await}
