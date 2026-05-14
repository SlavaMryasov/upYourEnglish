import { WORD_STATUSES, type Word, type WordStatus } from '@entities/word'

const ISO_DATE_RE = /^(\d{4}-\d{2}-\d{2})/

const isWordStatus = (value: string): value is WordStatus =>
  (WORD_STATUSES as readonly string[]).includes(value)

export const parseVocabDoc = (raw: string): Word[] => {
  const lines = raw.split('\n')
  const words: Word[] = []
  let currentStatus: WordStatus = 'new'
  let currentIntroductionDate: string | null = null
  let id = 0

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim()
    if (!line) return

    if (line.startsWith('###')) {
      const match = line.slice(3).trim().match(ISO_DATE_RE)
      if (match) {
        currentIntroductionDate = match[1]
      } else {
        console.warn(
          `parseVocabDoc: ### heading without ISO date on line ${index + 1}: "${line}"`,
        )
        currentIntroductionDate = null
      }
      return
    }

    if (line.startsWith('##')) {
      const label = line.slice(2).trim().toLowerCase()
      if (isWordStatus(label)) {
        currentStatus = label
      } else {
        console.warn(
          `parseVocabDoc: unknown status section "${label}" on line ${index + 1}, keeping "${currentStatus}"`,
        )
      }
      currentIntroductionDate = null
      return
    }

    if (line.startsWith('#')) return

    const parts = line.split(' | ').map((part) => part.trim())
    if (parts.length !== 4) {
      console.warn(`parseVocabDoc: skipping malformed line ${index + 1}: "${line}"`)
      return
    }

    const [en, translation, phrase, phraseTranslation] = parts
    id += 1
    words.push({
      id,
      en,
      translation,
      phrase,
      phraseTranslation,
      status: currentStatus,
      introductionDate: currentIntroductionDate,
    })
  })

  return words
}
