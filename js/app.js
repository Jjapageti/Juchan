import { loadState, saveState, resetState } from './storage.js';
import { loadQuestions } from './questionLoader.js';
import { checkImageMission } from './imageMission.js';
const TARGET_COUNT = 5;
let state = loadState(); let questions = []; let currentQuestion = null; let selectedPhotoFile = null;
const $ = (id) => document.getElementById(id);
const screens = { name: $('name-screen'), mission: $('mission-screen'), nextQr: $('nextqr-screen'), complete: $('complete-screen') };
function showScreen(screenName) { Object.values(screens).forEach(screen => screen.classList.add('hidden')); screens[screenName].classList.remove('hidden'); }
function normalize(text) { return String(text).trim().replace(/\s/g, '').toLowerCase(); }
function getProgressCount() { return state.solvedIds.length; }
function getProgressBlocks() { const count = getProgressCount(); return '■'.repeat(count) + '□'.repeat(TARGET_COUNT - count); }
function updateProgress() { const count = getProgressCount(); $('progress-text').textContent = `${count} / ${TARGET_COUNT}`; $('progress-blocks').textContent = getProgressBlocks(); $('next-progress-text').textContent = `${count} / ${TARGET_COUNT}`; $('next-progress-blocks').textContent = getProgressBlocks(); if (state.playerName) $('player-label').textContent = `참가자: ${state.playerName}`; }
function showCompleteScreen() { state.completed = true; saveState(state); $('complete-name').textContent = `참가자: ${state.playerName}`; showScreen('complete'); }
function checkCompleted() { if (state.completed || getProgressCount() >= TARGET_COUNT) { showCompleteScreen(); return true; } return false; }
function pickRandomQuestion() { const unsolvedQuestions = questions.filter(question => !state.solvedIds.includes(question.id)); if (unsolvedQuestions.length === 0) return null; return unsolvedQuestions[Math.floor(Math.random() * unsolvedQuestions.length)]; }
function resetMissionForm() { selectedPhotoFile = null; $('message').textContent = ''; $('ai-result').textContent = ''; $('answer-input').value = ''; $('photo-input').value = ''; $('preview').removeAttribute('src'); $('preview').classList.add('hidden'); }
function renderQuestion() { if (checkCompleted()) return; currentQuestion = pickRandomQuestion(); if (!currentQuestion) { showCompleteScreen(); return; } resetMissionForm(); $('mission-title').textContent = currentQuestion.title; $('mission-question').textContent = currentQuestion.question; $('quiz-area').classList.toggle('hidden', currentQuestion.type !== 'quiz'); $('photo-area').classList.toggle('hidden', currentQuestion.type !== 'photo'); updateProgress(); showScreen('mission'); }
function showNextQrScreen() { updateProgress(); showScreen('nextQr'); }
function markSolved() { if (!currentQuestion) return; if (!state.solvedIds.includes(currentQuestion.id)) state.solvedIds.push(currentQuestion.id); saveState(state); if (checkCompleted()) return; showNextQrScreen(); }
function checkQuizAnswer() { if (!currentQuestion) return; const value = $('answer-input').value; const answers = Array.isArray(currentQuestion.answers) ? currentQuestion.answers : [currentQuestion.answer]; const isCorrect = answers.some(answer => normalize(answer) === normalize(value)); if (isCorrect) markSolved(); else $('message').textContent = '아쉽습니다. 다시 생각해보세요!'; }
async function checkPhotoAnswer() { if (!currentQuestion) return; $('message').textContent = '사진을 분석하는 중입니다...'; $('ai-result').textContent = ''; try { const result = await checkImageMission(selectedPhotoFile, currentQuestion); $('ai-result').textContent = result.message; if (result.success) markSolved(); else $('message').textContent = '조건을 만족하지 못했습니다. 다시 찍어보세요!'; } catch (error) { console.error(error); $('message').textContent = '사진 분석 중 오류가 발생했습니다. 다시 시도해주세요.'; } }
function startGame() { const playerName = $('player-name').value.trim(); if (!playerName) { alert('이름 또는 팀명을 입력하세요.'); return; } state.playerName = playerName; saveState(state); renderQuestion(); }
function handleReset() { if (confirm('진행 상황을 초기화할까요?')) { resetState(); location.reload(); } }
function bindEvents() { $('start-btn').addEventListener('click', startGame); $('player-name').addEventListener('keydown', event => { if (event.key === 'Enter') startGame(); }); $('check-answer-btn').addEventListener('click', checkQuizAnswer); $('answer-input').addEventListener('keydown', event => { if (event.key === 'Enter') checkQuizAnswer(); }); $('photo-input').addEventListener('change', event => { selectedPhotoFile = event.target.files?.[0] ?? null; if (!selectedPhotoFile) return; const previewUrl = URL.createObjectURL(selectedPhotoFile); $('preview').src = previewUrl; $('preview').classList.remove('hidden'); }); $('check-photo-btn').addEventListener('click', checkPhotoAnswer); $('reset-btn').addEventListener('click', handleReset); $('complete-reset-btn').addEventListener('click', handleReset); }
async function init() { questions = await loadQuestions(); bindEvents(); if (state.playerName) $('player-name').value = state.playerName; if (state.completed) { showCompleteScreen(); return; } if (!state.playerName) { showScreen('name'); return; } renderQuestion(); }
init();
