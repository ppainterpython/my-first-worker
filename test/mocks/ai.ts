// Mock implementation of @cloudflare/ai for testing
export class Ai {
	constructor(binding: any) {
		// Mock constructor
	}

	async run(model: string, inputs: any): Promise<any> {
		return {
			response: 'Hello World!'
		};
	}
}