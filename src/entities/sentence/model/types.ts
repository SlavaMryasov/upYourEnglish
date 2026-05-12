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

export const SENTENCE_FORMS = ['affirmative', 'negative', 'question'] as const
export type SentenceForm = (typeof SENTENCE_FORMS)[number]

export const SENTENCE_FORM_LABELS: Record<SentenceForm, string> = {
  affirmative: 'Утверждение',
  negative: 'Отрицание',
  question: 'Вопрос',
}

export type SentencePair = { en: string; ru: string }

export type SentenceForms = Partial<Record<SentenceForm, SentencePair>>

export type WordSentences = Partial<Record<Tense, SentenceForms>>

export type SentencesIndex = Record<string, WordSentences>
