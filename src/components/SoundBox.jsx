import React, { PropTypes } from 'react'
import { Song, Sequencer, Sampler } from 'react-music'
import { Map } from 'immutable'

const getInstruments = sequence =>
  sequence.get('channels').map((chan) => {
    const instrument = chan.get('instrument')
    switch (instrument.get('type')) {
      case 'sampler':
        return <Sampler sample={instrument.get('sample')} steps={instrument.get('steps').toArray()} />
      default:
        return null
    }
  })

const SoundBox =
  ({
    tempo,
    play,
    resolution,
    bars,
    sequence
  }) =>
    <Song tempo={tempo} autoPlay={play} >
      <Sequencer resolution={resolution} bars={bars}>
        {
          getInstruments(sequence)
        }
      </Sequencer>
    </Song>

SoundBox.propTypes = {
  tempo: PropTypes.number.isRequired,
  play: PropTypes.bool.isRequired,
  sequence: PropTypes.instanceOf(Map),
  resolution: PropTypes.number,
  bars: PropTypes.number
}

export default SoundBox
