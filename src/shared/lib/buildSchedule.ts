import type { Word } from '@entities/word'
import { INTERVALS, MS_PER_DAY, COURSE_START_DATE, WORDS_PER_DAY } from '@shared/config'

export type Repetition = {
  interval: number
  ids: number[]
}

export type DaySchedule = {
  day: number
  date: Date
  newIds: number[]
  repetitions: Repetition[]
}

export type ScheduleResult = {
  batches: number[][]
  schedule: DaySchedule[]
  learningDays: number
  totalDays: number
}

export const buildSchedule = (words: Word[]): ScheduleResult => {
  const batches: number[][] = []
  for (let i = 0; i < words.length; i += WORDS_PER_DAY) {
    batches.push(words.slice(i, i + WORDS_PER_DAY).map((word) => word.id))
  }

  const learningDays = batches.length
  const totalDays = learningDays + Math.max(...INTERVALS)

  const schedule: DaySchedule[] = []
  for (let day = 1; day <= totalDays; day += 1) {
    const newBatchIdx = day - 1
    const newIds = newBatchIdx < batches.length ? batches[newBatchIdx] : []

    const repetitions = INTERVALS.flatMap<Repetition>((interval) => {
      const sourceBatchIdx = day - 1 - interval
      if (sourceBatchIdx < 0 || sourceBatchIdx >= batches.length) return []
      return [{ interval, ids: batches[sourceBatchIdx] }]
    })

    schedule.push({
      day,
      date: new Date(COURSE_START_DATE.getTime() + (day - 1) * MS_PER_DAY),
      newIds,
      repetitions,
    })
  }

  return { batches, schedule, learningDays, totalDays }
}

export const getDayDeckIds = (day: number, schedule: DaySchedule[]): number[] => {
  const entry = schedule.find((item) => item.day === day)
  if (!entry) return []
  return [...entry.newIds, ...entry.repetitions.flatMap((rep) => rep.ids)]
}

export const getFirstNIds = (n: number, words: Word[]): number[] =>
  words.slice(0, n).map((word) => word.id)

export const getStatusIds = (words: Word[], status: Word['status']): number[] =>
  words.filter((word) => word.status === status).map((word) => word.id)

export const getIntroductionDay = (wordId: number): number =>
  Math.floor((wordId - 1) / WORDS_PER_DAY) + 1
