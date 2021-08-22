import React, { ReactElement, useMemo } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import { Button } from '@material-ui/core'
import CashoutEarnModal from '../../components/ CashoutEarnModal'
import CashoutDespositModal from '../../components/CashoutDespositModal'
import { Sync } from '@material-ui/icons/'
import { Token } from '../../models/Token'
import moment from 'moment'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    card: {
      padding: theme.spacing(2),
      // height: 142,
    },
    span: {
      margin: '10px auto',
      color: theme.palette.text.primary,
      fontWeight: 500,
      fontSize: 15,
    },
    label: {
      display: 'block',
      fontSize: 16,
      color: theme.palette.primary.main,
    },
    val: {
      display: 'block',
      paddingTop: '2px',
    },
  }),
)

const PeerStatus = ({ isWork }: { isWork: boolean }) => (
  <div
    style={{
      backgroundColor: isWork ? '#32c48d' : 'red',
      marginRight: '7px',
      height: '10px',
      width: '10px',
      borderRadius: '50%',
      display: 'inline-block',
    }}
  />
)

interface IncomeProps {
  isLockup: boolean
  reward: Token
  pending: Token
  isWork: boolean
  totalEarns: Token
  expire: number
  deposit?: Token | null
  error: string
}

function IcomeCard({
  error,
  isLockup,
  isWork,
  expire,
  pending,
  reward,
  totalEarns,
  deposit,
}: IncomeProps): ReactElement {
  const classes = useStyles()

  const depositAmount = useMemo(() => {
    if (error) return 0

    if (deposit) {
      return deposit.toBigNumber.isZero() ? 0 : deposit.toFixedDecimal()
    }

    return expire === 0 ? (isWork ? 50000 : 0) : 50000
  }, [expire, deposit, isWork, error])

  const unFrozenAmount = useMemo(() => {
    if (error) return 0

    return depositAmount === 0 ? 50000 : 0
  }, [depositAmount, error])

  const expiry = useMemo(() => {
    if (expire === 0) return true
    const deadLine = moment(expire)
    const deadLineTime = deadLine.diff(moment())

    return deadLineTime < 0 ? true : false
  }, [expire])

  const lockUndepositButton = useMemo(() => {
    if (error) return true

    if (deposit) {
      if (deposit.toBigNumber.isZero()) return true

      if (expire === 0) return false

      return !expiry
    }

    if (expire === 0) {
      if (isWork) return false

      return true
    }

    return !expiry
  }, [expire, deposit, isWork, error, expiry])

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Card className={classes.card}>
            <div className={classes.span}>
              <span className={classes.label}>Amount of SANA deposits</span>
              <span className={classes.val}>{depositAmount}</span>
            </div>
            <div className={classes.span}>
              <span className={classes.label}>Miner Node Status</span>
              <span className={classes.val}>
                <PeerStatus isWork={isWork} />
                {error ? ' The node is wrong, refresh to check' : isWork ? 'working' : 'unwork'}
                {error && (
                  <Button
                    variant="outlined"
                    size="small"
                    style={{ marginTop: '7px' }}
                    onClick={() => window.location.reload()}
                  >
                    <Sync />
                    <span>Refresh Checks</span>
                  </Button>
                )}
              </span>
            </div>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card className={classes.card}>
            <div className={classes.span}>
              <span className={classes.label}>Received rewards</span>
              <span className={classes.val}>{reward.toFixedDecimal()}</span>
            </div>
            <div className={classes.span}>
              <span className={classes.label}>Unclaimed awards</span>
              <span className={classes.val}>{pending.toFixedDecimal()}</span>
            </div>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card className={classes.card}>
            <div className={classes.span}>
              <span className={classes.label}>Frozen SANA</span>
              <span className={classes.val}>{depositAmount}</span>
            </div>
            <div className={classes.span}>
              <span className={classes.label}>Unfrozen SANA</span>
              <span className={classes.val}>{unFrozenAmount}</span>
            </div>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card className={classes.card}>
            <div className={classes.span}>
              <span className={classes.label}>Total revenue</span>
              <span className="val">{totalEarns.toFixedDecimal()}</span>
            </div>
            <div className={classes.span} style={{ display: 'flex', marginTop: '20px' }}>
              <CashoutEarnModal disabled={Boolean(pending.toBigNumber.isZero())} />
              <CashoutDespositModal disabled={lockUndepositButton} expire={expire} />
            </div>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}

export default IcomeCard
