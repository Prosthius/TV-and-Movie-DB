<script lang="ts">
	import { navigating } from '$app/stores';
	import LoadingIcon from '../../../../LoadingIcon.svelte';
</script>

{#if navigating}
	<LoadingIcon />
{/if}
