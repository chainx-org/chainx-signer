import { Drawer } from '@chainx/ui'
import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { DefaultButton } from '@chainx/ui/dist'
import { useHistory } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import {
  setImportedKeystore,
  setShowImportMenu,
  showImportMenuSelector
} from '../../store/reducers/statusSlice'
import ErrorMessage from '../../components/ErrorMessage'
import { isKeystoreKeysRight } from '../../utils'

const Wrapper = styled.div`
  padding: 20px;

  & > button:not(:first-of-type) {
    margin-top: 16px;
  }
`

export function NewAccountDrawer() {
  const history = useHistory()
  const dispatch = useDispatch()
  const showImportMenu = useSelector(showImportMenuSelector)
  const inputElement = useRef()

  const [errMsg, setErrMsg] = useState(null)

  const closeMenu = () => {
    dispatch(setShowImportMenu(false))
  }

  return (
    <Drawer
      anchor="bottom"
      open={showImportMenu}
      style={{ padding: 20 }}
      onClose={closeMenu}
    >
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
        <DefaultButton
          size="fullWidth"
          onClick={() => {
            inputElement.current.click()
          }}
        >
          Keystore File
          <input
            id="upload-keystore"
            type="file"
            ref={inputElement}
            style={{ display: 'none' }}
            onChange={e => {
              setErrMsg(null)
              const file = e.currentTarget.files[0]
              if (!file) return

              const reader = new FileReader()
              reader.readAsText(file, 'UTF-8')

              reader.onload = e => {
                try {
                  const result = JSON.parse(e.target.result)
                  if (!isKeystoreKeysRight(result)) {
                    return setErrMsg('Invalid keystore format')
                  }
                  dispatch(setImportedKeystore(result))

                  closeMenu()
                  history.push('/importKeystore')
                } catch (e) {
                  setErrMsg('Invalid keystore')
                }
              }
            }}
          />
        </DefaultButton>

        {errMsg && <ErrorMessage msg={errMsg} />}
      </Wrapper>
    </Drawer>
  )
}
