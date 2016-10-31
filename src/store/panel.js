import { Map, fromJS } from 'immutable'
import { Observable } from 'rxjs'

export const actions = {
  dragStart: (index, x, y) => ({ type: 'DRAG_START', payload: { index, x, y } }),
  resizeStart: (index, x, y, orientation, height, width) =>
    ({ type: 'RESIZE_START', payload: { index, x, y, orientation, height, width } }),
  movePanel: (index, x, y) => ({ type: 'UPDATE_POSITION', payload: { index, x, y } }),
  resizePanel: (index, width, height) => ({ type: 'UPDATE_DIMENSIONS', payload: { index, width, height } })
}

const dragEpic = actions$ =>
  actions$.ofType('DRAG_START')
    .mergeMap(({ payload: { index, x, y } }) =>
      Observable.fromEvent(document, 'mousemove')
        .takeUntil(Observable.fromEvent(document, 'mouseup'))
        .map((e) => {
          e.preventDefault()
          return actions.movePanel(index, e.clientX - x, e.clientY - y)
        }))

const resizeEpic = actions$ =>
  actions$.ofType('RESIZE_START')
    .mergeMap(({ payload: { index, x, y, orientation, height, width } }) =>
      Observable.fromEvent(document, 'mousemove')
        .takeUntil(Observable.fromEvent(document, 'mouseup'))
        .map((e) => {
          e.preventDefault()
          return actions.resizePanel(
            index,
            orientation === 'ns' ? width : width + (e.clientX - x),
            orientation === 'ew' ? height : height + (e.clientY - y)
          )
        }))

const reducerMap = Map({
  UPDATE_POSITION: (state, { index, x, y }) => state.mergeIn([index], { x, y }),
  UPDATE_DIMENSIONS: (state, { index, width, height }) => state.mergeIn([index], { width, height })
})

const initialState = fromJS([
  { type: 'sequencer', x: 50, y: 50, active: true },
  { type: 'pianoRoll', x: 50, y: 300, width: 700, height: 300, active: false, channelIndex: 3 }
])

export const epics = [dragEpic, resizeEpic]

export default (state = initialState, { type, payload }) =>
  reducerMap.get(type, () => state)(state, payload)
