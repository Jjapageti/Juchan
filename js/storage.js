const KEY = 'churchTreasureState.v3';
const OLD_KEY = 'churchTreasureState.v2';

const initialState = () => ({
  playerName: '',
  solvedIds: [],
  usedSpots: [],
  failedSpots: [],
  spotAssignments: {},
  activeSpot: null,
  completed: false,
  completedAt: null
});

export function loadState() {
  const raw = localStorage.getItem(KEY);
  if (!raw) return initialState();

  try {
    const state = JSON.parse(raw);
    return {
      playerName: typeof state.playerName === 'string' ? state.playerName : '',
      solvedIds: Array.isArray(state.solvedIds) ? state.solvedIds : [],
      usedSpots: Array.isArray(state.usedSpots) ? state.usedSpots : [],
      failedSpots: Array.isArray(state.failedSpots) ? state.failedSpots : [],
      spotAssignments: state.spotAssignments && typeof state.spotAssignments === 'object'
        ? state.spotAssignments
        : {},
      activeSpot: typeof state.activeSpot === 'string' ? state.activeSpot : null,
      completed: state.completed === true,
      completedAt: typeof state.completedAt === 'string' ? state.completedAt : null
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
  localStorage.removeItem(OLD_KEY);
}
