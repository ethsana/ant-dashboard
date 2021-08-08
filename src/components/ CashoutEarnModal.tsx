import React, { Fragment, useCallback, useState, useContext } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContentText from '@material-ui/core/DialogContentText'
import CircularProgress from '@material-ui/core/CircularProgress'
import ClipboardCopy from './ClipboardCopy'
import axios from 'axios'
import { useSnackbar } from 'notistack'
import { Context as ApplicationContext, ApplicationInterface } from '../providers/Application'

let lock = false

export default function CashoutEarnModal({ disabled }: { disabled: boolean }) {
  const [open, setOpen] = React.useState(false)
  const [txHash, setHash] = React.useState('')
  const { enqueueSnackbar } = useSnackbar()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState(false)
  const { nodeApi } = useContext<ApplicationInterface>(ApplicationContext)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const clickCashout = useCallback(() => {
    if (lock || disabled || pending) {
      return
    }
    lock = true
    setPending(true)
    axios
      .post(`${nodeApi.debugApiHost}/mine/withdraw`)
      .then(({ data }) => {
        if (Boolean(data?.code)) {
          enqueueSnackbar(`Cashout: ${data?.message}`, { variant: 'error' })

          return
        }
        setHash(data?.hash)
        setError(data?.hash ? false : true)
        handleClickOpen()
      })
      .catch(error => {
        if (error.response) {
          enqueueSnackbar(`Withdraw: ${error.response.data.message}`, { variant: 'error' })
        } else {
          enqueueSnackbar(`Withdraw: ${error.toString()}`, { variant: 'error' })
        }
      })
      .finally(() => {
        lock = false
        setPending(false)
      })
  }, [setHash, setOpen, setError, enqueueSnackbar, lock, disabled])

  return (
    <div>
      <Button
        variant="contained"
        disabled={disabled}
        color="primary"
        style={{ marginRight: '14px' }}
        onClick={clickCashout}
      >
        {pending && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(66,66,66,.8)',
            }}
          >
            <CircularProgress style={{ width: '24px', height: '24px' }} />
          </div>
        )}
        Cashout
      </Button>
      <Dialog open={open} aria-labelledby="draggable-dialog-title" fullWidth>
        <DialogTitle id="draggable-dialog-title">Cashout</DialogTitle>
        <DialogContent>
          {pending && <p>Cashout...</p>}
          {!pending && txHash && (
            <Fragment>
              <DialogContentText style={{ marginTop: '20px', overflowWrap: 'break-word' }}>
                Copy the transaction hash or click on the link below for details
              </DialogContentText>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                Hash:{' '}
                <a
                  style={{ margin: '0 7px', fontSize: '14px' }}
                  href={`https://goerli.${process.env.REACT_APP_ETHERSCAN_HOST}/tx/${txHash}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {txHash.slice(0, 16) + '******' + txHash.slice(txHash.length - 16)}
                </a>
                <ClipboardCopy value={txHash} />
              </div>
            </Fragment>
          )}
          {error && <p style={{ color: 'red' }}>Failed to Cashout</p>}
        </DialogContent>
        <DialogActions>
          <Button autoFocus variant="outlined" color="primary" onClick={handleClose}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
