import {
  setShowAccountMenu,
  setShowNodeMenu,
  showAccountMenuSelector
} from '../../store/reducers/statusSlice'
import Icon from '../../components/Icon'
import React, { useRef } from 'react'
import { useOutsideClick } from '../../shared'
import { useDispatch, useSelector } from 'react-redux'

export default function() {
  const refAccountList = useRef(null)
  const dispatch = useDispatch()
  const showAccountMenu = useSelector(showAccountMenuSelector)

  useOutsideClick(refAccountList, () => {
    dispatch(setShowAccountMenu(false))
  })

  return (
    <div
      ref={refAccountList}
      className="setting"
      onClick={() => {
        dispatch(setShowAccountMenu(!showAccountMenu))
        dispatch(setShowNodeMenu(false))
      }}
    >
      <Icon name="Menu" className="setting-icon" />
    </div>
  )
}
