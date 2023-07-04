import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { SearchResultsWritable, SearchResults } from '$lib/interfaces/SearchResults';
import type { Error, ErrorWritable } from '$lib/interfaces/Error';
import type { TitleDetails, TitleDetailsWritable } from '$lib/interfaces/TitleDetails';

// TODO - move each variable to separate files

let searchResultsDefault: SearchResults = {
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

export const searchResults: SearchResultsWritable = createSearchResults();
function createSearchResults(): SearchResultsWritable {
    const { subscribe, set, update }: Writable<SearchResults> = writable<SearchResults>(searchResultsDefault);
    return {
        subscribe,
        set,
        update,
        loadingTrue: (): void => update(state => ({ ...state, Loading: true })),
        loadingFalse: (): void => update(state => ({ ...state, Loading: false })),
        setData: (json: SearchResults): void => {
            update((storeValue: SearchResults): SearchResults => {
                storeValue = { ...storeValue, ...json };
                storeValue.Loading = false;
                return storeValue;
            })
        },
        reset: (): void => set(searchResultsDefault)
    };
}

export const error: ErrorWritable = createError();
function createError(): ErrorWritable {
    const { subscribe, set, update }: Writable<Error> = writable<Error>({
        Error: '',
        Response: 'False',
        Status: false
    });
    return {
        subscribe,
        set,
        update,
        errorTrue: (): void => update(state => ({ ...state, Status: true })),
        errorFalse: (): void => update(state => ({ ...state, Status: false })),
        setData: (json: Error): void => {
            update((storeValue: Error): Error => {
                storeValue = { ...storeValue, ...json };
                storeValue.Status = true;
                return storeValue;
            });
        }
    };
}

export const selectedTitleDetails: TitleDetailsWritable = createSelectedTitleDetails();
function createSelectedTitleDetails(): TitleDetailsWritable {
    const { subscribe, set, update }: Writable<TitleDetails> = writable<TitleDetails>(selectedTitleDetailsDefault);
    return {
        subscribe,
        set,
        update,
        loadingTrue: (): void => update(state => ({ ...state, Loading: true })),
        loadingFalse: (): void => update(state => ({ ...state, Loading: false })),
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

export const selectedTitle: Writable<number> = writable<number>(0);
