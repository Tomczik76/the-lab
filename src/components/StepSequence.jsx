import React, { PropTypes } from 'react'
import shallowCompare from 'react/lib/shallowCompare'
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
  outline: '0px',
  margin: '0 1px 0 0'
}
const buttonGroupCss = {
  margin: '0 10px 2px 0'
}

const labelContainerCss = {
  fontFamily: 'sans-serif',
  display: 'flex',
  minWidth: '60px',
  borderColor: 'black',
  borderWidth: '2px',
  borderStyle: 'solid',
  borderRadius: '5px',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '0 10px 2px 0',
  backgroundColor: '#f5f5f5'
}

const stepSequencerButtonOn = Object.assign({}, buttonCss, {
  backgroundColor: '#610186'
})
const stepSequencerButtonOff = Object.assign({}, buttonCss, {
  backgroundColor: '#ce4dff'
})

class StepSequence extends React.Component {
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  render () {
    const { resolution, bars, steps, label, onToggleStepClick } = this.props
    return (
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
              <div
                key={`stepSequencerButtonGroup_${i}`}
                style={bars - 1 !== i ? buttonGroupCss : null}
              >
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
    )
  }
}

StepSequence.propTypes = {
  resolution: PropTypes.number.isRequired,
  bars: PropTypes.number.isRequired,
  steps: PropTypes.instanceOf(List),
  onToggleStepClick: PropTypes.func.isRequired,
  label: PropTypes.string
}

export default StepSequence

