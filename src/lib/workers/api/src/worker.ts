import { Client } from "pg";

// export default {
// 	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
// 		console.log(env.DB_URL);
// 		return new Response('Hello World!' + env.DB_URL);
// 	},
// };

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		if (url.pathname === "/favicon.ico")
			return new Response(null, { status: 404 });

		let client: Client = new Client(env.DB_URL);
		await client.connect();

		// Query the RNA database!
		const result = await client.query({
			text: "SELECT * FROM USERS",
		});
		console.log(JSON.stringify(result.rows));
		const res = new Response(JSON.stringify(result.rows), {
			headers: { 'Content-Type': 'application/json' },
		});

		// Clean up the client, ensuring we don't kill the worker before that is
		// completed.
		ctx.waitUntil(client.end());
		return res;
	},
};