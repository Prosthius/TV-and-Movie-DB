<script lang="ts">
	import { onMount } from 'svelte';
	import { searchResults, selectedTitle, selectedTitleDetails } from '../stores';
	import { PUBLIC_API_KEY as apiKey } from '$env/static/public';
	import type { TitleDetails } from '$lib/interfaces/OmdbSearchResults/TitleDetails';
	import type { OmdbError } from '$lib/interfaces/OmdbSearchResults/Error';

	let baseURL: string = `https://www.omdbapi.com/?apikey=${apiKey}&`;

	onMount(async () => {
		await getInfo($selectedTitle);
		console.log($selectedTitleDetails);
	});

	async function getInfo(index: number): Promise<void> {
		console.log($searchResults.Search[index].imdbID);
		try {
			let res: Response = await fetch(`${baseURL}i=${$searchResults.Search[index].imdbID}`);
			let json: TitleDetails & OmdbError = await res.json();
			selectedTitleDetails.set(json);
		} catch (error) {
			console.log(error);
		}
	}
</script>

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
