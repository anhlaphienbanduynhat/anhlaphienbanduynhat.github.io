(function() {
  'use strict';

  if (!window.QUIZ_DATA || !window.QUIZ_DATA.i18n) {
    return;
  }

  const quiz = window.QUIZ_DATA;
  let currentLang = window.CURRENT_LANG || 'pt';

  // UI Strings per language
  const UI_STRINGS = {
    pt: {
      questionOf: 'Pergunta',
      of: 'de',
      completed: 'Concluído!',
      celebration: '🎉 Resultado Revelado!',
      shareWhatsApp: '📲 Compartilhar no WhatsApp',
      copyLink: '📋 Copiar Link',
      copied: 'Link copiado com sucesso!',
      retake: '🔄 Refazer Teste',
      shareText: (qTitle, rTitle, url) => `Fiz o quiz "${qTitle}" no Quiztide e meu resultado foi: ${rTitle}! Descubra o seu: ${url}`
    },
    en: {
      questionOf: 'Question',
      of: 'of',
      completed: 'Completed!',
      celebration: '🎉 Result Unlocked!',
      shareWhatsApp: '📲 Share on WhatsApp',
      copyLink: '📋 Copy Link',
      copied: 'Link copied to clipboard!',
      retake: '🔄 Retake Quiz',
      shareText: (qTitle, rTitle, url) => `I took the "${qTitle}" quiz on Quiztide and my result is: ${rTitle}! Check yours: ${url}`
    },
    es: {
      questionOf: 'Pregunta',
      of: 'de',
      completed: '¡Completado!',
      celebration: '🎉 ¡Resultado Revelado!',
      shareWhatsApp: '📲 Compartir en WhatsApp',
      copyLink: '📋 Copiar Enlace',
      copied: '¡Enlace copiado con éxito!',
      retake: '🔄 Rehacer Test',
      shareText: (qTitle, rTitle, url) => `¡Hice el quiz "${qTitle}" en Quiztide y mi resultado fue: ${rTitle}! Descubre el tuyo: ${url}`
    }
  };

  function getLangData(lang) {
    if (quiz.i18n[lang]) return quiz.i18n[lang];
    if (quiz.i18n['pt']) return quiz.i18n['pt'];
    if (quiz.i18n['en']) return quiz.i18n['en'];
    return Object.values(quiz.i18n)[0];
  }

  let activeData = getLangData(currentLang);
  let questions = activeData.questions || [];
  let results = activeData.results || {};
  let totalQuestions = questions.length;

  let currentIndex = 0;
  let scores = {};
  let winningKey = null;

  // DOM Elements
  const quizTitle = document.getElementById('quiz-title');
  const quizSubtitle = document.getElementById('quiz-subtitle');
  const quizCategory = document.getElementById('quiz-category');
  const quizTimeBadge = document.getElementById('quiz-time-badge');
  const quizCountBadge = document.getElementById('quiz-count-badge');

  const progressText = document.getElementById('quiz-progress-text');
  const progressPercent = document.getElementById('quiz-progress-percent');
  const progressFill = document.getElementById('quiz-progress-fill');

  const questionCard = document.getElementById('quiz-question-card');
  const questionImgWrapper = document.getElementById('quiz-question-img-wrapper');
  const questionImg = document.getElementById('quiz-question-img');
  const questionTitle = document.getElementById('quiz-question-title');
  const optionsList = document.getElementById('quiz-options-list');

  const resultCard = document.getElementById('quiz-result-card');
  const resultCelebration = document.getElementById('result-celebration');
  const resultImgWrapper = document.getElementById('result-img-wrapper');
  const resultImg = document.getElementById('result-img');
  const resultBadge = document.getElementById('result-badge');
  const resultTitle = document.getElementById('result-title');
  const resultDesc = document.getElementById('result-description');

  const btnWhatsapp = document.getElementById('btn-share-whatsapp');
  const btnCopy = document.getElementById('btn-copy-link');
  const btnCopyText = document.getElementById('btn-copy-text');
  const btnRestart = document.getElementById('btn-restart-quiz');
  const btnRestartText = document.getElementById('btn-restart-text');
  const copyFeedback = document.getElementById('copy-feedback');

  function updateStaticHeader() {
    activeData = getLangData(currentLang);
    questions = activeData.questions || [];
    results = activeData.results || {};
    totalQuestions = questions.length;

    if (quizTitle) quizTitle.textContent = activeData.title || '';
    if (quizSubtitle) quizSubtitle.textContent = activeData.subtitle || activeData.description || '';
    if (quizCategory) quizCategory.textContent = activeData.category || 'Quiz';
    if (quizTimeBadge) quizTimeBadge.textContent = `⏱️ ${activeData.time || '2 min'}`;
    if (quizCountBadge) quizCountBadge.textContent = `📊 ${totalQuestions} questions`;

    const ui = UI_STRINGS[currentLang] || UI_STRINGS.en;
    if (btnCopyText) btnCopyText.textContent = ui.copyLink;
    if (btnRestartText) btnRestartText.textContent = ui.retake;
    if (resultCelebration) resultCelebration.textContent = ui.celebration;
    if (copyFeedback) copyFeedback.textContent = ui.copied;
  }

  function initQuiz() {
    currentIndex = 0;
    scores = {};
    winningKey = null;
    updateStaticHeader();

    if (resultCard) resultCard.style.display = 'none';
    if (questionCard) questionCard.style.display = 'block';

    renderQuestion(currentIndex);
  }

  function renderQuestion(index) {
    const q = questions[index];
    if (!q) return;

    const ui = UI_STRINGS[currentLang] || UI_STRINGS.en;
    const currentNum = index + 1;
    const pct = Math.round((index / totalQuestions) * 100);

    progressText.textContent = `${ui.questionOf} ${currentNum} ${ui.of} ${totalQuestions}`;
    progressPercent.textContent = `${pct}%`;
    progressFill.style.width = `${pct}%`;

    // Question image (optional)
    if (q.image) {
      questionImg.src = q.image;
      questionImgWrapper.style.display = 'block';
    } else {
      questionImgWrapper.style.display = 'none';
    }

    // Question title
    questionTitle.textContent = q.question;

    // Check if options have images to toggle grid layout
    const hasImages = q.options.some(opt => !!opt.image);
    optionsList.className = hasImages ? 'options-container options-grid-visual' : 'options-container options-list-vertical';
    optionsList.innerHTML = '';

    q.options.forEach((opt, optIndex) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn' + (opt.image ? ' has-image' : '');
      btn.type = 'button';

      let innerHtml = '';
      if (opt.image) {
        innerHtml += `<div class="opt-img-box"><img src="${opt.image}" alt="Option ${optIndex + 1}"></div>`;
      }
      innerHtml += `<div class="opt-content">
        <span class="option-marker">${String.fromCharCode(65 + optIndex)}</span>
        <span class="option-text">${opt.text}</span>
      </div>`;

      btn.innerHTML = innerHtml;
      btn.addEventListener('click', function() {
        handleOptionSelect(btn, opt.type);
      });

      optionsList.appendChild(btn);
    });
  }

  function handleOptionSelect(btnElement, resultType) {
    const allBtns = optionsList.querySelectorAll('.option-btn');
    allBtns.forEach(b => b.classList.add('disabled'));
    btnElement.classList.add('selected');

    scores[resultType] = (scores[resultType] || 0) + 1;

    setTimeout(() => {
      currentIndex++;
      if (currentIndex < totalQuestions) {
        renderQuestion(currentIndex);
      } else {
        showResults();
      }
    }, 280);
  }

  function showResults() {
    const ui = UI_STRINGS[currentLang] || UI_STRINGS.en;
    progressText.textContent = ui.completed;
    progressPercent.textContent = `100%`;
    progressFill.style.width = `100%`;

    let maxScore = -1;
    winningKey = Object.keys(results)[0];

    for (const key in scores) {
      if (scores[key] > maxScore) {
        maxScore = scores[key];
        winningKey = key;
      }
    }

    const winner = results[winningKey] || Object.values(results)[0];

    questionCard.style.display = 'none';
    resultCard.style.display = 'block';

    // Result image (optional)
    if (winner.image) {
      resultImg.src = winner.image;
      resultImgWrapper.style.display = 'block';
    } else {
      resultImgWrapper.style.display = 'none';
    }

    resultBadge.textContent = winner.badge || '🌊';
    resultTitle.textContent = winner.title || 'Result';
    resultDesc.textContent = winner.description || '';

    resultCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // Social Share Handlers
  if (btnWhatsapp) {
    btnWhatsapp.addEventListener('click', function() {
      const winner = results[winningKey] || Object.values(results)[0];
      if (!winner) return;
      const ui = UI_STRINGS[currentLang] || UI_STRINGS.en;
      const text = ui.shareText(activeData.title, winner.title, quiz.url);
      const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    });
  }

  if (btnCopy) {
    btnCopy.addEventListener('click', function() {
      navigator.clipboard.writeText(quiz.url).then(() => {
        if (copyFeedback) {
          copyFeedback.style.display = 'block';
          setTimeout(() => { copyFeedback.style.display = 'none'; }, 2500);
        }
      });
    });
  }

  if (btnRestart) {
    btnRestart.addEventListener('click', function() {
      initQuiz();
    });
  }

  // Listen to Global Language Switcher
  window.addEventListener('quiztide:langchange', function(e) {
    currentLang = e.detail.lang || 'pt';
    updateStaticHeader();
    if (resultCard && resultCard.style.display === 'block') {
      showResults(); // refresh result texts in new language
    } else {
      renderQuestion(currentIndex); // refresh question texts in new language
    }
  });

  // Start Quiz
  initQuiz();
})();
