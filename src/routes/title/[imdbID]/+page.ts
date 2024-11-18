import type { PageLoad } from './$types';
import type { TitleDetails } from '$lib/interfaces/TitleDetails';
import type { OmdbError, StreamingError } from '$lib/interfaces/Error';
import type { StreamingAvailability } from '$lib/interfaces/StreamingAvailability';
import type { NextOrPrevEp } from '$lib/interfaces/NextOrPrevEp';
import { error } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { selectedTitleDetails } from '$lib/stores';

export const load = (async ({ fetch, params }) => {
    try {
        // console.log(get(selectedTitleDetails));
        let streaming: StreamingAvailability | undefined;
        let streamingError: StreamingError | undefined;
        let currentSeasonDetails: TitleDetails[] = [];
        let prevSeasonDetails: TitleDetails[] = [];
        let titleDetails: TitleDetails;
        let streamingJSON: StreamingAvailability | StreamingError;
        let seriesDetails: TitleDetails | undefined;
        let nextEp: NextOrPrevEp | undefined;
        let prevEp: NextOrPrevEp | undefined;

        titleDetails = await getInfo(fetch, params.imdbID);
        if (titleDetails.Type === 'episode') {
            seriesDetails = await getInfo(fetch, titleDetails.seriesID as string);
            currentSeasonDetails = await getSeason(
                fetch,
                titleDetails.seriesID as string,
                parseInt(titleDetails.Season as string)
            );
            titleDetails.Season != '1' && titleDetails.Episode == '1' ?
                prevSeasonDetails = await getSeason(
                    fetch,
                    titleDetails.seriesID as string,
                    parseInt(titleDetails.Season as string) - 1,
                ) :
                null;
            nextEp = getNextEp(
                currentSeasonDetails,
                parseInt(titleDetails.Episode as string),
                parseInt(titleDetails.Season as string),
                parseInt(seriesDetails.totalSeasons as string)
            );
            prevEp = getPrevEp(
                prevSeasonDetails,
                parseInt(titleDetails.Episode as string),
                parseInt(titleDetails.Season as string),
            );
        }

        streamingJSON = await getStreamAvail(fetch, params.imdbID);

        IsStreamingAvailability(streamingJSON) ?
            streaming = streamingJSON :
            streamingError = streamingJSON

        switch (titleDetails.Type) {
            case 'series':
                titleDetails.Type = 'TV Series';
                break;
            case 'movie':
                titleDetails.Type = 'Movie';
                break;
            case 'episode':
                titleDetails.Type = 'Episode';
                break;
            default:
                titleDetails.Type = titleDetails.Type;
                break;
        }

        return {
            titleDetails,
            seriesDetails,
            streaming,
            streamingError,
            nextEp,
            prevEp,
        };
    } catch (error: unknown) {
        console.log(error);
        throw error;
    }

}) satisfies PageLoad;

async function getInfo(
    fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>,
    imdbID: string,
): Promise<TitleDetails> {
    try {
        let res: Response = await fetch(`/api/title?imdbID=${imdbID}&plot=full`);
        if (!res.ok) error(404, 'Not Found');
        let json: TitleDetails | OmdbError = await res.json();
        if (json.Response === 'False') throw new Error((json as OmdbError).Error);
        selectedTitleDetails.setData(json as TitleDetails);
        return json as TitleDetails;
    } catch (error: unknown) {
        console.log(error);
        throw error;
    }
}

async function getStreamAvail(
    fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>,
    imdbID: string
): Promise<StreamingAvailability | StreamingError> {
    try {
        const res: Response = await fetch(`/api/streaming?imdbID=${imdbID}`);
        const json: StreamingAvailability = await res.json();
        return json;
    } catch (error: unknown) {
        console.error(error);
        throw error;
    }
}

function IsStreamingAvailability(
    json: StreamingAvailability | StreamingError
): json is StreamingAvailability {
    return (json as StreamingAvailability).result !== undefined;
}

async function getSeason(
    fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>,
    imdbID: string,
    seasonNum: number
): Promise<TitleDetails[]> {
    try {
        let res: Response = await fetch(`/api/season?imdbID=${imdbID}&season=${seasonNum}`);
        let json: TitleDetails[] | TitleDetails = await res.json();
        if ((json as TitleDetails).Response === 'False')
            throw new Error((json as TitleDetails).Error);
        return json as TitleDetails[];
    } catch (error: unknown) {
        console.log(error);
        throw error;
    }
}

function getNextEp(episodes: TitleDetails[], epNum: number, seasonNum: number, totalSeasons: number): NextOrPrevEp {
    try {
        let nextEpNum: number = 1;
        let nextSeasonNum: number = 1;

        if (totalSeasons <= seasonNum && episodes.length <= epNum) {
            return {
                season: nextSeasonNum,
                episode: nextEpNum,
                available: false,
            };
        } else if (episodes.length <= epNum) {
            nextEpNum = 1;
            nextSeasonNum = seasonNum + 1;
        } else {
            nextEpNum = epNum + 1;
            nextSeasonNum = seasonNum;
        }
        return {
            season: nextSeasonNum,
            episode: nextEpNum,
            available: true,
        }
    } catch (error: unknown) {
        console.log(error);
        throw error;
    }
}

function getPrevEp(episodes: TitleDetails[], epNum: number, seasonNum: number): NextOrPrevEp {
    try {
        let prevEpNum: number = 1;
        let prevSeasonNum: number = 1;

        if (seasonNum <= 1 && epNum <= 1) {
            return {
                season: prevSeasonNum,
                episode: prevEpNum,
                available: false,
            };
        } else if (epNum <= 1) {
            prevEpNum = parseInt(episodes[episodes.length - 1].Episode as string);
            prevSeasonNum = seasonNum - 1;
        } else {
            prevEpNum = epNum - 1;
            prevSeasonNum = seasonNum;
        }
        return {
            season: prevSeasonNum,
            episode: prevEpNum,
            available: true,
        }
    } catch (error: unknown) {
        console.log(error);
        throw error;
    }
}
