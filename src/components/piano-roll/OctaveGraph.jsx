import React, { PropTypes } from 'react'
import { Range, List } from 'immutable'
import shallowCompare from 'react/lib/shallowCompare'

import './OctaveGraph.css'

const blackNotes = [1, 3, 5, 8, 10]

const onClickCell = () => {

}

const getNote = (scale, steps, currentStep, currentNote) => {
  const step = steps.find(([start, duration, notes]) =>
    start <= currentStep + 1 &&
    currentStep < start + duration &&
    notes.contains(currentNote))

  if (step === undefined) return {}

  const noteStart = step.get(0)
  const noteEnd = noteStart + step.get(1)

  const start = noteStart <= currentStep ? 0 : noteStart - currentStep
  const end = noteEnd >= currentStep + 1 ? 1 : noteEnd - currentStep
  return { start, end }
}

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
                const { start, end } = getNote(scale, steps, currentStep, currentNote)
                return (
                  <div
                    className="octave-graph-row"
                    data-step-number={currentStep}
                    data-note={currentNote}
                    key={(noteNumber * 100) + currentStep}
                    style={{
                      backgroundColor: blackNotes.indexOf(noteNumber) === -1 ? '#e8e8e8' : '#d4d4d4',
                      borderBottom: noteNumber === 6 || noteNumber === 11 ? '1px solid #d4d4d4' : '0',
                      borderRight: end === undefined || end < 1 ? '1px solid #a7a7a7' : null
                    }}
                  >
                    {start !== undefined &&
                      <div
                        style={{
                          backgroundColor: 'red',
                          flexGrow: 1,
                          marginLeft: `${start * 100}%`,
                          marginRight: `${100 - (end * 100)}%`
                        }}
                      />
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
