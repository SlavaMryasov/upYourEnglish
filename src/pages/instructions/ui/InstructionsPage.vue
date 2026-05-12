<script setup lang="ts">
import { PageInfo } from '@shared/ui'

const VOCAB_URL =
  'https://docs.google.com/document/d/1uW6W0iBGLY2hQIUv2_iQ2ZsJlFwskNj3fu5MTTIRZuY'

const WORDS_FOLDER_URL =
  'https://drive.google.com/drive/folders/1CTdev5tGlmTD3hNUqYyFSP_Fd6shQRN3'

const MANIFEST_URL =
  'https://docs.google.com/document/d/1IDcH4Y9Y82kTVjF9Dt0v2gI_jqag3T1qW1IARB9RUlU'

const promptText = `Сгенерируй предложения для слова "forward" во всех 12 английских временах,
каждое в 3 формах (утверждение, отрицание, вопрос). Формат каждой строки:

tense_code | + | English sentence | Русский перевод
tense_code | - | English sentence (с отрицанием) | Русский перевод
tense_code | ? | English question | Русский перевод

Где tense_code — один из:
present_simple, present_continuous, present_perfect, present_perfect_continuous,
past_simple, past_continuous, past_perfect, past_perfect_continuous,
future_simple, future_continuous, future_perfect, future_perfect_continuous

Сложность: A1-A2, простые предложения с фразой "{phrase}".
В начале добавь строку "## forward".`

const exampleBlock = `## forward
present_simple | + | I move forward every morning. | Я иду вперёд каждое утро.
present_simple | - | I don't move forward every morning. | Я не иду вперёд каждое утро.
present_simple | ? | Do I move forward every morning? | Я иду вперёд каждое утро?
present_continuous | + | I am moving forward slowly. | Я медленно двигаюсь вперёд.
...`
</script>

