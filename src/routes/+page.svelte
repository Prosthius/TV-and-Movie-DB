<script lang="ts">
	import { onMount } from 'svelte';
	import { Icon } from '@smui/common';
	import { Input } from '@smui/textfield';
	import Paper from '@smui/paper';
	import LayoutGrid from '@smui/layout-grid/src/LayoutGrid.svelte';
	import Cell from '@smui/layout-grid/src/Cell.svelte';
	import Fab from '@smui/fab/src/Fab.svelte';

	let searchTitleInput: string;

	function handleSearchEnterPress(event: CustomEvent | KeyboardEvent): void {
		event = event as KeyboardEvent;
		event.key === 'Enter' ? searchTitle() : null;
	}

	async function searchTitle(): Promise<void> {
		console.log('searching for title');
	}
</script>

<div class="container">
	<LayoutGrid>
		<Cell span={12} class="centre">
			<Paper class="paper" elevation={6}>
				<Icon class="material-icons">search</Icon>
				<Input
					bind:value={searchTitleInput}
					on:keydown={handleSearchEnterPress}
					placeholder="Search for a Movie or Show"
					class="input"
				/>
			</Paper>
			<Fab on:click={searchTitle} color="primary" mini class="fab">
				<Icon class="material-icons">arrow_forward</Icon>
			</Fab>
		</Cell>
	</LayoutGrid>
</div>

<style>
	.container {
		padding: 15px 0px;
	}
	* :global(.paper) {
		display: flex;
		align-items: center;
		flex-grow: 1;
		max-width: 600px;
		margin: 0 12px;
		padding: 0 12px;
		height: 48px;
	}
	* :global(.paper > *) {
		display: inline-block;
		margin: 0 7px;
	}
	* :global(input) {
		color: var(--mdc-theme-on-surface);
	}
	* :global(Input::placeholder) {
		color: var(--mdc-theme-on-surface);
		opacity: 0.6;
	}
	* :global(.fab) {
		flex-shrink: 0;
	}
</style>


<!-- <div class="solo-demo-container solo-container">
    <Paper class="solo-paper" elevation={6}>
      <Icon class="material-icons">search</Icon>
      <Input
        bind:value
        on:keydown={handleKeyDown}
        placeholder="Search"
        class="solo-input"
      />
    </Paper>
    <Fab
      on:click={doSearch}
      disabled={value === ''}
      color="primary"
      mini
      class="solo-fab"
    >
      <Icon class="material-icons">arrow_forward</Icon>
    </Fab>
  </div>
    
  <script lang="ts">
    import { Input } from '@smui/textfield';
    import Paper from '@smui/paper';
    import Fab from '@smui/fab';
    import { Icon } from '@smui/common';
  
    let value = '';
  
    function doSearch() {
      alert('Search for ' + value);
    }
  
    function handleKeyDown(event: CustomEvent | KeyboardEvent) {
      event = event as KeyboardEvent;
      if (event.key === 'Enter') {
        doSearch();
      }
    }
  </script>
  
  <style>
    .solo-demo-container {
      padding: 36px 18px;
      border: 1px solid
        var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.1));
    }
  
    .solo-container {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    * :global(.solo-paper) {
      display: flex;
      align-items: center;
      flex-grow: 1;
      max-width: 600px;
      margin: 0 12px;
      padding: 0 12px;
      height: 48px;
    }
    * :global(.solo-paper > *) {
      display: inline-block;
      margin: 0 12px;
    }
    * :global(.solo-input) {
      flex-grow: 1;
      color: var(--mdc-theme-on-surface);
    }
    * :global(.solo-input::placeholder) {
      color: var(--mdc-theme-on-surface);
      opacity: 0.6;
    }
    * :global(.solo-fab) {
      flex-shrink: 0;
    }
  </style> -->
  
