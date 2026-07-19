import { Menu, MenuItem, Plugin, TAbstractFile, TFile } from "obsidian";
import { DEFAULT_SETTINGS, QuizSettings } from "./settings/config";
import SelectorModal from "./ui/selector/selectorModal";
import QuizSettingsTab from "./settings/settings";
import QuizReviewer from "./services/quizReviewer";

export default class QuizGenerator extends Plugin {
	public settings: QuizSettings = DEFAULT_SETTINGS;

	async onload(): Promise<void> {
		this.addCommand({
			id: "open-generator",
			name: "Open generator",
			callback: (): void => {
				new SelectorModal(this.app, this.settings).open();
			}
		});

		this.addRibbonIcon("brain-circuit", "Open generator", (): void => {
			new SelectorModal(this.app, this.settings).open();
		});

		this.addCommand({
			id: "open-quiz-from-active-note",
			name: "Open quiz from active note",
			callback: (): void => {
				new QuizReviewer(this.app, this.settings).openQuiz(this.app.workspace.getActiveFile());
			}
		});

		this.registerEvent(
			this.app.workspace.on("file-menu", (menu: Menu, file: TAbstractFile): void => {
				if (file instanceof TFile && file.extension === "md") {
					menu.addItem((item: MenuItem): void => {
						item
							.setTitle("Open quiz from this note")
							.setIcon("scroll-text")
							.onClick((): void => {
								new QuizReviewer(this.app, this.settings).openQuiz(file);
							});
					});
				}
			})
		);

		await this.loadSettings();
		this.addSettingTab(new QuizSettingsTab(this.app, this));
	}

	async loadSettings(): Promise<void> {
		const data = await this.loadData();
		this.settings = Object.assign({}, DEFAULT_SETTINGS, data);

		if (this.migrateStudyServerSettings(data)) {
			await this.saveSettings();
		}
	}

	/**
	 * One-time migration from the pre-rename settings schema (old server
	 * provider/keys) to the current schema, run on load so existing users
	 * don't lose their configured server URL/token.
	 */
	private migrateStudyServerSettings(data: Record<string, unknown> | null | undefined): boolean {
		if (!data) return false;

		let migrated = false;
		const legacyKeyMap: [string, keyof QuizSettings][] = [
			["claudeServerUrl", "studyServerUrl"],
			["claudeServerToken", "studyServerToken"],
		];

		for (const [oldKey, newKey] of legacyKeyMap) {
			const oldValue = data[oldKey];
			if (oldValue !== undefined && !data[newKey as string]) {
				(this.settings as unknown as Record<string, unknown>)[newKey] = oldValue;
				migrated = true;
			}
		}

		const legacyProviderValue = "CLAUDE_SERVER";
		if (data.provider === legacyProviderValue) {
			this.settings.provider = "STUDY_SERVER";
			migrated = true;
		}

		return migrated;
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}
}
