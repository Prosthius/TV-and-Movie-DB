<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { selectedTitleDetails } from '$lib/stores';
	import type { TitleDetails } from '$lib/interfaces/TitleDetails';
	import { goto } from '$app/navigation';
	import { navigating } from '$app/stores';
	import SeasonSelectorCard from './SeasonSelectorCard.svelte';
	import LoadingIcon from '../../../LoadingIcon.svelte';
	import Episode from './Episode.svelte';

	let episodes: TitleDetails[] = [];
	let promise: Promise<[void, void]> = new Promise(() => {});
	let loadEpisodesPromise: Promise<void>;
	let totalSeasons: string[] = [];
	$: selectedSeason = $page.params.seasonNo;
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
			if ($selectedTitleDetails.imdbID != currentImdbID) {
				let res: Response = await fetch(`/api/title?imdbID=${imdbID}&plot=short`);
				let json: TitleDetails = await res.json();
				selectedTitleDetails.set(json);
				if ($selectedTitleDetails.Response === 'False')
					throw new Error($selectedTitleDetails.Error);
			}
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

	function changeSeason(season: string): void {
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
	{#if $navigating}
		<LoadingIcon />
	{:else}
		{#await promise}
			<LoadingIcon />
		{:then}
			<SeasonSelectorCard {selectedSeason} {totalSeasons} {changeSeason} />
			{#await loadEpisodesPromise}
				test
				<LoadingIcon />
			{:then}
				{#each episodes as ep}
					<Episode {ep} />
				{/each}
			{/await}
		{:catch error}
			<div class="container error centre">
				{error}
			</div>
		{/await}
	{/if}
</div>

<style>
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
