export type SentencesManifest = Record<string, string>

export const parseSentencesManifest = (raw: string): SentencesManifest => {
  const lines = raw.split('\n')
  const result: SentencesManifest = {}

  lines.forEach((rawLine) => {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) return
    const parts = line.split(' | ').map((part) => part.trim())
    if (parts.length !== 2) return
    const [word, docId] = parts
    if (!word || !docId) return
    result[word.toLowerCase()] = docId
  })

  return result
}
