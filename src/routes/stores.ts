import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { OmdbSearchResults } from '$lib/interfaces/OmdbSearchResults/SearchResults';
import type { OmdbError } from '$lib/interfaces/OmdbSearchResults/Error';

export const searchResults: Writable<OmdbSearchResults> = writable({
    "Search": [
        {
            "Title": "0",
            "Year": "0",
            "imdbID": "0",
            "Type": "0",
            "Poster": "0"
        },
    ],
    "totalResults": "0",
    "Response": "False"
});

export const searchResultsError: Writable<OmdbError> = writable({
    "Error": "0",
    "Response": "False"
});
