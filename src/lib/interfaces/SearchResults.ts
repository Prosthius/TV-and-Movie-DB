import type { Writable } from 'svelte/store';

export interface SearchResults {
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

export interface SearchResultsWritable extends Writable<SearchResults> {
    loadingTrue: () => void;
    loadingFalse: () => void;
    setData: (json: SearchResults) => void;
    reset: () => void;
}