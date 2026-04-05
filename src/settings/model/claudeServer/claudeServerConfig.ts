export interface ClaudeServerConfig {
	claudeServerUrl: string;
	claudeServerModel: string;
}

export const DEFAULT_CLAUDE_SERVER_SETTINGS: ClaudeServerConfig = {
	claudeServerUrl: "http://localhost:3457",
	claudeServerModel: "claude-sonnet-4-20250514",
};
