const KEY = 'churchTreasureState.v2';

const initialState = () => ({
  playerName: '',
  solvedIds: [],
  completed: false
});

export function loadState() {
  const raw = localStorage.getItem(KEY);
  if (!raw) return initialState();

  try {
    const state = JSON.parse(raw);
    return {
      playerName: typeof state.playerName === 'string' ? state.playerName : '',
      solvedIds: Array.isArray(state.solvedIds) ? state.solvedIds : [],
      completed: state.completed === true
    };
  } catch {
    return initialState();
  }
}

export function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function resetState() {
  localStorage.removeItem(KEY);
}