<template>
  <div class="h-full overflow-auto">
    <div class="mx-auto max-w-3xl space-y-6 p-4 sm:p-6">
      <header class="flex items-start justify-between gap-3">
        <div class="space-y-1">
          <h1 class="text-2xl font-semibold">Инструкции</h1>
          <p class="text-sm text-slate-400">
            Полный путь добавления нового слова в приложение
          </p>
        </div>
        <PageInfo
          title="Инструкции"
          description="Пошаговый чеклист по добавлению новых слов: vocab doc → генерация предложений в LLM → создание word-дока в нужной папке → запись в manifest."
        />
      </header>

      <section class="space-y-3">
        <h2 class="text-lg font-semibold text-vue-400">1. Добавь слово в основной словарь</h2>
        <p class="text-sm text-slate-300">Открой vocab-док:</p>
        <a
          :href="VOCAB_URL"
          target="_blank"
          rel="noopener"
          class="block overflow-x-auto rounded-md border border-vue-500/40 bg-vue-500/10 px-3 py-2 font-mono text-xs text-vue-400 hover:bg-vue-500/20"
        >
          {{ VOCAB_URL }}
        </a>
        <p class="text-sm text-slate-300">Допиши строку в формате:</p>
        <pre class="overflow-x-auto rounded-md border border-slate-700 bg-slate-950 p-3 text-xs text-slate-200">en | translation | phrase | phraseTranslation</pre>
        <p class="text-xs text-slate-500">Пример:</p>
        <pre class="overflow-x-auto rounded-md border border-slate-700 bg-slate-950 p-3 text-xs text-slate-200">forward | вперёд; передовой | move forward slowly | двигайся вперёд медленно</pre>
        <p class="text-xs text-slate-400">
          Слово сразу появится в Карточках / Всех словах после обновления вкладки.
        </p>
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-semibold text-vue-400">2. Сгенерируй 36 предложений</h2>
        <p class="text-sm text-slate-300">
          Открой Claude (или другую LLM) и используй промпт (подставь своё слово и фразу из vocab):
        </p>
        <pre class="overflow-x-auto rounded-md border border-slate-700 bg-slate-950 p-3 text-xs whitespace-pre-wrap text-slate-200">{{ promptText }}</pre>
        <p class="text-xs text-slate-500">Должен получиться блок вида:</p>
        <pre class="overflow-x-auto rounded-md border border-slate-700 bg-slate-950 p-3 text-xs whitespace-pre-wrap text-slate-200">{{ exampleBlock }}</pre>
        <p class="text-xs text-slate-400">
          12 времён × 3 формы (<span class="font-mono">+</span> /
          <span class="font-mono">−</span> / <span class="font-mono">?</span>) = 36 строк.
        </p>
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-semibold text-vue-400">3. Создай Google Doc в папке word-доков</h2>
        <p class="text-sm text-slate-300">Открой папку:</p>
        <a
          :href="WORDS_FOLDER_URL"
          target="_blank"
          rel="noopener"
          class="block overflow-x-auto rounded-md border border-vue-500/40 bg-vue-500/10 px-3 py-2 font-mono text-xs text-vue-400 hover:bg-vue-500/20"
        >
          {{ WORDS_FOLDER_URL }}
        </a>
        <ol class="list-decimal space-y-1 pl-5 text-sm text-slate-300">
          <li>Внутри папки → <span class="font-semibold">New</span> → <span class="font-semibold">Google Docs</span></li>
          <li>Имя дока = слово (например, <code class="rounded bg-slate-800 px-1 text-vue-400">forward</code>)</li>
          <li>Вставь сгенерированный блок из шага 2</li>
          <li><span class="font-semibold">Share</span> → <span class="font-semibold">Anyone with the link</span> → <span class="font-semibold">Viewer</span></li>
          <li>Скопируй <code class="rounded bg-slate-800 px-1 text-vue-400">doc id</code> из URL (между <code class="rounded bg-slate-800 px-1 text-vue-400">/d/</code> и <code class="rounded bg-slate-800 px-1 text-vue-400">/edit</code>)</li>
        </ol>
        <p class="text-xs text-slate-400">
          <span class="font-semibold text-slate-300">Для пачки слов:</span>
          сохрани сгенерированные блоки в <code class="rounded bg-slate-800 px-1 text-vue-400">.txt</code>-файлы,
          залей их в эту папку и запусти Apps Script из
          <code class="rounded bg-slate-800 px-1 text-vue-400">local/import-to-google-docs.gs</code> —
          создаст по Google Doc на файл и выдаст готовый блок манифеста.
        </p>
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-semibold text-vue-400">4. Добавь слово в manifest</h2>
        <p class="text-sm text-slate-300">Открой manifest-док:</p>
        <a
          :href="MANIFEST_URL"
          target="_blank"
          rel="noopener"
          class="block overflow-x-auto rounded-md border border-vue-500/40 bg-vue-500/10 px-3 py-2 font-mono text-xs text-vue-400 hover:bg-vue-500/20"
        >
          {{ MANIFEST_URL }}
        </a>
        <p class="text-sm text-slate-300">Допиши строку:</p>
        <pre class="overflow-x-auto rounded-md border border-slate-700 bg-slate-950 p-3 text-xs text-slate-200">forward | &lt;doc_id_из_шага_3&gt;</pre>
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-semibold text-vue-400">5. Готово</h2>
        <ul class="list-disc space-y-1 pl-5 text-sm text-slate-300">
          <li>Обнови вкладку приложения</li>
          <li>Слово появится в селекторах Конструктора</li>
          <li>При выборе фронт лениво подтянет word-док (только его, не весь словарь)</li>
        </ul>
      </section>

      <section class="space-y-3 rounded-lg border border-slate-800 bg-slate-900/60 p-4">
        <h2 class="text-base font-semibold text-amber-400">Если что-то не работает</h2>
        <ul class="list-disc space-y-2 pl-5 text-sm text-slate-300">
          <li>
            <span class="font-semibold text-slate-200">Слова нет в Конструкторе</span> —
            проверь, что слово есть и в vocab-доке, и в manifest-доке (с одинаковым написанием).
          </li>
          <li>
            <span class="font-semibold text-slate-200">Fetch failed 401</span> —
            шаринг word-дока или manifest-дока не «Anyone with the link». Открой нужный док и поправь.
          </li>
          <li>
            <span class="font-semibold text-slate-200">Слово есть, но предложений нет</span> —
            manifest указывает на пустой/некорректный word-док, либо в нём нет
            <code class="rounded bg-slate-800 px-1 text-vue-400">## word</code> заголовка или сломан формат строк.
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
