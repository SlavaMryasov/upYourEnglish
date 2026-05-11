import type { SentencesIndex } from '@entities/sentence'
import { useQuery } from '@pinia/colada'
import { env, requireDocId } from '@shared/config'
import { parseSentencesDoc } from '@shared/lib'

const fetchSentences = async (): Promise<SentencesIndex> => {
  const docId = requireDocId(env.sentencesDocId, 'VITE_SENTENCES_DOC_ID')
  const url = import.meta.env.DEV
    ? `/gdoc/document/d/${docId}/export?format=txt`
    : `https://docs.google.com/document/d/${docId}/export?format=txt`

  const response = await fetch(url)
  if (!response.ok) throw new Error(`Sentences fetch failed: ${response.status}`)

  const text = await response.text()
  return parseSentencesDoc(text)
}

export const useSentencesQuery = () =>
  useQuery({
    key: ['sentences'],
    query: fetchSentences,
    staleTime: 60 * 60 * 1000,
  })
