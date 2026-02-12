import { useUIStore } from "../store/store";
import { translations, TranslationKey } from "../utils/translations";

export function useTranslation() {
	const language = useUIStore((state) => state.language);

	const t = (key: TranslationKey): string => {
		return translations[language][key];
	};

	return { t, language };
}
