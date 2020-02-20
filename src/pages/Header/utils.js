export function getDelayClass(delay) {
  if (delay === 'timeout') {
    return 'red'
  } else if (delay > 300) {
    return 'yellow'
  } else if (delay <= 300) {
    return 'green'
  } else {
    return 'green'
  }
}

export function getDelayText(delay) {
  return delay ? (delay === 'timeout' ? 'timeout' : delay + ' ms') : ''
}
