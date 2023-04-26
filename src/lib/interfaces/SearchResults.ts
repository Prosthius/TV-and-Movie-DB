import type { Writable } from 'svelte/store';

export interface SearchResultsData {
    Search: Search[];
    Loading: boolean;
    totalResults: string;
    Response: string;
}

interface Search {
    Title: string;
    Year: string;
    imdbID: string;
    Type: string;
    Poster: string;
}

export interface SearchResults extends Writable<SearchResultsData> {
    loadingTrue: () => void;
    loadingFalse: () => void;
    setData: (json: SearchResultsData) => void;
    reset: () => void;
}