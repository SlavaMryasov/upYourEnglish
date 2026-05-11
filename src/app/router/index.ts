import {
  AllWordsPage,
  BuilderPage,
  CardsPage,
  GamePage,
  LearnedWordsPage,
  NotFoundPage,
  PlanPage,
  UnlearnedWordsPage,
} from '@pages/index'
import { routes } from '@shared/config'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routeRecords: RouteRecordRaw[] = [
  { path: routes.root, redirect: routes.cards },
  { path: routes.cards, component: CardsPage },
  { path: routes.plan, component: PlanPage },
  { path: routes.builder, component: BuilderPage },
  { path: routes.game, component: GamePage },
  { path: routes.allWords, component: AllWordsPage },
  { path: routes.learned, component: LearnedWordsPage },
  { path: routes.unlearned, component: UnlearnedWordsPage },
  { path: '/:pathMatch(.*)*', component: NotFoundPage },
]

export const router = createRouter({
  history: createWebHistory(),
  routes: routeRecords,
})
