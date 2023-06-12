import { Router, IRequest } from "itty-router";
import { Client } from "pg";
import { Env, User, Movie } from "../worker-configuration";

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
					await client.query({
						text: "CALL add_user($1, $2);",
						values: [requestBody.Firstname, requestBody.Lastname]
					});
					const res = new Response('{"Message": "Successfully added user"}', {
						headers: { 'Content-Type': 'application/json' },
					});
					ctx.waitUntil(client.end());
					return res;
				} catch (error: any) {
					return new Response(error, { status: 400 });
				}
			})
			.post('/addMovie', async (request: Request): Promise<Response> => {
				try {
					const requestBody: Movie = await request.json(); // Required as request.Firstname and request.Lastname are undefined for some reason when request is typed as User and used directly
					const client: Client = new Client(env.DB_URL);
					await client.connect();
					await client.query({
						text: "CALL add_movie($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);",
						values: [
							requestBody.ImdbID,
							requestBody.Title,
							requestBody.Year,
							requestBody.PosterLink,
							requestBody.PlotShort,
							requestBody.DetailsLink,
							requestBody.Genre,
							requestBody.Runtime,
							requestBody.Rewatch,
							requestBody.UserID
						]
					});
					const res = new Response('{"Status": "Successfully added movie"}', {
						headers: { 'Content-Type': 'application/json' },
					});
					ctx.waitUntil(client.end());
					return res;
				} catch (error: any) {
					return new Response(JSON.stringify(`{Error: ${error.message}}`), { status: 400 });
				}
			})
			.post('/addShow', async (request: Request): Promise<Response> => {
				try {
					const requestBody: Movie = await request.json(); // Required as request.Firstname and request.Lastname are undefined for some reason when request is typed as User and used directly
					const client: Client = new Client(env.DB_URL);
					await client.connect();
					await client.query({
						text: "CALL add_show($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);",
						values: [
							requestBody.ImdbID,
							requestBody.Title,
							requestBody.Year,
							requestBody.PosterLink,
							requestBody.PlotShort,
							requestBody.DetailsLink,
							requestBody.Genre,
							requestBody.Runtime,
							requestBody.Rewatch,
							requestBody.UserID
						]
					});
					const res = new Response('{"Status": "Successfully added movie"}', {
						headers: { 'Content-Type': 'application/json' },
					});
					ctx.waitUntil(client.end());
					return res;
				} catch (error: any) {
					return new Response(JSON.stringify(`{Error: ${error.message}}`), { status: 400 });
				}
			})
			.all('*', () => new Response('{"Error": "Not found"}', { status: 404 }));
		return router.handle(request)
	}
}

export default handler;