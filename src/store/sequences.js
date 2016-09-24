import { List, Map } from 'immutable'

const defaultSampler = Map({ type: 'sampler', sample: undefined, steps: List() })

const NEW_SAMPLER = (state, { sampler }) => state.push(sampler)
const EDIT_SAMPLE = (state, { sampler, sample }) => state.set(state.indexOf(sampler), sampler.set('sample', sample))

const reducerMap = Map({
  EDIT_SAMPLE,
  NEW_SAMPLER
})

const initialState = Map({
  resolution: 4,
  bars: 1,
  channels: List([defaultSampler])
})

export const actions = {
  newSampler: sample => ({ type: 'NEW_SAMPLER', sampler: defaultSampler.set('sample', sample) }),
  editSample: (sampler, sample) => ({ type: 'EDIT_SAMPLE', payload: { sampler, sample } })
}
export default (state = initialState, { type, payload }) =>
  reducerMap.get(type, () => state)(state, payload)

