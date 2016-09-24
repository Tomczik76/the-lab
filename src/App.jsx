import { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Song } from 'react-music'

import { playSelector, tempoSelector } from './selectors'

const App = (props) => {
  const { tempo, play } = props
  return (
    <Song tempo={tempo} autoplay={play}>
    </Song>
  )
}

App.propTypes = {
  tempo: PropTypes.number.isRequired,
  play: PropTypes.boolean.isRequired
}

const mapStateToProps = (state) => {
  return {
    tempo: tempoSelector(state),
    play: playSelector(state),
    sequences: state.get('sequences')
  }
}

export default connect(mapStateToProps)(App)
