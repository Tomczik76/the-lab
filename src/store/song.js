import { Map } from 'immutable'

const UPDATE_TEMPO = 'UPDATE_TEMPO'
const START_SONG = 'START_SONG'
const STOP_SONG = 'STOP_SONG'

export const updateTempo = (tempo) => ({ type: UPDATE_TEMPO, tempo })
export const startSong = () => ({ type: START_SONG })
export const stopSong = () => ({ type: STOP_SONG })

const initialState = Map({
  tempo: 120,
  play: true
})

export default function (state = initialState, action) {
  switch (action.type) {
    case UPDATE_TEMPO: return state.set('tempo', action.tempo)
    default: return state
  }
}
