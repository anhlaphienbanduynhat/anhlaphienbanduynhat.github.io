# 🌊 Quiztide (`quiztide.github.io`)

Interactive, multilingual, visual quiz platform built with Jekyll and zero-dependency vanilla JavaScript.

## 📁 Architecture & Folder Structure

Each quiz lives inside its own self-contained folder under `quizzes/`:

```text
quizzes/
  └── dominant-archetype/          # Quiz slug folder
      ├── index.md                 # Single multilingual quiz definition
      └── resources/               # All images and assets for this quiz
          ├── cover.svg            # Optional cover banner
          ├── leader.svg           # Option / result image
          ├── creator.svg
          ├── thinker.svg
          └── caregiver.svg
```

---

## 🚀 How to Add a New Quiz

To add a new quiz, simply create a new folder under `quizzes/<your-slug>/` with an `index.md` file:

```yaml
---
layout: quiz
slug: "your-quiz-slug"
cover_image: "resources/cover.svg"       # Optional quiz banner image
tags: ["personality", "career", "fun"]    # Tags for search and filtering
default_lang: "pt"

i18n:
  pt:
    title: "Título do Quiz em Português"
    subtitle: "Subtítulo explicativo"
    category: "Personalidade"
    time: "2 min"
    questions:
      - question: "Pergunta número 1?"
        image: "resources/question1.webp" # Optional question image
        options:
          - text: "Opção A"
            type: "result_a"
            image: "resources/opt_a.webp" # Optional option image
          - text: "Opção B"
            type: "result_b"
            image: "resources/opt_b.webp"
    results:
      result_a:
        badge: "👑"
        title: "Nome do Resultado A"
        image: "resources/result_a.webp"  # Optional result image
        description: "Descrição detalhada do resultado..."
      result_b:
        badge: "🎨"
        title: "Nome do Resultado B"
        image: "resources/result_b.webp"
        description: "Descrição detalhada do resultado..."

  en:
    title: "Quiz Title in English"
    subtitle: "English subtitle"
    category: "Personality"
    time: "2 min"
    questions:
      - question: "Question number 1?"
        options:
          - text: "Option A"
            type: "result_a"
            image: "resources/opt_a.webp"
          - text: "Option B"
            type: "result_b"
            image: "resources/opt_b.webp"
    results:
      result_a:
        badge: "👑"
        title: "Result A Title"
        image: "resources/result_a.webp"
        description: "Detailed description in English..."
      result_b:
        badge: "🎨"
        title: "Result B Title"
        image: "resources/result_b.webp"
        description: "Detailed description in English..."
---
```

### ✨ Built-in Features:
1. **Multilingual Switcher (`PT | EN | ES`):** Seamless instant toggling in the header. The quiz questions, options, and results switch immediately without reloading.
2. **Visual Options & Results:** If you provide `image: "resources/..."` on options, they automatically display in a responsive image-card grid.
3. **Live Search & Tags:** Homepage features instant keyword search and tag filtering.
4. **Viral Social Sharing:** Native WhatsApp and Copy Link buttons with pre-formatted localized result text.
