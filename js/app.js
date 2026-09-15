import { loadState, saveState, resetState } from './storage.js';
import { loadQuestions } from './questionLoader.js';
import {
  SPOT_COUNT,
  assignSpot,
  completeActiveSpot,
  failActiveSpot,
  getSpotId
} from './spotGame.js';

const TARGET_COUNT = 10;

let state = loadState();
let questions = [];
let currentQuestion = null;
const requestedSpot = getSpotId(window.location.search);

const $ = id => document.getElementById(id);

const screens = {
  name: $('name-screen'),
  mission: $('mission-screen'),
  scan: $('scan-screen'),
  complete: $('complete-screen')
};

function showScreen(name) {
  Object.values(screens).forEach(element => element.classList.add('hidden'));
  screens[name].classList.remove('hidden');
}

function normalize(text) {
  return String(text).trim().replace(/\s/g, '').toLowerCase();
}

function updateProgress() {
  const solved = state.solvedIds.length;
  const failed = state.failedSpots.length;
  const remaining = Math.max(0, TARGET_COUNT - solved - failed);
  const blocks = '■'.repeat(solved) + '×'.repeat(failed) + '□'.repeat(remaining);

  document.querySelectorAll('[data-player-label]').forEach(element => {
    element.textContent = `참가자 / Teilnehmer: ${state.playerName}`;
  });
  document.querySelectorAll('[data-progress-text]').forEach(element => {
    element.textContent = `성공 / Erfolg ${solved} · QR ${state.usedSpots.length} / ${SPOT_COUNT}`;
  });
  document.querySelectorAll('[data-progress-blocks]').forEach(element => {
    element.textContent = blocks;
  });
}

function showComplete() {
  state.completed = true;
  saveState(state);
  $('complete-name').textContent = `참가자 / Teilnehmer: ${state.playerName}`;
  $('complete-score').textContent = `최종 성공 점수 / Endpunktzahl: ${state.solvedIds.length} / ${TARGET_COUNT}`;
  $('complete-used').textContent = `사용한 QR / Verwendete QR-Codes: ${state.usedSpots.length} / ${SPOT_COUNT}`;
  showScreen('complete');
}

function showScan(message) {
  updateProgress();
  $('scan-message').textContent = message;
  showScreen('scan');
}

function findQuestion(id) {
  return questions.find(question => question.id === id) ?? null;
}

function renderMission(result) {
  currentQuestion = findQuestion(result.missionId);
  if (!currentQuestion) {
    showScan('미션 정보를 불러올 수 없습니다. 진행자에게 문의하세요.\nDie Mission konnte nicht geladen werden. Bitte wende dich an die Spielleitung.');
    return;
  }

  $('answer-input').value = '';
  $('spot-label').textContent = `QR ${result.spotId}`;
  $('mission-title').textContent = currentQuestion.title;
  $('mission-question').textContent = currentQuestion.question;
  $('message').textContent = result.status === 'blocked'
    ? `QR ${result.spotId}에서 받은 진행 중인 미션을 먼저 완료하세요.\nSchließe zuerst die laufende Mission von QR ${result.spotId} ab.`
    : '';
  $('fail-btn').classList.toggle('hidden', currentQuestion.id !== 'q6');

  updateProgress();
  showScreen('mission');
}

function handleRequestedSpot() {
  if (state.completed || state.usedSpots.length >= SPOT_COUNT) {
    showComplete();
    return;
  }

  if (!requestedSpot) {
    showScan('숨겨진 QR코드를 찾아 스캔하세요.\nFinde einen versteckten QR-Code und scanne ihn.');
    return;
  }

  const result = assignSpot(
    state,
    requestedSpot,
    questions.map(question => question.id)
  );

  if (result.status === 'assigned' || result.status === 'active') {
    saveState(state);
    renderMission(result);
    return;
  }

  if (result.status === 'blocked') {
    renderMission(result);
    return;
  }

  if (result.status === 'used') {
    showScan(`QR ${requestedSpot}은 이미 사용했습니다. 다른 QR코드를 찾으세요.\nQR ${requestedSpot} wurde bereits verwendet. Finde einen anderen QR-Code.`);
    return;
  }

  showComplete();
}

function markSolved() {
  completeActiveSpot(state);
  saveState(state);

  if (state.completed) {
    showComplete();
    return;
  }

  showScan('성공! 이 QR은 완료되었습니다. 다른 QR코드를 찾아 스캔하세요.\nGeschafft! Dieser QR-Code ist abgeschlossen. Finde und scanne einen anderen QR-Code.');
}

function checkPassword() {
  if (!currentQuestion || !state.activeSpot) return;

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

function markFailed() {
  if (!currentQuestion || currentQuestion.id !== 'q6' || !state.activeSpot) return;
  if (!confirm('목사님과의 게임에서 졌나요? 이 QR은 실패 처리됩니다.\nHast du gegen den Pastor verloren? Dieser QR-Code wird als gescheitert gewertet.')) return;

  failActiveSpot(state);
  saveState(state);

  if (state.completed) {
    showComplete();
    return;
  }

  showScan('미션 실패로 기록되었습니다. 다른 QR코드를 찾아 스캔하세요.\nDie Mission wurde als gescheitert gespeichert. Finde einen anderen QR-Code.');
}

function resetProgress() {
  if (confirm('진행 상황을 초기화할까요? / Fortschritt zurücksetzen?')) {
    resetState();
    location.reload();
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
    handleRequestedSpot();
  });

  $('check-answer-btn').addEventListener('click', checkPassword);
  $('answer-input').addEventListener('keydown', event => {
    if (event.key === 'Enter') checkPassword();
  });
  $('fail-btn').addEventListener('click', markFailed);
  $('reset-btn').addEventListener('click', resetProgress);
  $('scan-reset-btn').addEventListener('click', resetProgress);
  $('complete-reset-btn').addEventListener('click', resetProgress);
}

async function init() {
  questions = await loadQuestions();
  bindEvents();

  if (state.completed || state.usedSpots.length >= SPOT_COUNT) {
    showComplete();
  } else if (!state.playerName) {
    showScreen('name');
  } else {
    handleRequestedSpot();
  }
}

init();
