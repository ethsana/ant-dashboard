import React, { useState, useContext } from 'react'
import axios from 'axios'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import DialogTitle from '@material-ui/core/DialogTitle'
import { Close } from '@material-ui/icons/'
import DialogContentText from '@material-ui/core/DialogContentText'
import ClipboardCopy from './ClipboardCopy'
import CircularProgress from '@material-ui/core/CircularProgress'
import { useSnackbar } from 'notistack'
import { Context as ApplicationContext, ApplicationInterface } from '../providers/Application'

let lock = false

export default function ActivateDeposit() {
  const [open, setOpen] = React.useState(false)
  const [txHash, setHash] = React.useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState(false)
  const { nodeApi } = useContext<ApplicationInterface>(ApplicationContext)
  const { enqueueSnackbar } = useSnackbar()

  const handleClickOpen = () => {
    setError(false)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const clickCashout = () => {
    if (lock || txHash) {
      return
    }

    lock = true
    setPending(true)
    setError(false)

    axios
      .post(`${nodeApi.debugApiHost}/mine/unfreeze`, {}, { headers: { Authorization: nodeApi.authorizationCode } })
      .then(({ data }) => {
        setHash(data.hash)
        setError(data.hash ? false : true)
      })
      .catch(error => {
        if (error.response) {
          enqueueSnackbar(`Activate: ${error.response.data.message}`, { variant: 'error', autoHideDuration: 2000 })
        } else {
          enqueueSnackbar(`Activate: ${error.toString()}`, { variant: 'error', autoHideDuration: 2000 })
        }
      })
      .finally(() => {
        setPending(false)
        lock = false
      })
  }

  return (
    <div>
      {!Boolean(txHash) && (
        <Button variant="contained" color="primary" style={{ marginRight: '14px' }} onClick={handleClickOpen}>
          Activate
        </Button>
      )}
      <Dialog open={open} aria-labelledby="draggable-dialog-title" fullWidth>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '24px' }}>
          <DialogTitle id="draggable-dialog-title">Activation</DialogTitle>
          <IconButton style={{ marginRight: '-15px' }} onClick={handleClose}>
            <Close />
          </IconButton>
        </div>
        <DialogContent>
          {!error && !pending && !txHash && (
            <Typography>
              For nodes that have withdrawn their pledged SANA token, this action will open the node to re-pledge and
              participate in mining, are you sure you want to activate it?
            </Typography>
          )}
          {pending && <p>Waiting for the transaction to be completed</p>}
          {!pending && txHash && (
            <>
              <DialogContentText style={{ marginTop: '20px', overflowWrap: 'break-word' }}>
                Copy the transaction hash or click on the link below for details
              </DialogContentText>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                Hash:{' '}
                <a
                  style={{ margin: '0 7px', fontSize: '14px' }}
                  href={`https://blockscout.com/xdai/mainnet/tx/${txHash}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {txHash.slice(0, 12) + '***' + txHash.slice(txHash.length - 12)}
                </a>
                <ClipboardCopy value={txHash} />
              </div>
            </>
          )}
          {error && <p style={{ color: 'red' }}>Failed to Activate</p>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            {Boolean(txHash) ? 'close' : 'cancel'}
          </Button>
          <div style={{ marginRight: '8px' }} />
          {!Boolean(txHash) && (
            <Button onClick={clickCashout} variant="outlined" color="primary">
              Confirm
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
          )}
        </DialogActions>
      </Dialog>
    </div>
  )
}
