import { useUIStore } from '../lib/store';
import { translations, TranslationKey } from '../lib/translations';

export function useTranslation() {
  const language = useUIStore((state) => state.language);

  const t = (key: TranslationKey): string => {
    return translations[language][key];
  };

  return { t, language };
}
