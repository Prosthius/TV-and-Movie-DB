import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import type { SearchResults } from '$lib/interfaces/SearchResults';
import { PRIVATE_API_KEY_SA as API_KEY } from '$env/static/private';

export const GET: RequestHandler = async (event: RequestEvent) => {
	try {
		const headers: Headers = new Headers();
		headers.set('X-RapidAPI-Key', API_KEY);
		headers.set('X-RapidAPI-Host', 'streaming-availability.p.rapidapi.com');

		const url: URL = new URL(event.request.url);
		const params: URLSearchParams = new URLSearchParams(url.search);
		const query: string = params.get('imdbID') || '';
		let host: string = 'https://streaming-availability.p.rapidapi.com/v2/get';

		if (!query) return new Response('{"Error": "No imdbID provided"}', { status: 400 });

		let apiUrl: string = `${host}/basic?country=au&imdb_id=${query}&output_language=en`;
		let res: Response = await fetch(apiUrl, { headers });
		let json: SearchResults | Error = await res.json();
		return new Response(JSON.stringify(json));
	} catch (error: unknown) {
		return new Response(`{"Error": "${error}"}`, { status: 500 });
	}
};
