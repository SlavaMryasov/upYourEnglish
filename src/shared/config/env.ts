export const env = {
  vocabDocId: import.meta.env.VITE_VOCAB_DOC_ID ?? '',
}

export const requireDocId = (): string => {
  if (!env.vocabDocId) throw new Error('VITE_VOCAB_DOC_ID is not set. Create .env from .env.example')
  return env.vocabDocId
}
