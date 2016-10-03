import React, { PropTypes } from 'react'
import { Range, List } from 'immutable'

const containerCss = {
  display: 'flex',
  flexDirection: 'row'
}

const buttonCss = {
  width: '25px',
  height: '35px',
  borderColor: 'black',
  borderWidth: '2px',
  borderStyle: 'solid',
  borderRadius: '5px',
  outline: '0px'
}
const buttonGroupCss = {
  margin: '0 10px 2px 0'
}

const labelContainerCss = {
  display: 'flex',
  minWidth: '60px',
  borderColor: 'black',
  borderWidth: '2px',
  borderStyle: 'solid',
  borderRadius: '5px',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '0 10px 2px 0'
}

const stepSequencerButtonOn = Object.assign({}, buttonCss, {
  backgroundColor: 'red'
})
const stepSequencerButtonOff = Object.assign({}, buttonCss, {
  backgroundColor: 'grey'
})

const StepSequence = ({ resolution, bars, steps, label, onToggleStepClick }) =>
  <div style={containerCss}>
    <div style={labelContainerCss}>
        { label }
    </div>

    {
      Range()
        .take(resolution * bars)
        .map(i => steps.includes(i))
        .groupBy((_, x) => Math.floor(x / resolution))
        .toList()
        .map((buttonGroup, i) =>
          <div key={`stepSequencerButtonGroup_${i}`} style={buttonGroupCss}>
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
  steps: PropTypes.instanceOf(List),
  onToggleStepClick: PropTypes.func.isRequired,
  label: PropTypes.string
}

export default StepSequence

