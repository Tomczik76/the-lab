export const actions = {
  editSample: (sampler, sample) => ({ type: 'EDIT_SAMPLE', payload: { sampler, sample } }),
  selectSequenceIndex: sequenceIndex => ({ type: 'SET_SEQUENCE_INDEX', payload: { sequenceIndex } }),
  toggleStep: (channelIndex, stepIndex, value) => ({ type: 'TOGGLE_STEP', payload: { channelIndex, stepIndex, value } }),
  setResolution: resolution => ({ type: 'SET_RESOLUTION', payload: { resolution } }),
  setBars: bars => ({ type: 'SET_BARS', payload: { bars } })
}

export default {
  EDIT_SAMPLE: (state, { sampler, sample }) => state.set(state.indexOf(sampler), sampler.set('sample', sample)),
  NEW_SAMPLER: (state, { sampler }) => state.push(sampler),
  SET_SEQUENCE_INDEX: (state, { sequenceIndex }) => state.set('sequence', sequenceIndex),
  TOGGLE_STEP: (state, { channelIndex, stepIndex, value }) => {
    const steps = state.getIn(['sequences', state.get('selectedIndex'), 'channels', channelIndex, 'instrument', 'steps'])
    const newSteps = value ? steps.push(stepIndex) : steps.filter(x => x !== stepIndex)
    return state.setIn(['sequences', state.get('selectedIndex'), 'channels', channelIndex, 'instrument', 'steps'], newSteps)
  }
}

