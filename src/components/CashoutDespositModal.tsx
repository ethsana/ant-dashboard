import React, { Fragment, useCallback, useState } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContentText from '@material-ui/core/DialogContentText'
import ClipboardCopy from './ClipboardCopy'
import CircularProgress from '@material-ui/core/CircularProgress'
import axios from 'axios'
import { useSnackbar } from 'notistack'

let lock = false

export default function CashoutEarnModal({ disabled }: { disabled: boolean }) {
  const [open, setOpen] = React.useState(false)
  const [txHash, setHash] = React.useState('')
  const { enqueueSnackbar } = useSnackbar()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const clickCashout = useCallback(() => {
    if (lock || disabled || txHash) {
      return
    }
    lock = true
    setPending(true)

    const url = sessionStorage.getItem('debug_api_host') || process.env.REACT_APP_ANT_DEBUG_HOST
    axios
      .post(`${url}/mine/cashdeposit`)
      .then(({ data }) => {
        setHash(data.hash)
        setError(data.hash ? false : true)
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
  }, [setHash, setOpen, enqueueSnackbar, setPending, lock, pending, disabled, txHash])

  return (
    <div>
      <Button
        variant="contained"
        disabled={disabled || Boolean(txHash)}
        color="primary"
        style={{ marginRight: '14px' }}
        onClick={handleClickOpen}
      >
        Withdraw desposit
      </Button>
      <Dialog open={open} aria-labelledby="draggable-dialog-title" fullWidth>
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          Withdraw Desposit
        </DialogTitle>
        <DialogContent>
          {pending && <p>withdraw... </p>}
          {!pending && !txHash && <p>You will not be able to continue mining after withdrawing desposit</p>}
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
                  {txHash.slice(0, 12) + '***' + txHash.slice(txHash.length - 12)}
                </a>
                <ClipboardCopy value={txHash} />
              </div>
            </Fragment>
          )}
          {error && <p style={{ color: 'red' }}>Failed to withdraw desposit</p>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            cancel
          </Button>
          <div style={{ marginRight: '8px' }} />
          <Button onClick={clickCashout} variant="outlined" color="primary" disabled={Boolean(txHash)}>
            withdraw
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
                }}
              >
                <CircularProgress style={{ width: '24px', height: '24px' }} />
              </div>
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
