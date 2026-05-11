import type { Tense as SentenceTense } from '@entities/sentence'

export type TenseGroup = 'present' | 'past' | 'future'
export type TenseAspect = 'simple' | 'continuous' | 'perfect' | 'perfectContinuous'

export type ResolvedTenseExample = { en: string; ru?: string }

export type ResolvedTenseExamples = {
  affirmative: ResolvedTenseExample
  negative: ResolvedTenseExample
  question: ResolvedTenseExample
}

export const tenseCodeOf = (group: TenseGroup, aspect: TenseAspect): SentenceTense => {
  const aspectPart = aspect === 'perfectContinuous' ? 'perfect_continuous' : aspect
  return `${group}_${aspectPart}` as SentenceTense
}

export type Tense = {
  group: TenseGroup
  aspect: TenseAspect
  name: string
  nameRu: string
  affirmative: string
  negative: string
  question: string
  when: string
  example: string
  examples: {
    affirmative: string
    negative: string
    question: string
  }
}

export const TENSE_GROUPS: Record<TenseGroup, { label: string; ru: string }> = {
  present: { label: 'Present', ru: 'настоящее' },
  past: { label: 'Past', ru: 'прошедшее' },
  future: { label: 'Future', ru: 'будущее' },
}

export const TENSE_ASPECTS: Record<TenseAspect, { label: string; ru: string }> = {
  simple: { label: 'Simple', ru: 'простое' },
  continuous: { label: 'Continuous', ru: 'длительное' },
  perfect: { label: 'Perfect', ru: 'совершенное' },
  perfectContinuous: { label: 'Perfect Continuous', ru: 'совершенное длительное' },
}

export const GROUP_ORDER: TenseGroup[] = ['future', 'present', 'past']
export const ASPECT_ORDER: TenseAspect[] = ['simple', 'continuous', 'perfect', 'perfectContinuous']

