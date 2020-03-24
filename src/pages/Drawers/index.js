import { Drawer } from '@chainx/ui'
import React from 'react'
import styled from 'styled-components'
import { DefaultButton } from '@chainx/ui/dist'
import { useHistory } from 'react-router'
import { useDispatch } from 'react-redux'
import { setShowImportMenu } from '../../store/reducers/statusSlice'

const Wrapper = styled.div`
  padding: 20px;

  & > button:not(:first-of-type) {
    margin-top: 16px;
  }
`

export function NewAccountDrawer() {
  const history = useHistory()
  const dispatch = useDispatch()

  const closeMenu = () => {
    dispatch(setShowImportMenu(false))
  }

  return (
    <Drawer anchor="bottom" open style={{ padding: 20 }} onClose={closeMenu}>
      <Wrapper>
        <DefaultButton
          size="fullWidth"
          onClick={() => {
            closeMenu()
            history.push('/importMnemonic')
          }}
        >
          Mnemonic
        </DefaultButton>
        <DefaultButton
          size="fullWidth"
          onClick={() => {
            closeMenu()
            history.push('/importPrivateKey')
          }}
        >
          Private Key
        </DefaultButton>
      </Wrapper>
    </Drawer>
  )
}
