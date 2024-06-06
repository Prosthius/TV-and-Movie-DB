<script lang="ts">
	import MainInfo from './MainInfo.svelte';
	import SubInfo from './SubInfo.svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { navigating } from '$app/stores';
	import CircularProgress from '@smui/circular-progress';
	import { navigatedTo } from '$lib/stores';

	export let data: PageData;
	
	onMount(() => {
		console.log('mount');
	})
</script>

<div class="body">
	{#if $navigating || $navigatedTo} <!-- || data.titleDetails.imdbID !== $page.params.imdbID -->
		<div class="loading centred-horizontal">
			<CircularProgress style="height: 100px; width: 100px" indeterminate />
		</div>
	{:else}
		<MainInfo {data} />
		<SubInfo {data} />
	{/if}
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
