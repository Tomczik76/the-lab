import React, { PropTypes } from 'react'
import { Range } from 'immutable'
import OctaveKeys from './OctaveKeys'

const container = {
  display: 'flex',
  flexGrow: 1,
}

const octaveGraph = {
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  borderWidth: '0 1px 0 0',
  borderStyle: 'solid',
  borderColor: '#a7a7a7'
}

const row = {
  flexGrow: 1,
  borderTop: '0',
  borderRight: '0',
  borderLeft: '0',
  borderColor: '#d4d4d4'
}
const blackNotes = [1, 3, 5, 8, 10]

const getRows = (resolution, bars) =>
  Range().take(resolution * bars).map(i =>
    <div key={`pianoRoll_${i}`} style={(i + 1) % resolution ? octaveGraph : Object.assign({}, octaveGraph, { borderWidth: '0 2px 0 0', borderColor: '#797979' })}>
      {
        Range().take(12).map(j =>
          <div
            key={`pianoRoll_${i}_${j}`}
            style={Object.assign(
              { backgroundColor: blackNotes.indexOf(j) === -1 ? '#e8e8e8' : '#d4d4d4' },
              { borderBottom: j === 6 ? '1px' : '0', borderStyle: 'solid' },
              row)}
          />
        )
      }
    </div>
  )
const PianoRoll =
  ({
    resolution,
    bars
  }) =>
    <div style={container}>
      <div>
        {Range(8, -1).map(i => <OctaveKeys key={i} number={i} />)}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        {Range(8, -1).map(i =>
          <div key={i} style={{ display: 'flex', flexGrow: 1 }}>
            {getRows(resolution, bars)}
          </div>
        )}
      </div>
    </div>

PianoRoll.propTypes = {
  resolution: PropTypes.number.isRequired,
  bars: PropTypes.number.isRequired
}

export default PianoRoll
