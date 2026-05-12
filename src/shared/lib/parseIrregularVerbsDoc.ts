import { VERB_FREQUENCIES, type IrregularVerb, type VerbFrequency } from '@entities/verb'

const isFrequency = (value: string): value is VerbFrequency =>
  (VERB_FREQUENCIES as readonly string[]).includes(value)

const FREQ_TAIL_RE = /^(high|medium|low)(?:\s+(.+))?$/i

export const parseIrregularVerbsDoc = (raw: string): IrregularVerb[] => {
  const parts = raw
    .split(/[\r\n|]/)
    .map((part) => part.trim())
    .filter((part) => part && !part.startsWith('#'))

  const result: IrregularVerb[] = []
  let i = 0

  while (i + 4 < parts.length) {
    const v1 = parts[i]
    const v2 = parts[i + 1]
    const v3 = parts[i + 2]
    const translation = parts[i + 3]
    const freqField = parts[i + 4]

    const match = freqField.toLowerCase().match(FREQ_TAIL_RE)
    if (!match) {
      console.warn(
        `parseIrregularVerbsDoc: bad freq "${freqField}" near "${v1}" (offset ${i})`,
      )
      i += 1
      continue
    }

    const freq = match[1]
    const nextV1 = match[2]
    if (!isFrequency(freq)) {
      i += 1
      continue
    }

    result.push({ v1, v2, v3, translation, freq })

    if (nextV1) {
      parts[i + 4] = nextV1
      i += 4
    } else {
      i += 5
    }
  }

  return result
}
