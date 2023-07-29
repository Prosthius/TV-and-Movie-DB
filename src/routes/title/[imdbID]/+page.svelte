<script lang="ts">
	import MainInfo from './MainInfo.svelte';
	import SubInfo from './SubInfo.svelte';
	import { onMount } from 'svelte';
	import { selectedTitleDetails, error } from '$lib/stores';
	import { page } from '$app/stores';
	import type { TitleDetails } from '$lib/interfaces/TitleDetails';
	import type { Error, StreamingError } from '$lib/interfaces/Error';
	import type { StreamingAvailability } from '$lib/interfaces/StreamingAvailability';
	import CircularProgress from '@smui/circular-progress';

	let streamingAvailability: StreamingAvailability;
	let streamingError: StreamingError;
	let promise: Promise<void> = new Promise(() => {});
	let type: string;

	onMount((): void => {
		promise = new Promise(async (resolve, reject) => {
			selectedTitleDetails.reset();
			await Promise.all([getAvailability($page.params.imdbID), getInfo($page.params.imdbID)]);
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
		{:else}
			<MainInfo {type} />
			<SubInfo {streamingAvailability} />
		{/if}
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
