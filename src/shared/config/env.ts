export const env = {
  vocabDocId: import.meta.env.VITE_VOCAB_DOC_ID ?? '',
  tenseExamplesDocId: import.meta.env.VITE_TENSE_EXAMPLES_DOC_ID ?? '',
  sentencesManifestDocId: import.meta.env.VITE_SENTENCES_MANIFEST_DOC_ID ?? '',
  irregularVerbsDocId: import.meta.env.VITE_IRREGULAR_VERBS_DOC_ID ?? '',
}

export const requireDocId = (id: string, name: string): string => {
  if (!id) throw new Error(`${name} is not set. Edit .env`)
  return id
}
