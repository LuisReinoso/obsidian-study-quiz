export enum Provider {
	CLAUDE_SERVER = "CLAUDE_SERVER",
}

export const providers: Record<Provider, string> = {
	[Provider.CLAUDE_SERVER]: "Claude Server",
};
