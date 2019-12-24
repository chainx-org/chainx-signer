import React from 'react'

function getDotInCenterStr(value) {
  if (value && value.length > 13) {
    const length = value.length
    return value.slice(0, 5) + '...' + value.slice(length - 5, length)
  }
  return value
}

function DotInCenterStr(props) {
  const { value } = props
  const simpleStr = getDotInCenterStr(value)

  return <span>{simpleStr}</span>
}

export default DotInCenterStr
