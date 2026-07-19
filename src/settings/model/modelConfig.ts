import { Provider } from "../../generators/providers";
import { StudyServerConfig, DEFAULT_STUDY_SERVER_SETTINGS } from "./studyServer/studyServerConfig";

export interface ModelConfig extends StudyServerConfig {
	provider: string;
}

export const DEFAULT_MODEL_SETTINGS: ModelConfig = {
	provider: Provider.STUDY_SERVER,
	...DEFAULT_STUDY_SERVER_SETTINGS,
};
