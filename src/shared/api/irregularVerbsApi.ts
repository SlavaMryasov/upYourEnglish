import type { IrregularVerb } from '@entities/verb'
import { useQuery } from '@pinia/colada'
import { env, requireDocId } from '@shared/config'
import { parseIrregularVerbsDoc } from '@shared/lib'

const docUrl = (docId: string): string =>
  import.meta.env.DEV
    ? `/gdoc/document/d/${docId}/export?format=txt`
    : `https://docs.google.com/document/d/${docId}/export?format=txt`

const fetchIrregularVerbs = async (): Promise<IrregularVerb[]> => {
  const docId = requireDocId(env.irregularVerbsDocId, 'VITE_IRREGULAR_VERBS_DOC_ID')
  const response = await fetch(docUrl(docId))
  if (!response.ok) throw new Error(`Irregular verbs fetch failed: ${response.status}`)
  const raw = await response.text()
  return parseIrregularVerbsDoc(raw)
}

export const useIrregularVerbsQuery = () =>
  useQuery({
    key: ['irregular-verbs'],
    query: fetchIrregularVerbs,
    staleTime: 60 * 60 * 1000,
  })
