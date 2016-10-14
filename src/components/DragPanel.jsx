import React, { PropTypes } from 'react'
import { Observable } from '@reactivex/rxjs'

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

const DragPanel = ({ title, x, y, children, width, height, onMove, onResize, innerBorder }) =>
  <div className={`drag-panel ${onResize ? 'drag-panel-resize' : 'drag-panel-no-resize'}`} style={{ left: x, top: y }}>
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
      {onResize && <div className="drag-panel-bottom-drag" onMouseDown={e => onResizePanel(e, 'ns', height, width, onResize)} />}
    </div>
    {onResize &&
      <div className="drag-panel-right">
        <div className="drag-panel-right-drag" onMouseDown={e => onResizePanel(e, 'ew', height, width, onResize)} />
        <div className="drag-panel-bottom-right-drag" onMouseDown={e => onResizePanel(e, 'nwse', height, width, onResize)} />
      </div>
    }
  </div>

DragPanel.propTypes = {
  title: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
  children: PropTypes.instanceOf(Object),
  onMove: PropTypes.func,
  onResize: PropTypes.func,
  width: PropTypes.number,
  height: PropTypes.number,
  innerBorder: PropTypes.bool
}

export default DragPanel
