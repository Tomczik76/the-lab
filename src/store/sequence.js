import { Map, fromJS } from 'immutable'

const NEW_SAMPLER = (state, { sampler }) => state.push(sampler)
const EDIT_SAMPLE = (state, { sampler, sample }) => state.set(state.indexOf(sampler), sampler.set('sample', sample))
const SET_SEQUENCE_INDEX = (state, { sequenceIndex }) => state.set('sequence', sequenceIndex)
const TOGGLE_STEP = (state, { channelIndex, stepIndex, value }) => {
  const steps = state.getIn(['sequences', state.get('selectedIndex'), 'channels', channelIndex, 'instrument', 'steps'])
  const newSteps = value ? steps.push(stepIndex) : steps.filter(x => x !== stepIndex)
  return state.setIn(['sequences', state.get('selectedIndex'), 'channels', channelIndex, 'instrument', 'steps'], newSteps)
}
const SET_RESOLUTION = (state, { resolution }) => state.setIn(['sequences', state.get('selectedIndex'), 'resolution'], resolution)
const SET_BARS = (state, { bars }) => state.setIn(['sequences', state.get('selectedIndex'), 'bars'], bars)

const reducerMap = Map({
  EDIT_SAMPLE,
  NEW_SAMPLER,
  SET_SEQUENCE_INDEX,
  TOGGLE_STEP,
  SET_RESOLUTION,
  SET_BARS
})

const initialState = fromJS({
  selectedIndex: 0,
  sequences: [{
    resolution: 8,
    bars: 2,
    channels: [
      { instrument: { type: 'sampler', sample: './samples/kick.wav', steps: [] }, label: 'Kick', effects: [] },
      { instrument: { type: 'sampler', sample: './samples/snare.wav', steps: [] }, label: 'Snare', effects: [] },
      { instrument: { type: 'sampler', sample: './samples/hihat.wav', steps: [] }, label: 'HiHat', effects: [] },
      { instrument: { type: 'synth', synthType: 'sine', steps: [[0, 1.33, ['b8']]] }, label: 'Synth', effects: [] }
    ]
  }]
})

export const actions = {
  editSample: (sampler, sample) => ({ type: 'EDIT_SAMPLE', payload: { sampler, sample } }),
  selectSequenceIndex: sequenceIndex => ({ type: 'SET_SEQUENCE_INDEX', payload: { sequenceIndex } }),
  toggleStep: (channelIndex, stepIndex, value) => ({ type: 'TOGGLE_STEP', payload: { channelIndex, stepIndex, value } }),
  setResolution: resolution => ({ type: 'SET_RESOLUTION', payload: { resolution } }),
  setBars: bars => ({ type: 'SET_BARS', payload: { bars } })
}
export default (state = initialState, { type, payload }) =>
  reducerMap.get(type, () => state)(state, payload)

