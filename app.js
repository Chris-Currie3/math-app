// State Management
let state = {
  min1: 1,
  max1: 10,
  min2: 1,
  max2: 10,
  operations: ['+', '-', '*', '/'],
  correctCount: 0,
  incorrectCount: 0,
  currentQuestion: null,
  isCorrectAnimating: false
};

// DOM Elements
const questionDisplay = document.getElementById('question-display');
const answerInput = document.getElementById('answer-input');
const statCorrect = document.getElementById('stat-correct');
const statIncorrect = document.getElementById('stat-incorrect');
const statAccuracy = document.getElementById('stat-accuracy');

const settingsToggle = document.getElementById('settings-toggle');
const settingsOverlay = document.getElementById('settings-overlay');
const settingsClose = document.getElementById('settings-close');

const sliderMin1 = document.getElementById('slider-min1');
const sliderMax1 = document.getElementById('slider-max1');
const sliderMin2 = document.getElementById('slider-min2');
const sliderMax2 = document.getElementById('slider-max2');

const valMin1 = document.getElementById('val-min1');
const valMax1 = document.getElementById('val-max1');
const valMin2 = document.getElementById('val-min2');
const valMax2 = document.getElementById('val-max2');

const opButtons = document.querySelectorAll('.op-button');
const opErrorMessage = document.getElementById('op-error-message');

