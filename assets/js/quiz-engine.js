(function() {
  'use strict';

  var baseUrl = window.QUIZ_BASE_URL || './';
  // Ensure trailing slash
  if (baseUrl.charAt(baseUrl.length - 1) !== '/') {
    baseUrl += '/';
  }

  var currentLang = window.CURRENT_LANG || 'pt';
  var quizData = null;
  var currentIndex = 0;
  var scores = {};
  var winningKey = null;
  var isFinished = false;

  // DOM Elements
  var quizTitle = document.getElementById('quiz-title');
  var quizSubtitle = document.getElementById('quiz-subtitle');
  var quizCategory = document.getElementById('quiz-category');
  var quizTimeBadge = document.getElementById('quiz-time-badge');
  var quizCountBadge = document.getElementById('quiz-count-badge');
  var quizCoverWrapper = document.getElementById('quiz-cover-wrapper');
  var quizCoverImg = document.getElementById('quiz-cover-img');
  var quizTagsWrapper = document.getElementById('quiz-tags-wrapper');
  var quizLangNotice = document.getElementById('quiz-lang-notice');

  var progressText = document.getElementById('quiz-progress-text');
  var progressPercent = document.getElementById('quiz-progress-percent');
  var progressFill = document.getElementById('quiz-progress-fill');

  var questionCard = document.getElementById('quiz-question-card');
  var questionImgWrapper = document.getElementById('quiz-question-img-wrapper');
  var questionImg = document.getElementById('quiz-question-img');
  var questionTitle = document.getElementById('quiz-question-title');
  var optionsList = document.getElementById('quiz-options-list');

  var resultCard = document.getElementById('quiz-result-card');
  var resultCelebration = document.getElementById('result-celebration');
  var resultImgWrapper = document.getElementById('result-img-wrapper');
  var resultImg = document.getElementById('result-img');
  var resultBadge = document.getElementById('result-badge');
  var resultTitle = document.getElementById('result-title');
  var resultDesc = document.getElementById('result-description');

  var btnWhatsapp = document.getElementById('btn-share-whatsapp');
  var btnCopy = document.getElementById('btn-copy-link');
  var btnCopyText = document.getElementById('btn-copy-text');
  var btnRestart = document.getElementById('btn-restart-quiz');
  var btnRestartText = document.getElementById('btn-restart-text');
  var copyFeedback = document.getElementById('copy-feedback');

  function getUI(lang) {
    var i18n = window.SITE_I18N || {};
    return i18n[lang] || i18n.pt || {
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

  function loadLocale(targetLang) {
    var url = baseUrl + 'locales/' + targetLang + '.json';

    return fetch(url)
      .then(function(res) {
        if (!res.ok) throw new Error('Locale not found: ' + targetLang);
        return res.json();
      })
      .then(function(data) {
        currentLang = targetLang;
        quizData = data;
        if (quizLangNotice) quizLangNotice.style.display = 'none';
        return data;
      })
      .catch(function(err) {
        // Fallback to pt or en if requested lang is missing
        var fallbackLang = targetLang === 'pt' ? 'en' : 'pt';
        var fallbackUrl = baseUrl + 'locales/' + fallbackLang + '.json';

        return fetch(fallbackUrl)
          .then(function(res) {
            if (!res.ok) throw new Error('Fallback failed');
            return res.json();
          })
          .then(function(fallbackData) {
            currentLang = fallbackLang;
            quizData = fallbackData;
            if (quizLangNotice) {
              quizLangNotice.textContent = targetLang === 'en' 
                ? 'This quiz is not available in English yet. Displaying in Portuguese.'
                : 'Este quiz ainda não está disponível no idioma selecionado.';
              quizLangNotice.style.display = 'block';
            }
            return fallbackData;
          });
      });
  }

  function updateHeader() {
    if (!quizData) return;
    var ui = getUI(currentLang);

    if (quizTitle) quizTitle.textContent = quizData.title || '';
    if (quizSubtitle) quizSubtitle.textContent = quizData.subtitle || '';
    if (quizCategory) quizCategory.textContent = quizData.category || 'Quiz';

    var total = (quizData.questions || []).length;
    if (quizTimeBadge) quizTimeBadge.textContent = '⏱️ ' + (quizData.time || '2 min');
    if (quizCountBadge) quizCountBadge.textContent = '📊 ' + total + ' ' + (ui.question_of || 'questions');

    // Localized Cover Image
    if (quizData.cover && quizCoverImg && quizCoverWrapper) {
      quizCoverImg.src = baseUrl + quizData.cover;
      quizCoverWrapper.style.display = 'block';
    }

    // Localized Tags
    if (quizTagsWrapper && quizData.tags) {
      quizTagsWrapper.innerHTML = quizData.tags.map(function(tag) {
        return '<span class="quiz-tag-pill">#' + tag + '</span>';
      }).join('');
    }

    if (btnCopyText) btnCopyText.textContent = ui.copy_link;
    if (btnRestartText) btnRestartText.textContent = ui.retake_quiz;
    if (resultCelebration) resultCelebration.textContent = ui.celebration;
    if (copyFeedback) copyFeedback.textContent = ui.copied_success;
  }

  function renderQuestion(index) {
    if (!quizData || !quizData.questions) return;
    var questions = quizData.questions;
    var totalQuestions = questions.length;
    var q = questions[index];
    if (!q) return;

    var ui = getUI(currentLang);
    var currentNum = index + 1;
    var pct = Math.round((index / totalQuestions) * 100);

    progressText.textContent = (ui.question_of || 'Question') + ' ' + currentNum + ' ' + (ui.of || 'of') + ' ' + totalQuestions;
    progressPercent.textContent = pct + '%';
    progressFill.style.width = pct + '%';

    // Optional Question Image
    if (q.image) {
      questionImg.src = baseUrl + q.image;
      questionImgWrapper.style.display = 'block';
    } else {
      questionImgWrapper.style.display = 'none';
    }

    // Question Title
    questionTitle.textContent = q.text || '';

    // Render Options
    var hasImages = q.options && q.options.some(function(opt) { return !!opt.image; });
    optionsList.className = hasImages ? 'options-container options-grid-visual' : 'options-container options-list-vertical';
    optionsList.innerHTML = '';

    (q.options || []).forEach(function(opt, optIndex) {
      var btn = document.createElement('button');
      btn.className = 'option-btn' + (opt.image ? ' has-image' : '');
      btn.type = 'button';

      var inner = '';
      if (opt.image) {
        inner += '<div class="opt-img-box"><img src="' + baseUrl + opt.image + '" alt="Option ' + (optIndex + 1) + '"></div>';
      }
      inner += '<div class="opt-content">' +
        '<span class="option-marker">' + String.fromCharCode(65 + optIndex) + '</span>' +
        '<span class="option-text">' + opt.text + '</span>' +
      '</div>';

      btn.innerHTML = inner;
      btn.addEventListener('click', function() {
        handleOptionSelect(btn, opt.type);
      });

      optionsList.appendChild(btn);
    });
  }

  function handleOptionSelect(btnElement, resultType) {
    var allBtns = optionsList.querySelectorAll('.option-btn');
    allBtns.forEach(function(b) { b.classList.add('disabled'); });
    btnElement.classList.add('selected');

    scores[resultType] = (scores[resultType] || 0) + 1;

    setTimeout(function() {
      currentIndex++;
      var questions = (quizData && quizData.questions) ? quizData.questions : [];
      if (currentIndex < questions.length) {
        renderQuestion(currentIndex);
      } else {
        showResults();
      }
    }, 280);
  }

  function showResults() {
    isFinished = true;
    var ui = getUI(currentLang);
    var results = (quizData && quizData.results) ? quizData.results : {};

    progressText.textContent = ui.completed;
    progressPercent.textContent = '100%';
    progressFill.style.width = '100%';

    if (!winningKey) {
      var maxScore = -1;
      winningKey = Object.keys(results)[0];
      for (var key in scores) {
        if (scores[key] > maxScore) {
          maxScore = scores[key];
          winningKey = key;
        }
      }
    }

    var winner = results[winningKey] || Object.values(results)[0];
    if (!winner) return;

    questionCard.style.display = 'none';
    resultCard.style.display = 'block';

    if (winner.image) {
      resultImg.src = baseUrl + winner.image;
      resultImgWrapper.style.display = 'block';
    } else {
      resultImgWrapper.style.display = 'none';
    }

    resultBadge.textContent = winner.badge || '🌊';
    resultTitle.textContent = winner.title || '';
    resultDesc.textContent = winner.description || '';

    resultCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function initQuiz(targetLang) {
    currentIndex = 0;
    scores = {};
    winningKey = null;
    isFinished = false;

    if (resultCard) resultCard.style.display = 'none';
    if (questionCard) questionCard.style.display = 'block';

    loadLocale(targetLang || currentLang).then(function() {
      updateHeader();
      renderQuestion(currentIndex);
    });
  }

  // Social Share Handlers
  if (btnWhatsapp) {
    btnWhatsapp.addEventListener('click', function() {
      if (!quizData) return;
      var results = quizData.results || {};
      var winner = results[winningKey] || Object.values(results)[0];
      if (!winner) return;

      var qTitle = quizData.title || '';
      var rTitle = winner.title || '';
      var shareText = currentLang === 'en'
        ? 'I took the "' + qTitle + '" quiz on Quiztide and got: ' + rTitle + '! Check yours here: ' + window.location.href
        : 'Fiz o quiz "' + qTitle + '" no Quiztide e meu resultado foi: ' + rTitle + '! Descubra o seu: ' + window.location.href;

      var url = 'https://api.whatsapp.com/send?text=' + encodeURIComponent(shareText);
      window.open(url, '_blank');
    });
  }

  if (btnCopy) {
    btnCopy.addEventListener('click', function() {
      navigator.clipboard.writeText(window.location.href).then(function() {
        if (copyFeedback) {
          copyFeedback.style.display = 'block';
          setTimeout(function() { copyFeedback.style.display = 'none'; }, 2500);
        }
      });
    });
  }

  if (btnRestart) {
    btnRestart.addEventListener('click', function() {
      initQuiz(currentLang);
    });
  }

  // Language Change Listener: Seamless Mid-Quiz Switch!
  window.addEventListener('quiztide:langchange', function(e) {
    var newLang = e.detail.lang || 'pt';
    loadLocale(newLang).then(function() {
      updateHeader();
      if (isFinished) {
        showResults(); // refresh result card in new language
      } else {
        renderQuestion(currentIndex); // refresh question & options in new language! Progress preserved!
      }
    });
  });

  // Start initial quiz
  initQuiz(currentLang);
})();
