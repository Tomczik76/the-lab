export const actions = {
  editSample: (sampler, sample) => ({ type: 'EDIT_SAMPLE', payload: { sampler, sample } }),
  toggleStep: (channelIndex, stepIndex, value) => ({ type: 'TOGGLE_STEP', payload: { channelIndex, stepIndex, value } }),
}

export default {
  EDIT_SAMPLE: (state, { sampler, sample }) => state.set(state.indexOf(sampler), sampler.set('sample', sample)),
  NEW_SAMPLER: (state, { sampler }) => state.push(sampler),
  TOGGLE_STEP: (state, { channelIndex, stepIndex, value }) => {
    const steps = state.getIn(['sequences', state.get('selectedIndex'), 'channels', channelIndex, 'instrument', 'steps'])
    const newSteps = value ? steps.push(stepIndex) : steps.filter(x => x !== stepIndex)
    return state.setIn(['sequences', state.get('selectedIndex'), 'channels', channelIndex, 'instrument', 'steps'], newSteps)
  }
}

