import { List } from 'immutable'
import { Observable } from 'rxjs'

import { getSelectedBars, getSelectedResolution } from '../selectors'

export const actions = {
  pianoRollClick: (channelIndex, stepIndex, note, stepNumber) =>
    ({ type: 'PIANO_ROLL_CLICK', payload: { channelIndex, stepIndex, note, stepNumber } }),
  dragHeadStart: (channelIndex, stepIndex, x, start, end, note, parentWidth) =>
    ({ type: 'DRAG_HEAD_START', payload: { channelIndex, stepIndex, x, start, end, note, parentWidth } }),
  dragTailStart: (channelIndex, stepIndex, x, start, duration, note, parentWidth) =>
    ({ type: 'DRAG_TAIL_START', payload: { channelIndex, stepIndex, x, start, duration, note, parentWidth } }),
  addNote: (channelIndex, step, duration, note) =>
    ({ type: 'ADD_NOTE', payload: { channelIndex, step, duration, note } }),
  removeNote: (channelIndex, stepIndex, note) =>
    ({ type: 'REMOVE_NOTE', payload: { channelIndex, stepIndex, note } }),
  resizeNote: (channelIndex, stepIndex, start, duration, note) =>
    ({ type: 'RESIZE_NOTE', payload: { channelIndex, stepIndex, note, start, duration } })
}

const snap = value =>
  (Math.abs(value) % 1 > 0.9 || Math.abs(value) % 1 < 0.1 ? Math.round(value) : value)

const dragHeadEpic = actions$ =>
  actions$.ofType('DRAG_HEAD_START')
    .mergeMap(({ payload: { channelIndex, stepIndex, x, start, end, note, parentWidth } }) =>
      Observable.fromEvent(document, 'mousemove')
        .takeUntil(Observable.fromEvent(document, 'mouseup'))
        .do(e => e.preventDefault())
        .map(e => snap(start - ((x - e.clientX) / parentWidth)))
        .filter(snappedStart => snappedStart >= 0)
        .filter(snappedStart => end - snappedStart > 0)
        .map(snappedStart =>
          actions.resizeNote(channelIndex, stepIndex, snappedStart, end - snappedStart, note)))

const dragTailEpic = (actions$, { getState }) =>
  actions$.ofType('DRAG_TAIL_START')
    .mergeMap(({ payload: { channelIndex, stepIndex, x, start, duration, note, parentWidth } }) =>
       Observable.fromEvent(document, 'mousemove')
        .takeUntil(Observable.fromEvent(document, 'mouseup'))
        .do(e => e.preventDefault())
        .map(e => snap(duration - ((x - e.clientX) / parentWidth)))
        .filter(snappedDuration =>
          start + snappedDuration <= getSelectedBars(getState()) * getSelectedResolution(getState())
        )
        .map(snappedDuration =>
          actions.resizeNote(channelIndex, stepIndex, start, snappedDuration, note)
    ))

const addNoteEpic = (actions$) => {
  const clickStream = actions$.ofType('PIANO_ROLL_CLICK')
    .map(action => action.payload)

  const singleClickStream = clickStream
    .filter(({ note }) => note)
    .filter(({ stepIndex }) => stepIndex === undefined)
    .map(({ channelIndex, stepNumber, note }) =>
      actions.addNote(channelIndex, stepNumber, 1, note))

  const doubleClickStream = clickStream
    .buffer(clickStream.debounceTime(250))
    .filter(x => x.length === 2)
    .filter(x => x.every(({ note }) => note))
    .filter(x => x.every(({ stepIndex }) => stepIndex !== undefined))
    .map(x => x.pop())
    .map(({ channelIndex, stepIndex, note }) =>
      actions.removeNote(channelIndex, stepIndex, note))

  return Observable.merge(singleClickStream, doubleClickStream)
}

export const epics = [dragHeadEpic, dragTailEpic, addNoteEpic]

const updateSteps = (state, channelIndex, note, updateFunction) =>
  state.updateIn(
    [
      'sequences',
      state.get('selectedIndex'),
      'channels',
      channelIndex,
      'instrument',
      'notes',
      note
    ],
    updateFunction)

export default {
  ADD_NOTE: (state, { channelIndex, step, duration, note }) =>
    updateSteps(state, channelIndex, note, steps => (steps || List()).push(List([step, duration]))),
  REMOVE_NOTE: (state, { channelIndex, stepIndex, note }) =>
    updateSteps(state, channelIndex, note, steps => steps.delete(stepIndex)),
  RESIZE_NOTE: (state, { channelIndex, stepIndex, note, start, duration }) =>
    updateSteps(state, channelIndex, note, steps => steps.set(stepIndex, List([start, duration])))
}
