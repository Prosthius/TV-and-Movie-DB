<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { selectedTitleDetails } from '$lib/stores';
	import type { TitleDetails } from '$lib/interfaces/TitleDetails';
	import CircularProgress from '@smui/circular-progress';
	import Select, { Option } from '@smui/select';
	import Paper, { Title } from '@smui/paper';
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import Fab from '@smui/fab';
	import { goto } from '$app/navigation';
	import InnerGrid from '@smui/layout-grid/src/InnerGrid.svelte';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faStar } from '@fortawesome/free-solid-svg-icons/faStar';

	let episodes: TitleDetails[] = [];
	let promise: Promise<[void, void]> = new Promise(() => {});
	let loadEpisodesPromise: Promise<void>;
	let totalSeasons: string[] = [];
	let selectedSeason: string;
	$: currentImdbID = $page.params.imdbID;

	onMount(async (): Promise<void> => {
		try {
			selectedSeason = $page.params.seasonNo;
			promise = Promise.all([
				getShowDetails(currentImdbID),
				getSeason(currentImdbID, parseInt(selectedSeason))
			]);
			await promise;
		} catch (error: unknown) {
			console.log(error);
		}
	});

	async function getShowDetails(imdbID: string): Promise<void> {
		try {
			let res: Response = await fetch(`/api/title?imdbID=${imdbID}&plot=short`);
			let json: TitleDetails = await res.json();
			selectedTitleDetails.set(json);
			if ($selectedTitleDetails.Response === 'False') throw new Error($selectedTitleDetails.Error);
			for (let i: number = 0; i < parseInt($selectedTitleDetails.totalSeasons as string); i++) {
				totalSeasons.push((i + 1).toString());
			}
		} catch (error: unknown) {
			console.log(error);
			throw error;
		}
	}

	async function getSeason(imdbID: string, seasonNum: number): Promise<void> {
		try {
			let res: Response = await fetch(`/api/season?imdbID=${imdbID}&season=${seasonNum}`);
			let json: TitleDetails[] | TitleDetails = await res.json();
			if ((json as TitleDetails).Response === 'False')
				throw new Error((json as TitleDetails).Error);
			episodes = json as TitleDetails[];
		} catch (error: unknown) {
			console.log(error);
			throw error;
		}
	}

	function changeSeason(season: string) {
		if (season !== $page.params.seasonNo) {
			goto(`/title/${currentImdbID}/season=${season}`);
			loadEpisodesPromise = new Promise(async (resolve, reject) => {
				try {
					await getSeason(currentImdbID, parseInt(season));
					resolve();
				} catch (error: unknown) {
					reject(error);
					console.log(error);
				}
			});
		}
	}
</script>

<div class="body">
	{#await promise}
		<div class="loading centred-horizontal">
			<CircularProgress style="height: 100px; width: 100px" indeterminate />
		</div>
	{:then}
		<div class="container">
			<Fab on:click={() => goto(`/title/${$page.params.imdbID}`)} color="primary" extended>
				Back to Show Details
			</Fab>
		</div>
		<div class="container">
			<Paper color="secondary">
				<LayoutGrid>
					<Cell spanDevices={{ desktop: 6, tablet: 4, phone: 4 }}>
						<h3 style="margin: 0;">{$selectedTitleDetails.Title}</h3>
						<h4 style="margin: 10px auto;">Season {selectedSeason}</h4>
					</Cell>
					<Cell spanDevices={{ desktop: 6, tablet: 4, phone: 4 }}>
						<div style="margin: 0;">
							<Select bind:value={selectedSeason} on:click={() => changeSeason(selectedSeason)}>
								{#each totalSeasons as seasonNum}
									<Option value={seasonNum}>Season {seasonNum}</Option>
								{/each}
							</Select>
						</div>
						<h5 style="margin: 15px auto;">{$selectedTitleDetails.totalSeasons} Total Seasons</h5>
					</Cell>
					<Cell span={3} />
				</LayoutGrid>
			</Paper>
		</div>
		{#await loadEpisodesPromise}
			<div class="loading centred-horizontal">
				<CircularProgress style="height: 100px; width: 100px" indeterminate />
			</div>
		{:then}
			{#each episodes as ep}
				<div class="container">
					<Paper>
						<LayoutGrid>
							<Cell spanDevices={{ desktop: 6, tablet: 8, phone: 8 }}>
								<img src={ep.Poster} alt="{ep.Season}.{ep.Episode} - {ep.Title} poster" />
							</Cell>
							<Cell spanDevices={{ desktop: 6, tablet: 8, phone: 8 }}>
								<InnerGrid>
									<Cell spanDevices={{ desktop: 9, tablet: 6, phone: 3 }}>
										<a href={`/title/${ep.imdbID}`} data-sveltekit-preload-data="off">
											<Title>{ep.Season}.{ep.Episode}<br />{ep.Title}</Title>
										</a>
										<div style="opacity: 70%;">
											<span class="move">{ep.imdbRating}</span>
											<FontAwesomeIcon class="icon" icon={faStar} />
											({ep.imdbVotes})
										</div>
									</Cell>
									<Cell spanDevices={{ desktop: 3, tablet: 2, phone: 1 }}>
										{ep.Released}
									</Cell>
									<Cell span={12}>
										{ep.Plot}
									</Cell>
								</InnerGrid>
							</Cell>
						</LayoutGrid>
					</Paper>
				</div>
			{/each}
		{/await}
	{:catch error}
		<div class="container error centre">
			{error}
		</div>
	{/await}
</div>

<style>
	.move {
		transform: translate(0px, 0px);
		display: inline-block;
	}

	* :global(.icon) {
		color: yellow;
	}

	* :global(.move-span) {
		margin-left: 25px;
	}

	* :global(.smui-paper.smui-paper--color-secondary.smui-paper--raised.smui-paper--elevation-z1) {
		box-shadow: 0px 6px 6px -3px rgba(0, 0, 0, 0.2), 0px 10px 14px 1px rgba(0, 0, 0, 0.14),
			0px 4px 18px 3px rgba(0, 0, 0, 0.12);
	}
</style>
