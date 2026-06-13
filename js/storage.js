const KEY = 'churchTreasureState.v2';
const DEFAULT_STATE = { playerName: '', solvedIds: [], completed: false };
export function loadState() { const raw = localStorage.getItem(KEY); if (!raw) return { ...DEFAULT_STATE }; try { return { ...DEFAULT_STATE, ...JSON.parse(raw) }; } catch { return { ...DEFAULT_STATE }; } }
export function saveState(state) { localStorage.setItem(KEY, JSON.stringify(state)); }
export function resetState() { localStorage.removeItem(KEY); }
