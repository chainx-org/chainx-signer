import {
  setShowAccountMenu,
  setShowNodeMenu,
  showAccountMenuSelector
} from '../../store/reducers/statusSlice'
import Icon from '../../components/Icon'
import React, { useRef } from 'react'
import { useOutsideClick } from '../../shared'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  i {
    color: #3f3f3f;
  }
`

export default function() {
  const refAccountList = useRef(null)
  const dispatch = useDispatch()
  const showAccountMenu = useSelector(showAccountMenuSelector)

  useOutsideClick(refAccountList, () => {
    dispatch(setShowAccountMenu(false))
  })

  return (
    <Wrapper
      ref={refAccountList}
      onClick={() => {
        dispatch(setShowAccountMenu(!showAccountMenu))
        dispatch(setShowNodeMenu(false))
      }}
    >
      <Icon name="Menu" />
    </Wrapper>
  )
}
