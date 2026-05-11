/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_VOCAB_DOC_ID: string
  readonly VITE_SENTENCES_DOC_ID: string
  readonly VITE_TENSE_EXAMPLES_DOC_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
