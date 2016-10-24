import { Map, fromJS } from 'immutable'
import samplerReducers from './sampler'
import synthReducers from './synth'

const initialState = fromJS({
  selectedIndex: 0,
  sequences: [{
    resolution: 8,
    bars: 2,
    channels: [
      { instrument: { type: 'sampler', sample: './samples/kick.wav', steps: [] }, label: 'Kick', effects: [] },
      { instrument: { type: 'sampler', sample: './samples/snare.wav', steps: [] }, label: 'Snare', effects: [] },
      { instrument: { type: 'sampler', sample: './samples/hihat.wav', steps: [] }, label: 'HiHat', effects: [] },
      { instrument: { type: 'synth', synthType: 'sine', notes: { } }, label: 'Synth', effects: [] }
    ]
  }]
})

export const actions = {
  setResolution: resolution => ({ type: 'SET_RESOLUTION', payload: { resolution } }),
  selectSequenceIndex: sequenceIndex => ({ type: 'SET_SEQUENCE_INDEX', payload: { sequenceIndex } }),
  setBars: bars => ({ type: 'SET_BARS', payload: { bars } })
}

const reducerMap = Map({
  SET_RESOLUTION: (state, { resolution }) => state.setIn(['sequences', state.get('selectedIndex'), 'resolution'], resolution),
  SET_SEQUENCE_INDEX: (state, { sequenceIndex }) => state.set('sequence', sequenceIndex),
  SET_BARS: (state, { bars }) => state.setIn(['sequences', state.get('selectedIndex'), 'bars'], bars),
  ...samplerReducers,
  ...synthReducers
})

export default (state = initialState, { type, payload }) =>
  reducerMap.get(type, () => state)(state, payload)

