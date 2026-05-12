import {
  TENSES,
  type SentenceForm,
  type SentenceForms,
  type SentencesIndex,
  type Tense,
} from '@entities/sentence'

const isTense = (value: string): value is Tense =>
  (TENSES as readonly string[]).includes(value)

const FORM_MAP: Record<string, SentenceForm> = {
  '+': 'affirmative',
  '-': 'negative',
  '?': 'question',
}

export const parseSentencesDoc = (raw: string): SentencesIndex => {
  const lines = raw.split('\n')
  const result: SentencesIndex = {}
  let currentWord: string | null = null

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim()
    if (!line) return

    if (line.startsWith('###')) return

    if (line.startsWith('##')) {
      const word = line.slice(2).trim().toLowerCase()
      if (!word) {
        console.warn(`parseSentencesDoc: empty section header on line ${index + 1}`)
        currentWord = null
        return
      }
      currentWord = word
      if (!result[currentWord]) result[currentWord] = {}
      return
    }

    if (line.startsWith('#')) return
    if (!currentWord) return

    const parts = line.split(' | ').map((part) => part.trim())
    if (parts.length !== 4) return

    const [tenseCode, formKey, en, ru] = parts
    if (!isTense(tenseCode)) return
    const form = FORM_MAP[formKey]
    if (!form) return

    const wordBucket = result[currentWord]
    const tenseBucket: SentenceForms = wordBucket[tenseCode] ?? {}
    tenseBucket[form] = { en, ru }
    wordBucket[tenseCode] = tenseBucket
  })

  return result
}
