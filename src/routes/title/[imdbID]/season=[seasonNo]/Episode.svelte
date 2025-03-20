<script lang="ts">
	import Paper, { Title } from '@smui/paper';
	import LayoutGrid, { Cell, InnerGrid } from '@smui/layout-grid';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faStar } from '@fortawesome/free-solid-svg-icons/faStar';
	import type { TitleDetails } from '$lib/interfaces/TitleDetails';

  export let ep: TitleDetails;
</script>

<div class="container">
	<Paper>
		<LayoutGrid>
			<Cell spanDevices={{ desktop: 6, tablet: 8, phone: 8 }}>
				<img src={ep.Poster} alt="{ep.Season}.{ep.Episode} - {ep.Title} poster" />
			</Cell>
			<Cell spanDevices={{ desktop: 6, tablet: 8, phone: 8 }}>
				<InnerGrid>
					<Cell spanDevices={{ desktop: 9, tablet: 6, phone: 3 }}>
						<a href={`/title/${ep.imdbID}`} data-sveltekit-preload-data="off">
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

<style>
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

	* :global(.smui-paper.smui-paper--color-secondary.smui-paper--raised.smui-paper--elevation-z1) {
		box-shadow: 0px 6px 6px -3px rgba(0, 0, 0, 0.2), 0px 10px 14px 1px rgba(0, 0, 0, 0.14),
			0px 4px 18px 3px rgba(0, 0, 0, 0.12);
	}
</style>

