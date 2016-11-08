import { List, Map } from 'immutable'
import { Observable } from 'rxjs'
import uuid from 'uuid'

import { getSelectedBars, getSelectedResolution } from '../selectors'

export const actions = {
  pianoRollClick: (channelIndex, id, note, stepNumber) =>
    ({ type: 'PIANO_ROLL_CLICK', payload: { channelIndex, id, note, stepNumber } }),
  dragHeadStart: (channelIndex, id, x, start, end, note, parentWidth) =>
    ({ type: 'DRAG_HEAD_START', payload: { channelIndex, id, x, start, end, note, parentWidth } }),
  dragTailStart: (channelIndex, id, x, start, duration, note, parentWidth) =>
    ({ type: 'DRAG_TAIL_START', payload: { channelIndex, id, x, start, duration, note, parentWidth } }),
  dragNoteStart: (channelIndex, id, x, start, duration, note, parentWidth) =>
    ({ type: 'DRAG_NOTE_START', payload: { channelIndex, id, x, start, duration, note, parentWidth } }),
  addNote: (channelIndex, start, duration, note) =>
    ({ type: 'ADD_NOTE', payload: { channelIndex, start, duration, note } }),
  removeNote: (channelIndex, id, note) =>
    ({ type: 'REMOVE_NOTE', payload: { channelIndex, id, note } }),
  updateNote: (channelIndex, id, start, duration, note) =>
    ({ type: 'UPDATE_NOTE', payload: { channelIndex, id, note, start, duration } })
}

const snap = value =>
  (Math.abs(value) % 1 > 0.9 || Math.abs(value) % 1 < 0.1 ? Math.round(value) : value)

const resizeNoteHeadEpic = actions$ =>
  actions$.ofType('DRAG_HEAD_START')
    .mergeMap(({ payload: { channelIndex, id, x, start, end, note, parentWidth } }) =>
      Observable.fromEvent(document, 'mousemove')
        .takeUntil(Observable.fromEvent(document, 'mouseup'))
        .do(e => e.preventDefault())
        .map(e => snap(start - ((x - e.clientX) / parentWidth)))
        .filter(snappedStart => snappedStart >= 0)
        .filter(snappedStart => end - snappedStart > 0)
        .map(snappedStart =>
          actions.updateNote(channelIndex, id, snappedStart, end - snappedStart, note)))

const resizeNoteTailEpic = (actions$, { getState }) =>
  actions$.ofType('DRAG_TAIL_START')
    .mergeMap(({ payload: { channelIndex, id, x, start, duration, note, parentWidth } }) =>
       Observable.fromEvent(document, 'mousemove')
        .takeUntil(Observable.fromEvent(document, 'mouseup'))
        .map(e => snap(duration - ((x - e.clientX) / parentWidth)))
        .filter(snappedDuration =>
          start + snappedDuration <= getSelectedBars(getState()) * getSelectedResolution(getState())
        )
        .map(snappedDuration =>
          actions.updateNote(channelIndex, id, start, snappedDuration, note)))

const moveNoteEpic = actions$ =>
  actions$.ofType('DRAG_NOTE_START')
    .mergeMap(({ payload: { channelIndex, id, x, start, duration, note, parentWidth } }) =>
      Observable.fromEvent(document, 'mousemove')
        .takeUntil(Observable.fromEvent(document, 'mouseup'))
        .do(e => e.preventDefault())
        .filter(e => e.target.dataset.note)
        .map(e => [snap((e.clientX - x) / parentWidth), e.target.dataset.note])
        .filter(([snappedStart]) => snappedStart >= 0)
        .map(([snapStart, newNote]) =>
          actions.updateNote(channelIndex, id, snapStart, duration, newNote)))

const addAndRemoveNoteEpic = (actions$) => {
  const clickStream = actions$.ofType('PIANO_ROLL_CLICK')
    .map(action => action.payload)

  const singleClickStream = clickStream
    .filter(({ note }) => note)
    .filter(({ id }) => id === undefined)
    .map(({ channelIndex, stepNumber, note }) =>
      actions.addNote(channelIndex, stepNumber, 1, note))

  const doubleClickStream = clickStream
    .buffer(clickStream.debounceTime(250))
    .filter(x => x.length === 2)
    .filter(x => x.every(({ note }) => note))
    .filter(x => x.every(({ id }) => id !== undefined))
    .map(x => x.pop())
    .map(({ channelIndex, id, note }) =>
      actions.removeNote(channelIndex, id, note))

  return Observable.merge(singleClickStream, doubleClickStream)
}

export const epics = [resizeNoteHeadEpic, resizeNoteTailEpic, addAndRemoveNoteEpic, moveNoteEpic]

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

const getNotes = (state, channelIndex) =>
  state.getIn(
    [
      'sequences',
      state.get('selectedIndex'),
      'channels',
      channelIndex,
      'instrument',
      'notes'
    ])

const findStepIndex = (steps, id) => steps.findIndex(s => s.get('id') === id)

const findNoteAndIndex = (notes, id) =>
  notes.reduce((result, steps, noteIndex) => {
    if (result) return result
    const index = findStepIndex(steps, id)
    return (index !== -1) ? [notes.keyOf(steps), index] : undefined
  }, null)


export default {
  ADD_NOTE: (state, { channelIndex, start, duration, note }) =>
    updateSteps(state, channelIndex, note, steps =>
      (steps || List()).push(Map({ start, duration, id: uuid.v4() }))),
  REMOVE_NOTE: (state, { channelIndex, id, note }) =>
    updateSteps(state, channelIndex, note, steps => steps.filter(step => step.get('id') !== id)),
  UPDATE_NOTE: (state, { channelIndex, id, note, start, duration }) => {
    const [prevNote, stepIndex] = findNoteAndIndex(getNotes(state, channelIndex), id)
    if (prevNote === note) {
      return updateSteps(state, channelIndex, note,
        steps => steps.set(stepIndex, Map({ start, duration, id })))
    }
    const nextState = updateSteps(state, channelIndex, prevNote, steps =>
      steps.filter(step => step.get('id') !== id))
    return updateSteps(nextState, channelIndex, note,
      steps => (steps || List()).push(Map({ start, duration, id })))
  }
}
