const handler: ExportedHandler<Env> = {
	async fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const API_KEY_OMDB: string = env.API_KEY_OMDB;
		const API_KEY_SA: string = env.API_KEY_SA;
		let host: string;
		const headers: Headers = new Headers();
		headers.set("Access-Control-Allow-Origin", "*");
		headers.set("content-type", "application/json;charset=UTF-8")

		const url = new URL(request.url);
		const path = url.pathname;
		const query = url.searchParams.get("query");
		const imdbID = url.searchParams.get("imdbID");
		const plotLength = url.searchParams.get("plot");
		const season = url.searchParams.get("season");

		let apiUrl: string;
		switch (path) {
			case "/search":
				host = `https://www.omdbapi.com/?apikey=${API_KEY_OMDB}`;
				apiUrl = `${host}&s=${query}`;
				break;
			case "/title":
				host = `https://www.omdbapi.com/?apikey=${API_KEY_OMDB}`;
				apiUrl = `${host}&i=${imdbID}&plot=${plotLength}`;
				break;
			case "/season":
				host = `https://www.omdbapi.com/?apikey=${API_KEY_OMDB}`;
				apiUrl = `${host}&i=${imdbID}&season=${season}`;
				break;
			case "/streaming":
				host = 'https://streaming-availability.p.rapidapi.com/v2/get';
				headers.set("X-RapidAPI-Key", API_KEY_SA);
				headers.set("X-RapidAPI-Host", "streaming-availability.p.rapidapi.com");
				apiUrl = `${host}/basic?country=au&imdb_id=${imdbID}&output_language=en`;
				break;
			default:
				return new Response(JSON.stringify({ error: "Invalid URL or parameters" }), {
					status: 400,
					headers: headers
				});
		}

		const init = {
			headers: headers
		};

		async function gatherResponse(response: Response) {
			const { headers } = response;
			const contentType = headers.get("content-type") || "";
			if (contentType.includes("application/json")) {
				console.log(response);
				return JSON.stringify(await response.json());
			}
			return response.text();
		}

		try {
			// const response = await fetch(apiUrl, init);
			const apiRequest = new Request(apiUrl, init);
			const response = await fetchAndCache(apiRequest);
			const results = await gatherResponse(response);
			console.log(results);
			return new Response(results, init);
		} catch (error: any) {
			const errorMessage = `Error fetching data from OMDB API: ${error.message}`;
			return new Response(JSON.stringify({ error: errorMessage }), {
				status: 400,
				headers: headers
			});
		}
	},
};

export default handler;


async function fetchAndCache(request: Request) {
	// Check if the response is already in the cache
	let response: Response = await caches.default.match(request);
	console.log(JSON.stringify(response));

	if (!response) {
		console.log('test');
		response = await fetch(request);
		const varyHeader = response.headers.get("Vary");
		const [body1, body2] = response.body.tee();
		if (varyHeader === "*") {
			const newHeaders = new Headers(response.headers);
			newHeaders.delete("Vary");
			response = new Response(body1, {
				status: response.status,
				statusText: response.statusText,
				headers: newHeaders
			});
		}
		const cachedResponse = new Response(body2, response);
		await caches.default.put(request, cachedResponse);
	}
	return response;
}
