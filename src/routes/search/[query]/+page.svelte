<script lang="ts">
	import { selectedTitle, searchTitleInput } from '$lib/stores';
	import { capitaliseFirstLetter } from '$lib/helper';
	import { navigating } from '$app/stores';
	import Paper from '@smui/paper';
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import CircularProgress from '@smui/circular-progress';
	import type { PageData } from './$types';

	export let data: PageData;

	function handleSelectTitleEnter(event: KeyboardEvent): void {
		const value: number = parseInt((event.target as HTMLInputElement).value);
		event.key === 'Enter' ? selectedTitle.set(value) : null;
	}
</script>

<div class="body">
	{#if $navigating}
		<div class="loading centred-horizontal">
			<CircularProgress style="height: 100px; width: 100px" indeterminate />
		</div>
	{:else}
		{#each data.searchResults.Search as title, i}
			<div class="container">
				<Paper color="secondary">
					<LayoutGrid>
						<Cell spanDevices={{ desktop: 3, tablet: 3, phone: 4 }}>
							<img src={title.Poster} alt="{title.Title} poster" />
						</Cell>
						<Cell spanDevices={{ desktop: 9, tablet: 5, phone: 4 }}>
							<div class="title">
								<a
									href={`/title/${title.imdbID}`}
									on:click={() => selectedTitle.set(i)}
									on:click={() => searchTitleInput.set('')}
									on:keydown={() => handleSelectTitleEnter}
									data-sveltekit-preload-data="off"
									>{title.Title}
								</a>
							</div>
							<div class="sub-text">
								{title.Year}
							</div>
							<div class="sub-text">
								{capitaliseFirstLetter(title.Type)}
							</div>
						</Cell>
					</LayoutGrid>
				</Paper>
			</div>
		{/each}
	{/if}
</div>

<style>
	.title {
		font-size: 3rem;
		line-height: 1;
		margin: 0px 0px 10px 0px;
	}

	img {
		max-width: 150px;
	}

	.sub-text {
		opacity: 80%;
	}

	* :global(.smui-paper.smui-paper--color-secondary.smui-paper--raised.smui-paper--elevation-z1) {
		box-shadow: 0px 6px 6px -3px rgba(0, 0, 0, 0.2), 0px 10px 14px 1px rgba(0, 0, 0, 0.14),
			0px 4px 18px 3px rgba(0, 0, 0, 0.12);
	}
</style>
