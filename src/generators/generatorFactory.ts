import Generator from "./generator";
import { Provider } from "./providers";
import { QuizSettings } from "../settings/config";
import StudyServerGenerator from "./studyServer/studyServerGenerator";

export default class GeneratorFactory {
	private static generatorMap: { [key in Provider]: new (settings: QuizSettings) => Generator } = {
		[Provider.STUDY_SERVER]: StudyServerGenerator,
	};

	public static createInstance(settings: QuizSettings): Generator {
		const provider = Provider[settings.provider as keyof typeof Provider];
		const GeneratorConstructor = this.generatorMap[provider];
		return new GeneratorConstructor(settings);
	}
}
