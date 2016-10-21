import { List } from 'immutable'

export const actions = {
  addNote: (channelIndex, step, duration, note) => ({ type: 'ADD_NOTE', payload: { channelIndex, step, duration, note } }),
  removeNote: (channelIndex, stepIndex, note) => ({ type: 'REMOVE_NOTE', payload: { channelIndex, stepIndex, note } })
}

const updateSteps = (state, channelIndex, note, updateFunction) =>
  state.updateIn([
    'sequences',
    state.get('selectedIndex'),
    'channels',
    channelIndex,
    'instrument',
    'notes',
    note
  ], updateFunction)

export default {
  ADD_NOTE: (state, { channelIndex, step, duration, note }) =>
    updateSteps(state, channelIndex, note, steps => (steps || List()).push(List([step, duration]))),
  REMOVE_NOTE: (state, { channelIndex, stepIndex, note }) =>
    updateSteps(state, channelIndex, note, steps => steps.delete(stepIndex))
}
