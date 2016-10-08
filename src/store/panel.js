import { Map, fromJS } from 'immutable'

export const actions = {
  movePanel: (name, x, y) => ({ type: 'UPDATE_POSITION', payload: { name, x, y } })
}

const reducerMap = Map({
  UPDATE_POSITION: (state, { name, x, y }) => state.mergeIn([name], { x, y })
})

const initialState = fromJS({
  pianoRoll: { x: 50, y: 300, width: '700px', active: false },
  sequencer: { x: 50, y: 50, active: true }
})

export default (state = initialState, { type, payload }) =>
  reducerMap.get(type, () => state)(state, payload)
