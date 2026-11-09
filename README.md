# 🌊 Quiztide (`quiztide.github.io`)

Interactive, multilingual, visual quiz platform built with Jekyll and zero-dependency vanilla JavaScript.

## 📁 Scalable Architecture

Each quiz is a self-contained directory under `quizzes/`:

```text
quizzes/
  └── dominant-archetype/
      ├── index.md                 # Minimalist: only declares `layout: quiz`
      ├── resources/               # Image assets
      │   ├── cover-pt.svg         # Localized cover (if text on banner)
      │   ├── cover-en.svg         # Localized cover (if text on banner)
      │   ├── leader.svg           # Option and result graphics
      │   ├── creator.svg
      │   ├── thinker.svg
      │   └── caregiver.svg
      └── locales/                 # One standalone JSON per language
          ├── pt.json              # Portuguese (title, subtitle, localized tags, cover, questions, results)
          ├── en.json              # English (title, subtitle, localized tags, cover, questions, results)
          └── es.json              # Spanish (title, subtitle, localized tags, cover, questions, results)
```

---

## 🚀 How to Add a New Quiz

1. Create a folder: `quizzes/<your-quiz-name>/`
2. Create `quizzes/<your-quiz-name>/index.md`:
   ```markdown
   ---
   layout: quiz
   ---
   ```
3. Put images inside `resources/`.
4. Create your language files inside `locales/` (e.g. `locales/pt.json`):
   ```json
   {
     "title": "Título do Quiz",
     "subtitle": "Subtítulo explicativo",
     "category": "Personalidade",
     "tags": ["personalidade", "carreira"],
     "cover": "resources/cover-pt.svg",
     "questions": [
       {
         "text": "Pergunta número 1?",
         "image": "resources/q1.svg",
         "options": [
           { "type": "result_a", "text": "Opção A", "image": "resources/opt_a.svg" },
           { "type": "result_b", "text": "Opção B", "image": "resources/opt_b.svg" }
         ]
       }
     ],
     "results": {
       "result_a": {
         "badge": "👑",
         "image": "resources/result_a.svg",
         "title": "Nome do Resultado A",
         "description": "Descrição detalhada..."
       }
     }
   }
   ```

---

## 🌐 Dynamic Language Filtering & Switching

* **Automatic Language Discovery:** If a quiz has `locales/en.json`, it appears when the site is set to English. If it only has `locales/pt.json`, it is **automatically hidden** from the English catalog!
* **Localized Tags & Covers:** Tags (`#personality` vs `#personalidade`) and covers (`cover-en.svg` vs `cover-pt.svg`) are completely localized inside their respective JSON files.
* **Mid-Quiz Switching:** Users can switch language at any point during a quiz without losing progress or current answers.
