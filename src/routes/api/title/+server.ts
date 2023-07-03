import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import type { TitleDetails } from '$lib/interfaces/TitleDetails';
import type { Error } from '$lib/interfaces/Error';
import { PRIVATE_API_KEY as API_KEY } from '$env/static/private';

interface Query {
    imdbID: string;
    plotLength: string;
}

export const GET: RequestHandler = async (event: RequestEvent) => {
    try {
        const url: URL = new URL(event.request.url);
        const params: URLSearchParams = new URLSearchParams(url.search);
        const query: Query = {
            imdbID: params.get('imdbID') || '',
            plotLength: params.get('plot') || ''
        };
        if (!query.imdbID) return new Response('{"Error": "No imdbID provided"}', { status: 400 });
        !query.plotLength ? query.plotLength = 'full' : null;
        
        let host: string = `https://www.omdbapi.com/?apikey=${API_KEY}`;
        let apiUrl: string = `${host}&i=${query.imdbID}&plot=${query.plotLength}`;
        let res: Response = await fetch(apiUrl);
        let json: TitleDetails | Error = await res.json();
        return new Response(JSON.stringify(json));
    } catch (error: unknown) {
        return new Response(`{"Error": "${error}"}`, { status: 500 });
    }
};
