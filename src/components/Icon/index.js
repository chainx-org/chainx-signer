import React from 'react'

function Icon(props) {
  const { className = {}, style = {}, name = '' } = props
  return <i className={`iconfont icon${name} ${className}`} style={style} />
}

export default Icon
