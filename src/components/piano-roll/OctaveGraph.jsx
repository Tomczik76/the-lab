import React, { PropTypes } from 'react'
import { Range, List } from 'immutable'
import shallowCompare from 'react/lib/shallowCompare'

import './OctaveGraph.css'

const blackNotes = [1, 3, 5, 8, 10]

const getNotes = (scale, steps, currentStep, currentNote) =>
  steps
    .map((x, i) => [x, i])
    .filter(([[start, duration, notes]]) =>
      start <= currentStep + 1 &&
      currentStep < start + duration &&
      notes.contains(currentNote))
    .map(([[start, duration, notes], i]) => [
      start <= currentStep ? 0 : start - currentStep,
      duration + start >= currentStep + 1 ? 1 : (duration + start) - currentStep,
      i
    ])

const calculateSpacing = ([[start, end, i], ...rest], acc = 0) =>
  [[start - acc, end - acc - (start - acc), i], ...(rest.length ? calculateSpacing(rest, end) : [])]

class OctaveGraph extends React.Component {
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  render () {
    const { resolution, bars, number, steps } = this.props
    const scale = ['b', 'a#', 'a', 'g#', 'g', 'f#', 'f', 'e', 'd#', 'd', 'c#', 'c'].map(x => x + number)
    return (
      <div style={{ display: 'flex', flexGrow: 1 }}>
        {Range(0, resolution * bars).map(currentStep =>
          <div
            className="octave-graph"
            key={currentStep}
            style={(currentStep + 1) % resolution ? null : { borderWidth: '0 2px 0 0', borderColor: '#797979' }}
          >
            {
              scale.map((currentNote, noteNumber) => {
                const notes = getNotes(scale, steps, currentStep, currentNote)
                return (
                  <div
                    className="octave-graph-row"
                    data-step-number={currentStep}
                    data-note={currentNote}
                    key={(noteNumber * 100) + currentStep}
                    style={{
                      backgroundColor: blackNotes.indexOf(noteNumber) === -1 ? '#e8e8e8' : '#d4d4d4',
                      borderBottom: noteNumber === 6 || noteNumber === 11 ? '1px solid #d4d4d4' : '0',
                      borderRight: notes.size === 0 || !notes.some(([_, end]) => end === 1) ? '1px solid #a7a7a7' : null
                    }}
                  >
                    { notes.size > 0 &&
                      calculateSpacing(notes)
                        .map(([start, duration, i]) =>
                          <div
                            key={i}
                            data-step-number={currentStep}
                            data-note={currentNote}
                            data-steps-index={i}
                            style={{
                              backgroundColor: 'red',
                              marginLeft: `${start * 100}%`,
                              width: `${duration * 100}%`
                            }}
                          />)
                    }
                  </div>
                )
              })
            }
          </div>
        )}
      </div>
    )
  }
}

OctaveGraph.propTypes = {
  bars: PropTypes.number.isRequired,
  resolution: PropTypes.number.isRequired,
  number: PropTypes.number.isRequired,
  steps: PropTypes.instanceOf(List).isRequired
}

export default OctaveGraph
