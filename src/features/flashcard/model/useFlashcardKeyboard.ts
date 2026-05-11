import { useEventListener } from '@vueuse/core'

export type FlashcardKeyHandlers = {
  known: () => void
  unknown: () => void
}

const isFormTarget = (target: EventTarget | null): boolean =>
  target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement

export const useFlashcardKeyboard = (handlers: FlashcardKeyHandlers) => {
  useEventListener(window, 'keydown', (event: KeyboardEvent) => {
    if (isFormTarget(event.target)) return

    switch (event.key) {
      case 'ArrowRight':
      case 'k':
      case 'K':
        event.preventDefault()
        handlers.known()
        break
      case 'ArrowLeft':
      case 'n':
      case 'N':
        event.preventDefault()
        handlers.unknown()
        break
      default:
        break
    }
  })
}
