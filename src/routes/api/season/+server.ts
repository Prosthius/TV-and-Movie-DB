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
		const query: Query = parseQueryParams(event);

		if (!query.imdbID) return new Response('{"Error": "No imdbID provided"}', { status: 400 });
		if (!query.season) return new Response('{"Error": "No season provided"}', { status: 400 });

		const seasonNum: number = parseInt(query.season);
		await getSeason(query.imdbID, seasonNum);

		await Promise.all(season.Episodes.map((episode) => getEpisode(episode.imdbID)));

		episodes.sort((a, b) => parseInt(a.Episode as string) - parseInt(b.Episode as string));

		return new Response(JSON.stringify(episodes));
	} catch (error: unknown) {
		console.error('Error handling request:', error);
		return new Response(`{"Error": "${String(error)}"}`, { status: 500 });
	}
};

async function getEpisode(imdbID: string): Promise<void> {
	try {
		let apiUrl: string = `${host}&i=${imdbID}&plot=short`;
		let res: Response = await fetch(apiUrl);
		let json: TitleDetails = await res.json();
		episodes.push(json);
	} catch (errorStr: unknown) {
		console.error(errorStr);
	}
}

async function getSeason(imdbID: string, seasonNum: number): Promise<void> {
	try {
		let apiUrl: string = `${host}&i=${imdbID}&season=${seasonNum}`;
		let res: Response = await fetch(apiUrl);
		let json: Season = await res.json();
		season = json;
	} catch (errorStr: unknown) {
		console.error(errorStr);
	}
}

function parseQueryParams(event: RequestEvent): Query {
	const url = new URL(event.request.url);
	const params = new URLSearchParams(url.search);

	return {
		imdbID: params.get('imdbID') || '',
		season: params.get('season') || ''
	};
}
