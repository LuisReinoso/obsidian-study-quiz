import { Notice, requestUrl } from "obsidian";
import Generator from "../generator";
import { QuizSettings } from "../../settings/config";

export default class ClaudeServerGenerator extends Generator {
	constructor(settings: QuizSettings) {
		super(settings);
	}

	public async generateQuiz(contents: string[]): Promise<string | null> {
		try {
			const response = await requestUrl({
				url: `${this.settings.claudeServerUrl}/api/generate`,
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					system: this.systemPrompt(),
					userMessage: this.userPrompt(contents),
					model: this.settings.claudeServerModel,
					maxTokens: 4096,
				}),
			});

			const data = response.json;

			if (data.stopReason === "end_turn" || data.stopReason === "stop") {
				// Normal completion
			} else if (data.stopReason === "max_tokens") {
				new Notice("Generation truncated: Token limit reached");
			}

			return data.text || null;
		} catch (error) {
			throw new Error(`Claude Server error: ${(error as Error).message}`);
		}
	}

	public async shortOrLongAnswerSimilarity(userAnswer: string, answer: string): Promise<number> {
		try {
			const response = await requestUrl({
				url: `${this.settings.claudeServerUrl}/api/generate`,
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					system: "You are a grading assistant. Compare the user's answer to the correct answer. Return ONLY a JSON object: {\"score\": X} where X is a number from 0.0 to 1.0. Score 1.0 = perfectly correct, 0.0 = completely wrong. Judge meaning, not exact wording.",
					userMessage: `Correct answer: "${answer}"\nUser's answer: "${userAnswer}"`,
					maxTokens: 100,
				}),
			});

			const data = response.json;
			const parsed = JSON.parse(data.text);
			return typeof parsed.score === "number" ? parsed.score : 0;
		} catch {
			throw new Error("Claude Server: Failed to grade answer.");
		}
	}
}
