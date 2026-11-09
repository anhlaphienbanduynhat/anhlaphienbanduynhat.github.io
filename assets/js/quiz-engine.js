(function() {
  'use strict';

  if (!window.QUIZ_DATA) return;

  const quiz = window.QUIZ_DATA;
  let currentLang = window.CURRENT_LANG || 'pt';

  // Helper to extract localized string from nested language object
  function t(obj) {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[currentLang] || obj.pt || obj.en || obj.es || '';
  }

  function getUI() {
    const siteI18n = window.SITE_I18N || {};
    return siteI18n[currentLang] || siteI18n.pt || {
      question_of: 'Pergunta',
      of: 'de',
      completed: 'Concluído!',
      celebration: '🎉 Resultado Revelado!',
      share_whatsapp: 'Compartilhar no WhatsApp',
      copy_link: 'Copiar Link',
      copied_success: 'Link copiado com sucesso!',
      retake_quiz: 'Refazer Teste'
    };
  }

  const questions = quiz.questions || [];
  const results = quiz.results || {};
  const totalQuestions = questions.length;

  let currentIndex = 0;
  let scores = {};
  let winningKey = null;
  let isFinished = false;

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

  function updateHeader() {
    const ui = getUI();
    if (quizTitle) quizTitle.textContent = t(quiz.title);
    if (quizSubtitle) quizSubtitle.textContent = t(quiz.subtitle);
    if (quizCategory) quizCategory.textContent = t(quiz.category) || 'Quiz';
    if (quizTimeBadge) quizTimeBadge.textContent = `⏱️ ${ui.read_time || '2 min'}`;
    if (quizCountBadge) quizCountBadge.textContent = `📊 ${totalQuestions} ${ui.question_of || 'questions'}`;

    if (btnCopyText) btnCopyText.textContent = ui.copy_link;
    if (btnRestartText) btnRestartText.textContent = ui.retake_quiz;
    if (resultCelebration) resultCelebration.textContent = ui.celebration;
    if (copyFeedback) copyFeedback.textContent = ui.copied_success;
  }

  function initQuiz() {
    currentIndex = 0;
    scores = {};
    winningKey = null;
    isFinished = false;

    updateHeader();

    if (resultCard) resultCard.style.display = 'none';
    if (questionCard) questionCard.style.display = 'block';

    renderQuestion(currentIndex);
  }

  function renderQuestion(index) {
    const q = questions[index];
    if (!q) return;

    const ui = getUI();
    const currentNum = index + 1;
    const pct = Math.round((index / totalQuestions) * 100);

    progressText.textContent = `${ui.question_of} ${currentNum} ${ui.of} ${totalQuestions}`;
    progressPercent.textContent = `${pct}%`;
    progressFill.style.width = `${pct}%`;

    // Optional Question Image
    if (q.image) {
      questionImg.src = q.image;
      questionImgWrapper.style.display = 'block';
    } else {
      questionImgWrapper.style.display = 'none';
    }

    // Question Title
    questionTitle.textContent = t(q.text);

    // Render Options
    const hasImages = q.options && q.options.some(opt => !!opt.image);
    optionsList.className = hasImages ? 'options-container options-grid-visual' : 'options-container options-list-vertical';
    optionsList.innerHTML = '';

    q.options.forEach((opt, optIndex) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn' + (opt.image ? ' has-image' : '');
      btn.type = 'button';

      let inner = '';
      if (opt.image) {
        inner += `<div class="opt-img-box"><img src="${opt.image}" alt="Option ${optIndex + 1}"></div>`;
      }
      inner += `<div class="opt-content">
        <span class="option-marker">${String.fromCharCode(65 + optIndex)}</span>
        <span class="option-text">${t(opt.text)}</span>
      </div>`;

      btn.innerHTML = inner;
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
    isFinished = true;
    const ui = getUI();

    progressText.textContent = ui.completed;
    progressPercent.textContent = `100%`;
    progressFill.style.width = `100%`;

    if (!winningKey) {
      let maxScore = -1;
      winningKey = Object.keys(results)[0];
      for (const key in scores) {
        if (scores[key] > maxScore) {
          maxScore = scores[key];
          winningKey = key;
        }
      }
    }

    const winner = results[winningKey] || Object.values(results)[0];

    questionCard.style.display = 'none';
    resultCard.style.display = 'block';

    if (winner.image) {
      resultImg.src = winner.image;
      resultImgWrapper.style.display = 'block';
    } else {
      resultImgWrapper.style.display = 'none';
    }

    resultBadge.textContent = winner.badge || '🌊';
    resultTitle.textContent = t(winner.title);
    resultDesc.textContent = t(winner.description);

    resultCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // Social Share Handlers
  if (btnWhatsapp) {
    btnWhatsapp.addEventListener('click', function() {
      const winner = results[winningKey] || Object.values(results)[0];
      if (!winner) return;
      const qTitle = t(quiz.title);
      const rTitle = t(winner.title);
      const shareText = `Fiz o teste "${qTitle}" no Quiztide e meu resultado foi: ${rTitle}! Descubra o seu: ${quiz.url}`;
      const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
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

  // Language Change Listener (Maintains Quiz State Mid-Quiz!)
  window.addEventListener('quiztide:langchange', function(e) {
    currentLang = e.detail.lang || 'pt';
    updateHeader();
    if (isFinished) {
      showResults(); // refresh result card in new language
    } else {
      renderQuestion(currentIndex); // refresh active question in new language
    }
  });

  // Launch initial state
  initQuiz();
})();
