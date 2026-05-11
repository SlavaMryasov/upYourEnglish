export const env = {
  vocabDocId: import.meta.env.VITE_VOCAB_DOC_ID ?? '',
  sentencesDocId: import.meta.env.VITE_SENTENCES_DOC_ID ?? '',
}

export const requireDocId = (id: string, name: string): string => {
  if (!id) throw new Error(`${name} is not set. Edit .env`)
  return id
}
