# 🌊 Quiztide (`quiztide.github.io`)

Interactive, ultra-fast quiz platform built with Jekyll and vanilla JavaScript.

## 🚀 How to Add a New Quiz

To add a new quiz, simply create a new Markdown file inside the `_quizzes/` folder (e.g. `_quizzes/your-quiz-name.md`):

```yaml
---
title: "Your Quiz Title"
description: "Short catchy summary of what this quiz discovers."
category: "Personality"
lang: "en"
questions:
  - question: "Your question here?"
    options:
      - text: "Option A"
        type: "result_key_1"
      - text: "Option B"
        type: "result_key_2"

results:
  result_key_1:
    badge: "👑"
    title: "The Champion"
    description: "Detailed description of the result..."
  result_key_2:
    badge: "🎨"
    title: "The Artist"
    description: "Detailed description of the result..."
---

## Optional SEO Content Below
You can add markdown articles, tips, or context below the frontmatter to boost Google SEO and AdSense compliance.
```

The site will automatically render the quiz card on the homepage, generate the interactive progress bar, calculate results, and provide the WhatsApp/social share buttons!
