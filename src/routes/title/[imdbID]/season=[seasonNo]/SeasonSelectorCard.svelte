<script lang="ts">
	import { page } from '$app/stores';
	import { selectedTitleDetails } from '$lib/stores';
	import Select, { Option } from '@smui/select';
	import Paper, { Title } from '@smui/paper';
	import LayoutGrid, { Cell, InnerGrid } from '@smui/layout-grid';
	import Fab from '@smui/fab';
	import { goto } from '$app/navigation';

  export let selectedSeason: string;
  export let totalSeasons: string[] = [];
  export let changeSeason: (season: string) => void;
</script>

<div class="container">
  <Fab on:click={() => goto(`/title/${$page.params.imdbID}`)} color="primary" extended>
    Back to Show Details
  </Fab>
</div>
<div class="container">
  <Paper color="secondary">
    <LayoutGrid>
      <Cell spanDevices={{ desktop: 6, tablet: 4, phone: 4 }}>
        <h3 style="margin: 0;">{$selectedTitleDetails.Title}</h3>
        <h4 style="margin: 10px auto;">Season {selectedSeason}</h4>
      </Cell>
      <Cell spanDevices={{ desktop: 6, tablet: 4, phone: 4 }}>
        <div style="margin: 0;">
          <Select bind:value={selectedSeason} on:click={() => changeSeason(selectedSeason)}>
            {#each totalSeasons as seasonNum}
              <Option value={seasonNum}>Season {seasonNum}</Option>
            {/each}
          </Select>
        </div>
        <h5 style="margin: 15px auto;">{$selectedTitleDetails.totalSeasons} Total Seasons</h5>
      </Cell>
      <Cell span={3} />
    </LayoutGrid>
  </Paper>
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
