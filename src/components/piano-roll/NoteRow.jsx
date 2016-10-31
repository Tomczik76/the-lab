import React, { PropTypes } from 'react'
import { Range, List } from 'immutable'
import shallowCompare from 'react/lib/shallowCompare'

import './NoteRow.css'

const getNormalizedSteps = (steps, currentStep) =>
  steps
    .map((x, i) => [x, i])
    .filter(([[start, duration]]) =>
      start < currentStep + 1 &&
      start + duration > currentStep
    )
    .map(([[start, duration], stepIndex]) => ({
      start: start <= currentStep ? 0 : start - currentStep,
      duration: duration + start >= currentStep + 1 ? 1 : (duration + start) - currentStep,
      isHead: start >= currentStep,
      isTail: start + duration <= currentStep + 1,
      stepIndex
    })
)

const calculateMargins = ([{ start, duration, stepIndex, isTail, isHead }, ...rest], acc = 0) => {
  const marginLeft = start - acc
  const width = duration - acc - (start - acc)
  return [{ marginLeft, width, stepIndex, isHead, isTail },
    ...(rest.length ? calculateMargins(rest, duration) : [])]
}

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

class NoteRow extends React.Component {
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  onDragHeadStart (e, steps, stepIndex, note) {
    const step = steps.get(stepIndex)
    const [start, duration] = step
    const end = start + duration
    const x = e.clientX
    const parentWidth = e.target.parentElement.clientWidth
    this.props.onDragHeadStart(stepIndex, x, start, end, note, parentWidth)
  }

  onDragTailStart (e, steps, stepIndex, note) {
    const step = steps.get(stepIndex)
    const [start, duration] = step
    const x = e.clientX
    const parentWidth = e.target.parentElement.clientWidth
    this.props.onDragTailStart(stepIndex, x, start, duration, note, parentWidth)
  }

  render () {
    const { resolution, bars, note, steps } = this.props
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
                calculateMargins(normalizedSteps)
                  .map(({ marginLeft, width, isHead, isTail, stepIndex }) =>
                    <div
                      className="note-row-note"
                      key={stepIndex}
                      data-step-number={currentStep}
                      data-note={note}
                      data-step-index={stepIndex}
                      style={{ marginLeft: `${marginLeft * 100}%`, width: `${width * 100}%` }}
                    >
                      {isHead &&
                        <div
                          onMouseDown={e => this.onDragHeadStart(e, steps, stepIndex, note)}
                          className="note-row-note-handle"
                          style={{ marginRight: `calc(${isTail ? 50 : 100}% - 2px)` }}
                        />
                      }
                      {isTail &&
                        <div
                          onMouseDown={e => this.onDragTailStart(e, steps, stepIndex, note)}
                          className="note-row-note-handle"
                          style={{ marginLeft: `calc(${isHead ? 50 : 100}% - 2px)` }}
                        />
                      }
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
  onDragHeadStart: PropTypes.func.isRequired,
  onDragTailStart: PropTypes.func.isRequired
}

export default NoteRow
