import { routes } from '@shared/config'
import {
  BookOpen,
  CalendarDays,
  Clock,
  Languages,
  Library,
  Puzzle,
  Sparkles,
  SquareStack,
} from 'lucide-vue-next'
import type { Component } from 'vue'

export type NavItem = {
  label: string
  to: string
  icon: Component
}

export const navItems: NavItem[] = [
  { label: 'Карточки', to: routes.cards, icon: SquareStack },
  { label: 'План', to: routes.plan, icon: CalendarDays },
  { label: 'Конструктор', to: routes.builder, icon: Puzzle },
  { label: 'Таблица времён', to: routes.tenses, icon: Clock },
  { label: 'Неправильные глаголы', to: routes.irregularVerbs, icon: Languages },
  { label: 'Все слова', to: routes.allWords, icon: Library },
  { label: 'Дикий шарик', to: routes.game, icon: Sparkles },
]

export const bottomNavItems: NavItem[] = [
  { label: 'Инструкции', to: routes.instructions, icon: BookOpen },
]
