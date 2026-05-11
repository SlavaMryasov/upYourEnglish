export const WORD_STATUSES = ['new', 'learned', 'ignored'] as const
export type WordStatus = (typeof WORD_STATUSES)[number]

export type Word = {
  id: number
  en: string
  translation: string
  phrase: string
  phraseTranslation: string
  status: WordStatus
}
