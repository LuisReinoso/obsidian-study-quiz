import { Provider } from "../../generators/providers";
import { ClaudeServerConfig, DEFAULT_CLAUDE_SERVER_SETTINGS } from "./claudeServer/claudeServerConfig";

export interface ModelConfig extends ClaudeServerConfig {
	provider: string;
}

export const DEFAULT_MODEL_SETTINGS: ModelConfig = {
	provider: Provider.CLAUDE_SERVER,
	...DEFAULT_CLAUDE_SERVER_SETTINGS,
};
