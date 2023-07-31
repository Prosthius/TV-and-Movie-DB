<script lang="ts">
	import { selectedTitleDetails } from '$lib/stores';
	import { page } from '$app/stores';
	import Fab, { Icon } from '@smui/fab';
	import Paper from '@smui/paper';
	import LayoutGrid, { Cell, InnerGrid } from '@smui/layout-grid';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faStar } from '@fortawesome/free-solid-svg-icons/faStar';

	export let type: string;
	$: title = $selectedTitleDetails;
</script>

<div class="container fab-container">
	{#if type === 'TV Series'}
		<div class="fab">
			<Fab href={`/title/${$page.params.imdbID}/season=1`} color="primary" extended>
				All Episodes
			</Fab>
		</div>
	{:else if type === 'Episode'}
		<Fab color="secondary" mini href="">
			<Icon class="material-icons left-arrow">arrow_backward</Icon>
		</Fab>
		<div class="fab">
			<Fab
				href={`/title/${encodeURIComponent(String($selectedTitleDetails.seriesID))}/season=${
					$selectedTitleDetails.Season
				}`}
				color="primary"
				extended
			>
				All Episodes
			</Fab>
		</div>
		<Fab color="secondary" mini href="">
			<Icon class="material-icons right-arrow">arrow_forward</Icon>
		</Fab>
	{/if}
</div>
<div class="container">
	<Paper color="secondary">
		<LayoutGrid>
			<Cell spanDevices={{ desktop: 5, tablet: 8, phone: 8 }}>
				<img src={title.Poster} alt="{title.Title} poster" />
			</Cell>
			<Cell spanDevices={{ desktop: 7, tablet: 8, phone: 8 }}>
				<InnerGrid>
					<Cell spanDevices={{ desktop: 9, tablet: 6, phone: 3 }}>
						{#if type === 'Episode'}
							<h3>{$selectedTitleDetails.Season}.{$selectedTitleDetails.Episode}</h3>
						{/if}
						<h3>{title.Title}</h3>
						<div style="opacity: 70%;">
							<span class="move">{title.imdbRating}</span>
							<FontAwesomeIcon class="icon" icon={faStar} />
							({title.imdbVotes})
							<br />
							{#if type === 'Episode'}
								{$selectedTitleDetails.Released}
							{:else}
								{title.Year}
							{/if}
							<br />
							{type}
							<br />
							{$selectedTitleDetails.Runtime}
							<br />
							{$selectedTitleDetails.Rated}
						</div>
					</Cell>
					<Cell spanDevices={{ desktop: 3, tablet: 2, phone: 4 }}>
						<Fab color="primary" extended class="secondary-btn">Add to Watchlist</Fab>
					</Cell>
					<Cell span={12}>
						{title.Plot}
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
