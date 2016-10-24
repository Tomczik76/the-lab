import React, { PropTypes } from 'react'
import { Range, List } from 'immutable'
import shallowCompare from 'react/lib/shallowCompare'
import { Observable } from '@reactivex/rxjs'

import './NoteRow.css'

const getNormalizedSteps = (steps, currentStep) =>
  steps
    .map((x, i) => [x, i])
    .filter(([[start, duration]]) =>
      start < currentStep + 1 &&
      start + duration > currentStep
    )
    .map(([[start, duration], index]) => ({
      start: start <= currentStep ? 0 : start - currentStep,
      duration: duration + start >= currentStep + 1 ? 1 : (duration + start) - currentStep,
      isHead: start >= currentStep,
      isTail: start + duration <= currentStep + 1,
      index
    })
)

const calculateSpacing = ([{ start, duration, index, isTail, isHead }, ...rest], acc = 0) =>
  [{ start: start - acc, duration: duration - acc - (start - acc), index, isHead, isTail },
    ...(rest.length ? calculateSpacing(rest, duration) : [])]

const getNoteStyles = (currentStep, resolution, note, notes) => {
  const backgroundColor = note.indexOf('#') === -1 ? '#e8e8e8' : '#d4d4d4'

  const borderRight = `1px solid ${
    notes.size === 0 ||
    notes.last().isTail ||
    notes.every(({ duration }) => duration !== 1) ? '#a7a7a7' : 'red'}`
  const borderLeft = currentStep === 0 || currentStep % resolution ? null : '2px solid #797979'
  const borderBottom = note.slice(0, -1) === 'c' || note.slice(0, -1) === 'f' ? '1px solid #d4d4d4' : null
  return { backgroundColor, borderRight, borderLeft, borderBottom }
}

const snap = value => (Math.abs(value) % 1 > 0.9 || Math.abs(value) % 1 < 0.1
  ? Math.round(value) : value)

const stretchHead = (evt, steps, index, note, resizeNote) => {
  const step = steps.get(index)
  const [start, duration] = step
  const end = start + duration
  const x = evt.clientX
  const parentWidth = evt.target.parentElement.clientWidth
  Observable.fromEvent(document, 'mousemove')
    .takeUntil(Observable.fromEvent(document, 'mouseup'))
    .subscribe((e) => {
      const snappedStart = snap(start - ((x - e.clientX) / parentWidth))
      if (snappedStart >= 0) resizeNote(index, snappedStart, end - snappedStart, note)
      e.preventDefault()
    })
}

const stretchTail = (evt, steps, index, note, resizeNote) => {
  const step = steps.get(index)
  const [start, duration] = step
  const x = evt.clientX
  const parentWidth = evt.target.parentElement.clientWidth
  Observable.fromEvent(document, 'mousemove')
    .takeUntil(Observable.fromEvent(document, 'mouseup'))
    .subscribe((e) => {
      const snappedDuration = snap(duration - ((x - e.clientX) / parentWidth))
      resizeNote(index, start, snappedDuration, note)
      e.preventDefault()
    })
}

class NoteRow extends React.Component {
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  render () {
    const { resolution, bars, note, steps, resizeNote } = this.props
    return (
      <div className="note-row">
        {Range(0, resolution * bars).map((currentStep) => {
          const normalizedSteps = getNormalizedSteps(steps, currentStep)
          return (
            <div
              className="note-row-step"
              data-step-number={currentStep}
              data-note={note}
              key={currentStep}
              style={getNoteStyles(currentStep, resolution, note, normalizedSteps)}
            >
              { normalizedSteps.size > 0 &&
                calculateSpacing(normalizedSteps)
                  .map(({ start, duration, isHead, isTail, index }) =>
                    <div
                      className="note-row-note"
                      key={index}
                      data-step-number={currentStep}
                      data-note={note}
                      data-steps-index={index}
                      style={{ marginLeft: `${start * 100}%`, width: `${duration * 100}%` }}
                    >
                      {isHead &&
                        <div
                          onMouseDown={e => stretchHead(e, steps, index, note, resizeNote)}
                          className="note-row-note-handle"
                          style={{ marginRight: `calc(${isTail ? 50 : 100}% - 2px)` }}
                        />
                      }
                      {isTail && <div onMouseDown={e => stretchTail(e, steps, index, note, resizeNote)} className="note-row-note-handle" style={{ marginLeft: `calc(${isHead ? 50 : 100}% - 2px)` }} />}
                    </div>
                    )
              }
            </div>
          )
        })}
      </div>
    )
  }
}

NoteRow.propTypes = {
  bars: PropTypes.number.isRequired,
  resolution: PropTypes.number.isRequired,
  note: PropTypes.string.isRequired,
  steps: PropTypes.instanceOf(List).isRequired,
  resizeNote: PropTypes.func.isRequired
}

export default NoteRow
