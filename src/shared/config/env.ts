export const env = {
  vocabDocAllId: import.meta.env.VITE_VOCAB_DOC_ALL_ID ?? '',
  vocabDocLearnedId: import.meta.env.VITE_VOCAB_DOC_LEARNED_ID ?? '',
  vocabDocUnlearnedId: import.meta.env.VITE_VOCAB_DOC_UNLEARNED_ID ?? '',
}

export const requireDocId = (id: string, name: string): string => {
  if (!id) throw new Error(`Missing env: ${name}. Set it in .env`)
  return id
}
