<script lang="ts">
	import { page } from '$app/stores';
	import Fab, { Icon } from '@smui/fab';
	import Paper from '@smui/paper';
	import LayoutGrid, { Cell, InnerGrid } from '@smui/layout-grid';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faStar } from '@fortawesome/free-solid-svg-icons/faStar';
	import type { PageData } from './$types';

	export let nextEpID: string;
	export let prevEpID: string;
	export let data: PageData;
</script>

<div class="container fab-container">
	{#if data.titleDetails.Type === 'TV Series'}
		<div class="fab">
			<Fab
				href={`/title/${$page.params.imdbID}/season=1`}
				color="primary"
				extended
				data-sveltekit-preload-data="off"
			>
				All Episodes
			</Fab>
		</div>
	{:else if data.titleDetails.Type === 'Episode'}
		<Fab color="secondary" mini href={`/title/${prevEpID}`} data-sveltekit-reload>
			<Icon class="material-icons left-arrow">arrow_backward</Icon>
		</Fab>
		<div class="fab">
			<Fab
				href={`/title/${data.titleDetails.seriesID}/season=${data.titleDetails.Season}`}
				color="primary"
				extended
				data-sveltekit-preload-data="off"
				>All Episodes
			</Fab>
		</div>
		<Fab color="secondary" mini href={`/title/${nextEpID}`} data-sveltekit-reload>
			<Icon class="material-icons right-arrow">arrow_forward</Icon>
		</Fab>
	{/if}
</div>
<div class="container">
	<Paper color="secondary">
		<LayoutGrid>
			<Cell spanDevices={{ desktop: 5, tablet: 8, phone: 8 }}>
				<img src={data.titleDetails.Poster} alt="{data.titleDetails.Title} poster" />
			</Cell>
			<Cell spanDevices={{ desktop: 7, tablet: 8, phone: 8 }}>
				<InnerGrid>
					<Cell spanDevices={{ desktop: 9, tablet: 6, phone: 3 }}>
						{#if data.titleDetails.Type === 'Episode'}
							<h3>{data.titleDetails.Season}.{data.titleDetails.Episode}</h3>
						{/if}
						<h3>{data.titleDetails.Title}</h3>
						<div style="opacity: 70%;">
							<span class="move">{data.titleDetails.imdbRating}</span>
							<FontAwesomeIcon class="icon" icon={faStar} />
							({data.titleDetails.imdbVotes})
							<br />
							{#if data.titleDetails.Type === 'Episode'}
								{data.titleDetails.Released}
							{:else}
								{data.titleDetails.Year}
							{/if}
							<br />
							{data.titleDetails.Type}
							<br />
							{data.titleDetails.Runtime}
							<br />
							{data.titleDetails.Rated}
						</div>
					</Cell>
					<Cell spanDevices={{ desktop: 3, tablet: 2, phone: 4 }}>
						<Fab color="primary" extended class="secondary-btn">Add to Watchlist</Fab>
					</Cell>
					<Cell span={12}>
						{data.titleDetails.Plot}
					</Cell>
				</InnerGrid>
			</Cell>
		</LayoutGrid>
	</Paper>
</div>

<style>
	h3 {
		margin: 0px 0px 10px 0px;
	}

	* :global(.secondary-btn) {
		min-width: 110px;
		/* background-color: red; */
	}

	* :global(.left-arrow) {
		transform: translateX(48px);
	}

	.container.fab-container {
		display: flex;
		align-items: center;
	}

	.fab {
		margin: 0px 10px;
	}
</style>
