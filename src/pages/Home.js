import React, { useEffect, useRef, useState } from 'react'
import { useOutsideClick } from '../shared'
import { useSelector, useDispatch } from 'react-redux'
import { setHomeLoading } from '../store/reducers/statusSlice'
import ClipboardJS from 'clipboard'
import Icon from '../components/Icon'
import './index.scss'
import logo from '../assets/extension_logo.svg'
import { currentChainxAccountSelector } from '../store/reducers/accountSlice'
import { isTestNetSelector } from '../store/reducers/settingSlice'

function Home(props) {
  const ref = useRef(null)
  const [showAccountAction, setShowAccountAction] = useState(false)
  const dispatch = useDispatch()
  const homeLoading = useSelector(state => state.status.homeLoading)
  const isTestNet = useSelector(isTestNetSelector)
  const [copySuccess, setCopySuccess] = useState('')
  const currentAccount = useSelector(currentChainxAccountSelector)
  // const toSign = useSelector(state => state.tx.toSign)

  useEffect(() => {
    getUnapprovedTxs()
    // eslint-disable-next-line
  }, [isTestNet])

  useOutsideClick(ref, () => {
    setShowAccountAction(false)
  })

  async function getToSign() {
    const data = {
      id: 'test',
      address: '',
      data:
        '0xe90281ff3f53e37c21e24df9cacc2ec69d010d144fe4dace6b2f087f466ade8b6b72278fc116af6b699bdeb55d265d7fa1828111106f1bac0814ab2432765e029b31976e3991300d94d4a5ec8411cd49f5a61fda0cbd9aeed39501cbe1913e51f55b910e0000040803ff7684c16db0c321ee15a297e20bab33279632dd7e288c6d66f16d73e185a4f9fc0c504358010000000000000094756e6973776170313536393733353332303134323832322e36303438363133363738323639'
    }
    return new Promise(resolve => {
      resolve(data)
    })
  }

  async function getUnapprovedTxs() {
    try {
      const toSign = await getToSign()
      console.log('get to sign', toSign)
      if (toSign) {
        props.history.push({
          pathname: '/requestSign/' + toSign.id,
          query: toSign
        })
      }
    } catch (error) {
      console.log('sign request error occurs ', error)
    } finally {
      dispatch(setHomeLoading(false))
      setCopyEvent()
    }
  }

  function setCopyEvent() {
    const clipboard = new ClipboardJS('.copy')
    clipboard.on('success', function() {
      setCopySuccess('Copied!')
      setTimeout(() => {
        setCopySuccess('')
      }, 2000)
    })
  }

  async function operateAccount(type) {
    if (currentAccount.address) {
      props.history.push({
        pathname: '/enterPassword',
        query: {
          address: currentAccount.address,
          keystore: currentAccount.keystore,
          type: type
        }
      })
    }
    setShowAccountAction(false)
  }

  if (homeLoading) {
    return <></>
  }

  return (
    <>
      {currentAccount ? (
        <div className="container-account">
          <div className="account-title">
            <span className="name">{currentAccount.name}</span>
            <div
              ref={ref}
              className="arrow"
              onClick={() => {
                setShowAccountAction(!showAccountAction)
              }}
            >
              <Icon className="arrow-icon" name="Arrowdown" />
            </div>
            {showAccountAction ? (
              <div className="account-action">
                <span onClick={() => operateAccount('export')}>
                  Export PrivateKey
                </span>
                <span onClick={() => operateAccount('remove')}>
                  Forget Account
                </span>
              </div>
            ) : null}
          </div>
          <div className="account-address">
            <span>{currentAccount.address}</span>
          </div>
          <button className="copy" data-clipboard-text={currentAccount.address}>
            <Icon className="copy-icon" name="copy" />
            <span className="copy-text">Copy</span>
          </button>
          <span>{copySuccess}</span>
        </div>
      ) : (
        <div className="container container-column container-no-account">
          <div className="home-logo">
            <img src={logo} alt="logo" />
          </div>
          <button
            className="button button-white button-new-account"
            onClick={() => props.history.push('/createAccount')}
          >
            New Account
          </button>
          <button
            className="button button-white button-import-account"
            onClick={() => props.history.push('/importAccount')}
          >
            Import Account
          </button>
        </div>
      )}
    </>
  )
}

export default Home
