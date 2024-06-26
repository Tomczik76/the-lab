import { Map } from 'immutable'

export const actions = {
  updateTempo: tempo => ({ type: 'UPDATE_TEMPO', payload: { tempo } }),
  startSong: () => ({ type: 'START_SONG' }),
  stopSong: () => ({ type: 'STOP_SONG' })
}

const reducerMap = Map({
  UPDATE_TEMPO: (state, { tempo }) => state.set('tempo', tempo),
  START_SONG: (state) => state.set('play', true),
  STOP_SONG: (state) => state.set('play', false)
})

const initialState = Map({
  tempo: 120,
  play: false
})

export default (state = initialState, { type, payload }) =>
  reducerMap.get(type, () => state)(state, payload)
