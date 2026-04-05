import { Setting } from "obsidian";
import QuizGenerator from "../../main";
import { providers } from "../../generators/providers";
import displayClaudeServerSettings from "./claudeServer/claudeServerSettings";

const displayModelSettings = (containerEl: HTMLElement, plugin: QuizGenerator, refreshSettings: () => void): void => {
	new Setting(containerEl).setName("Model").setHeading();

	new Setting(containerEl)
		.setName("Provider")
		.setDesc("Model provider to use.")
		.addDropdown(dropdown =>
			dropdown
				.addOptions(providers)
				.setValue(plugin.settings.provider)
				.onChange(async (value) => {
					plugin.settings.provider = value;
					await plugin.saveSettings();
					refreshSettings();
				})
		);

	displayClaudeServerSettings(containerEl, plugin, refreshSettings);
};

export default displayModelSettings;
