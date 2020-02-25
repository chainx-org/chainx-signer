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
