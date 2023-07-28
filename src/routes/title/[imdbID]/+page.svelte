<script lang="ts">
	import { onMount } from 'svelte';
	import { selectedTitleDetails, error } from '$lib/stores';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { TitleDetails } from '$lib/interfaces/TitleDetails';
	import type { Error, StreamingError } from '$lib/interfaces/Error';
	import type { StreamingAvailability } from '$lib/interfaces/StreamingAvailability';
	import CircularProgress from '@smui/circular-progress';
	import Fab from '@smui/fab';
	import Paper, { Title } from '@smui/paper';
	import LayoutGrid, { Cell, InnerGrid } from '@smui/layout-grid';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faStar } from '@fortawesome/free-solid-svg-icons/faStar';

	let streamingAvailability: StreamingAvailability;
	let streamingError: StreamingError;
	let promise: Promise<void>;
	$: title = $selectedTitleDetails;
	$: type = $selectedTitleDetails.Type === 'series' ? 'TV Series' : 'Movie';

	onMount(async (): Promise<void> => {
		promise = new Promise(async (resolve, reject) => {
			selectedTitleDetails.reset();
			await Promise.all([getAvailability($page.params.imdbID), getInfo($page.params.imdbID)]);
			resolve();
		});
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
			const json: StreamingAvailability | StreamingError = await res.json();
			IsStreamingAvailability(json)
				? (streamingAvailability = json as StreamingAvailability)
				: (streamingError = json as StreamingError);
		} catch (errorStr: unknown) {
			console.error(errorStr);
		}
	}

	function IsStreamingAvailability(
		json: StreamingAvailability | StreamingError
	): json is StreamingAvailability {
		return (json as StreamingAvailability).result !== undefined;
	}

	async function goToSeasons(imdbID: string, seasonNo: number): Promise<void> {
		goto(`/title/${encodeURIComponent(imdbID)}/season=${seasonNo}`);
	}
</script>

<div class="body">
	{#await promise}
		<div class="loading centred-horizontal">
			<CircularProgress style="height: 100px; width: 100px" indeterminate />
		</div>
	{:then}
		{#if $error.Status}
			<div>
				{$error.Error}
			</div>
			<!-- {:else if $selectedTitleDetails.Loading === true}
		<div class="loading centred-horizontal">
			<CircularProgress style="height: 100px; width: 100px" indeterminate />
		</div> -->
		{:else}
			{#if $selectedTitleDetails.Type === 'series'}
				<div class="container">
					<Fab on:click={() => goToSeasons($page.params.imdbID, 1)} color="primary" extended>
						Episode Guide
					</Fab>
				</div>
			{:else if $selectedTitleDetails.Type === 'episode'}
				<div class="container">
					<Fab
						on:click={() =>
							goToSeasons(
								String($selectedTitleDetails.seriesID),
								parseInt($selectedTitleDetails.Season)
							)}
						extended
						>Episode Guide
					</Fab>
				</div>
			{/if}
			<div class="container">
				<Paper color="secondary">
					<LayoutGrid>
						<Cell spanDevices={{ desktop: 5, tablet: 8, phone: 8 }}>
							<img src={title.Poster} alt="{title.Title} poster" />
						</Cell>
						<Cell spanDevices={{ desktop: 7, tablet: 8, phone: 8 }}>
							<InnerGrid>
								<Cell spanDevices={{ desktop: 9, tablet: 6, phone: 3 }}>
									<h3>{title.Title}</h3>
									<div style="opacity: 70%;">
										<span class="move">{title.imdbRating}</span>
										<FontAwesomeIcon class="icon" icon={faStar} />
										({title.imdbVotes})
										<br />
										{title.Year}
										<br />
										{type}
										<br />
										{$selectedTitleDetails.Runtime}
										<br />
										{$selectedTitleDetails.Rated}
									</div>
								</Cell>
								<Cell spanDevices={{ desktop: 3, tablet: 2, phone: 4 }}>
									<Fab color="primary" extended style="min-width: 110px;">Add to Watchlist</Fab>
								</Cell>
								<Cell span={12}>
									{title.Plot}
								</Cell>
							</InnerGrid>
						</Cell>
					</LayoutGrid>
				</Paper>
			</div>
			<div class="container">
				<Paper>
					<Title>Genre(s)</Title>
					{$selectedTitleDetails.Genre}
				</Paper>
			</div>
			<div class="container">
				<Paper>
					<Title>Streaming Services</Title>
					{#if streamingAvailability?.result.streamingInfo.au}
						{#each Object.keys(streamingAvailability.result.streamingInfo.au) as service}
							<div><ul>{service}:</ul></div>
							{#each streamingAvailability.result.streamingInfo.au[service] as streamingService}
								<div>{streamingService.type}</div>
							{/each}
						{/each}
					{:else}
						<div>Streaming service information unavailable</div>
					{/if}
				</Paper>
			</div>
			<div class="container">
				<Paper>
					<div class="paper-container">
						<Title>Top Cast</Title>
						{$selectedTitleDetails.Actors}
					</div>
					<div class="paper-container">
						<Title>Director</Title>
						{$selectedTitleDetails.Director}
					</div>
					<Title>Writer(s)</Title>
					{$selectedTitleDetails.Writer}
				</Paper>
			</div>
			{#if $selectedTitleDetails.Ratings.length > 1}
				<div class="container">
					<Paper>
						<Title>Ratings</Title>
						<ul>
							{#each $selectedTitleDetails.Ratings as rating}
								<li>{rating.Source}: {rating.Value}</li>
							{/each}

						</ul>
					</Paper>
				</div>
			{/if}
			<div class="container">
				<Paper>
					<div class="paper-container">
						<Title>Language</Title>
						{$selectedTitleDetails.Language}
					</div>
					<div class="paper-container">
						<Title>Country</Title>
						{$selectedTitleDetails.Country}
					</div>
					<Title>Awards</Title>
					{$selectedTitleDetails.Awards}
				</Paper>
			</div>
		{/if}
	{/await}
</div>

<style>
	h3 {
		margin: 0;
	}

	* :global(.icon) {
		color: yellow;
	}

	* :global(.smui-paper.smui-paper--color-secondary.smui-paper--raised.smui-paper--elevation-z1) {
		box-shadow: 0px 6px 6px -3px rgba(0, 0, 0, 0.2), 0px 10px 14px 1px rgba(0, 0, 0, 0.14),
			0px 4px 18px 3px rgba(0, 0, 0, 0.12);
	}

	.paper-container {
		margin-bottom: 20px;
	}
</style>
