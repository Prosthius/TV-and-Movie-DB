<script lang="ts">
	import { selectedTitleDetails, error } from '$lib/stores';
	import Paper, { Title } from '@smui/paper';
	import type { StreamingAvailability } from '$lib/interfaces/StreamingAvailability';

	export let streamingAvailability: StreamingAvailability;
    $: director = $selectedTitleDetails.Director.split(', ');
	$: writer = $selectedTitleDetails.Writer.split(', ');
	$: genre = $selectedTitleDetails.Genre.split(', ');
</script>

<div class="container">
	<Paper>
		{#if genre.length > 1}
			<Title>Genres</Title>
		{:else}
			<Title>Genre</Title>
		{/if}
		{$selectedTitleDetails.Genre}
	</Paper>
</div>
<div class="container">
	<Paper>
		<Title>Streaming Services</Title>
		{#if streamingAvailability?.result.streamingInfo.au}
			{#each Object.keys(streamingAvailability.result.streamingInfo.au) as service}
				<div><ul>{service}:</ul></div>
				{#each streamingAvailability.result.streamingInfo.au[service] as streamingService}
					<div>{streamingService.type}</div>
				{/each}
			{/each}
		{:else}
			<div>Streaming service information unavailable</div>
		{/if}
	</Paper>
</div>
<div class="container">
	<Paper>
		<div class="paper-container">
			<Title>Top Cast</Title>
			{$selectedTitleDetails.Actors}
		</div>
		<div class="paper-container">
			{#if director.length > 1}
				<Title>Directors</Title>
			{:else}
				<Title>Director</Title>
			{/if}
			{$selectedTitleDetails.Director}
		</div>
		<div class="paper-container">
			{#if writer.length > 1}
				<Title>Writers</Title>
			{:else}
				<Title>Writer</Title>
			{/if}
			{$selectedTitleDetails.Writer}
		</div>
	</Paper>
</div>
{#if $selectedTitleDetails.Ratings.length > 1}
	<div class="container">
		<Paper>
			<Title>Ratings</Title>
			<ul>
				{#each $selectedTitleDetails.Ratings as rating}
					<li>{rating.Source}: {rating.Value}</li>
				{/each}
			</ul>
		</Paper>
	</div>
{/if}
<div class="container">
	<Paper>
		<div class="paper-container">
			<Title>Language</Title>
			{$selectedTitleDetails.Language}
		</div>
		<div class="paper-container">
			<Title>Country</Title>
			{$selectedTitleDetails.Country}
		</div>
		<div class="paper-container">
			<Title>Awards</Title>
			{$selectedTitleDetails.Awards}
		</div>
		{#if $selectedTitleDetails.BoxOffice}
			<div class="paper-container">
				<Title>Box Office</Title>
				{$selectedTitleDetails.BoxOffice}
			</div>
		{/if}
	</Paper>
</div>

<style>
	.paper-container {
		margin-bottom: 20px;
	}

	.paper-container:last-child {
		margin-bottom: auto;
	}
</style>
