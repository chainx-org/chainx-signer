import React from 'react'
import DetailItem from './components/DetailItem'
import { useSelector } from 'react-redux'
import {
  toSignExtrinsicSelector,
  toSignMethodNameSelector
} from '../../store/reducers/txSlice'
import styled from 'styled-components'

const Args = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;

  span {
    font-size: 14px;
  }

  & > span {
    color: #afb1b4;
  }

  :last-child {
    word-wrap: break-word;
    word-break: break-all;
    white-space: pre-wrap;
    text-align: right;
  }

  section.args {
    display: flex;
    width: 300px;

    ol,
    li {
      margin: 0;
      padding: 0;
      list-style: none;
    }

    li {
      &:not(:first-of-type) {
        margin-top: 5px;
      }
    }
    .arg-name {
      color: #afb1b4;
      font-size: 14px;
    }
    .arg-value {
      font-size: 14px;
      color: #3f3f3f;
    }
  }
`

export default function() {
  const toSignMethodName = useSelector(toSignMethodNameSelector)
  const methodName = toSignMethodName.replace(/([A-Z])/g, '_$1').toLowerCase()
  const extrinsic = useSelector(toSignExtrinsicSelector)

  return (
    <>
      <DetailItem label="Method" value={methodName} />
      <Args>
        <span>Args</span>
        <section className="args">
          <ol>
            {(extrinsic.argsArr || []).map((arg, index) => {
              if (!arg) {
                return null
              }

              return (
                <li key={index}>
                  <span className="arg-name">{arg.name}: </span>
                  <span className="arg-value">
                    {arg.value.toString().length > 10000
                      ? '[object Object]'
                      : arg.value.toString()}
                  </span>
                </li>
              )
            })}
          </ol>
        </section>
      </Args>
    </>
  )
}
