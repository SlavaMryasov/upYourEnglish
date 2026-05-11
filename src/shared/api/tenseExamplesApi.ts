import { useQuery } from '@pinia/colada'
import { env, requireDocId } from '@shared/config'
import { parseTenseExamplesDoc, type TenseExamplesIndex } from '@shared/lib'

const fetchTenseExamples = async (): Promise<TenseExamplesIndex> => {
  const docId = requireDocId(env.tenseExamplesDocId, 'VITE_TENSE_EXAMPLES_DOC_ID')
  const url = import.meta.env.DEV
    ? `/gdoc/document/d/${docId}/export?format=txt`
    : `https://docs.google.com/document/d/${docId}/export?format=txt`

  const response = await fetch(url)
  if (!response.ok) throw new Error(`Tense examples fetch failed: ${response.status}`)

  const text = await response.text()
  return parseTenseExamplesDoc(text)
}

export const useTenseExamplesQuery = () =>
  useQuery({
    key: ['tense-examples'],
    query: fetchTenseExamples,
    staleTime: 60 * 60 * 1000,
  })
