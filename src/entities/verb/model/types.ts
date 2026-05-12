export const VERB_FREQUENCIES = ['high', 'medium', 'low'] as const
export type VerbFrequency = (typeof VERB_FREQUENCIES)[number]

export const VERB_FREQUENCY_LABELS: Record<VerbFrequency, string> = {
  high: 'Частые',
  medium: 'Средние',
  low: 'Редкие',
}

export const VERB_FREQUENCY_BADGE_CLASS: Record<VerbFrequency, string> = {
  high: 'border-vue-500/40 bg-vue-500/15 text-vue-300',
  medium: 'border-amber-500/40 bg-amber-500/15 text-amber-300',
  low: 'border-slate-600 bg-slate-800 text-slate-300',
}

export type IrregularVerb = {
  v1: string
  v2: string
  v3: string
  translation: string
  freq: VerbFrequency
}
