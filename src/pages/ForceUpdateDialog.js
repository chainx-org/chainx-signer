import { Dialog, PrimaryButton } from '@chainx/ui'
import styled from 'styled-components'
import React from 'react'
import { useSelector } from 'react-redux'
import { updateInfoSelector } from '../store/reducers/statusSlice'

const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    min-width: unset !important;
  }

  .makeStyles-header-1 {
    justify-content: space-around;
  }

  .makeStyles-title-2 {
    font-weight: 600;
  }

  .makeStyles-closeButton-3 {
    display: none;
  }
  .MuiDialog-paper {
    position: relative;
    left: 30px;
  }

  width: 300px;
  div.wrapper {
    padding: 0 10px 10px;
    p {
      text-align: center;
      font-size: 14px;
      margin-top: 8px;
    }
  }
`

export default function() {
  const { versionInfo } = useSelector(updateInfoSelector)
  if (!versionInfo) {
    throw new Error('No update info available')
  }

  return (
    <StyledDialog title="New Version" open>
      <div className="wrapper">
        <p>
          Please update ChainX signer to <b>{versionInfo.version}</b>
        </p>
        <PrimaryButton
          size="fullWidth"
          onClick={() => {
            window.openExternal(versionInfo.path)
          }}
        >
          download
        </PrimaryButton>
      </div>
    </StyledDialog>
  )
}
