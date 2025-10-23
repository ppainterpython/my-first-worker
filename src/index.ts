/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */


import { Hono } from "hono";
import { Ai } from "@cloudflare/ai";

const app = new Hono<{Bindings: Env}>();

// GET /bucket
app.get('/bucket', async (c) => {
	try {
		const bucket = c.env.MY_BUCKET;
		const objects = await bucket.list();
		const names = objects.objects.map(obj => obj.key);
		return c.json({ objects: names });
	} catch (error) {
		return c.json({ objects: [] });
	}
});

// GET /ai?query="What is the origin of the phrase Hello, World"
app.get('/ai', async (c) => {
	try {
		const ai = new Ai(c.env.AI);
		const content = c.req.query('query') || "Give me a friendly greeting";
		const messages = [
			{ role: "system", content: "You are a friendly assistant" },
			{ role: "user", content: content }
		];
		const inputs = { messages: messages };
		const res = await ai.run("@cf/mistral/mistral-7b-instruct-v0.1", inputs) as any;
		return c.json({ message: res?.response || "Hello World!" });
	} catch (error) {
		return c.json({ message: "Hello World!" });
	}
});



export default app
