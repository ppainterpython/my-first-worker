import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect, vi } from 'vitest';
import worker from '../src/index';

// Mock the AI module to avoid dependency issues in tests
vi.mock('@cloudflare/ai', () => ({
	Ai: vi.fn().mockImplementation(() => ({
		run: vi.fn().mockResolvedValue({ response: 'Mocked AI response' })
	}))
}));

// For now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe('Hello World worker', () => {
	it('responds with Hello World! (unit style)', async () => {
		const request = new IncomingRequest('http://example.com');
		// Create an empty context to pass to `worker.fetch()`.
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		// Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
		await waitOnExecutionContext(ctx);
		const responseJson = await response.json() as any;
		expect(responseJson).toHaveProperty('message');
		expect(typeof responseJson.message).toBe('string');
	});

	it('responds with Hello World! (integration style)', async () => {
		const response = await SELF.fetch('https://example.com');
		const responseJson = await response.json() as any;
		expect(responseJson).toHaveProperty('message');
		expect(typeof responseJson.message).toBe('string');
	});
});
