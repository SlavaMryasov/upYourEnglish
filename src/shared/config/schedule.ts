export const COURSE_START_DATE = new Date('2026-05-11')
export const WORDS_PER_DAY = 5
export const INTERVALS = [1, 3, 7, 16, 35] as const
export const REQUIRED_STREAK_NEW = 5
export const REQUIRED_STREAK_REPEAT = 3

export const MS_PER_DAY = 1000 * 60 * 60 * 24

export const getCurrentDay = (now: Date = new Date()): number => {
  const startUtc = Date.UTC(
    COURSE_START_DATE.getFullYear(),
    COURSE_START_DATE.getMonth(),
    COURSE_START_DATE.getDate(),
  )
  const nowUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.floor((nowUtc - startUtc) / MS_PER_DAY) + 1
}
