export const SPOT_COUNT = 10;

export function getSpotId(search) {
  const value = new URLSearchParams(search).get('spot');
  if (!/^\d+$/.test(value ?? '')) return null;

  const number = Number(value);
  return number >= 1 && number <= SPOT_COUNT ? String(number) : null;
}

function getAssignedMissionIds(state) {
  return new Set(Object.values(state.spotAssignments));
}

export function assignSpot(state, requestedSpot, questionIds, random = Math.random) {
  if (state.usedSpots.includes(requestedSpot)) {
    return { status: 'used', spotId: requestedSpot, missionId: state.spotAssignments[requestedSpot] ?? null };
  }

  if (state.activeSpot) {
    const missionId = state.spotAssignments[state.activeSpot];
    return {
      status: state.activeSpot === requestedSpot ? 'active' : 'blocked',
      spotId: state.activeSpot,
      missionId
    };
  }

  const existingMissionId = state.spotAssignments[requestedSpot];
  if (existingMissionId) {
    state.activeSpot = requestedSpot;
    return { status: 'active', spotId: requestedSpot, missionId: existingMissionId };
  }

  const assignedMissionIds = getAssignedMissionIds(state);
  const available = questionIds.filter(id => !assignedMissionIds.has(id));
  if (available.length === 0) {
    return { status: 'empty', spotId: requestedSpot, missionId: null };
  }

  const rawIndex = Math.floor(random() * available.length);
  const index = Math.max(0, Math.min(rawIndex, available.length - 1));
  const missionId = available[index];

  state.spotAssignments[requestedSpot] = missionId;
  state.activeSpot = requestedSpot;
  return { status: 'assigned', spotId: requestedSpot, missionId };
}

function closeActiveSpot(state, succeeded, timestamp) {
  if (!state.activeSpot) return null;

  const spotId = state.activeSpot;
  const missionId = state.spotAssignments[spotId];

  if (!state.usedSpots.includes(spotId)) state.usedSpots.push(spotId);
  if (succeeded && !state.solvedIds.includes(missionId)) state.solvedIds.push(missionId);
  if (!succeeded && !state.failedSpots.includes(spotId)) state.failedSpots.push(spotId);

  state.activeSpot = null;
  if (state.usedSpots.length >= SPOT_COUNT) {
    state.completed = true;
    state.completedAt = timestamp;
  }

  return { spotId, missionId };
}

export function completeActiveSpot(state, timestamp = new Date().toISOString()) {
  return closeActiveSpot(state, true, timestamp);
}

export function failActiveSpot(state, timestamp = new Date().toISOString()) {
  return closeActiveSpot(state, false, timestamp);
}
