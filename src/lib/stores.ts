import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { SearchResults, SearchResultsData } from '$lib/interfaces/SearchResults';
import type { ErrorData, Error } from '$lib/interfaces/Error';
import type { TitleDetailsData, TitleDetails } from '$lib/interfaces/TitleDetails';

// TODO - move each variable to separate files

let searchResultsDefault: SearchResultsData = {
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

let selectedTitleDetailsDefault: TitleDetailsData = {
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
    Response: '',
    Loading: false
};

function createSearchResults(): SearchResults {
    const { subscribe, set, update }: Writable<SearchResultsData> = writable<SearchResultsData>(searchResultsDefault);

    return {
        subscribe,
        set,
        update,
        loadingTrue: (): void => update(state => ({ ...state, Loading: true })),
        loadingFalse: (): void => update(state => ({ ...state, Loading: false })),
        setData: (json: SearchResultsData): void => {
            update((storeValue: SearchResultsData): SearchResultsData => {
                storeValue = { ...storeValue, ...json };
                storeValue.Loading = false;
                return storeValue;
            })
        },
        reset: (): void => set(searchResultsDefault)
    };
}
export const searchResults: SearchResults = createSearchResults();

function createError(): Error {
    const { subscribe, set, update }: Writable<ErrorData> = writable<ErrorData>({
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
        setData: (json: ErrorData): void => {
            update((storeValue: ErrorData): ErrorData => {
                storeValue = { ...storeValue, ...json };
                storeValue.Status = true;
                return storeValue;
            });
        }
    };
}
export const error: Error = createError();

function createSelectedTitleDetails(): TitleDetails {
    const { subscribe, set, update }: Writable<TitleDetailsData> = writable<TitleDetailsData>(selectedTitleDetailsDefault);

    return {
        subscribe,
        set,
        update,
        loadingTrue: (): void => update(state => ({ ...state, Loading: true })),
        loadingFalse: (): void => update(state => ({ ...state, Loading: false })),
        setData: (json: TitleDetailsData): void => {
            update((storeValue: TitleDetailsData): TitleDetailsData => {
                storeValue = { ...storeValue, ...json };
                storeValue.Loading = false;
                return storeValue;
            });
        },
        reset: (): void => set(selectedTitleDetailsDefault)
    };
}
export const selectedTitleDetails: TitleDetails = createSelectedTitleDetails();

export const selectedTitle: Writable<number> = writable<number>(0);

export const popstateFired: Writable<boolean> = writable<boolean>(false);
