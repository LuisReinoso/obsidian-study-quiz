import { Setting } from "obsidian";
import QuizGenerator from "../../../main";
import { DEFAULT_STUDY_SERVER_SETTINGS } from "./studyServerConfig";

const displayStudyServerSettings = (containerEl: HTMLElement, plugin: QuizGenerator, refreshSettings: () => void): void => {
	new Setting(containerEl)
		.setName("Server URL")
		.setDesc("URL of your Study Server (e.g., http://100.x.x.x:3457 via Tailscale)")
		.addButton(button =>
			button
				.setClass("clickable-icon")
				.setIcon("rotate-ccw")
				.setTooltip("Restore default")
				.onClick(async () => {
					plugin.settings.studyServerUrl = DEFAULT_STUDY_SERVER_SETTINGS.studyServerUrl;
					await plugin.saveSettings();
					refreshSettings();
				})
		)
		.addText(text =>
			text
				.setPlaceholder("http://localhost:3457")
				.setValue(plugin.settings.studyServerUrl)
				.onChange(async (value) => {
					plugin.settings.studyServerUrl = value.trim().replace(/\/+$/, "");
					await plugin.saveSettings();
				})
		);

	new Setting(containerEl)
		.setName("Model override")
		.setDesc("Optional. Leave empty to let the server pick its model automatically. Only set if you want to force a specific model name known to your backend.")
		.addButton(button =>
			button
				.setClass("clickable-icon")
				.setIcon("rotate-ccw")
				.setTooltip("Restore default")
				.onClick(async () => {
					plugin.settings.studyServerModel = DEFAULT_STUDY_SERVER_SETTINGS.studyServerModel;
					await plugin.saveSettings();
					refreshSettings();
				})
		)
		.addText(text =>
			text
				.setPlaceholder("Auto")
				.setValue(plugin.settings.studyServerModel)
				.onChange(async (value) => {
					plugin.settings.studyServerModel = value.trim();
					await plugin.saveSettings();
				})
		);

	new Setting(containerEl)
		.setName("Auth token")
		.setDesc("Optional. If your Study Server requires authentication, enter the token here. Leave empty if it doesn't.")
		.addButton(button =>
			button
				.setClass("clickable-icon")
				.setIcon("rotate-ccw")
				.setTooltip("Restore default")
				.onClick(async () => {
					plugin.settings.studyServerToken = DEFAULT_STUDY_SERVER_SETTINGS.studyServerToken;
					await plugin.saveSettings();
					refreshSettings();
				})
		)
		.addText(text => {
			text.inputEl.type = "password";
			text
				.setPlaceholder("Bearer token")
				.setValue(plugin.settings.studyServerToken)
				.onChange(async (value) => {
					plugin.settings.studyServerToken = value.trim();
					await plugin.saveSettings();
				});
		});
};

export default displayStudyServerSettings;
