/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_VOCAB_DOC_ALL_ID: string
  readonly VITE_VOCAB_DOC_LEARNED_ID: string
  readonly VITE_VOCAB_DOC_UNLEARNED_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
