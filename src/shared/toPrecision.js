import BigNumber from 'bignumber.js'

export default function toPrecision(value, precision = 0, showPrecision = 0) {
  precision = Number(precision)
  return new BigNumber(value)
    .dividedBy(Math.pow(10, precision))
    .toFixed(showPrecision || precision)
}
