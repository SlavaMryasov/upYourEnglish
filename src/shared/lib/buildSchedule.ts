import type { Word } from '@entities/word'
import { INTERVALS, MS_PER_DAY } from '@shared/config'

export type Repetition = {
  interval: number
  ids: number[]
}

export type DaySchedule = {
  day: number
  date: Date
  iso: string
  newIds: number[]
  repetitions: Repetition[]
}

export type ScheduleResult = {
  schedule: DaySchedule[]
  learningDays: number
  totalDays: number
}

const pad = (n: number): string => String(n).padStart(2, '0')

const dateToISO = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

const isoToDate = (iso: string): Date => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const todayISO = (now: Date = new Date()): string => dateToISO(now)

export const buildSchedule = (words: Word[]): ScheduleResult => {
  const wordsByDate = new Map<string, number[]>()
  words.forEach((word) => {
    if (!word.introductionDate) return
    const ids = wordsByDate.get(word.introductionDate) ?? []
    ids.push(word.id)
    wordsByDate.set(word.introductionDate, ids)
  })

  if (wordsByDate.size === 0) {
    return { schedule: [], learningDays: 0, totalDays: 0 }
  }

  const learningISOs = [...wordsByDate.keys()].sort()
  const firstDate = isoToDate(learningISOs[0])
  const lastLearningDate = isoToDate(learningISOs[learningISOs.length - 1])
  const maxInterval = Math.max(...INTERVALS)
  const totalDays =
    Math.round((lastLearningDate.getTime() - firstDate.getTime()) / MS_PER_DAY) + maxInterval + 1

  const schedule: DaySchedule[] = []
  for (let i = 0; i < totalDays; i += 1) {
    const date = new Date(firstDate.getTime() + i * MS_PER_DAY)
    const iso = dateToISO(date)
    const newIds = wordsByDate.get(iso) ?? []
    const repetitions = INTERVALS.flatMap<Repetition>((interval) => {
      const sourceDate = new Date(date.getTime() - interval * MS_PER_DAY)
      const sourceIso = dateToISO(sourceDate)
      const ids = wordsByDate.get(sourceIso)
      return ids ? [{ interval, ids }] : []
    })
    schedule.push({ day: i + 1, date, iso, newIds, repetitions })
  }

  return { schedule, learningDays: learningISOs.length, totalDays }
}

export const getDayDeckIds = (day: number, schedule: DaySchedule[]): number[] => {
  const entry = schedule.find((item) => item.day === day)
  if (!entry) return []
  return [...entry.newIds, ...entry.repetitions.flatMap((rep) => rep.ids)]
}

export const findCurrentDay = (
  schedule: DaySchedule[],
  now: Date = new Date(),
): number => {
  const today = dateToISO(now)
  const entry = schedule.find((item) => item.iso === today)
  return entry?.day ?? 0
}

export const getStatusIds = (words: Word[], status: Word['status']): number[] =>
  words.filter((word) => word.status === status).map((word) => word.id)
