# Как добавить новое слово

Полный путь от появления слова до его готовности в приложении.

---

## 1. Добавь слово в основной словарь

Открой основной vocab-док:
`https://docs.google.com/document/d/1uW6W0iBGLY2hQIUv2_iQ2ZsJlFwskNj3fu5MTTIRZuY`

Допиши строку в формате:

```
en | translation | phrase | phraseTranslation
```

**Пример:**

```
forward | вперёд; передовой | move forward slowly | двигайся вперёд медленно
```

Слово сразу появится во всех страницах приложения (Карточки, Все слова и т.д.) после обновления вкладки.

---

## 2. Сгенерируй 36 предложений (12 времён × 3 формы)

Открой Claude (или другой LLM) и используй промпт:

```
Сгенерируй предложения для слова "forward" во всех 12 английских временах,
каждое в 3 формах (утверждение, отрицание, вопрос). Формат каждой строки:

tense_code | + | English sentence | Русский перевод
tense_code | - | English sentence (с отрицанием) | Русский перевод
tense_code | ? | English question | Русский перевод

Где tense_code — один из:
present_simple, present_continuous, present_perfect, present_perfect_continuous,
past_simple, past_continuous, past_perfect, past_perfect_continuous,
future_simple, future_continuous, future_perfect, future_perfect_continuous

Сложность: A1-A2, простые предложения с фразой "{phrase}".
В начале добавь строку "## forward".
```

Получишь блок вида:

```
## forward
present_simple | + | I move forward every morning. | Я иду вперёд каждое утро.
present_simple | - | I don't move forward every morning. | Я не иду вперёд каждое утро.
present_simple | ? | Do I move forward every morning? | Я иду вперёд каждое утро?
present_continuous | + | I am moving forward slowly. | Я медленно двигаюсь вперёд.
...
```

---

## 3. Создай Google Doc в папке word-доков

Открой папку с word-доками:
`https://drive.google.com/drive/folders/1CTdev5tGlmTD3hNUqYyFSP_Fd6shQRN3`

**Вручную:**

1. Внутри папки → **New** → **Google Docs**
2. Имя дока = слово (например, `forward`)
3. Вставь сгенерированный блок из шага 2
4. **Share** → **Anyone with the link** → **Viewer**
5. Скопируй doc id из URL (между `/d/` и `/edit`)

**Для пачки слов:**

Сохрани сгенерированные блоки в текстовых файлах (`forward.txt`, `appear.txt`, …),
залей их в эту папку и запусти скрипт из `local/import-to-google-docs.gs`.
Скрипт создаст по Google Doc на каждый файл и выдаст готовый блок манифеста.

---

## 4. Добавь слово в manifest doc

Открой manifest:
`https://docs.google.com/document/d/1IDcH4Y9Y82kTVjF9Dt0v2gI_jqag3T1qW1IARB9RUlU`

Допиши строку:

```
forward | <doc_id_созданного_word_дока>
```

---

## 5. Готово

Обнови вкладку приложения:

- Слово появится в селекторах **Конструктора**
- При выборе слова фронт лениво подтянет его word-док (только этот, не весь словарь)
- Можно тренировать утверждение / отрицание / вопрос во всех 12 временах

---

## Если что-то не работает

- **Слова нет в Конструкторе** → проверь, что слово есть и в vocab-доке, и в manifest-доке (с одинаковым написанием)
- **Fetch failed 401** → шаринг word-дока или manifest-дока не «Anyone with the link» — открой соответствующий док и поправь
- **Слово появилось, но без предложений** → manifest указывает на пустой/некорректный word-док, либо в word-доке не та структура (нет `## word` или формат строк нарушен)
