/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

const handler: ExportedHandler = {
	async fetch(request: any, env: any, ctx: any) {
		const API_KEY: string = env.API_KEY;
		const host: string = `https://streaming-availability.p.rapidapi.com/v2/get`;
		const headers: Headers = new Headers();
		headers.set("Access-Control-Allow-Origin", "*");
		headers.set("content-type", "application/json");
		headers.set("X-RapidAPI-Key", API_KEY);
		headers.set("X-RapidAPI-Host", "streaming-availability.p.rapidapi.com");

		try {
			const url: URL = new URL(request.url);
			const imdbID: string | null = url.searchParams.get("imdbID");
			const apiUrl: string = `${host}/basic?country=au&imdb_id=${imdbID}&output_language=en`;
			const init = {
				method: "GET",
				headers: headers
			};

			async function gatherResponse(response: Response) {
				const { headers } = response;
				const contentType: string = headers.get("content-type") || "";
				if (contentType.includes("application/json")) {
					return JSON.stringify(await response.json());
				}
				return response.text();
			}

			const response: Response = await fetch(apiUrl, init);
			const results: string = await gatherResponse(response);

			return new Response(results, init);
		} catch (error: any) {
			const errorMessage = `Error fetching data from Streaming Availability API: ${error.message}`;
			return new Response(JSON.stringify({ error: errorMessage }), {
				status: 400,
				headers: headers
			});
		}
	},
};

export default handler;