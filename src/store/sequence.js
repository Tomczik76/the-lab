import { Map, fromJS } from 'immutable'
import samplerReducerMap, { actions as samplerActions } from './sampler'

const initialState = fromJS({
  selectedIndex: 0,
  sequences: [{
    resolution: 8,
    bars: 2,
    channels: [
      { instrument: { type: 'sampler', sample: './samples/kick.wav', steps: [] }, label: 'Kick', effects: [] },
      { instrument: { type: 'sampler', sample: './samples/snare.wav', steps: [] }, label: 'Snare', effects: [] },
      { instrument: { type: 'sampler', sample: './samples/hihat.wav', steps: [] }, label: 'HiHat', effects: [] },
      { instrument: { type: 'synth', synthType: 'sine', steps: [[0, 1.33, ['b8']], [1.66, 1, ['b8']]] }, label: 'Synth', effects: [] }
    ]
  }]
})

export const actions = {
  setResolution: resolution => ({ type: 'SET_RESOLUTION', payload: { resolution } }),
  setBars: bars => ({ type: 'SET_BARS', payload: { bars } }),
  ...samplerActions
}

const reducerMap = Map({
  SET_RESOLUTION: (state, { resolution }) => state.setIn(['sequences', state.get('selectedIndex'), 'resolution'], resolution),
  SET_BARS: (state, { bars }) => state.setIn(['sequences', state.get('selectedIndex'), 'bars'], bars),
  ...samplerReducerMap
})

export default (state = initialState, { type, payload }) =>
  reducerMap.get(type, () => state)(state, payload)

