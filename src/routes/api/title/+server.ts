import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import type { TitleDetails } from '$lib/interfaces/TitleDetails';
import type { Error } from '$lib/interfaces/Error';
import { PRIVATE_API_KEY as API_KEY } from '$env/static/private';

interface Query {
    imdbID: string;
    season?: string;
    episode?: string;
    plotLength?: string;
}

export const GET: RequestHandler = async (event: RequestEvent) => {
    try {
        const url: URL = new URL(event.request.url);
        const params: URLSearchParams = new URLSearchParams(url.search);
        const query: Query = {
            imdbID: params.get('imdbID') || '',
            season: params.get('season') || '',
            episode: params.get('episode') || '',
            plotLength: params.get('plot') || '',
        };
        if (!query.imdbID)
            return new Response('{"Error": "No imdbID provided"}', { status: 400 });
        if ((query.season && !query.episode) || (!query.season && query.episode))
            return new Response('{"Error": "Must provide episode and season"}', { status: 400 });
        !query.plotLength ? query.plotLength = 'full' : null;

        let host: string = `https://www.omdbapi.com/?apikey=${API_KEY}`;
        let apiUrl: string;
        query.season && query.episode ?
            apiUrl = `${host}&i=${query.imdbID}&season=${query.season}&episode=${query.episode}&plot=${query.plotLength}` :
            apiUrl = `${host}&i=${query.imdbID}&plot=${query.plotLength}`;
        let res: Response = await fetch(apiUrl);
        let json: TitleDetails | Error = await res.json();
        if ((json as TitleDetails).Response === 'False') {
            json = json as Error;
            return new Response(`{"Response": "${json.Response}","Error": "${json.Error}"}`, { status: 400 });
        }
        return new Response(JSON.stringify(json as TitleDetails));
    } catch (error: unknown) {
        return new Response(`{"Error": "${error}"}`, { status: 500 });
    }
};