// Load settings from localStorage if available
function loadSettings() {
  const savedMin1 = localStorage.getItem('math_min1');
  const savedMax1 = localStorage.getItem('math_max1');
  const savedMin2 = localStorage.getItem('math_min2');
  const savedMax2 = localStorage.getItem('math_max2');
  const savedOps = localStorage.getItem('math_operations');

  if (savedMin1) {
    state.min1 = parseInt(savedMin1, 10);
    sliderMin1.value = state.min1;
    valMin1.textContent = state.min1;
  }
  if (savedMax1) {
    state.max1 = parseInt(savedMax1, 10);
    sliderMax1.value = state.max1;
    valMax1.textContent = state.max1;
  }
  if (savedMin2) {
    state.min2 = parseInt(savedMin2, 10);
    sliderMin2.value = state.min2;
    valMin2.textContent = state.min2;
  }
  if (savedMax2) {
    state.max2 = parseInt(savedMax2, 10);
    sliderMax2.value = state.max2;
    valMax2.textContent = state.max2;
  }
  if (savedOps) {
    state.operations = JSON.parse(savedOps);
    opButtons.forEach(btn => {
      const op = btn.dataset.op;
      if (state.operations.includes(op)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
}

// Save settings to localStorage
function saveSettings() {
  localStorage.setItem('math_min1', state.min1);
  localStorage.setItem('math_max1', state.max1);
  localStorage.setItem('math_min2', state.min2);
  localStorage.setItem('math_max2', state.max2);
  localStorage.setItem('math_operations', JSON.stringify(state.operations));
}

// Reset correct and incorrect answer counters
function resetStats() {
  state.correctCount = 0;
  state.incorrectCount = 0;
  updateStats();
}

// Generate a random integer between min and max (inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate a new math question
function generateQuestion() {
  if (state.operations.length === 0) {
    questionDisplay.textContent = "Select Operation";
    return;
  }

  // Pick a random operation from the active ones
  const opSymbol = state.operations[Math.floor(Math.random() * state.operations.length)];
  let num1, num2, answer, displaySymbol;

  switch (opSymbol) {
    case '+':
      num1 = getRandomInt(state.min1, state.max1);
      num2 = getRandomInt(state.min2, state.max2);
      answer = num1 + num2;
      displaySymbol = '+';
      break;
    case '-':
      num1 = getRandomInt(state.min1, state.max1);
      num2 = getRandomInt(state.min2, state.max2);
      answer = num1 - num2;
      displaySymbol = '−'; // Clean minus sign
      break;
    case '*':
      num1 = getRandomInt(state.min1, state.max1);
      num2 = getRandomInt(state.min2, state.max2);
      answer = num1 * num2;
      displaySymbol = '×'; // Multiplication cross
      break;
    case '/':
      // Division rule: only whole numbers, no division by zero.
      // To ensure even distribution of divisors (num2), we:
      // 1. Group valid multiples (num1) for each candidate divisor (num2) in the range.
      // 2. Select a divisor uniformly at random from those that have at least one valid multiple.
      // 3. Select a multiple (num1) uniformly at random for that divisor.
      const validDivisors = [];
      const multiplesMap = {};
      
      for (let b = state.min2; b <= state.max2; b++) {
        const multiples = [];
        for (let a = state.min1; a <= state.max1; a++) {
          if (a % b === 0) {
            multiples.push(a);
          }
        }
        if (multiples.length > 0) {
          validDivisors.push(b);
          multiplesMap[b] = multiples;
        }
      }

      if (validDivisors.length > 0) {
        num2 = validDivisors[Math.floor(Math.random() * validDivisors.length)];
        const possibleMultiples = multiplesMap[num2];
        num1 = possibleMultiples[Math.floor(Math.random() * possibleMultiples.length)];
      } else {
        // Fallback if there are no exact pairs (e.g. ranges don't match cleanly):
        // Pick a random b in range, and multiply it by a factor close to min1
        num2 = getRandomInt(state.min2, state.max2);
        let k = Math.max(1, Math.round(state.min1 / num2));
        num1 = num2 * k;
      }
      answer = num1 / num2;
      displaySymbol = '÷';
      break;
  }

  state.currentQuestion = { num1, num2, opSymbol, answer };
  
  // Clean animation refresh
  questionDisplay.classList.remove('pop-in');
  void questionDisplay.offsetWidth; // Trigger reflow
  questionDisplay.textContent = `${num1} ${displaySymbol} ${num2}`;
  questionDisplay.classList.add('pop-in');
}

// Update Stats Panel
function updateStats() {
  statCorrect.textContent = state.correctCount;
  statIncorrect.textContent = state.incorrectCount;
  
  const total = state.correctCount + state.incorrectCount;
  const accuracy = total === 0 ? 0 : Math.round((state.correctCount / total) * 100);
  statAccuracy.textContent = `${accuracy}%`;
}

// Handle correct answer
function handleCorrect() {
  if (state.isCorrectAnimating) return;
  state.isCorrectAnimating = true;
  
  state.correctCount++;
  updateStats();
  
  // Visual feedback
  answerInput.classList.remove('incorrect');
  answerInput.classList.add('correct');
  
  // Brief delay to appreciate success before clearing and moving on
  setTimeout(() => {
    answerInput.value = '';
    answerInput.classList.remove('correct');
    state.isCorrectAnimating = false;
    generateQuestion();
    answerInput.focus();
  }, 220);
}

// Handle incorrect answer
function handleIncorrect() {
  state.incorrectCount++;
  updateStats();
  
  // Trigger shake animation and red border
  answerInput.classList.remove('correct');
  answerInput.classList.add('incorrect', 'shake-animation');
  
  // Remove shake animation after it finishes so it can be re-triggered
  setTimeout(() => {
    answerInput.classList.remove('shake-animation');
  }, 300);
}

// Check input value against correct answer
function checkAnswer(isSubmitting) {
  if (state.isCorrectAnimating || !state.currentQuestion) return;
  
  const userVal = answerInput.value.trim();
  if (userVal === '') return;
  
  const userNum = parseInt(userVal, 10);
  
  if (userNum === state.currentQuestion.answer) {
    handleCorrect();
  } else if (isSubmitting) {
    handleIncorrect();
  }
}

// Event Listeners
answerInput.addEventListener('input', () => {
  // Reset incorrect styling when they start typing/correcting
  answerInput.classList.remove('incorrect');
  checkAnswer(false);
});

answerInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    checkAnswer(true);
  }
});

// Slider settings event listeners
sliderMin1.addEventListener('input', () => {
  let min = parseInt(sliderMin1.value, 10);
  let max = parseInt(sliderMax1.value, 10);
  if (min > max) {
    max = min;
    sliderMax1.value = max;
    valMax1.textContent = max;
    state.max1 = max;
  }
  state.min1 = min;
  valMin1.textContent = min;
  
  resetStats();
  saveSettings();
  generateQuestion();
});

sliderMax1.addEventListener('input', () => {
  let min = parseInt(sliderMin1.value, 10);
  let max = parseInt(sliderMax1.value, 10);
  if (max < min) {
    min = max;
    sliderMin1.value = min;
    valMin1.textContent = min;
    state.min1 = min;
  }
  state.max1 = max;
  valMax1.textContent = max;
  
  resetStats();
  saveSettings();
  generateQuestion();
});

sliderMin2.addEventListener('input', () => {
  let min = parseInt(sliderMin2.value, 10);
  let max = parseInt(sliderMax2.value, 10);
  if (min > max) {
    max = min;
    sliderMax2.value = max;
    valMax2.textContent = max;
    state.max2 = max;
  }
  state.min2 = min;
  valMin2.textContent = min;
  
  resetStats();
  saveSettings();
  generateQuestion();
});

sliderMax2.addEventListener('input', () => {
  let min = parseInt(sliderMin2.value, 10);
  let max = parseInt(sliderMax2.value, 10);
  if (max < min) {
    min = max;
    sliderMin2.value = min;
    valMin2.textContent = min;
    state.min2 = min;
  }
  state.max2 = max;
  valMax2.textContent = max;
  
  resetStats();
  saveSettings();
  generateQuestion();
});

// Settings Operations
opButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const op = btn.dataset.op;
    const isActive = btn.classList.contains('active');
    
    if (isActive) {
      // Check if this is the last remaining active operation
      if (state.operations.length <= 1) {
        opErrorMessage.classList.remove('hidden');
        // Vibrate/shake error feedback
        opErrorMessage.classList.remove('shake-animation');
        void opErrorMessage.offsetWidth;
        opErrorMessage.classList.add('shake-animation');
        return;
      }
      
      btn.classList.remove('active');
      state.operations = state.operations.filter(item => item !== op);
    } else {
      btn.classList.add('active');
      if (!state.operations.includes(op)) {
        state.operations.push(op);
      }
      opErrorMessage.classList.add('hidden');
    }
    
    resetStats();
    saveSettings();
    generateQuestion();
  });
});

// Modal open/close
function openSettings() {
  settingsOverlay.classList.remove('hidden');
  answerInput.blur();
}

function closeSettings() {
  settingsOverlay.classList.add('hidden');
  answerInput.focus();
}

settingsToggle.addEventListener('click', openSettings);
settingsClose.addEventListener('click', closeSettings);

// Close overlay on click outside modal content
settingsOverlay.addEventListener('click', (e) => {
  if (e.target === settingsOverlay) {
    closeSettings();
  }
});

// Keyboard navigation (Esc to toggle settings)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (settingsOverlay.classList.contains('hidden')) {
      openSettings();
    } else {
      closeSettings();
    }
  }
});

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  generateQuestion();
  answerInput.focus();
  
  // Re-focus on input if user clicks anywhere outside settings
  document.addEventListener('click', (e) => {
    if (settingsOverlay.classList.contains('hidden') && 
        e.target !== answerInput && 
        !settingsToggle.contains(e.target)) {
      answerInput.focus();
    }
  });
});