export const TENSES: Tense[] = [
  {
    group: 'present',
    aspect: 'simple',
    name: 'Present Simple',
    nameRu: 'настоящее простое',
    affirmative: 'S + V(s/es)',
    negative: "S + don't/doesn't + V",
    question: 'Do/Does + S + V?',
    when: 'Факты, привычки, законы природы',
    example: 'She works every day.',
    examples: {
      affirmative: 'She works every day.',
      negative: "She doesn't work on Sundays.",
      question: 'Does she work on weekends?',
    },
  },
  {
    group: 'present',
    aspect: 'continuous',
    name: 'Present Continuous',
    nameRu: 'настоящее длительное',
    affirmative: 'S + am/is/are + V-ing',
    negative: 'S + am/is/are + not + V-ing',
    question: 'Am/Is/Are + S + V-ing?',
    when: 'Действие происходит прямо сейчас',
    example: 'She is reading now.',
    examples: {
      affirmative: 'She is reading a book now.',
      negative: "She isn't reading a book now.",
      question: 'Is she reading a book now?',
    },
  },
  {
    group: 'present',
    aspect: 'perfect',
    name: 'Present Perfect',
    nameRu: 'настоящее совершенное',
    affirmative: 'S + have/has + V3',
    negative: "S + haven't/hasn't + V3",
    question: 'Have/Has + S + V3?',
    when: 'Опыт, результат важен сейчас; точное время неважно',
    example: 'I have visited Paris.',
    examples: {
      affirmative: 'I have visited Paris twice.',
      negative: "I haven't visited Paris yet.",
      question: 'Have you ever visited Paris?',
    },
  },
  {
    group: 'present',
    aspect: 'perfectContinuous',
    name: 'Present Perfect Continuous',
    nameRu: 'настоящее совершенное длительное',
    affirmative: 'S + have/has been + V-ing',
    negative: "S + haven't/hasn't been + V-ing",
    question: 'Have/Has + S + been + V-ing?',
    when: 'Действие началось в прошлом и продолжается до сих пор',
    example: "I've been running for 2h.",
    examples: {
      affirmative: 'I have been running for two hours.',
      negative: "I haven't been running for long.",
      question: 'Have you been running for long?',
    },
  },
  {
    group: 'past',
    aspect: 'simple',
    name: 'Past Simple',
    nameRu: 'прошедшее простое',
    affirmative: 'S + V2',
    negative: "S + didn't + V",
    question: 'Did + S + V?',
    when: 'Завершённое действие в прошлом',
    example: 'I called him yesterday.',
    examples: {
      affirmative: 'I called him yesterday.',
      negative: "I didn't call him yesterday.",
      question: 'Did you call him yesterday?',
    },
  },
  {
    group: 'past',
    aspect: 'continuous',
    name: 'Past Continuous',
    nameRu: 'прошедшее длительное',
    affirmative: 'S + was/were + V-ing',
    negative: "S + wasn't/weren't + V-ing",
    question: 'Was/Were + S + V-ing?',
    when: 'Действие длилось в определённый момент в прошлом',
    example: 'I was sleeping at 9 pm.',
    examples: {
      affirmative: 'I was sleeping at 9 pm.',
      negative: "I wasn't sleeping at 9 pm.",
      question: 'Were you sleeping at 9 pm?',
    },
  },
  {
    group: 'past',
    aspect: 'perfect',
    name: 'Past Perfect',
    nameRu: 'прошедшее совершенное',
    affirmative: 'S + had + V3',
    negative: "S + hadn't + V3",
    question: 'Had + S + V3?',
    when: 'Действие завершилось до другого действия в прошлом',
    example: 'She had left before I came.',
    examples: {
      affirmative: 'She had left before I came.',
      negative: "She hadn't left before I came.",
      question: 'Had she left before you came?',
    },
  },
  {
    group: 'past',
    aspect: 'perfectContinuous',
    name: 'Past Perfect Continuous',
    nameRu: 'прошедшее совершенное длительное',
    affirmative: 'S + had been + V-ing',
    negative: "S + hadn't been + V-ing",
    question: 'Had + S + been + V-ing?',
    when: 'Действие длилось до другого события в прошлом',
    example: 'He had been working for 3h when she called.',
    examples: {
      affirmative: 'He had been working for three hours when she called.',
      negative: "He hadn't been working for long when she called.",
      question: 'Had he been working for long when she called?',
    },
  },
  {
    group: 'future',
    aspect: 'simple',
    name: 'Future Simple',
    nameRu: 'будущее простое',
    affirmative: 'S + will + V',
    negative: "S + won't + V",
    question: 'Will + S + V?',
    when: 'Спонтанное решение, прогноз, обещание',
    example: "I'll help you.",
    examples: {
      affirmative: 'I will help you.',
      negative: "I won't help you.",
      question: 'Will you help me?',
    },
  },
  {
    group: 'future',
    aspect: 'continuous',
    name: 'Future Continuous',
    nameRu: 'будущее длительное',
    affirmative: 'S + will be + V-ing',
    negative: "S + won't be + V-ing",
    question: 'Will + S + be + V-ing?',
    when: 'Действие будет длиться в определённый момент в будущем',
    example: "I'll be working at noon.",
    examples: {
      affirmative: 'I will be working at noon.',
      negative: "I won't be working at noon.",
      question: 'Will you be working at noon?',
    },
  },
  {
    group: 'future',
    aspect: 'perfect',
    name: 'Future Perfect',
    nameRu: 'будущее совершенное',
    affirmative: 'S + will have + V3',
    negative: "S + won't have + V3",
    question: 'Will + S + have + V3?',
    when: 'Действие завершится к определённому моменту в будущем',
    example: "I'll have finished by 5 pm.",
    examples: {
      affirmative: 'I will have finished the report by 5 pm.',
      negative: "I won't have finished the report by 5 pm.",
      question: 'Will you have finished the report by 5 pm?',
    },
  },
  {
    group: 'future',
    aspect: 'perfectContinuous',
    name: 'Future Perfect Continuous',
    nameRu: 'будущее совершенное длительное',
    affirmative: 'S + will have been + V-ing',
    negative: "S + won't have been + V-ing",
    question: 'Will + S + have been + V-ing?',
    when: 'Действие длится с прошлого и будет всё ещё длиться к моменту в будущем',
    example: "By July I'll have been living here for 2 years.",
    examples: {
      affirmative: 'By July I will have been living here for two years.',
      negative: "By July I won't have been living here for two years.",
      question: 'Will you have been living here for two years by July?',
    },
  },
]
