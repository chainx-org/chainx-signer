import React from 'react'
import './nodeAction.scss'

function NodeError() {
  return (
    <div className="node-error">
      <span className="msg">
        Failed to init ChainX instance, please switch node and retry.
      </span>
    </div>
  )
}

export default NodeError
