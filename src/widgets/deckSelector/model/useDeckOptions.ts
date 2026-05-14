import { type DeckMode, useDeckStore } from '@features/deck'
import { useVocabQuery } from '@shared/api'
import { buildSchedule, findCurrentDay } from '@shared/lib'
import { computed } from 'vue'

export type DeckOption = { value: string; label: string; mode: DeckMode }

const fmt = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'short',
  weekday: 'short',
})

export const useDeckOptions = () => {
  const { state } = useVocabQuery()
  const deck = useDeckStore()

  const words = computed(() => state.value.data ?? [])
  const schedule = computed(() => (words.value.length > 0 ? buildSchedule(words.value) : null))
  const currentDay = computed(() =>
    schedule.value ? findCurrentDay(schedule.value.schedule) : 0,
  )

  const options = computed<DeckOption[]>(() => {
    const list: DeckOption[] = [
      { value: 'custom', label: 'Свободное повторение', mode: { kind: 'custom', ids: [] } },
    ]
    if (!schedule.value) {
      list.unshift({ value: 'today', label: 'Сегодня', mode: { kind: 'today' } })
      return list
    }

    let todayInserted = false

    schedule.value.schedule.forEach((daySchedule) => {
      const isToday = daySchedule.day === currentDay.value
      const newCount = daySchedule.newIds.length
      const repCount = daySchedule.repetitions.reduce((sum, rep) => sum + rep.ids.length, 0)

      if (isToday) {
        const parts = ['Сегодня']
        if (newCount > 0) parts.push(`+${newCount} нов`)
        if (repCount > 0) parts.push(`${repCount} повт`)
        list.push({ value: 'today', label: parts.join(' · '), mode: { kind: 'today' } })
        todayInserted = true
        return
      }

      if (newCount === 0 && repCount === 0) return

      const parts = [fmt.format(daySchedule.date)]
      if (newCount > 0) parts.push(`+${newCount} нов`)
      if (repCount > 0) parts.push(`${repCount} повт`)

      list.push({
        value: `day-${daySchedule.day}`,
        label: parts.join(' · '),
        mode: { kind: 'day', day: daySchedule.day },
      })
    })

    if (!todayInserted) {
      list.unshift({ value: 'today', label: 'Сегодня', mode: { kind: 'today' } })
    }

    return list
  })

  const selectedValue = computed({
    get: () => {
      if (deck.mode.kind === 'today') return 'today'
      if (deck.mode.kind === 'day') return `day-${deck.mode.day}`
      if (deck.mode.kind === 'custom') return 'custom'
      return 'today'
    },
    set: (value: string | number | undefined) => {
      const option = options.value.find((item) => item.value === value)
      if (option) deck.setMode(option.mode)
    },
  })

  return { options, selectedValue }
}
