export const TENSES = [
  'present_simple',
  'present_continuous',
  'present_perfect',
  'present_perfect_continuous',
  'past_simple',
  'past_continuous',
  'past_perfect',
  'past_perfect_continuous',
  'future_simple',
  'future_continuous',
  'future_perfect',
  'future_perfect_continuous',
] as const

export type Tense = (typeof TENSES)[number]

export const TENSE_LABELS: Record<Tense, string> = {
  present_simple: 'Present Simple',
  present_continuous: 'Present Continuous',
  present_perfect: 'Present Perfect',
  present_perfect_continuous: 'Present Perfect Continuous',
  past_simple: 'Past Simple',
  past_continuous: 'Past Continuous',
  past_perfect: 'Past Perfect',
  past_perfect_continuous: 'Past Perfect Continuous',
  future_simple: 'Future Simple',
  future_continuous: 'Future Continuous',
  future_perfect: 'Future Perfect',
  future_perfect_continuous: 'Future Perfect Continuous',
}

export type SentenceForTense = {
  en: string
  ru: string
}

export type WordSentences = Partial<Record<Tense, SentenceForTense>>

export type SentencesIndex = Record<string, WordSentences>
