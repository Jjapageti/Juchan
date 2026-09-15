import { loadState, saveState, resetState } from './storage.js';
import { loadQuestions } from './questionLoader.js';

const TARGET_COUNT = 10;

let state = loadState();
let questions = [];
let currentQuestion = null;

const $ = (id) => document.getElementById(id);

const screens = {
  name: $('name-screen'),
  mission: $('mission-screen'),
  complete: $('complete-screen')
};

function showScreen(name) {
  Object.values(screens).forEach(element => element.classList.add('hidden'));
  screens[name].classList.remove('hidden');
}

function normalize(text) {
  return String(text).trim().replace(/\s/g, '').toLowerCase();
}

function getProgressCount() {
  return state.solvedIds.length;
}

function updateProgress() {
  const count = getProgressCount();
  $('player-label').textContent = `참가자 / Teilnehmer: ${state.playerName}`;
  $('progress-text').textContent = `${count} / ${TARGET_COUNT}`;
  $('progress-blocks').textContent = '■'.repeat(count) + '□'.repeat(TARGET_COUNT - count);
}

function completeIfNeeded() {
  if (getProgressCount() >= TARGET_COUNT) {
    state.completed = true;
    saveState(state);
    $('complete-name').textContent = `참가자 / Teilnehmer: ${state.playerName}`;
    showScreen('complete');
    return true;
  }
  return false;
}

function pickRandomQuestion() {
  const unsolved = questions.filter(question => !state.solvedIds.includes(question.id));
  if (unsolved.length === 0) return null;
  return unsolved[Math.floor(Math.random() * unsolved.length)];
}

function renderQuestion() {
  if (completeIfNeeded()) return;

  $('message').textContent = '';
  $('answer-input').value = '';
  $('next-btn').classList.add('hidden');

  currentQuestion = pickRandomQuestion();
  if (!currentQuestion) {
    $('message').textContent = '더 이상 남은 미션이 없습니다.\nEs sind keine weiteren Missionen verfügbar.';
    return;
  }

  $('mission-title').textContent = currentQuestion.title;
  $('mission-question').textContent = currentQuestion.question;

  updateProgress();
  showScreen('mission');
}

function markSolved() {
  if (!state.solvedIds.includes(currentQuestion.id)) {
    state.solvedIds.push(currentQuestion.id);
    saveState(state);
  }

  updateProgress();

  if (!completeIfNeeded()) {
    $('message').textContent = '성공! 다음 미션을 진행하세요.\nGeschafft! Fahre mit der nächsten Mission fort.';
    $('next-btn').classList.remove('hidden');
  }
}

function checkPassword() {
  const value = $('answer-input').value;
  const answers = Array.isArray(currentQuestion.answers)
    ? currentQuestion.answers
    : [currentQuestion.answer];
  const isCorrect = answers.some(answer => normalize(answer) === normalize(value));

  if (isCorrect) {
    markSolved();
  } else {
    $('message').textContent = '비밀번호가 올바르지 않습니다. 다시 확인해 주세요.\nDas Passwort ist nicht korrekt. Bitte versuche es erneut.';
  }
}

function bindEvents() {
  $('start-btn').addEventListener('click', () => {
    const name = $('player-name').value.trim();
    if (!name) {
      alert('이름을 입력하세요. / Bitte gib deinen Namen ein.');
      return;
    }
    state.playerName = name;
    saveState(state);
    renderQuestion();
  });

  $('check-answer-btn').addEventListener('click', checkPassword);
  $('answer-input').addEventListener('keydown', event => {
    if (event.key === 'Enter') checkPassword();
  });
  $('next-btn').addEventListener('click', renderQuestion);

  $('reset-btn').addEventListener('click', () => {
    if (confirm('진행 상황을 초기화할까요? / Fortschritt zurücksetzen?')) {
      resetState();
      location.reload();
    }
  });

  $('complete-reset-btn').addEventListener('click', () => {
    if (confirm('처음부터 다시 시작할까요? / Von vorne beginnen?')) {
      resetState();
      location.reload();
    }
  });
}

async function init() {
  questions = await loadQuestions();
  bindEvents();

  if (state.completed) {
    $('complete-name').textContent = `참가자 / Teilnehmer: ${state.playerName}`;
    showScreen('complete');
  } else if (state.playerName) {
    renderQuestion();
  } else {
    showScreen('name');
  }
}

init();
