import toPrecision from '../../shared/toPrecision'
import { Slider } from '@chainx/ui'
import React from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { pcxPrecisionSelector } from '../../store/reducers/assetSlice'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  .adjust-gas-desc {
    display: flex;
    flex-direction: column;
    color: #000;
    span {
      font-size: 14px;
    }
    div {
      margin-top: 16px;
      display: flex;
      justify-content: space-between;
    }
    > span {
      margin-top: 4px;
      opacity: 0.32;
    }
  }
`

const marks = [
  {
    value: 1,
    label: '1x'
  },
  {
    value: 10,
    label: '10x'
  }
]

export default function({ currentGas, acceleration, setAcceleration }) {
  const precision = useSelector(pcxPrecisionSelector)

  return (
    <Wrapper>
      <div className="adjust-gas-desc">
        <div>
          <span>Fee</span>
          <span className="yellow">
            {toPrecision(currentGas, precision)} PCX
          </span>
        </div>
        <span>More fee, faster speed</span>
      </div>
      <Slider
        defaultValue={acceleration}
        onChange={v => setAcceleration(v)}
        // getAriaValueText={valuetext}
        aria-labelledby="discrete-slider"
        valueLabelDisplay="auto"
        step={1}
        marks={marks}
        min={1}
        max={10}
      />
    </Wrapper>
  )
}
