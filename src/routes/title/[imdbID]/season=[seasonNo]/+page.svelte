<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import { selectedTitleDetails, error } from '$lib/stores';
	import type { TitleDetails } from '$lib/interfaces/TitleDetails';
	import CircularProgress from '@smui/circular-progress';
	import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
	import IconButton, { Icon } from '@smui/icon-button';
	import Select, { Option } from '@smui/select';
	import { goto } from '$app/navigation';

	let episodes: TitleDetails[] = [];
	let promise: Promise<void> = new Promise(() => {});
	let loadEpisodesPromise: Promise<void>;
	let panelOpen: boolean[] = [false];
	let totalSeasons: string[] = [];
	let selectedSeason: string = $page.params.seasonNo;
	$: currentImdbID = $page.params.imdbID;

	onMount(async (): Promise<void> => {
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

{#await promise}
	<div class="centred-horizontal" style="margin-top: 70px;">
		<CircularProgress style="height: 100px; width: 100px" indeterminate />
	</div>
{:then}
	<h3>{$selectedTitleDetails.Title}</h3>
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
				{#each episodes as ep, i}
					<Panel bind:open={panelOpen[i]}>
						<Header>
							{ep.Episode}: {ep.Title}
							<span slot="description">{ep.imdbRating} ({ep.imdbVotes})</span>
							<IconButton slot="icon" toggle pressed={panelOpen[i]}>
								<Icon class="material-icons" on>expand_less</Icon>
								<Icon class="material-icons">expand_more</Icon>
							</IconButton>
						</Header>
						<Content>
							{ep.Plot}
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
