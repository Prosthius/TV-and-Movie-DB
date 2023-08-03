<script lang="ts">
	import { selectedTitleDetails } from '$lib/stores';
	import { capitaliseFirstLetter } from '$lib/helper';
	import Paper, { Title } from '@smui/paper';
	import type { PageData } from './$types';

	export let data: PageData;
	let locale: string = 'en-AU';
	$: director = data.titleDetails.Director.split(', ');
	$: writer = data.titleDetails.Writer.split(', ');
	$: genre = data.titleDetails.Genre.split(', ');
	$: timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	// $: locale = navigator.language;

	function unixSecToTime(unixSec: number): string {
		const date: Date = new Date(unixSec * 1000);
		const options: Intl.DateTimeFormatOptions = {
			timeZone: timeZone,
			year: 'numeric',
			month: 'numeric',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric'
		};
		return date.toLocaleString(locale, options);
	}
</script>

<div class="container">
	<Paper>
		{#if genre.length > 1}
			<Title>Genres</Title>
		{:else}
			<Title>Genre</Title>
		{/if}
		{data.titleDetails.Genre}
	</Paper>
</div>
<div class="container">
	<Paper>
		<Title>Streaming Services</Title>
		{#if data.streaming?.result.streamingInfo.au}
			{#each Object.keys(data.streaming?.result.streamingInfo.au) as service}
				<div class="subtitle">
					{capitaliseFirstLetter(service)}
				</div>
				{#each data.streaming?.result.streamingInfo.au[service] as streamingService}
					<div class="indent">
						<div>
							<a target="_blank" href={streamingService.link}>
								{capitaliseFirstLetter(streamingService.type)}
							</a>
						</div>
						{#if streamingService.price}
							<div>
								${streamingService.price.amount}
								{streamingService.price.currency}
							</div>
						{/if}
						<div>
							{streamingService.quality.toLocaleUpperCase()}
						</div>
						{#if streamingService.leaving !== 0}
							<div>
								Leaving on {unixSecToTime(streamingService.leaving)}
							</div>
						{/if}
					</div>
				{/each}
				<div class="divider rating" />
			{/each}
		{:else}
			<div>Streaming service information currently unavailable</div>
		{/if}
	</Paper>
</div>
<div class="container">
	<Paper>
		<div class="paper-container">
			<Title>Top Cast</Title>
			{data.titleDetails.Actors}
		</div>
		<div class="divider" />
		<div class="paper-container">
			{#if director.length > 1}
				<Title>Directors</Title>
			{:else}
				<Title>Director</Title>
			{/if}
			{data.titleDetails.Director}
		</div>
		<div class="divider" />
		<div class="paper-container">
			{#if writer.length > 1}
				<Title>Writers</Title>
			{:else}
				<Title>Writer</Title>
			{/if}
			{data.titleDetails.Writer}
		</div>
	</Paper>
</div>
{#if data.titleDetails.Ratings.length > 1}
	<div class="container">
		<Paper>
			<Title>Ratings</Title>
			{#each data.titleDetails.Ratings as rating}
				<div class="subtitle">
					{rating.Source}
				</div>
				<div class="indent">
					{rating.Value}
				</div>
				<div class="divider" />
			{/each}
		</Paper>
	</div>
{/if}
<div class="container">
	<Paper>
		<div class="paper-container">
			<Title>Language</Title>
			{data.titleDetails.Language}
		</div>
		<div class="divider" />
		<div class="paper-container">
			<Title>Country</Title>
			{data.titleDetails.Country}
		</div>
		{#if data.titleDetails.Awards !== 'N/A'}
			<div class="divider" />
			<div class="paper-container">
				<Title>Awards</Title>
				{data.titleDetails.Awards}
			</div>
		{/if}
		{#if data.titleDetails.BoxOffice}
			<div class="divider" />
			<div class="paper-container">
				<Title>Box Office</Title>
				{data.titleDetails.BoxOffice}
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

	.divider {
		border-bottom: 1px;
		border-bottom-style: solid;
		margin-bottom: 10px;
		border-color: #ffe600d8; /* import primary colour */
		box-shadow: 0px 6px 6px -3px rgba(0, 0, 0, 0.2), 0px 10px 14px 1px rgba(0, 0, 0, 0.14),
			0px 4px 18px 3px rgba(0, 0, 0, 0.12);
	}

	.divider:last-child {
		border-bottom: none;
		margin-bottom: auto;
		padding-bottom: 0px;
		box-shadow: none;
	}

	.divider.rating {
		margin-top: 14px;
	}

	.divider.rating:last-child {
		margin-top: auto;
	}

	.indent {
		text-indent: 10px;
		margin-bottom: 3px;
	}

	.indent:last-child {
		margin-bottom: auto;
	}

	.subtitle {
		font-size: 1.1rem;
		font-weight: bold;
		margin-bottom: 3px;
	}
</style>
