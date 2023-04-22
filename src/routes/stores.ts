import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { OmdbSearchResults } from '$lib/interfaces/OmdbSearchResults/SearchResults';
import type { OmdbError } from '$lib/interfaces/OmdbSearchResults/Error';
import type { TitleDetails } from '$lib/interfaces/OmdbSearchResults/TitleDetails';

export const searchResults: Writable<OmdbSearchResults> = writable({
    Search: [
        {
            Title: '',
            Year: '',
            imdbID: '',
            Type: '',
            Poster: ''
        },
    ],
    totalResults: '',
    Response: 'False'
});

export const searchResultsError: Writable<OmdbError> = writable({
    Error: '',
    Response: 'False'
});

export const selectedTitle: Writable<number> = writable(0);

export const selectedTitleDetails = writable<TitleDetails>({
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
    Type: '',
    totalSeasons: '',
    Response: ''
});