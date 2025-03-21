import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { SearchResultsWritable, SearchResults } from '$lib/interfaces/SearchResults';
import type { TitleDetails, TitleDetailsWritable } from '$lib/interfaces/TitleDetails';
import type { StreamingAvailability } from '$lib/interfaces/StreamingAvailability';

// TODO - move each variable to separate files

let searchResultsDefault: SearchResults = {
	Search: [
		{
			Title: '',
			Year: '',
			imdbID: '',
			Type: '',
			Poster: ''
		}
	],
	Loading: false,
	totalResults: '',
	Response: 'False'
};

let selectedTitleDetailsDefault: TitleDetails = {
	Title: '',
	Year: '',
	Rated: '',
	Released: '',
	Runtime: '',
	Genre: '',
	Director: '',
	Writer: '',
	Actors: '',
	Plot: '',
	Language: '',
	Country: '',
	Awards: '',
	Poster: '',
	Ratings: [],
	Metascore: '',
	imdbRating: '',
	imdbVotes: '',
	imdbID: '',
	seriesID: '',
	Type: '',
	totalSeasons: '',
	Response: '',
	Episode: '',
	Season: '',
	Loading: false
};

let streamingAvailabilityDefault: StreamingAvailability = {
	result: {
		type: '',
		title: '',
		overview: '',
		streamingInfo: {},
		cast: [],
		year: 0,
		advisedMinimumAudienceAge: undefined,
		imdbId: '',
		imdbRating: 0,
		imdbVoteCount: 0,
		tmdbId: 0,
		tmdbRating: 0,
		originalTitle: '',
		backdropPath: '',
		backdropURLs: {},
		genres: [],
		originalLanguage: undefined,
		countries: [],
		directors: [],
		runtime: 0,
		youtubeTrailerVideoId: '',
		youtubeTrailerVideoLink: '',
		posterPath: '',
		posterURLs: {},
		tagline: ''
	}
};

export const searchResults: SearchResultsWritable = createSearchResults();
function createSearchResults(): SearchResultsWritable {
	const { subscribe, set, update }: Writable<SearchResults> =
		writable<SearchResults>(searchResultsDefault);
	return {
		subscribe,
		set,
		update,
		loadingTrue: (): void => update((state) => ({ ...state, Loading: true })),
		loadingFalse: (): void => update((state) => ({ ...state, Loading: false })),
		setData: (json: SearchResults): void => {
			update((storeValue: SearchResults): SearchResults => {
				storeValue = { ...storeValue, ...json };
				storeValue.Loading = false;
				return storeValue;
			});
		},
		reset: (): void => set(searchResultsDefault)
	};
}

export const selectedTitleDetails: TitleDetailsWritable = createSelectedTitleDetails();
function createSelectedTitleDetails(): TitleDetailsWritable {
	const { subscribe, set, update }: Writable<TitleDetails> = writable<TitleDetails>(
		selectedTitleDetailsDefault
	);
	return {
		subscribe,
		set,
		update,
		loadingTrue: (): void => update((state) => ({ ...state, Loading: true })),
		loadingFalse: (): void => update((state) => ({ ...state, Loading: false })),
		setData: (json: TitleDetails): void => {
			update((storeValue: TitleDetails): TitleDetails => {
				storeValue = { ...storeValue, ...json };
				storeValue.Loading = false;
				return storeValue;
			});
		},
		reset: (): void => set(selectedTitleDetailsDefault)
	};
}

export const streamingAvailability: Writable<StreamingAvailability> = writable<StreamingAvailability>(streamingAvailabilityDefault);

export const selectedTitle: Writable<number> = writable<number>(0);

export const searchTitleInput: Writable<string> = writable<string>('');
