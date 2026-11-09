(function() {
  'use strict';

  var baseUrl = window.QUIZ_BASE_URL || './';
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
  var quizBackLink = document.getElementById('quiz-back-link');
  var quizCategoryPill = document.getElementById('quiz-category-pill');
  var quizTimePill = document.getElementById('quiz-time-pill');
  var quizTitle = document.getElementById('quiz-title');
  var quizSubtitle = document.getElementById('quiz-subtitle');
  var quizCoverWrapper = document.getElementById('quiz-cover-wrapper');
  var quizCoverImg = document.getElementById('quiz-cover-img');
  var quizLangNotice = document.getElementById('quiz-lang-notice');

  var progressText = document.getElementById('quiz-progress-text');
  var progressPercent = document.getElementById('quiz-progress-percent');
  var progressFill = document.getElementById('quiz-progress-fill');
  var progressBar = document.getElementById('quiz-progress-bar');

  var questionCard = document.getElementById('quiz-question-card');
  var questionEyebrow = document.getElementById('question-eyebrow');
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
  var traitBreakdownTitle = document.getElementById('trait-breakdown-title');
  var traitBarsContainer = document.getElementById('trait-bars-container');

  var btnWhatsapp = document.getElementById('btn-share-whatsapp');
  var btnWhatsappText = document.getElementById('btn-whatsapp-text');
  var btnCopy = document.getElementById('btn-copy-link');
  var btnCopyText = document.getElementById('btn-copy-text');
  var btnRestart = document.getElementById('btn-restart-quiz');
  var btnRestartText = document.getElementById('btn-restart-text');
  var copyFeedback = document.getElementById('copy-feedback');

  function calculateEstMinutes(questionCount) {
    if (questionCount <= 3) return 1;
    if (questionCount <= 7) return 2;
    if (questionCount <= 12) return 3;
    return Math.ceil(questionCount * 0.35);
  }

  function getUI(lang) {
    var i18n = window.SITE_I18N || {};
    return i18n[lang] || i18n.pt || {
      back_to_catalog: '← Todos os testes',
      step_label: 'Questão',
      of: 'de',
      questions_label: 'questões',
      completed: 'Avaliação Concluída',
      celebration: 'Perfil Psicológico Revelado',
      breakdown_title: 'Distribuição dos Seus Traços',
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
      .catch(function() {
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
                ? 'This assessment is not available in English yet. Displaying in Portuguese.'
                : 'Esta avaliação ainda não está disponível no idioma selecionado.';
              quizLangNotice.style.display = 'block';
            }
            return fallbackData;
          });
      });
  }

  function updateHeader() {
    if (!quizData) return;
    var ui = getUI(currentLang);

    if (quizBackLink) quizBackLink.textContent = ui.back_to_catalog || '← Todos os testes';
    if (quizTitle) quizTitle.textContent = quizData.title || '';
    if (quizSubtitle) quizSubtitle.textContent = quizData.subtitle || '';
    if (quizCategoryPill) quizCategoryPill.textContent = quizData.category || 'Personalidade';

    var total = (quizData.questions || []).length;
    var estMinutes = calculateEstMinutes(total);
    if (quizTimePill) quizTimePill.textContent = '⏱ ~' + estMinutes + ' min';

    if (quizData.cover && quizCoverImg && quizCoverWrapper) {
      quizCoverImg.src = baseUrl + quizData.cover;
      quizCoverWrapper.style.display = 'block';
    }

    if (btnCopyText) btnCopyText.textContent = ui.copy_link || 'Copiar Link';
    if (btnWhatsappText) btnWhatsappText.textContent = ui.share_whatsapp || 'WhatsApp';
    if (btnRestartText) btnRestartText.textContent = ui.retake_quiz || 'Refazer Teste';
    if (resultCelebration) resultCelebration.textContent = ui.celebration || 'Perfil Psicológico Revelado';
    if (traitBreakdownTitle) traitBreakdownTitle.textContent = ui.breakdown_title || 'Distribuição dos Seus Traços';
    if (copyFeedback) copyFeedback.textContent = ui.copied_success || 'Link copiado com sucesso!';
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

    if (questionEyebrow) {
      questionEyebrow.textContent = (ui.step_label || 'QUESTÃO') + ' ' + (currentNum < 10 ? '0' + currentNum : currentNum);
    }

    if (progressText) {
      progressText.innerHTML = (ui.step_label || 'Questão') + ' <span class="tabular-nums">' + (currentNum < 10 ? '0' + currentNum : currentNum) + '</span> ' + (ui.of || 'de') + ' <span class="tabular-nums">' + (totalQuestions < 10 ? '0' + totalQuestions : totalQuestions) + '</span>';
    }
    if (progressPercent) {
      progressPercent.innerHTML = '<span class="tabular-nums">' + pct + '%</span>';
    }
    if (progressFill) {
      progressFill.style.width = pct + '%';
    }
    if (progressBar) {
      progressBar.setAttribute('aria-valuenow', pct);
    }

    if (q.image) {
      questionImg.src = baseUrl + q.image;
      questionImgWrapper.style.display = 'block';
    } else {
      questionImgWrapper.style.display = 'none';
    }

    questionTitle.textContent = q.text || '';

    var hasImages = q.options && q.options.some(function(opt) { return !!opt.image; });
    optionsList.className = hasImages ? 'options-container options-grid-visual' : 'options-container options-list-vertical';
    optionsList.innerHTML = '';

    (q.options || []).forEach(function(opt, optIndex) {
      var btn = document.createElement('button');
      btn.className = 'option-btn' + (opt.image ? ' has-image' : '');
      btn.type = 'button';
      btn.setAttribute('data-index', optIndex);
      btn.setAttribute('data-key', String.fromCharCode(65 + optIndex));

      var inner = '';
      if (opt.image) {
        inner += '<div class="opt-img-box"><img src="' + baseUrl + opt.image + '" alt="Opção ' + String.fromCharCode(65 + optIndex) + '"></div>';
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

    if (resultType) {
      scores[resultType] = (scores[resultType] || 0) + 1;
    }

    setTimeout(function() {
      currentIndex++;
      var questions = (quizData && quizData.questions) ? quizData.questions : [];
      if (currentIndex < questions.length) {
        renderQuestion(currentIndex);
      } else {
        showResults();
      }
    }, 200);
  }

  // Keyboard shortcut listener for options (A, B, C, D or 1, 2, 3, 4)
  window.addEventListener('keydown', function(e) {
    if (isFinished || !questionCard || questionCard.style.display === 'none') return;
    
    var key = e.key.toUpperCase();
    var optIndex = -1;

    if (key === 'A' || key === '1') optIndex = 0;
    else if (key === 'B' || key === '2') optIndex = 1;
    else if (key === 'C' || key === '3') optIndex = 2;
    else if (key === 'D' || key === '4') optIndex = 3;

    if (optIndex !== -1) {
      var buttons = optionsList.querySelectorAll('.option-btn');
      if (buttons[optIndex] && !buttons[optIndex].classList.contains('disabled')) {
        e.preventDefault();
        buttons[optIndex].click();
      }
    }
  });

  function showResults() {
    isFinished = true;
    var ui = getUI(currentLang);
    var results = (quizData && quizData.results) ? quizData.results : {};
    var questions = (quizData && quizData.questions) ? quizData.questions : [];
    var totalQuestions = questions.length || 1;

    if (progressText) progressText.innerHTML = ui.completed || 'Avaliação Concluída';
    if (progressPercent) progressPercent.innerHTML = '<span class="tabular-nums">100%</span>';
    if (progressFill) progressFill.style.width = '100%';
    if (progressBar) progressBar.setAttribute('aria-valuenow', 100);

    // Calculate winning archetype
    if (!winningKey) {
      var maxScore = -1;
      var topKeys = [];
      for (var key in scores) {
        if (scores[key] > maxScore) {
          maxScore = scores[key];
          topKeys = [key];
        } else if (scores[key] === maxScore) {
          topKeys.push(key);
        }
      }
      winningKey = topKeys.length > 0 ? topKeys[0] : Object.keys(results)[0];
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

    // Render Trait Breakdown Bars
    if (traitBarsContainer) {
      traitBarsContainer.innerHTML = '';
      var totalAnswered = 0;
      for (var sk in scores) {
        totalAnswered += scores[sk];
      }
      if (totalAnswered === 0) totalAnswered = totalQuestions;

      for (var rk in results) {
        var rItem = results[rk];
        var count = scores[rk] || 0;
        var percentage = Math.round((count / totalAnswered) * 100);

        var barRow = document.createElement('div');
        barRow.className = 'trait-bar-row';
        barRow.innerHTML = '<div class="trait-bar-info">' +
          '<span class="trait-name">' + (rItem.badge ? rItem.badge + ' ' : '') + rItem.title + '</span>' +
          '<span class="trait-pct tabular-nums">' + percentage + '%</span>' +
        '</div>' +
        '<div class="trait-bar-track">' +
          '<div class="trait-bar-fill' + (rk === winningKey ? ' is-winner' : '') + '" style="width: ' + percentage + '%;"></div>' +
        '</div>';

        traitBarsContainer.appendChild(barRow);
      }
    }

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
        ? 'I took the "' + qTitle + '" assessment on Quiztide and got: ' + rTitle + '! Discover yours: ' + window.location.href
        : 'Fiz a avaliação "' + qTitle + '" no Quiztide e meu resultado foi: ' + rTitle + '! Descubra o seu: ' + window.location.href;

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

  // Reactive mid-quiz language switch
  window.addEventListener('quiztide:langchange', function(e) {
    var newLang = e.detail.lang || 'pt';
    loadLocale(newLang).then(function() {
      updateHeader();
      if (isFinished) {
        showResults();
      } else {
        renderQuestion(currentIndex);
      }
    });
  });

  // Start initial quiz
  initQuiz(currentLang);
})();
