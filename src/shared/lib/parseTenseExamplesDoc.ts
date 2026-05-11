import { TENSES, type Tense as SentenceTense } from '@entities/sentence'

export type TenseExampleLine = { en: string; ru: string }

export type TenseExampleSet = {
  affirmative?: TenseExampleLine
  negative?: TenseExampleLine
  question?: TenseExampleLine
}

export type TenseExamplesIndex = Partial<Record<SentenceTense, TenseExampleSet>>

const isTense = (value: string): value is SentenceTense =>
  (TENSES as readonly string[]).includes(value)

const FORM_MAP: Record<string, keyof TenseExampleSet> = {
  '+': 'affirmative',
  '-': 'negative',
  '?': 'question',
}

export const parseTenseExamplesDoc = (raw: string): TenseExamplesIndex => {
  const lines = raw.split('\n')
  const result: TenseExamplesIndex = {}
  let currentTense: SentenceTense | null = null

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim()
    if (!line) return

    if (line.startsWith('###')) return

    if (line.startsWith('##')) {
      const code = line.slice(2).trim().toLowerCase()
      if (!isTense(code)) {
        console.warn(`parseTenseExamplesDoc: unknown tense "${code}" on line ${index + 1}`)
        currentTense = null
        return
      }
      currentTense = code
      if (!result[currentTense]) result[currentTense] = {}
      return
    }

    if (line.startsWith('#')) return
    if (!currentTense) return

    const parts = line.split(' | ').map((part) => part.trim())
    if (parts.length !== 3) return

    const [form, en, ru] = parts
    const formKey = FORM_MAP[form]
    if (!formKey) return

    const bucket = result[currentTense] ?? {}
    bucket[formKey] = { en, ru }
    result[currentTense] = bucket
  })

  return result
}
