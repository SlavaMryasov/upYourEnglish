import type { Word } from '@entities/word'
import { useQuery } from '@pinia/colada'
import { env, requireDocId } from '@shared/config'
import { parseVocabDoc } from '@shared/lib'

export type VocabSource = 'all' | 'learned' | 'unlearned'

const docIdBySource: Record<VocabSource, () => string> = {
  all: () => requireDocId(env.vocabDocAllId, 'VITE_VOCAB_DOC_ALL_ID'),
  learned: () => requireDocId(env.vocabDocLearnedId, 'VITE_VOCAB_DOC_LEARNED_ID'),
  unlearned: () => requireDocId(env.vocabDocUnlearnedId, 'VITE_VOCAB_DOC_UNLEARNED_ID'),
}

const fetchVocab = async (source: VocabSource): Promise<Word[]> => {
  const docId = docIdBySource[source]()
  const url = import.meta.env.DEV
    ? `/gdoc/document/d/${docId}/export?format=txt`
    : `https://docs.google.com/document/d/${docId}/export?format=txt`

  const response = await fetch(url)
  if (!response.ok) throw new Error(`Vocab fetch failed (${source}): ${response.status}`)

  const text = await response.text()
  return parseVocabDoc(text)
}

export const useVocabQuery = (source: VocabSource) =>
  useQuery({
    key: ['vocab', source],
    query: () => fetchVocab(source),
    staleTime: 60 * 60 * 1000,
  })
