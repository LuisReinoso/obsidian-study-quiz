import { Setting } from "obsidian";
import QuizGenerator from "../../../main";
import { DEFAULT_CLAUDE_SERVER_SETTINGS } from "./claudeServerConfig";

const claudeServerModels: Record<string, string> = {
	"claude-sonnet-4-20250514": "Claude Sonnet 4",
	"claude-haiku-4-5-20251001": "Claude Haiku 4.5",
	"claude-opus-4-6": "Claude Opus 4.6",
};

const displayClaudeServerSettings = (containerEl: HTMLElement, plugin: QuizGenerator, refreshSettings: () => void): void => {
	new Setting(containerEl)
		.setName("Server URL")
		.setDesc("URL of your Claude Study Server (e.g., http://100.x.x.x:3457 via Tailscale)")
		.addButton(button =>
			button
				.setClass("clickable-icon")
				.setIcon("rotate-ccw")
				.setTooltip("Restore default")
				.onClick(async () => {
					plugin.settings.claudeServerUrl = DEFAULT_CLAUDE_SERVER_SETTINGS.claudeServerUrl;
					await plugin.saveSettings();
					refreshSettings();
				})
		)
		.addText(text =>
			text
				.setPlaceholder("http://localhost:3457")
				.setValue(plugin.settings.claudeServerUrl)
				.onChange(async (value) => {
					plugin.settings.claudeServerUrl = value.trim().replace(/\/+$/, "");
					await plugin.saveSettings();
				})
		);

	new Setting(containerEl)
		.setName("Model")
		.setDesc("Claude model to use for generation.")
		.addDropdown(dropdown =>
			dropdown
				.addOptions(claudeServerModels)
				.setValue(plugin.settings.claudeServerModel)
				.onChange(async (value) => {
					plugin.settings.claudeServerModel = value;
					await plugin.saveSettings();
				})
		);
};

export default displayClaudeServerSettings;
