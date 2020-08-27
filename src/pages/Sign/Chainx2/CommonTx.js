import { useSelector } from 'react-redux'
import { chainx2ToSignDataSelector } from '@store/reducers/txSlice'
import DetailItem from '@pages/RequestSign/components/DetailItem'
import React from 'react'
import styled from 'styled-components'

const Args = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  margin-top: 10px;

  section.args {
    ol,
    li {
      margin: 5px 0 0 10px;
      padding: 0;
      font-size: 14px;

      word-wrap: break-word;
      word-break: break-all;
      white-space: pre-wrap;
    }
  }

  & > span {
    font-size: 14px;
    color: #afb1b4;
  }
`

export default function() {
  const { section, method, params } =
    useSelector(chainx2ToSignDataSelector) || {}

  return (
    <>
      <DetailItem label="Module" value={section} />
      <DetailItem label="Method" value={method} />
      <Args>
        <span>Args</span>
        <section className="args">
          <ol>
            {params.map((param, idx) => {
              return (
                <li key={idx}>
                  <span>{param}</span>
                </li>
              )
            })}
          </ol>
        </section>
      </Args>
    </>
  )
}
