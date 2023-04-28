<script lang="ts">
	import { onMount } from 'svelte';
	import { selectedTitleDetails, error } from '$lib/stores';
	import { page } from '$app/stores';
	import type { TitleDetailsData } from '$lib/interfaces/TitleDetails';
	import type { ErrorData } from '$lib/interfaces/Error';
	import CircularProgress from '@smui/circular-progress';

	let baseURL: string = `https://omdb-search-id.mtvdb.callumhopkins.au`;

	onMount(async () => {
		await getInfo($page.params.imdbID);
	});

	async function getInfo(imdbID: string): Promise<void> {
		selectedTitleDetails.loadingTrue();
		try {
			let res: Response = await fetch(`${baseURL}/?i=${imdbID}&plot=full`);
			let json: TitleDetailsData | ErrorData = await res.json();
			json.Response === 'False'
				? error.setData(json as ErrorData)
				: selectedTitleDetails.setData(json as TitleDetailsData);
		} catch (errorStr) {
			console.log(errorStr);
		}
	}
</script>

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
