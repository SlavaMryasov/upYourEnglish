import { routes } from '@shared/config'

export type NavItem = {
  label: string
  to: string
}

export const navItems: NavItem[] = [
  { label: 'Карточки', to: routes.cards },
  { label: 'План', to: routes.plan },
  { label: 'Конструктор', to: routes.builder },
  { label: 'Таблица времён', to: routes.tenses },
  { label: 'Выученные', to: routes.learned },
  { label: 'Невыученные', to: routes.unlearned },
  { label: 'Все слова', to: routes.allWords },
  { label: 'Дикий шарик', to: routes.game },
]
