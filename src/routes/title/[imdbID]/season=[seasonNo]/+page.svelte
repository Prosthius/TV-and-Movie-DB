<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import { error } from '$lib/stores';
	import type { Season } from '$lib/interfaces/Season';
	import type { TitleDetailsData } from '$lib/interfaces/TitleDetails';
	import CircularProgress from '@smui/circular-progress';
	import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
	import IconButton, { Icon } from '@smui/icon-button';
	import Select, { Option } from '@smui/select';
	import { goto } from '$app/navigation';

	let baseURI: string = 'https://api.mtvdb.callumhopkins.au';
	let season: Season;
	let episodeDetails: TitleDetailsData[] = [];
	let promise: Promise<void> = new Promise(() => {});
	let loadEpisodesPromise: Promise<void>;
	let panelOpen: boolean[] = [false];
	let totalSeasons: string[] = [];
	let selectedSeason: string = $page.params.seasonNo;
	$: currentImdbID = $page.params.imdbID;

	onMount(async (): Promise<void> => {
		promise = new Promise(async (resolve, reject) => {
			await loadEpisodes();
			resolve();
		});
	});

	async function loadEpisodes(): Promise<void> {
		let episodePromises: Promise<void>[] = [new Promise<void>(() => {})];
		await getSeason(currentImdbID, parseInt(selectedSeason));
		episodeDetails = [];
		episodePromises = season.Episodes.map((episode) => getEpisode(episode.imdbID));
		await Promise.all(episodePromises);
		// Ensures that episodes are ordered from lowest to highest in the array
		episodeDetails.sort((a, b) => parseInt(a.Episode) - parseInt(b.Episode));
		for (let i: number = 0; i < parseInt(season.totalSeasons); i++) {
			totalSeasons.push((i + 1).toString());
		}
	}

	async function getSeason(imdbID: string, seasonNum: number): Promise<void> {
		error.errorFalse();
		try {
			let res: Response = await fetch(
				`${baseURI}/season?imdbID=${imdbID}&season=${seasonNum}`
			);
			let json: Season = await res.json();
			season = json;
		} catch (errorStr: unknown) {
			console.log(errorStr);
			error.errorTrue();
		}
	}

	async function getEpisode(imdbID: string) {
		error.errorFalse();
		try {
			let res: Response = await fetch(`${baseURI}/title?imdbID=${imdbID}&plot=short`);
			let json: TitleDetailsData = await res.json();
			episodeDetails.push(json);
		} catch (errorStr: unknown) {
			console.log(errorStr);
			error.errorTrue();
		}
	}

	function changeSeason() {
		if (selectedSeason !== $page.params.seasonNo) {
			goto(`/title/${currentImdbID}/season=${selectedSeason}`);
			loadEpisodesPromise = new Promise(async (resolve, reject) => {
				await loadEpisodes();
				resolve();
			});
		}
	}
</script>

{#await promise}
	<div class="centred-horizontal" style="margin-top: 70px;">
		<CircularProgress style="height: 100px; width: 100px" indeterminate />
	</div>
{:then}
	<h3>{season.Title}</h3>
	<h4>Season {selectedSeason}</h4>
	<div class="columns margins" style="justify-content: flex-start;">
		<div>
			<Select bind:value={selectedSeason} on:click={changeSeason} label="Select Menu">
				{#each totalSeasons as seasonNum}
					<Option value={seasonNum}>Season {seasonNum}</Option>
				{/each}
			</Select>
		</div>
	</div>
	{#await loadEpisodesPromise}
		<div class="centred-horizontal" style="margin-top: 70px;">
			<CircularProgress style="height: 100px; width: 100px" indeterminate />
		</div>
	{:then}
		<div class="accordion-container">
			<Accordion multiple>
				{#each episodeDetails as episode, i}
					<Panel bind:open={panelOpen[i]}>
						<Header>
							{episode.Episode}: {episode.Title}
							<span slot="description">{episode.imdbRating} ({episodeDetails[i].imdbVotes})</span>
							<IconButton slot="icon" toggle pressed={panelOpen[i]}>
								<Icon class="material-icons" on>expand_less</Icon>
								<Icon class="material-icons">expand_more</Icon>
							</IconButton>
						</Header>
						<Content>
							{episodeDetails[i].Plot}
						</Content>
					</Panel>
				{/each}
			</Accordion>
		</div>
	{/await}
{/await}

<style>
	.accordion-container {
		padding: 24px;
	}

	* :global(.smui-accordion) {
		margin: 0 12px 24px;
	}

	* :global(.smui-accordion:last-child) {
		margin-bottom: 0;
	}
</style>
