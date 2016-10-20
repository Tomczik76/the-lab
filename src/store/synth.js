import { List } from 'immutable'

export const actions = {
  addNote: (channelIndex, step, duration, note) => ({ type: 'ADD_NOTE', payload: { channelIndex, step, duration, note } }),
  removeNote: (channelIndex, stepIndex) => ({ type: 'REMOVE_NOTE', payload: { channelIndex, stepIndex } })
}

const updateSteps = (state, channelIndex, updateFunction) =>
  state.updateIn([
    'sequences',
    state.get('selectedIndex'),
    'channels',
    channelIndex,
    'instrument',
    'steps'
  ], updateFunction)

export default {
  ADD_NOTE: (state, { channelIndex, step, duration, note }) =>
    updateSteps(state, channelIndex, steps => steps.push(List([step, duration, List([note])]))),
  REMOVE_NOTE: (state, { channelIndex, stepIndex }) =>
    updateSteps(state, channelIndex, steps => steps.delete(stepIndex))
}
