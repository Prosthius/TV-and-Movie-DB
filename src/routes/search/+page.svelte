<script lang="ts">
	import { navigating } from '$app/stores';
	import LoadingIcon from '../LoadingIcon.svelte';
</script>

{#if $navigating}
	<LoadingIcon />
{:else}
	<div class="centre container">
		<h2>Enter a search query</h2>
	</div>
{/if}
