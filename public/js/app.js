import {
  MAX_TEXT_LENGTH,
  UI_TEXT,
  INPUT_ERRORS,
  CLIENT_ERRORS,
  SENTIMENT_CLASS,
  EXAMPLES,
} from './config.js';
import { analyzeText } from './api.js';

// DOM 요소 참조
const form = document.getElementById('sentiment-form');
const textInput = document.getElementById('text-input');
const inputError = document.getElementById('input-error');
const charCount = document.getElementById('char-count');
const exampleList = document.getElementById('example-list');
const clearButton = document.getElementById('clear-button');
const analyzeButton = document.getElementById('analyze-button');

const resultSection = document.getElementById('result-section');
const resultEmpty = document.getElementById('result-empty');
const resultLoading = document.getElementById('result-loading');
const resultCard = document.getElementById('result-card');
const resultLabel = document.getElementById('result-label');
const confidenceValue = document.getElementById('confidence-value');
const confidenceBar = document.getElementById('confidence-bar');
const confidenceFill = document.getElementById('confidence-fill');
const resultReason = document.getElementById('result-reason');
const errorBox = document.getElementById('error-box');
const errorMessage = document.getElementById('error-message');
const retryButton = document.getElementById('retry-button');

let currentStatus = 'idle';

// 글자 수 세기 (앞뒤 공백 제거 후 이모지 1자 단위 계산)
const countChars = (value) => Array.from(value.trim()).length;

function renderExamples() {
  EXAMPLES.forEach((example) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-chip';
    btn.textContent = example.label;
    btn.addEventListener('click', () => {
      textInput.value = example.text;
      updateInputCount();
      textInput.focus();
    });
    exampleList.appendChild(btn);
  });
}

function updateInputCount() {
  const len = countChars(textInput.value);
  charCount.textContent = `${len} / ${MAX_TEXT_LENGTH}`;
  if (len > MAX_TEXT_LENGTH) {
    charCount.classList.add('is-over');
    textInput.classList.add('is-invalid');
    inputError.textContent = INPUT_ERRORS.TOO_LONG;
  } else {
    charCount.classList.remove('is-over');
    textInput.classList.remove('is-invalid');
    inputError.textContent = '';
  }
}

export function setState(nextState) {
  currentStatus = nextState.status;

  // 전체 결과 영역 숨김 처리
  resultEmpty.hidden = true;
  resultLoading.hidden = true;
  resultCard.hidden = true;
  errorBox.hidden = true;

  const exampleButtons = exampleList.querySelectorAll('button');

  if (nextState.status === 'idle') {
    resultEmpty.hidden = false;
    resultSection.setAttribute('aria-busy', 'false');
    analyzeButton.disabled = false;
    analyzeButton.textContent = UI_TEXT.analyze;
    clearButton.disabled = false;
    exampleButtons.forEach((btn) => { btn.disabled = false; });
    textInput.readOnly = false;
  } else if (nextState.status === 'loading') {
    resultLoading.hidden = false;
    resultSection.setAttribute('aria-busy', 'true');
    analyzeButton.disabled = true;
    analyzeButton.textContent = UI_TEXT.analyzing;
    clearButton.disabled = true;
    exampleButtons.forEach((btn) => { btn.disabled = true; });
    textInput.readOnly = true;
  } else if (nextState.status === 'success') {
    const data = nextState.data;
    if (!data || !SENTIMENT_CLASS[data.sentiment]) {
      setState({
        status: 'error',
        error: { code: 'UNKNOWN_ERROR', ...CLIENT_ERRORS.UNKNOWN_ERROR },
      });
      return;
    }

    resultCard.classList.remove('is-positive', 'is-negative', 'is-neutral');
    resultCard.classList.add(SENTIMENT_CLASS[data.sentiment]);

    resultLabel.textContent = data.label;
    confidenceValue.textContent = `${data.confidence}%`;
    confidenceBar.setAttribute('aria-valuenow', String(data.confidence));

    confidenceFill.style.width = '0%';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        confidenceFill.style.width = `${data.confidence}%`;
      });
    });

    resultReason.textContent = data.reason;

    resultCard.hidden = false;
    resultSection.setAttribute('aria-busy', 'false');
    analyzeButton.disabled = false;
    analyzeButton.textContent = UI_TEXT.analyze;
    clearButton.disabled = false;
    exampleButtons.forEach((btn) => { btn.disabled = false; });
    textInput.readOnly = false;
  } else if (nextState.status === 'error') {
    const error = nextState.error;
    errorMessage.textContent = error.message;
    retryButton.hidden = !error.retryable;

    errorBox.hidden = false;
    resultSection.setAttribute('aria-busy', 'false');
    analyzeButton.disabled = false;
    analyzeButton.textContent = UI_TEXT.analyze;
    clearButton.disabled = false;
    exampleButtons.forEach((btn) => { btn.disabled = false; });
    textInput.readOnly = false;
  }
}

async function submitAnalysis() {
  if (currentStatus === 'loading') return;

  const text = textInput.value.trim();
  if (text.length === 0) {
    inputError.textContent = INPUT_ERRORS.EMPTY_INPUT;
    textInput.classList.add('is-invalid');
    textInput.focus();
    return;
  }

  if (countChars(text) > MAX_TEXT_LENGTH) {
    inputError.textContent = INPUT_ERRORS.TOO_LONG;
    textInput.focus();
    return;
  }

  inputError.textContent = '';
  textInput.classList.remove('is-invalid');

  setState({ status: 'loading' });
  const result = await analyzeText(text);

  if (result.ok) {
    setState({ status: 'success', data: result.data });
  } else {
    setState({ status: 'error', error: result.error });
  }
}

// 이벤트 리스너 등록
textInput.addEventListener('input', updateInputCount);

textInput.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    event.preventDefault();
    submitAnalysis();
  }
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  submitAnalysis();
});

clearButton.addEventListener('click', () => {
  textInput.value = '';
  inputError.textContent = '';
  charCount.classList.remove('is-over');
  textInput.classList.remove('is-invalid');
  charCount.textContent = `0 / ${MAX_TEXT_LENGTH}`;
  setState({ status: 'idle' });
  textInput.focus();
});

retryButton.addEventListener('click', () => {
  submitAnalysis();
});

// 초기화
renderExamples();
setState({ status: 'idle' });
charCount.textContent = `0 / ${MAX_TEXT_LENGTH}`;
