export type Language = {
  code: string;
  name: string;
  localName?: string;
  isRTL?: boolean;
};

export const languages: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'vi', name: 'Vietnamese', localName: 'Tiếng Việt' },
].sort((a, b) => a.name.localeCompare(b.name));

export const languageMap: Record<string, Language> = languages.reduce(
  (acc, lang) => ({
    ...acc,
    [lang.code]: lang,
  }),
  {}
);
