import React, { Fragment, useCallback, useState, useContext, useEffect, useMemo } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import IconButton from '@material-ui/core/IconButton'
import DialogTitle from '@material-ui/core/DialogTitle'
import { Close } from '@material-ui/icons/'
import DialogContentText from '@material-ui/core/DialogContentText'
import ClipboardCopy from './ClipboardCopy'
import CircularProgress from '@material-ui/core/CircularProgress'
import axios from 'axios'
import { useSnackbar } from 'notistack'
import { Context as ApplicationContext, ApplicationInterface } from '../providers/Application'
import moment from 'moment'
import { useInterval } from 'ahooks'

let lock = false

const CountDowm = ({ expire }: { expire: number }) => {
  const [interval, setInterval] = useState<number | null>(1000)
  const [current, setTime] = useState<any>('0d 00h:00m:00s')

  useEffect(() => {
    if (isArrived) {
      setInterval(null)
    }
  })

  const deadLine = moment(expire)

  const deadLineTime = deadLine.diff(moment())

  let durationTime = moment.duration(deadLineTime)

  const isArrived = deadLineTime < 0

  useInterval(
    () => {
      const _h = durationTime.hours() > 9 ? durationTime.hours() : `0${durationTime.hours()}`
      const _m = durationTime.minutes() > 9 ? durationTime.minutes() : `0${durationTime.minutes()}`
      const _s = durationTime.seconds() > 9 ? durationTime.seconds() : `0${durationTime.seconds()}`
      const arriveTime = `${durationTime.days()}d ${_h}h:${_m}m:${_s}s`

      if (!isArrived) {
        durationTime = moment.duration(deadLine.diff(moment()))
        setTime(() => arriveTime) // make pretty
      }
    },
    interval,
    { immediate: true },
  )

  return <span style={{ color: '#32c48d' }}>{current}</span>
}

export default function CashoutEarnModal({ disabled, expire }: { disabled: boolean; expire: number }) {
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

  const clickCashout = useCallback(() => {
    if (lock || disabled || txHash) {
      return
    }
    lock = true
    setPending(true)
    setError(false)

    axios
      .post(`${nodeApi.debugApiHost}/mine/cashdeposit`, {}, { headers: { Authorization: nodeApi.authorizationCode } })
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
        const t = setTimeout(() => {
          clearTimeout(t)
          lock = false
          setPending(false)
        }, 1000)
      })
  }, [setHash, setOpen, enqueueSnackbar, setPending, lock, pending, disabled, txHash, nodeApi])

  const expiry = useMemo(() => {
    if (expire === 0) return true
    const deadLine = moment(expire)
    const deadLineTime = deadLine.diff(moment())

    return deadLineTime < 0 ? true : false
  }, [expire])

  return (
    <div>
      <Button
        variant="contained"
        disabled={disabled || Boolean(txHash)}
        color="primary"
        style={{ marginRight: '14px' }}
        onClick={handleClickOpen}
      >
        {expire === 0 ? 'Unstake' : expiry ? 'Unstake' : <CountDowm expire={expire} />}
      </Button>
      <Dialog open={open} aria-labelledby="draggable-dialog-title" fullWidth>
        <DialogTitle id="draggable-dialog-title">
          {expire === 0 && !disabled ? <span style={{ color: 'yellow' }}>Warning</span> : 'Unstake'}
        </DialogTitle>

        <DialogContent>
          {expire === 0 && !disabled && !error && !pending && !txHash && (
            <>
              <p style={{ fontSize: '16px', margin: '0' }}>
                Proceed with caution! This action will prevent you from continuing to mine.
              </p>
              <p>
                Tip: the token will be locked for 7 days and you will need to withdraw it again after expiry to take it
                out.
              </p>
            </>
          )}
          {!disabled && expire > 0 && !error && !pending && !txHash && (
            <p>The pledged token has been unfrozen and you can withdraw it.</p>
          )}
          {pending && <p>Waiting for the transaction to be completed</p>}
          {!pending && txHash && (
            <Fragment>
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
            confirm
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
