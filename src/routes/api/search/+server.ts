import type { RequestEvent, RequestHandler } from './$types';
import type { SearchResultsData } from '$lib/interfaces/SearchResults';
import { PRIVATE_API_KEY as API_KEY } from '$env/static/private';

export const GET: RequestHandler = async (query) => {
    let searchQuery = query.url.searchParams.get('query');
    let host: string = `https://www.omdbapi.com/?apikey=${API_KEY}`;
    let apiUrl: string = `${host}&s=${searchQuery}`;
    let res: Response = await fetch(apiUrl);
    let json: SearchResultsData = await res.json();
    return new Response(JSON.stringify(json));
};
