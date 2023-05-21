export interface StreamingAvailabilityError {
    message: string;
}

export interface StreamingAvailability {
    result: {
        type: string;
        title: string;
        overview: string;
        streamingInfo: {
            au: {
                [service: string]: StreamingService[];
            };
        };
        cast: string[];
        year: number;
        advisedMinimumAudienceAge?: number;
        imdbId?: string;
        imdbRating?: number;
        imdbVoteCount?: number;
        tmdbId?: number;
        tmdbRating?: number;
        originalTitle?: string;
        backdropPath?: string;
        backdropURLs?: { [key: string]: string };
        genres?: { id: number; name: string }[];
        originalLanguage?: string;
        countries?: string[];
        directors?: string[];
        runtime?: number;
        youtubeTrailerVideoId?: string;
        youtubeTrailerVideoLink?: string;
        posterPath?: string;
        posterURLs?: { [key: string]: string };
        tagline: string
    };
}

interface StreamingService {
    type: string;
    quality: string;
    addOn: string;
    link: string;
    watchLink: string;
    audios: {
        language: string;
        region?: string;
    }[];
    subtitles: {
        locale: {
            language: string;
            region?: string;
        };
        closedCaptions: boolean;
    }[];
    price?: any | {
        amount: string;
        currency: string;
        formatted: string;
    };
    leaving: number;
    availableSince: number;
}
