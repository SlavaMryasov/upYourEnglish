import { useQuery } from '@pinia/colada'
import { env, requireDocId } from '@shared/config'
import { parseSentencesManifest, type SentencesManifest } from '@shared/lib'

const docUrl = (docId: string): string =>
  import.meta.env.DEV
    ? `/gdoc/document/d/${docId}/export?format=txt`
    : `https://docs.google.com/document/d/${docId}/export?format=txt`

const fetchManifest = async (): Promise<SentencesManifest> => {
  const docId = requireDocId(env.sentencesManifestDocId, 'VITE_SENTENCES_MANIFEST_DOC_ID')
  const response = await fetch(docUrl(docId))
  if (!response.ok) throw new Error(`Manifest fetch failed: ${response.status}`)
  const raw = await response.text()
  return parseSentencesManifest(raw)
}

export const useSentencesManifestQuery = () =>
  useQuery({
    key: ['sentences-manifest'],
    query: fetchManifest,
    staleTime: 60 * 60 * 1000,
  })
