(function() {
  'use strict';

  if (!window.QUIZ_DATA || !window.QUIZ_DATA.questions || !window.QUIZ_DATA.results) {
    return;
  }

  const data = window.QUIZ_DATA;
  const questions = data.questions;
  const results = data.results;
  const totalQuestions = questions.length;

  let currentIndex = 0;
  let scores = {};

  // Elements
  const progressText = document.getElementById('quiz-progress-text');
  const progressPercent = document.getElementById('quiz-progress-percent');
  const progressFill = document.getElementById('quiz-progress-fill');
  const questionCard = document.getElementById('quiz-question-card');
  const questionTitle = document.getElementById('quiz-question-title');
  const optionsList = document.getElementById('quiz-options-list');
  const resultCard = document.getElementById('quiz-result-card');
  const resultBadge = document.getElementById('result-badge');
  const resultTitle = document.getElementById('result-title');
  const resultDesc = document.getElementById('result-description');
  const btnWhatsapp = document.getElementById('btn-share-whatsapp');
  const btnCopy = document.getElementById('btn-copy-link');
  const btnRestart = document.getElementById('btn-restart-quiz');
  const copyFeedback = document.getElementById('copy-feedback');

  let winningResult = null;

  function initQuiz() {
    currentIndex = 0;
    scores = {};
    resultCard.style.display = 'none';
    questionCard.style.display = 'block';
    renderQuestion(currentIndex);
  }

  function renderQuestion(index) {
    const q = questions[index];
    if (!q) return;

    // Progress updates
    const currentNum = index + 1;
    const pct = Math.round((index / totalQuestions) * 100);
    progressText.textContent = `Question ${currentNum} of ${totalQuestions}`;
    progressPercent.textContent = `${pct}%`;
    progressFill.style.width = `${pct}%`;

    // Question title
    questionTitle.textContent = q.question;

    // Render options
    optionsList.innerHTML = '';
    q.options.forEach((opt, optIndex) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.type = 'button';
      btn.innerHTML = `<span class="option-marker">${String.fromCharCode(65 + optIndex)}</span><span class="option-text">${opt.text}</span>`;
      
      btn.addEventListener('click', function() {
        handleOptionSelect(btn, opt.type);
      });

      optionsList.appendChild(btn);
    });
  }

  function handleOptionSelect(btnElement, resultType) {
    // Disable all options momentarily
    const allBtns = optionsList.querySelectorAll('.option-btn');
    allBtns.forEach(b => b.classList.add('disabled'));
    btnElement.classList.add('selected');

    // Register score
    scores[resultType] = (scores[resultType] || 0) + 1;

    // Advance after short tactile feedback
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
    // Complete progress bar
    progressText.textContent = `Completed!`;
    progressPercent.textContent = `100%`;
    progressFill.style.width = `100%`;

    // Determine winner
    let maxScore = -1;
    let winningKey = Object.keys(results)[0];

    for (const key in scores) {
      if (scores[key] > maxScore) {
        maxScore = scores[key];
        winningKey = key;
      }
    }

    winningResult = results[winningKey] || Object.values(results)[0];

    // Populate UI
    questionCard.style.display = 'none';
    resultCard.style.display = 'block';

    resultBadge.textContent = winningResult.badge || '🌊';
    resultTitle.textContent = winningResult.title || 'Your Archetype';
    resultDesc.textContent = winningResult.description || '';

    // Scroll smoothly to results
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // Social Share Handlers
  if (btnWhatsapp) {
    btnWhatsapp.addEventListener('click', function() {
      if (!winningResult) return;
      const shareText = `I took the "${data.title}" quiz on Quiztide and my result is: ${winningResult.title}! Check yours here: ${data.url}`;
      const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
      window.open(url, '_blank');
    });
  }

  if (btnCopy) {
    btnCopy.addEventListener('click', function() {
      navigator.clipboard.writeText(data.url).then(() => {
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

  // Launch initial quiz state
  initQuiz();
})();
