import React, { PropTypes } from 'react'
import { Song, Sequencer, Sampler, Synth } from 'react-music'
import { Map } from 'immutable'

const notesToSteps = notes => notes
  .map((steps, note) =>
    steps.map(step => step.push(note)))
  .toList()
  .flatten(true)
  .toJS()

const getInstruments = sequence =>
  sequence.get('channels').map((chan, i) => {
    const instrument = chan.get('instrument')
    switch (instrument.get('type')) {
      case 'sampler':
        return <Sampler key={i} sample={instrument.get('sample')} steps={instrument.get('steps').toArray()} />
      case 'synth':
        return <Synth key={i} type={instrument.get('synthType')} steps={notesToSteps(instrument.get('notes'))} />
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
    <Song tempo={tempo} playing={play} >
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
