import BigNumber from 'bignumber.js'

export default function toPrecision(value, precision = 0, showPrecision = 0) {
  precision = Number(precision)
  return new BigNumber(value)
    .dividedBy(Math.pow(10, precision))
    .toFixed(showPrecision || precision)
}

export function bigAdd(valueStr1, valueStr2) {
  return new BigNumber(valueStr1).plus(valueStr2).toString()
}

export function localString(numberStr) {
  if (numberStr.indexOf('.') < 0) {
    return Number(numberStr).toLocaleString()
  }

  const [digit, fraction] = numberStr.split('.')
  return `${Number(digit).toLocaleString()}.${fraction}`
}
