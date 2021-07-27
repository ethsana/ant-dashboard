import React, { useCallback } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContentText from '@material-ui/core/DialogContentText'
import Paper, { PaperProps } from '@material-ui/core/Paper'
import Draggable from 'react-draggable'
import ClipboardCopy from './ClipboardCopy'
import axios from 'axios'
import { useSnackbar } from 'notistack'
// import LocalDining from '@material-ui/icons/LocalDining'

function PaperComponent(props: PaperProps) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  )
}

let lock = false

export default function CashoutEarnModal({ disabled }: { disabled: boolean }) {
  const [open, setOpen] = React.useState(false)
  const [txHash, setHash] = React.useState('')
  const { enqueueSnackbar } = useSnackbar()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const clickCashout = useCallback(() => {
    if (lock || disabled || open) {
      return
    }
    lock = true
    axios
      .post(`${sessionStorage.getItem('debug_api_host') || process.env.REACT_APP_ANT_DEBUG_HOST}/mine/withdraw`)
      .then(({ data }) => {
        if (Boolean(data?.code)) {
          enqueueSnackbar(`Cashout: ${data?.message}`, { variant: 'error' })

          return
        }
        setHash(data.hash)
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
      })
  }, [setHash, setOpen, enqueueSnackbar, lock, disabled])

  return (
    <div>
      <Button
        variant="contained"
        disabled={disabled}
        color="primary"
        style={{ marginRight: '14px' }}
        onClick={clickCashout}
      >
        Cashout
      </Button>
      <Dialog open={open} aria-labelledby="draggable-dialog-title" fullWidth>
        <DialogTitle id="draggable-dialog-title">Success</DialogTitle>
        <DialogContent>
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
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
