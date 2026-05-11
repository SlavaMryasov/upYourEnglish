import type { Word } from '@entities/word'
import { useQuery } from '@pinia/colada'
import { requireDocId } from '@shared/config'
import { parseVocabDoc } from '@shared/lib'

const fetchVocab = async (): Promise<Word[]> => {
  const docId = requireDocId()
  const url = import.meta.env.DEV
    ? `/gdoc/document/d/${docId}/export?format=txt`
    : `https://docs.google.com/document/d/${docId}/export?format=txt`

  const response = await fetch(url)
  if (!response.ok) throw new Error(`Vocab fetch failed: ${response.status}`)

  const text = await response.text()
  return parseVocabDoc(text)
}

export const useVocabQuery = () =>
  useQuery({
    key: ['vocab'],
    query: fetchVocab,
    staleTime: 60 * 60 * 1000,
  })
