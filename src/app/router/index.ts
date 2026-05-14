import {
  AllWordsPage,
  BuilderPage,
  CardsPage,
  GamePage,
  InstructionsPage,
  IrregularVerbsPage,
  MatchPage,
  NotFoundPage,
  PlanPage,
  TensesPage,
} from '@pages/index'
import { routes } from '@shared/config'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const LAST_ROUTE_KEY = 'upYourEnglish:lastRoute'

const readLastRoute = (): string | null => {
  if (typeof localStorage === 'undefined') return null
  try {
    return localStorage.getItem(LAST_ROUTE_KEY)
  } catch {
    return null
  }
}

const writeLastRoute = (path: string) => {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(LAST_ROUTE_KEY, path)
  } catch {
    // ignore (private mode, quota)
  }
}

const routeRecords: RouteRecordRaw[] = [
  { path: routes.root, redirect: () => readLastRoute() ?? routes.cards },
  { path: routes.cards, component: CardsPage },
  { path: routes.plan, component: PlanPage },
  { path: routes.builder, component: BuilderPage },
  { path: routes.tenses, component: TensesPage },
  { path: routes.game, component: GamePage },
  { path: routes.allWords, component: AllWordsPage },
  { path: routes.irregularVerbs, component: IrregularVerbsPage },
  { path: routes.match, component: MatchPage },
  { path: routes.instructions, component: InstructionsPage },
  { path: '/:pathMatch(.*)*', component: NotFoundPage },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routeRecords,
})

let isInitialNavigation = true

router.beforeEach((to) => {
  if (!isInitialNavigation) return
  isInitialNavigation = false
  const last = readLastRoute()
  if (!last || last === to.fullPath) return
  return last
})

router.afterEach((to) => {
  if (to.path && to.path !== routes.root) writeLastRoute(to.fullPath)
})
