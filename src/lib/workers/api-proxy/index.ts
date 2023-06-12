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
		if (path === "/search" && query) {
			host = `https://www.omdbapi.com/?apikey=${API_KEY_OMDB}`;
			apiUrl = `${host}&s=${query}`;
		} else if (path === "/title" && imdbID && plotLength) {
			host = `https://www.omdbapi.com/?apikey=${API_KEY_OMDB}`;
			apiUrl = `${host}&i=${imdbID}&plot=${plotLength}`;
		} else if (path === "/season" && imdbID && plotLength) {
			host = `https://www.omdbapi.com/?apikey=${API_KEY_OMDB}`;
			apiUrl = `${host}&i=${imdbID}&plot=${plotLength}&season=${season}`;
		} else if (path === "/streaming" && imdbID) {
			host = 'https://streaming-availability.p.rapidapi.com/v2/get';
			headers.set("X-RapidAPI-Key", API_KEY_SA);
			headers.set("X-RapidAPI-Host", "streaming-availability.p.rapidapi.com");
			apiUrl = `${host}/basic?country=au&imdb_id=${imdbID}&output_language=en`;
		} else {
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
				return JSON.stringify(await response.json());
			}
			return response.text();
		}

		try {
			const response = await fetch(apiUrl, init);
			const results = await gatherResponse(response);
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
