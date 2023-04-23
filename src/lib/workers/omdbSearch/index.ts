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
		const host: string = `https://www.omdbapi.com/?apikey=${API_KEY}`;
		const headers: Headers = new Headers();
		headers.set("Access-Control-Allow-Origin", "*");
		headers.set("content-type", "application/json;charset=UTF-8")

		const url = new URL(request.url);
		const query = url.searchParams.get("s");
		const apiUrl = `${host}&s=${query}`;
		const init = {
			headers: headers
		};

		async function gatherResponse(response: any) {
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