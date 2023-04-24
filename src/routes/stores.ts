import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { SearchResults, SearchResultsLoading } from '$lib/interfaces/SearchResults';
import type { Error, ErrorLoading } from '$lib/interfaces/Error';
import type { TitleDetails } from '$lib/interfaces/TitleDetails';

function createSearchResults(): SearchResultsLoading {
    const { subscribe, set, update }: Writable<SearchResults> = writable<SearchResults>({
        Search: [
            {
                Title: '',
                Year: '',
                imdbID: '',
                Type: '',
                Poster: ''
            },
        ],
        Loading: false,
        totalResults: '',
        Response: 'False'
    });

    return {
        subscribe,
        set,
        update,
        loadingTrue: () => update(state => ({ ...state, Loading: true })),
        loadingFalse: () => update(state => ({ ...state, Loading: false })),
    };
}
export const searchResults: SearchResultsLoading = createSearchResults();

function createSearchResultsError(): ErrorLoading {
    const { subscribe, set, update }: Writable<Error> = writable<Error>({
        Error: '',
        Response: 'False',
        Status: false
    });

    return {
        subscribe,
        set,
        update,
        errorTrue: () => update(state => ({ ...state, Status: true })),
        errorFalse: () => update(state => ({ ...state, Status: false })),
    };
}
export const searchResultsError: ErrorLoading = createSearchResultsError();

export const selectedTitleDetails: Writable<TitleDetails> = writable<TitleDetails>({
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

export const selectedTitle: Writable<number> = writable<number>(0);
