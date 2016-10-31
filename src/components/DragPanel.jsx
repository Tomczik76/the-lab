import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import shallowCompare from 'react/lib/shallowCompare'
import { Map } from 'immutable'
import { bindActionCreators } from 'redux'
import { actions as panelActions } from '../store/panel'

import './DragPanel.css'

const { dragStart, resizeStart } = panelActions

class DragPanel extends React.Component {
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  onDragStart (e) {
    const x = e.clientX - e.target.parentElement.parentElement.offsetLeft
    const y = e.clientY - e.target.parentElement.parentElement.offsetTop
    this.props.dragStart(this.props.index, x, y)
  }

  onResizePanel (e, orientation, height, width) {
    const x = e.clientX
    const y = e.clientY
    this.props.resizeStart(this.props.index, x, y, orientation, height, width)
  }

  render () {
    const { title, children, innerBorder, panel, index } = this.props
    const x = panel.get('x')
    const y = panel.get('y')
    const width = panel.get('width')
    const height = panel.get('height')

    return (
      <div className={`drag-panel ${index > 0 ? 'drag-panel-resize' : 'drag-panel-no-resize'}`} style={{ left: x, top: y }}>
        <div style={{ flexGrow: 1 }}>
          <div className="drag-panel-title-bar" onMouseDown={e => this.onDragStart(e)}>
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
          {index > 0 && <div className="drag-panel-bottom-drag" onMouseDown={e => this.onResizePanel(e, 'ns', height, width)} />}
        </div>
        {index > 0 &&
          <div className="drag-panel-right">
            <div className="drag-panel-right-drag" onMouseDown={e => this.onResizePanel(e, 'ew', height, width)} />
            <div className="drag-panel-bottom-right-drag" onMouseDown={e => this.onResizePanel(e, 'nwse', height, width)} />
          </div>
        }
      </div>
    )
  }
}

DragPanel.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.instanceOf(Object),
  dragStart: PropTypes.func,
  resizeStart: PropTypes.func,
  innerBorder: PropTypes.bool,
  panel: PropTypes.instanceOf(Map),
  index: PropTypes.number.isRequired
}
const mapDispatchToProps = (dispatch, ownProps) => bindActionCreators(
  {
    dragStart,
    resizeStart
  }, dispatch)

const mapStateToProps = (state, ownProps) => ({
  panel: state.getIn(['panel', ownProps.index])
})

export default connect(mapStateToProps, mapDispatchToProps)(DragPanel)
