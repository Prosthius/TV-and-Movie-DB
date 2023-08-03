import type { RequestEvent, RequestHandler } from './$types';
import type { SearchResults } from '$lib/interfaces/SearchResults';
import type { OmdbError } from '$lib/interfaces/Error';
import { PRIVATE_API_KEY as API_KEY } from '$env/static/private';

export const GET: RequestHandler = async (event: RequestEvent) => {
    try {
        const url: URL = new URL(event.request.url);
        const params: URLSearchParams = new URLSearchParams(url.search);
        const query: string = params.get('query') || '';
        if (!query) {
            return new Response('{"Error": "No search query provided"}', { status: 400 });
        }
        let host: string = `https://www.omdbapi.com/?apikey=${API_KEY}`;
        let apiUrl: string = `${host}&s=${query}`;
        let res: Response = await fetch(apiUrl);
        let json: SearchResults | OmdbError = await res.json();
        if ((json as OmdbError).Response === 'False')
            return new Response(`{"Response": "${json.Response}","Error": "${(json as OmdbError).Error}"}`, { status: 400 });
        return new Response(JSON.stringify(json));
    } catch (error: unknown) {
        return new Response(`{"Error": "${error}"}`, { status: 500 });
    }
};
