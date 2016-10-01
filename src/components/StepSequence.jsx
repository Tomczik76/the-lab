import React, { PropTypes } from 'react'
import { Range, List } from 'immutable'

const stepSequencerButton = {
  display: 'inline-block',
  width: '25px',
  height: '35px',
  borderColor: 'black',
  borderWidth: '2px',
  borderStyle: 'solid',
  borderRadius: '5px',
  outline: '0px',
  margin: '1px'
}
const stepSequencerButtonGroup = {
  display: 'inline-block',
  margin: '5px'
}

const stepSequencerButtonOn = Object.assign({}, stepSequencerButton, {
  backgroundColor: 'red'
})
const stepSequencerButtonOff = Object.assign({}, stepSequencerButton, {
  backgroundColor: 'grey'
})

const StepSequence = ({ resolution, bars, steps, onToggleStepClick }) =>
  <div>
    {
      Range()
        .take(resolution * bars)
        .map(i => steps.includes(i))
        .groupBy((_, x) => Math.floor(x / resolution))
        .toList()
        .map((buttonGroup, i) =>
          <div key={`stepSequencerButtonGroup_${i}`} style={stepSequencerButtonGroup}>
            {
              buttonGroup.map((on, j) =>
                <button
                  key={`stepSequencerButton_${i}_${j}`}
                  style={on ? stepSequencerButtonOn : stepSequencerButtonOff}
                  onClick={() => onToggleStepClick((i * resolution) + j, !on)}
                />)
            }
          </div>)
    }
  </div>

StepSequence.propTypes = {
  resolution: PropTypes.number.isRequired,
  bars: PropTypes.number.isRequired,
  steps: React.PropTypes.instanceOf(List),
  onToggleStepClick: React.PropTypes.func.isRequired
}

export default StepSequence

