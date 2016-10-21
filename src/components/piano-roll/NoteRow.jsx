import React, { PropTypes } from 'react'
import { Range, List } from 'immutable'
import shallowCompare from 'react/lib/shallowCompare'

import './NoteRow.css'

const getSteps = (steps, currentStep) =>
  steps
    .map((x, i) => [x, i])
    .filter(([[start, duration]]) =>
      start <= currentStep + 1 &&
      currentStep < start + duration
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

class NoteRow extends React.Component {
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  render () {
    const { resolution, bars, note, steps } = this.props
    return (
      <div className="note-row">
        {Range(0, resolution * bars).map((currentStep) => {
          const notes = getSteps(steps, currentStep)
          return (
            <div
              className="note-row-step"
              data-step-number={currentStep}
              data-note={note}
              key={currentStep}
              style={{
                backgroundColor: note.indexOf('#') === -1 ? '#e8e8e8' : '#d4d4d4',
                borderBottom: note.slice(0, -1) === 'c' || note.slice(0, -1) === 'f' ? '1px solid #d4d4d4' : '0',
                borderRight: `1px solid ${notes.size === 0 || notes.last().isTail || !notes.some(({ duration }) => duration === 1) ? '#a7a7a7' : 'red'}`,
                borderLeft: currentStep === 0 || currentStep % resolution ? null : '2px solid #797979'
              }}
            >
              { notes.size > 0 &&
                calculateSpacing(notes)
                  .map(({ start, duration, isHead, isTail, index }) =>
                    <div
                      className="note-row-note"
                      key={index}
                      data-step-number={currentStep}
                      data-note={note}
                      data-steps-index={index}
                      style={{
                        marginLeft: `${start * 100}%`,
                        width: `${duration * 100}%`
                      }}
                    >
                      {isHead && <div className="note-row-note-handle" style={{ marginRight: `calc(${isTail ? 50 : 100}% - 2px)` }} />}
                      {isTail && <div className="note-row-note-handle" style={{ marginLeft: `calc(${isHead ? 50 : 100}% - 2px)` }} />}
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
  steps: PropTypes.instanceOf(List).isRequired
}

export default NoteRow
