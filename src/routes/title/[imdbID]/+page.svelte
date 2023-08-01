<script lang="ts">
	import MainInfo from './MainInfo.svelte';
	import SubInfo from './SubInfo.svelte';
	import { onMount } from 'svelte';
	import { selectedTitleDetails } from '$lib/stores';
	import { page } from '$app/stores';
	import type { TitleDetails } from '$lib/interfaces/TitleDetails';
	import type { Error, StreamingError } from '$lib/interfaces/Error';
	import type { StreamingAvailability } from '$lib/interfaces/StreamingAvailability';
	import CircularProgress from '@smui/circular-progress';

	let streamingAvailability: StreamingAvailability;
	let streamingError: StreamingError;
	let epPromise: Promise<[void, void]> = new Promise(() => {});
	let promise: Promise<void>;
	let episodes: TitleDetails[] = [];
	let nextEpID: string;
	let prevEpID: string;
	$: type = $selectedTitleDetails.Type;
	$: seriesID = $selectedTitleDetails.seriesID;
	$: season = $selectedTitleDetails.Season;
	$: imdbID = $selectedTitleDetails.imdbID;

	onMount(async (): Promise<void> => {
		try {
			selectedTitleDetails.reset();
			await getInfo($page.params.imdbID);
			if ($selectedTitleDetails.Type === 'episode') {
				epPromise = Promise.all([
					getStreamAvail($selectedTitleDetails.seriesID as string),
					getSeason(seriesID as string, parseInt(season as string))
				]);
				await epPromise;
			} else {
				promise = getStreamAvail($page.params.imdbID);
				await promise;
			}
			if (type === 'episode') {
				getNextEp();
				getPrevEp();
			}
			switch ($selectedTitleDetails.Type) {
				case 'series':
					type = 'TV Series';
					break;
				case 'movie':
					type = 'Movie';
					break;
				case 'episode':
					type = 'Episode';
					break;
				default:
					type = $selectedTitleDetails.Type;
					break;
			}
		} catch (error: unknown) {
			console.log(error);
		}
	});

	async function getInfo(imdbID: string): Promise<void> {
		selectedTitleDetails.loadingTrue();
		try {
			let res: Response = await fetch(`/api/title?imdbID=${imdbID}&plot=full`);
			let json: TitleDetails | Error = await res.json();
			if (json.Response === 'False') throw new Error((json as Error).Error);
			selectedTitleDetails.setData(json as TitleDetails);
		} catch (error: unknown) {
			console.log(error);
			throw error;
		}
	}

	async function getStreamAvail(imdbID: string): Promise<void> {
		try {
			const res: Response = await fetch(`/api/streaming?imdbID=${imdbID}`);
			const json: StreamingAvailability | StreamingError = await res.json();
			IsStreamingAvailability(json)
				? (streamingAvailability = json as StreamingAvailability)
				: (streamingError = json as StreamingError);
		} catch (error: unknown) {
			console.error(error);
			throw error;
		}
	}

	function IsStreamingAvailability(
		json: StreamingAvailability | StreamingError
	): json is StreamingAvailability {
		return (json as StreamingAvailability).result !== undefined;
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

	function getNextEp(): void {
		try {
			let nextEpIndex: number = 0;
			episodes.forEach((episode, i) => {
				imdbID === episode.imdbID ? (nextEpIndex = i + 1) : null;
			});
			nextEpID = episodes[nextEpIndex].imdbID;
		} catch (error: unknown) {
			console.log(error);
		}
	}

	function getPrevEp(): void {
		try {
			let prevEpIndex: number = 1;
			episodes.forEach((episode, i) => {
				imdbID === episode.imdbID ? (prevEpIndex = i - 1) : null;
			});
			prevEpID = episodes[prevEpIndex].imdbID;
		} catch (error: unknown) {
			console.log(error);
		}
	}
</script>

<div class="body">
	{#await promise || epPromise}
		<div class="loading centred-horizontal">
			<CircularProgress style="height: 100px; width: 100px" indeterminate />
		</div>
	{:then}
		<MainInfo {type} {nextEpID} {prevEpID} />
		<SubInfo {streamingAvailability} />
	{:catch error}
		<div class="container error centre">{error}</div>
	{/await}
</div>

<style>
	* :global(.icon) {
		color: yellow;
	}

	* :global(.smui-paper.smui-paper--color-secondary.smui-paper--raised.smui-paper--elevation-z1) {
		box-shadow: 0px 6px 6px -3px rgba(0, 0, 0, 0.2), 0px 10px 14px 1px rgba(0, 0, 0, 0.14),
			0px 4px 18px 3px rgba(0, 0, 0, 0.12);
	}
</style>
