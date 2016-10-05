import { Map, fromJS } from 'immutable'

export const actions = {
  movePanel: (name, x, y) => ({ type: 'UPDATE_POSITION', payload: { name, x, y } })
}

const reducerMap = Map({
  UPDATE_POSITION: (state, { name, x, y }) => state.set(name, Map({ x, y }))
})

const initialState = fromJS({
  sequencer: { x: 50, y: 50 }
})

export default (state = initialState, { type, payload }) =>
  reducerMap.get(type, () => state)(state, payload)
