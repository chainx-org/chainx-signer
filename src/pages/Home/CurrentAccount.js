import { useDispatch, useSelector } from 'react-redux'
import React, { useRef } from 'react'
import styled from 'styled-components'
import Icon from '../../components/Icon'
import {
  setShowAccountAction,
  showAccountActionSelector
} from '../../store/reducers/statusSlice'
import AccountActionPanel from './AccountActionPanel'
import { useOutsideClick } from '../../shared'
import Account from './Account'

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 56px;
  background: #f2f3f4;
  align-items: center;
  justify-content: space-around;

  position: relative;
`

const ArrowWrapper = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 24px;

  i {
    cursor: pointer;
    font-size: 8px;
    color: #6a6a6b;
  }
`

export default function() {
  const ref = useRef(null)
  const dispatch = useDispatch()
  const showAccountAction = useSelector(showAccountActionSelector)

  useOutsideClick(ref, () => {
    dispatch(setShowAccountAction(false))
  })

  return (
    <Wrapper>
      <Account />
      <ArrowWrapper
        ref={ref}
        onClick={() => {
          dispatch(setShowAccountAction(!showAccountAction))
        }}
      >
        <Icon className="arrow-icon" name="Arrowdown" />
      </ArrowWrapper>
      {showAccountAction && <AccountActionPanel />}
    </Wrapper>
  )
}
