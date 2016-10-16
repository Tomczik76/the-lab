import { Map, fromJS } from 'immutable'

export const actions = {
  movePanel: (index, x, y) => ({ type: 'UPDATE_POSITION', payload: { index, x, y } }),
  resizePanel: (index, width, height) => ({ type: 'UPDATE_DIMENSIONS', payload: { index, width, height } })
}

const reducerMap = Map({
  UPDATE_POSITION: (state, { index, x, y }) => state.mergeIn([index], { x, y }),
  UPDATE_DIMENSIONS: (state, { index, width, height }) => state.mergeIn([index], { width, height })
})

const initialState = fromJS([
  { type: 'sequencer', x: 50, y: 50, active: true },
  { type: 'pianoRoll', x: 50, y: 300, width: 700, height: 300, active: false, channelIndex: 3 }
])

export default (state = initialState, { type, payload }) =>
  reducerMap.get(type, () => state)(state, payload)
