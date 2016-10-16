import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import shallowCompare from 'react/lib/shallowCompare'
import { Map } from 'immutable'
import { bindActionCreators } from 'redux'
import { Observable } from '@reactivex/rxjs'

import { actions as panelActions } from '../store/panel'

const { movePanel, resizePanel } = panelActions

import './DragPanel.css'

const onDrag = (evt, move) => {
  const x = evt.clientX - evt.target.parentElement.parentElement.offsetLeft
  const y = evt.clientY - evt.target.parentElement.parentElement.offsetTop
  Observable.fromEvent(document, 'mousemove')
    .takeUntil(Observable.fromEvent(document, 'mouseup'))
    .subscribe(e => move(e.clientX - x, e.clientY - y))
}

const onResizePanel = (evt, orientation, height, width, resize) => {
  const x = evt.clientX
  const y = evt.clientY
  Observable.fromEvent(document, 'mousemove')
    .takeUntil(Observable.fromEvent(document, 'mouseup'))
    .subscribe(e =>
      resize(
        orientation === 'ns' ? width : width + (e.clientX - x),
        orientation === 'ew' ? height : height + (e.clientY - y)
      )
    )
}

class DragPanel extends React.Component {
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  render () {
    const { title, children, onMove, onResize, innerBorder, panel, index } = this.props
    const x = panel.get('x')
    const y = panel.get('y')
    const width = panel.get('width')
    const height = panel.get('height')

    return (
      <div className={`drag-panel ${index > 0 ? 'drag-panel-resize' : 'drag-panel-no-resize'}`} style={{ left: x, top: y }}>
        <div style={{ flexGrow: 1 }}>
          <div className="drag-panel-title-bar" onMouseDown={e => onDrag(e, onMove)}>
            {title}
          </div>
          <div
            style={
              Object.assign({ overflow: 'auto' },
                width ? { width: `${width}px` } : null,
                height ? { height: `${height}px` } : null,
                innerBorder ? { border: '1px solid' } : null)
            }
          >
            {children}
          </div>
          {index > 0 && <div className="drag-panel-bottom-drag" onMouseDown={e => onResizePanel(e, 'ns', height, width, onResize)} />}
        </div>
        {index > 0 &&
          <div className="drag-panel-right">
            <div className="drag-panel-right-drag" onMouseDown={e => onResizePanel(e, 'ew', height, width, onResize)} />
            <div className="drag-panel-bottom-right-drag" onMouseDown={e => onResizePanel(e, 'nwse', height, width, onResize)} />
          </div>
        }
      </div>
    )
  }
}

DragPanel.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.instanceOf(Object),
  onMove: PropTypes.func,
  onResize: PropTypes.func,
  innerBorder: PropTypes.bool,
  panel: PropTypes.instanceOf(Map),
  index: PropTypes.number.isRequired
}
const mapDispatchToProps = (dispatch, ownProps) => bindActionCreators(
  {
    onMove: (x, y) => movePanel(ownProps.index, x, y),
    onResize: (w, h) => resizePanel(ownProps.index, w, h)
  }, dispatch)

const mapStateToProps = (state, ownProps) => ({
  panel: state.getIn(['panel', ownProps.index])
})

export default connect(mapStateToProps, mapDispatchToProps)(DragPanel)
