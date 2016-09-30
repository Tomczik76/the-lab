import { Map } from 'immutable'

export const actions = {
  updateTempo: tempo => ({ type: 'UPDATE_TEMPO', payload: { tempo } }),
  startSong: () => ({ type: 'START_SONG' }),
  stopSong: () => ({ type: 'STOP_SONG' })
}

const reducerMap = Map({
  UPDATE_TEMPO: (state, { tempo }) => state.set('tempo', tempo)
})

const initialState = Map({
  tempo: 120,
  play: true
})

export default (state = initialState, { type, payload }) =>
  reducerMap.get(type, () => state)(state, payload)
