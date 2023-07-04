<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { selectedTitleDetails, error } from '$lib/stores';
	import type { TitleDetails } from '$lib/interfaces/TitleDetails';
	import CircularProgress from '@smui/circular-progress';
	import Select, { Option } from '@smui/select';
	import Paper, { Title, Subtitle } from '@smui/paper';
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import Fab from '@smui/fab';
	import { goto } from '$app/navigation';
	import InnerGrid from '@smui/layout-grid/src/InnerGrid.svelte';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faStar } from '@fortawesome/free-solid-svg-icons/faStar';

	let episodes: TitleDetails[] = [];
	let promise: Promise<void> = new Promise(() => {});
	let loadEpisodesPromise: Promise<void>;
	let totalSeasons: string[] = [];
	let selectedSeason: string;
	$: currentImdbID = $page.params.imdbID;

	onMount(async (): Promise<void> => {
		selectedSeason = $page.params.seasonNo;
		promise = new Promise(async (resolve, reject) => {
			getShowDetails(currentImdbID);
			await getSeason(currentImdbID, parseInt(selectedSeason));
			resolve();
		});
	});

	async function getShowDetails(imdbID: string): Promise<void> {
		error.errorFalse();
		try {
			let res: Response = await fetch(`/api/title?imdbID=${imdbID}&plot=short`);
			let json: TitleDetails = await res.json();
			selectedTitleDetails.set(json);
			for (let i: number = 0; i < parseInt($selectedTitleDetails.totalSeasons as string); i++) {
				totalSeasons.push((i + 1).toString());
			}
		} catch (errorStr: unknown) {
			console.log(errorStr);
			error.errorTrue();
		}
	}

	async function getSeason(imdbID: string, seasonNum: number): Promise<void> {
		error.errorFalse();
		try {
			let res: Response = await fetch(`/api/season?imdbID=${imdbID}&season=${seasonNum}`);
			let json: TitleDetails[] = await res.json();
			episodes = json;
		} catch (errorStr: unknown) {
			console.log(errorStr);
			error.errorTrue();
		}
	}

	function changeSeason() {
		if (selectedSeason !== $page.params.seasonNo) {
			goto(`/title/${currentImdbID}/season=${selectedSeason}`);
			loadEpisodesPromise = new Promise(async (resolve, reject) => {
				await getSeason(currentImdbID, parseInt(selectedSeason));
				resolve();
			});
		}
	}
</script>

<div class="max-width">
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
			<Paper color="secondary" elevation={24}>
				<LayoutGrid>
					<Cell spanDevices={{desktop: 6, tablet: 4, phone: 4}}>
						<h3 style="margin: 0;">{$selectedTitleDetails.Title}</h3>
						<h4 style="margin: 10px auto;">Season {selectedSeason}</h4>
					</Cell>
					<Cell spanDevices={{desktop: 6, tablet: 4, phone: 4}}>
						<div style="margin: 0;">
							<Select bind:value={selectedSeason} on:click={changeSeason}>
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
					<Paper color="secondary">
						<LayoutGrid>
							<Cell spanDevices={{ desktop: 6, tablet: 8, phone: 8 }} class="img">
								<img src={ep.Poster} alt="{ep.Season}.{ep.Episode} - {ep.Title} poster" />
							</Cell>
							<Cell spanDevices={{ desktop: 6, tablet: 8, phone: 8 }}>
								<InnerGrid>
									<Cell spanDevices={{ desktop: 9, tablet: 6, phone: 3 }}>
										<a href={`/title/${ep.imdbID}`}>
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
	{/await}
</div>

<style>
	.container {
		padding: 24px;
	}

	.max-width {
		max-width: 1000px;
		margin: 0 auto;
	}

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

	* :global(.img) {
		display: inline-block;
		min-width: 302px;
	}

	/* * :global(.smui-accordion .smui-accordion__panel > .smui-accordion__header .smui-accordion__header__title.smui-accordion__header__title--with-description) {
		max-width: fit-content;
	} */
</style>
