import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import type { TitleDetails } from '$lib/interfaces/TitleDetails';
import type { Season } from '$lib/interfaces/Season';
import { PRIVATE_API_KEY as API_KEY } from '$env/static/private';

interface Query {
    imdbID: string;
    season: string;
}

let season: Season;
let episodes: TitleDetails[] = [];
let host: string = `https://www.omdbapi.com/?apikey=${API_KEY}`;

export const GET: RequestHandler = async (event: RequestEvent) => {
    try {
        episodes = [];
        const url: URL = new URL(event.request.url);
        const params: URLSearchParams = new URLSearchParams(url.search);
        const query: Query = {
            imdbID: params.get('imdbID') || '',
            season: params.get('season') || ''
        };
        if (!query.imdbID) return new Response('{"Error": "No imdbID provided"}', { status: 400 });
        if (!query.season) return new Response('{"Error": "No season provided"}', { status: 400 });

        await getSeason(query.imdbID, parseInt(query.season));
        if (season.Response === 'False') 
            return new Response(`{"Response": "${season.Response}","Error": "${season.Error}"}`, { status: 400 });
        await Promise.all(season.Episodes.map((episode) => getEpisode(episode.imdbID)));
        episodes.sort((a, b) => parseInt(a.Episode as string) - parseInt(b.Episode as string));
        return new Response(JSON.stringify(episodes));
    } catch (error: unknown) {
        return new Response(`{"Error": "${error}"}`, { status: 500 });
    }
};

async function getEpisode(imdbID: string): Promise<void> {
    try {
        let apiUrl: string = `${host}&i=${imdbID}&plot=short`;
        let res: Response = await fetch(apiUrl);
        let json: TitleDetails = await res.json();
        episodes.push(json);
    } catch (errorStr: unknown) {
        console.log(errorStr);
    }
}

async function getSeason(imdbID: string, seasonNum: number): Promise<void> {
    try {
        let apiUrl: string = `${host}&i=${imdbID}&season=${seasonNum}`;
        let res: Response = await fetch(apiUrl);
        let json: Season = await res.json();
        season = json;
    } catch (errorStr: unknown) {
        console.log(errorStr);
    }
}
