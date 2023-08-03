<script lang="ts">
	import { navigating } from '$app/stores';
	import CircularProgress from '@smui/circular-progress';
</script>

{#if navigating}
	<div class="loading centred-horizontal">
		<CircularProgress style="height: 100px; width: 100px" indeterminate />
	</div>
{/if}
