import { requestUrl } from "obsidian";
import Generator from "../generator";
import { QuizSettings } from "../../settings/config";

export default class StudyServerGenerator extends Generator {
	constructor(settings: QuizSettings) {
		super(settings);
	}

	public async generateQuiz(contents: string[]): Promise<string | null> {
		try {
			const body: Record<string, unknown> = {
				system: this.systemPrompt(),
				userMessage: this.userPrompt(contents),
			};

			if (this.settings.studyServerModel) {
				body.model = this.settings.studyServerModel;
			}

			const response = await requestUrl({
				url: `${this.settings.studyServerUrl}/api/generate`,
				method: "POST",
				headers: this.headers(),
				body: JSON.stringify(body),
			});

			return response.json.text || null;
		} catch (error) {
			throw new Error(`Study Server error: ${(error as Error).message}`);
		}
	}

	public async shortOrLongAnswerSimilarity(userAnswer: string, answer: string): Promise<number> {
		try {
			const response = await requestUrl({
				url: `${this.settings.studyServerUrl}/api/grade`,
				method: "POST",
				headers: this.headers(),
				body: JSON.stringify({ answer, userAnswer }),
			});

			const score = response.json.score;

			if (typeof score !== "number") {
				throw new Error("Study Server: Failed to grade answer.");
			}

			return Math.min(1, Math.max(0, score));
		} catch {
			throw new Error("Study Server: Failed to grade answer.");
		}
	}

	private headers(): Record<string, string> {
		const headers: Record<string, string> = { "Content-Type": "application/json" };

		if (this.settings.studyServerToken) {
			headers["Authorization"] = `Bearer ${this.settings.studyServerToken}`;
		}

		return headers;
	}
}
