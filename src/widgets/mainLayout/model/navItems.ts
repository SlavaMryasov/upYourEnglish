import { routes } from '@shared/config'

export type NavItem = {
  label: string
  to: string
}

export const navItems: NavItem[] = [
  { label: 'Cards', to: routes.cards },
  { label: 'All words', to: routes.allWords },
  { label: 'Learned', to: routes.learned },
  { label: 'Unlearned', to: routes.unlearned },
]
