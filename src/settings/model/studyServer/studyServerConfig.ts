export interface StudyServerConfig {
	studyServerUrl: string;
	studyServerModel: string;
	studyServerToken: string;
}

export const DEFAULT_STUDY_SERVER_SETTINGS: StudyServerConfig = {
	studyServerUrl: "http://localhost:3457",
	studyServerModel: "",
	studyServerToken: "",
};
