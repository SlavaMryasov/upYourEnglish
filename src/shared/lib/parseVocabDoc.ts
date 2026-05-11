import type { Word } from '@entities/word'

export const parseVocabDoc = (raw: string): Word[] => {
  const lines = raw.split('\n')
  const words: Word[] = []
  let id = 0

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) return

    const parts = line.split(' | ').map((part) => part.trim())
    if (parts.length !== 4) {
      console.warn(`parseVocabDoc: skipping malformed line ${index + 1}: "${line}"`)
      return
    }

    const [en, translation, phrase, phraseTranslation] = parts
    id += 1
    words.push({ id, en, translation, phrase, phraseTranslation })
  })

  return words
}
