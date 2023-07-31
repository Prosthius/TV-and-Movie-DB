export interface Season {
    Title: string;
    Season: string;
    totalSeasons: string;
    Episodes: Episode[];
    Response: string;
    Error?: string
}

interface Episode {
    Title: string;
    Released: string;
    Episode: string;
    imdbRating: string;
    imdbID: string;
    Error?: string
}
