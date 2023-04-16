export interface OmdbSearchResults {
    Search: SearchResult[];
}

interface SearchResult {
    Title: string;
    Year: string;
    imdbID: string;
    Type: string;
    Poster: string;
}