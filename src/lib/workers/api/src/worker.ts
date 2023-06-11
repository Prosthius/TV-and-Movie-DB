import { Router, IRequest } from "itty-router";
import { Client } from "pg";
import { Env, User } from "../worker-configuration";

const handler: ExportedHandler<Env> = {
	fetch: (request: Request, env: Env, ctx: ExecutionContext) => {
		const router = Router<any>();
		router
			.get('/', () => new Response('Hello World!'))
			.get('/users', async () => {
				const client: Client = new Client(env.DB_URL);
				await client.connect();
				const result = await client.query({
					text: "SELECT * FROM USERS",
				});
				const res = new Response(JSON.stringify(result.rows), {
					headers: { 'Content-Type': 'application/json' },
				});
				ctx.waitUntil(client.end());
				return res;
			})
			.post('/addUser', async (request: Request): Promise<Response> => {
				try {
					const requestBody: User = await request.json(); // Required as request.Firstname and request.Lastname are undefined for some reason when request is typed as User and used directly
					const client: Client = new Client(env.DB_URL);
					await client.connect();
					const result = await client.query({
						text: "CALL add_user($1, $2);",
						values: [requestBody.Firstname, requestBody.Lastname]
					});
					const res = new Response('{"0": "Successfully added user"}', {
						headers: { 'Content-Type': 'application/json' },
					});
					ctx.waitUntil(client.end());
					return res;
				} catch (error: any) {
					return new Response(error, { status: 400 });
				}
			})
			.all('*', () => new Response('Not found', { status: 404 }));
		return router.handle(request, env)
	}
}

export default handler;